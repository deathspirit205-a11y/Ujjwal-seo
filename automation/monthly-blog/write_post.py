"""
Monthly blog post generator for ujjwal-seo.com.

Steps:
  1. Read the site's existing articles, services and pages (the "inventory").
  2. Research recent search/SEO news relevant to small businesses (Claude + web search).
  3. Plan one article that fits a pillar of the editorial plan and links to existing content.
  4. Write the article in simple French (Markdown), then run an editing pass.
  5. Check every link, build the frontmatter, draw a cover image, link 2 older posts
     to the new one (relatedArticles), and write a summary for the pull request.

Usage (from the repository root):
  python automation/monthly-blog/write_post.py --pr-body /tmp/pr.md [--topic "..."] [--dry-run]

Needs ANTHROPIC_API_KEY (except with --dry-run).
"""

import argparse
import datetime as dt
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
BLOG_DIR = ROOT / "src/content/blog"
STANDALONE_JSON = ROOT / "src/data/standalone-posts.json"
ASSETS_DIR = ROOT / "public/assets/blog"
HISTORY = HERE / "history.md"
SITE = "https://ujjwal-seo.com"

MODEL = "claude-opus-5-5"
FALLBACK_BETA = "server-side-fallback-2026-07-01"
AUTHOR = "Ujjwal Lage"

# Service ids understood by src/pages/blog/[...slug].astro (relatedServices)
SERVICE_IDS = {
    "seo-local": "/services/seo-local/",
    "seo-technique": "/services/seo-technique/",
    "seo-contenu": "/services/seo-contenu/",
    "audit-seo": "/services/audit-seo/",
    "strategie-seo": "/services/strategie-seo/",
    "geo": "/services/geo/",
}


# --------------------------------------------------------------------------- inventory
def parse_frontmatter(text):
    """Very small frontmatter parser for this site's posts (scalars and JSON-style lists)."""
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return {}, text
    data = {}
    for line in m.group(1).splitlines():
        if ":" not in line or line.startswith(" "):
            continue
        key, val = line.split(":", 1)
        val = val.strip()
        if val.startswith("[") or val.startswith('"'):
            try:
                data[key.strip()] = json.loads(val)
                continue
            except json.JSONDecodeError:
                pass
        data[key.strip()] = val.strip('"')
    return data, text[m.end():]


def load_inventory():
    posts = []
    for f in sorted(BLOG_DIR.glob("*.md*")):
        fm, body = parse_frontmatter(f.read_text(encoding="utf-8"))
        slug = re.sub(r"\.mdx?$", "", f.name)
        posts.append({
            "slug": slug,
            "url": f"/blog/{slug}/",
            "title": fm.get("title", slug),
            "description": fm.get("description", ""),
            "categories": fm.get("categories", []),
            "tags": fm.get("tags", []),
            "pubDate": str(fm.get("pubDate", "")),
            "headings": re.findall(r"^##\s+(.+)$", body, re.M),
            "in_collection": True,
        })
    if STANDALONE_JSON.exists():
        for p in json.loads(STANDALONE_JSON.read_text(encoding="utf-8")):
            posts.append({
                "slug": p["slug"], "url": p["href"], "title": p["title"],
                "description": p["description"], "categories": p.get("categories", []),
                "tags": [], "pubDate": p["pubDate"], "headings": [], "in_collection": False,
            })

    pages = {"/": "Accueil", "/blog/": "Blog", "/contact/": "Contact",
             "/reserver-un-appel/": "Réserver un appel", "/a-propos/": "À propos",
             "/approche/": "Approche / méthode", "/services/": "Tous les services",
             "/realisations/": "Réalisations"}
    for sid, url in SERVICE_IDS.items():
        pages[url] = f"Service : {sid}"
    for f in sorted((ROOT / "src/pages/zones-intervention").glob("*.astro")):
        if f.stem != "index":
            pages[f"/zones-intervention/{f.stem}/"] = f"Zone : {f.stem}"
    # keep only pages that really exist in the source tree
    def exists(url):
        if url in ("/",):
            return True
        p = url.strip("/")
        return (ROOT / f"src/pages/{p}.astro").exists() or (ROOT / f"src/pages/{p}/index.astro").exists()
    pages = {u: t for u, t in pages.items() if exists(u)}

    categories = sorted({c for p in posts for c in p["categories"]})
    return posts, pages, categories


def inventory_text(posts, pages):
    lines = ["ARTICLES EXISTANTS (url | titre | catégories | date | sections H2):"]
    for p in sorted(posts, key=lambda x: x["pubDate"], reverse=True):
        lines.append(f"- {p['url']} | {p['title']} | {', '.join(p['categories'])} | {p['pubDate']}"
                     + (f" | H2: {' ; '.join(p['headings'][:10])}" if p["headings"] else ""))
    lines.append("\nPAGES ET SERVICES EXISTANTS (url | nom):")
    for u, t in pages.items():
        lines.append(f"- {u} | {t}")
    return "\n".join(lines)


# --------------------------------------------------------------------------- Claude calls
def claude_call(client, system, messages, *, tools=None, output_format=None,
                effort="high", max_tokens=64000, max_continuations=5):
    """Streamed request with adaptive thinking, refusal fallback, and pause_turn handling."""
    output_config = {"effort": effort}
    if output_format:
        output_config["format"] = output_format
    messages = list(messages)
    for _ in range(max_continuations + 1):
        kwargs = dict(
            model=MODEL,
            max_tokens=max_tokens,
            system=system,
            messages=messages,
            thinking={"type": "adaptive"},
            output_config=output_config,
            betas=[FALLBACK_BETA],
            extra_body={"fallbacks": "default"},
        )
        if tools:
            kwargs["tools"] = tools
        with client.beta.messages.stream(**kwargs) as stream:
            msg = stream.get_final_message()
        if msg.stop_reason == "pause_turn":
            messages = messages + [{"role": "assistant", "content": msg.content}]
            continue
        if msg.stop_reason == "refusal":
            raise RuntimeError(f"Claude declined the request: {msg.stop_details}")
        if msg.stop_reason == "max_tokens":
            raise RuntimeError("Response hit max_tokens; increase the limit.")
        return msg
    raise RuntimeError("Too many pause_turn continuations.")


def text_of(msg):
    return "".join(b.text for b in msg.content if b.type == "text").strip()


RESEARCH_SYSTEM = """Tu es l'assistant de veille d'Ujjwal Lage, consultant SEO indépendant en France qui \
accompagne des TPE/PME, artisans et commerçants.
Ta mission : repérer les actualités et tendances RÉCENTES (environ les 60 derniers jours) de la recherche \
en ligne qui ont un impact concret pour une petite entreprise française : mises à jour Google, évolutions \
de Google Business Profile / Maps, AI Overviews et recherche par IA, nouveautés de la Search Console, \
changements d'usage des internautes, etc.
Privilégie les sources fiables (blog Google Search Central, documentation officielle Google, \
annonces officielles, médias SEO reconnus FR/EN). Vérifie les dates.
Réponds en français avec 5 à 8 points. Pour chaque point : ce qui a changé, la date, pourquoi c'est \
important pour une petite entreprise, et les URL exactes des sources."""


def research(client, today, topic_hint):
    tools = [{
        "type": "web_search_20260209", "name": "web_search", "max_uses": 10,
        "user_location": {"type": "approximate", "country": "FR", "timezone": "Europe/Paris"},
    }]
    prompt = f"Date du jour : {today}.\n"
    if topic_hint:
        prompt += f"Le sujet du mois est imposé : « {topic_hint} ». Concentre la recherche sur ce sujet.\n"
    prompt += "Fais ta veille et rédige tes notes."
    msg = claude_call(client, RESEARCH_SYSTEM, [{"role": "user", "content": prompt}],
                      tools=tools, effort="medium")
    sources = {}
    for b in msg.content:
        if b.type == "web_search_tool_result" and isinstance(b.content, list):
            for r in b.content:
                url = getattr(r, "url", None)
                if url:
                    sources[url] = getattr(r, "title", url)
    return text_of(msg), sources


PLAN_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["pillar", "why_this_topic", "title", "meta_title", "description", "slug",
                 "category", "tags", "target_keyword", "outline", "internal_links",
                 "related_articles", "related_services", "backlink_from", "sources",
                 "cover_alt"],
    "properties": {
        "pillar": {"type": "string"},
        "why_this_topic": {"type": "string"},
        "title": {"type": "string"},
        "meta_title": {"type": "string"},
        "description": {"type": "string"},
        "slug": {"type": "string"},
        "category": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}},
        "target_keyword": {"type": "string"},
        "outline": {"type": "array", "items": {"type": "string"}},
        "internal_links": {"type": "array", "items": {
            "type": "object", "additionalProperties": False,
            "required": ["url", "where_and_why"],
            "properties": {"url": {"type": "string"}, "where_and_why": {"type": "string"}}}},
        "related_articles": {"type": "array", "items": {"type": "string"}},
        "related_services": {"type": "array", "items": {"type": "string"}},
        "backlink_from": {"type": "array", "items": {"type": "string"}},
        "sources": {"type": "array", "items": {"type": "string"}},
        "cover_alt": {"type": "string"},
    },
}

PLAN_SYSTEM = """Tu es le rédacteur en chef du blog d'Ujjwal Lage, consultant SEO (site en français, \
public : petites entreprises non techniciennes). Tu choisis le sujet de l'article du mois et tu en fais \
le plan. L'article doit être utile, concret, relié aux contenus existants du site (maillage interne) et \
ne doit PAS reprendre un sujet déjà traité."""


def plan_article(client, today, notes, posts, pages, categories, topic_hint):
    plan_md = (HERE / "editorial-plan.md").read_text(encoding="utf-8")
    history = HISTORY.read_text(encoding="utf-8") if HISTORY.exists() else "(aucun)"
    collection_slugs = [p["slug"] for p in posts if p["in_collection"]]
    prompt = f"""Date du jour : {today}

PLAN ÉDITORIAL :
{plan_md}

HISTORIQUE DES ARTICLES AUTOMATIQUES :
{history}

{inventory_text(posts, pages)}

CATÉGORIES EXISTANTES (category doit être l'une d'elles) : {', '.join(categories)}
IDENTIFIANTS DE SERVICES (related_services) : {', '.join(SERVICE_IDS)}
SLUGS D'ARTICLES UTILISABLES pour related_articles et backlink_from : {', '.join(collection_slugs)}

NOTES DE VEILLE RÉCENTES :
{notes}

{"SUJET IMPOSÉ : " + topic_hint if topic_hint else "Choisis toi-même le meilleur sujet selon le plan éditorial et la veille."}

Consignes pour le plan :
- title : titre clair en français, sans ville précise, 50 à 70 caractères idéalement.
- meta_title : 60 caractères maximum, contient le mot-clé principal.
- description : meta description de 140 à 160 caractères, donne envie de cliquer.
- slug : minuscules, sans accents, mots séparés par des tirets, 3 à 6 mots, unique.
- tags : 4 à 7 mots-clés en français.
- outline : les titres H2 prévus (4 à 7), avec si besoin les H3 entre parenthèses.
- internal_links : 3 à 5 URL prises UNIQUEMENT dans les listes ci-dessus, et où les placer.
- related_articles : 2 ou 3 slugs d'articles proches (liste des slugs utilisables).
- related_services : 1 ou 2 identifiants de services.
- backlink_from : 2 slugs d'articles existants qui devraient recommander ce nouvel article.
- sources : URL exactes tirées des notes de veille qui seront citées (peut être vide).
- cover_alt : texte alternatif de l'image de couverture (titre stylisé de l'article)."""
    fmt = {"type": "json_schema", "schema": PLAN_SCHEMA}
    msg = claude_call(client, PLAN_SYSTEM, [{"role": "user", "content": prompt}],
                      output_format=fmt, effort="high", max_tokens=32000)
    return json.loads(text_of(msg))


WRITE_SYSTEM = """Tu es Ujjwal Lage, consultant SEO indépendant. Tu écris un article de blog en français \
pour des dirigeants de petites entreprises qui ne sont pas techniciens. Ton objectif : qu'ils comprennent \
facilement et sachent exactement quoi faire après la lecture. Tu respectes strictement le guide de style."""


def write_article(client, plan, notes, posts, pages, sample):
    style = (HERE / "style.md").read_text(encoding="utf-8")
    prompt = f"""GUIDE DE STYLE :
{style}

PLAN VALIDÉ (JSON) :
{json.dumps(plan, ensure_ascii=False, indent=2)}

NOTES DE VEILLE (seule source autorisée pour les faits récents et les chiffres) :
{notes}

{inventory_text(posts, pages)}

EXEMPLE D'ARTICLE DÉJÀ PUBLIÉ SUR LE SITE (pour le ton et le format Markdown, pas le sujet) :
<exemple>
{sample}
</exemple>

Rédige l'article complet en Markdown, en suivant le plan.
- Commence directement par l'introduction (pas de frontmatter, pas de titre H1).
- Liens internes : chemins relatifs exacts, par exemple [texte](/blog/audit-seo-guide-complet/).
- Liens externes : uniquement des URL qui apparaissent dans les notes de veille.
- Réponds uniquement avec le Markdown de l'article."""
    msg = claude_call(client, WRITE_SYSTEM, [{"role": "user", "content": prompt}], effort="high")
    return text_of(msg)


EDIT_SYSTEM = """Tu es le correcteur du blog d'Ujjwal Lage. Tu relis un article destiné à des \
dirigeants de petites entreprises non techniciens et tu le rends plus simple, plus clair et plus juste, \
sans changer le sujet ni la structure générale."""


def edit_article(client, draft, plan, notes, valid_urls):
    style = (HERE / "style.md").read_text(encoding="utf-8")
    prompt = f"""GUIDE DE STYLE :
{style}

NOTES DE VEILLE (référence pour vérifier les faits) :
{notes}

URL INTERNES AUTORISÉES : {', '.join(sorted(valid_urls))}

MOT-CLÉ PRINCIPAL : {plan['target_keyword']}

BROUILLON :
<brouillon>
{draft}
</brouillon>

Relis et améliore le brouillon :
1. Simplifie : phrases plus courtes, mots plus simples, jargon expliqué.
2. Supprime ou rends général tout chiffre ou fait récent qui n'est pas appuyé par les notes de veille.
3. Garde 3 à 5 liens internes, uniquement vers les URL autorisées, avec des ancres descriptives.
4. Vérifie l'orthographe, la grammaire et la typographie française (espaces avant « : ; ? ! », guillemets « »).
5. Pas de titre H1, pas de frontmatter.
Réponds uniquement avec la version finale de l'article en Markdown."""
    msg = claude_call(client, EDIT_SYSTEM, [{"role": "user", "content": prompt}], effort="high")
    return text_of(msg)


# --------------------------------------------------------------------------- checks & files
def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return re.sub(r"-{2,}", "-", s)[:70].strip("-")


def check_links(body, valid_urls, sources):
    """Unlink internal links to pages that don't exist and external links not found by the research."""
    removed, kept_internal = [], set()

    def fix(m):
        text, url = m.group(1), m.group(2).strip()
        path = url[len(SITE):] if url.startswith(SITE) else url
        if path.startswith("/"):
            base = path.split("#")[0]
            if not base.endswith("/"):
                base += "/"
            if base in valid_urls:
                kept_internal.add(base)
                return f"[{text}]({base}{'#' + path.split('#', 1)[1] if '#' in path else ''})"
            removed.append(url)
            return text
        if url.startswith("#"):
            return m.group(0)
        if url in sources:
            return m.group(0)
        removed.append(url)
        return text

    body = re.sub(r"(?<!!)\[([^\]]+)\]\(([^)\s]+)\)", fix, body)
    return body, removed, sorted(kept_internal)


def yaml_str(s):
    return json.dumps(s, ensure_ascii=False)


def build_frontmatter(plan, slug, today, cover_path, valid_slugs, categories):
    category = plan["category"] if plan["category"] in categories else (categories[0] if categories else "Stratégie SEO")
    related = [s for s in plan["related_articles"] if s in valid_slugs][:3]
    services = [s for s in plan["related_services"] if s in SERVICE_IDS][:2]
    lines = [
        "---",
        f"title: {yaml_str(plan['title'])}",
        f"metaTitle: {yaml_str(plan['meta_title'][:70])}",
        f"description: {yaml_str(plan['description'])}",
    ]
    if cover_path:
        lines += [f"featuredImage: {yaml_str(cover_path)}",
                  f"featuredImageAlt: {yaml_str(plan['cover_alt'])}"]
    lines += [
        f"pubDate: {today}",
        f"author: {yaml_str(AUTHOR)}",
        f"categories: {json.dumps([category], ensure_ascii=False)}",
        f"tags: {json.dumps(plan['tags'][:7], ensure_ascii=False)}",
        f"relatedArticles: {json.dumps(related, ensure_ascii=False)}",
        f"relatedServices: {json.dumps(services, ensure_ascii=False)}",
        "---",
        "",
    ]
    return "\n".join(lines), category


def add_backlink(post_file, new_slug):
    """Add new_slug to an existing post's relatedArticles (front of the list)."""
    text = post_file.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return False
    fm = m.group(1)
    rel = re.search(r"^relatedArticles:\s*(\[.*\])\s*$", fm, re.M)
    if rel:
        current = json.loads(rel.group(1))
        if new_slug in current:
            return False
        new_line = f"relatedArticles: {json.dumps([new_slug] + current[:2], ensure_ascii=False)}"
        fm = fm[:rel.start()] + new_line + fm[rel.end():]
    else:
        fm = fm + f"\nrelatedArticles: {json.dumps([new_slug], ensure_ascii=False)}"
    post_file.write_text(f"---\n{fm}\n---\n" + text[m.end():], encoding="utf-8")
    return True


def draw_cover(title, category, out_path):
    """1600x900 branded cover in the site's colours. Returns False if Pillow/fonts are missing."""
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError:
        return False
    W, H = 1600, 900
    navy, atlantic, mist = (23, 50, 77), (57, 123, 155), (184, 209, 214)
    img = Image.new("RGB", (W, H))
    px = img.load()
    for y in range(H):
        for x in range(0, W):
            t = min(1.0, (x / W) * 0.6 + (y / H) * 0.4)
            px[x, y] = tuple(int(navy[i] + (atlantic[i] - navy[i]) * t * 0.85) for i in range(3))
    dr = ImageDraw.Draw(img)
    dr.ellipse((1150, -300, 2000, 550), outline=mist, width=3)
    dr.ellipse((1250, -200, 1900, 450), outline=mist, width=2)

    font_dir = ROOT / "automation/monthly-blog/fonts"

    def font(name, size, variation=None):
        try:
            f = ImageFont.truetype(str(font_dir / name), size)
            if variation:
                try:
                    f.set_variation_by_name(variation)
                except Exception:
                    pass
            return f
        except OSError:
            return ImageFont.load_default(size=size)

    f_cat = font("Inter.ttf", 34, "SemiBold")
    f_site = font("Inter.ttf", 32, "Medium")
    pad = 110
    cat = category.upper()
    cw = dr.textlength(cat, font=f_cat)
    dr.rounded_rectangle((pad, 120, pad + cw + 56, 184), radius=32, fill=mist)
    dr.text((pad + 28, 130), cat, font=f_cat, fill=navy)

    size = 92
    while size >= 54:
        f_title = font("PlayfairDisplay.ttf", size, "Bold")
        words, lines, cur = title.split(), [], ""
        for w in words:
            test = (cur + " " + w).strip()
            if dr.textlength(test, font=f_title) <= W - pad - 380:
                cur = test
            else:
                lines.append(cur)
                cur = w
        lines.append(cur)
        if len(lines) <= 4:
            break
        size -= 6
    y = 250
    for line in lines:
        dr.text((pad, y), line, font=f_title, fill=(255, 255, 255))
        y += int(size * 1.22)

    dr.line((pad, H - 150, pad + 90, H - 150), fill=mist, width=4)
    dr.text((pad, H - 120), "ujjwal-seo.com  ·  Ujjwal Lage, consultant SEO", font=f_site, fill=mist)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "JPEG", quality=86, optimize=True, progressive=True)
    return True


# --------------------------------------------------------------------------- dry run
DRY_PLAN = {
    "pillar": "Mesurer ses résultats", "why_this_topic": "Test sans appel à l'API.",
    "title": "Google Search Console : les 5 rapports à regarder chaque mois",
    "meta_title": "Search Console : 5 rapports à suivre chaque mois",
    "description": "Découvrez les 5 rapports de la Google Search Console à consulter chaque mois pour suivre la visibilité de votre site, même sans être technicien.",
    "slug": "google-search-console-5-rapports",
    "category": "SEO Technique", "tags": ["Google Search Console", "suivi SEO", "performances"],
    "target_keyword": "google search console", "outline": ["Intro"],
    "internal_links": [{"url": "/blog/audit-seo-guide-complet/", "where_and_why": "test"}],
    "related_articles": ["audit-seo-guide-complet", "core-web-vitals-2026"],
    "related_services": ["audit-seo"], "backlink_from": ["audit-seo-guide-complet", "core-web-vitals-2026"],
    "sources": [], "cover_alt": "Titre de l'article sur fond bleu",
}
DRY_BODY = """Ceci est un article de test généré sans appel à l'API.

## Pourquoi suivre la Search Console ?

Voir notre [guide de l'audit SEO](/blog/audit-seo-guide-complet/) et un [lien cassé](/blog/nexiste-pas/),
un [lien externe inventé](https://exemple-invente.com/page) et le [contact](/contact/).
"""


# --------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pr-body", required=True, help="Where to write the pull request description")
    ap.add_argument("--topic", default=os.environ.get("BLOG_TOPIC", "").strip())
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    today = dt.date.today().isoformat()
    posts, pages, categories = load_inventory()
    valid_urls = set(pages) | {p["url"] for p in posts}
    valid_slugs = {p["slug"] for p in posts if p["in_collection"]}
    print(f"Inventory: {len(posts)} articles, {len(pages)} pages, categories: {categories}")

    if args.dry_run:
        notes, sources, plan, body = "(dry run)", {}, dict(DRY_PLAN), DRY_BODY
    else:
        import anthropic
        client = anthropic.Anthropic()
        print("1/4 Researching recent trends…")
        notes, sources = research(client, today, args.topic)
        print(f"    {len(sources)} sources found")
        print("2/4 Planning the article…")
        plan = plan_article(client, today, notes, posts, pages, categories, args.topic)
        print(f"    Topic: {plan['title']}")
        sample_file = BLOG_DIR / "recherche-mots-cles-seo-guide-complet.md"
        sample = parse_frontmatter(sample_file.read_text(encoding="utf-8"))[1] if sample_file.exists() else ""
        print("3/4 Writing…")
        draft = write_article(client, plan, notes, posts, pages, sample)
        print("4/4 Editing for clarity and accuracy…")
        body = edit_article(client, draft, plan, notes, valid_urls)

    slug = slugify(plan["slug"] or plan["title"])
    if slug in valid_slugs or any(p["slug"] == slug for p in posts):
        slug = f"{slug}-{today[:7]}"
    post_file = BLOG_DIR / f"{slug}.md"

    # Strip a stray H1 or frontmatter if the model added one
    body = re.sub(r"^---\n.*?\n---\n", "", body.strip() + "\n", flags=re.S)
    body = re.sub(r"^#\s+.+\n+", "", body)
    body, removed_links, internal_links = check_links(body, valid_urls, sources)
    words = len(re.findall(r"\w+", body))

    cover_rel = f"/assets/blog/{slug}.jpg"
    category_guess = plan["category"] if plan["category"] in categories else (categories[0] if categories else "")
    has_cover = draw_cover(plan["title"], category_guess, ASSETS_DIR / f"{slug}.jpg")
    frontmatter, category = build_frontmatter(plan, slug, today, cover_rel if has_cover else None,
                                              valid_slugs, categories)
    post_file.write_text(frontmatter + "\n" + body.strip() + "\n", encoding="utf-8")

    backlinked = []
    for s in plan["backlink_from"][:2]:
        if s in valid_slugs and add_backlink(BLOG_DIR / f"{s}.md", slug):
            backlinked.append(s)

    if not args.dry_run:
        with HISTORY.open("a", encoding="utf-8") as h:
            if HISTORY.stat().st_size == 0:
                h.write("# Articles générés automatiquement\n\n")
            h.write(f"- {today} — {plan['title']} (/blog/{slug}/) — pilier : {plan['pillar']}\n")

    warnings = []
    if len(internal_links) < 3:
        warnings.append(f"Seulement {len(internal_links)} liens internes (objectif : 3 à 5).")
    if not 900 <= words <= 2200:
        warnings.append(f"Longueur : {words} mots (objectif : 1 200 à 1 800).")
    if len(plan["meta_title"]) > 60:
        warnings.append(f"Le meta title fait {len(plan['meta_title'])} caractères (60 maximum).")
    if not 120 <= len(plan["description"]) <= 165:
        warnings.append(f"La meta description fait {len(plan['description'])} caractères (objectif : 140 à 160).")
    if not has_cover:
        warnings.append("Aucune image de couverture n'a été générée.")

    pr = [
        f"## Nouvel article du mois : {plan['title']}",
        "",
        f"**URL après publication :** {SITE}/blog/{slug}/",
        f"**Pilier :** {plan['pillar']} · **Catégorie :** {category} · **Mot-clé :** {plan['target_keyword']}",
        f"**Longueur :** ~{words} mots",
        "",
        "### Pourquoi ce sujet",
        plan["why_this_topic"],
        "",
        "### Liens internes dans l'article",
        *([f"- {u}" for u in internal_links] or ["- (aucun)"]),
        "",
        "### Articles existants qui recommandent maintenant celui-ci",
        *([f"- /blog/{s}/" for s in backlinked] or ["- (aucun)"]),
        "",
        "### Sources de la veille citées",
        *([f"- {u}" for u in plan["sources"] if u in sources] or ["- (aucune)"]),
        "",
    ]
    if removed_links:
        pr += ["### Liens retirés automatiquement (page inexistante ou source non vérifiée)",
               *[f"- {u}" for u in removed_links], ""]
    if warnings:
        pr += ["### ⚠️ Points à vérifier", *[f"- {w}" for w in warnings], ""]
    pr += [
        "### Avant de fusionner",
        "- [ ] Lire l'article sur l'aperçu Netlify (lien dans les checks de cette pull request)",
        "- [ ] Vérifier que les faits récents correspondent bien aux sources",
        "- [ ] Corriger ce qui doit l'être directement dans le fichier, puis fusionner pour publier",
        "",
        "Pour ne pas publier cet article, fermez simplement cette pull request.",
        "",
        "<details><summary>Notes de veille utilisées</summary>",
        "",
        notes,
        "",
        "</details>",
    ]
    Path(args.pr_body).write_text("\n".join(pr), encoding="utf-8")

    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as f:
            f.write(f"slug={slug}\n")
            f.write(f"title={plan['title']}\n")
    print(f"Wrote {post_file.relative_to(ROOT)} ({words} words). Backlinks: {backlinked}. "
          f"Removed links: {removed_links}")


if __name__ == "__main__":
    sys.exit(main())
