# ujjwal-seo.com — project notes for Claude

Static Astro 7 site (French), deployed on Netlify. Build with `npm run build`.

## The team (agents in `.claude/agents/`)

| Name | Agent | Job |
|---|---|---|
| Claire | `claire-auditor` | Audits the site (read-only), assigns each finding an owner |
| Léa | `lea-writer` | Writes French blog articles |
| Marc | `marc-reviewer` | Fact-checks and reviews content (read-only) |
| Yann | `yann-local-seo` | Local SEO, zones-intervention pages, NAP |
| Hugo | `hugo-schema-geo` | Structured data, `llms.txt`, AI-search visibility |
| Théo | `theo-developer` | Code changes, performance, redirects, headers |

Agents cannot call each other directly. The main session coordinates: it runs one agent, reads its report, and passes the relevant part to the next.

## Workflows

**Audit → fix ("Claire audits and the team fixes")**
1. Run Claire. Her report ends with a Hand-off section grouping findings by owner.
2. Show the user the findings and ask which to fix. Anything owned by "Owner (Ujjwal)" is a business decision: ask, never guess.
3. Send each teammate only their findings, with the evidence and files from Claire's report. Teammates whose files don't overlap can run in parallel; Théo and Hugo both touch layouts, so run them one after the other.
4. Run Claire again on the fixed items to confirm, then report what is fixed and what is still open.

**New article**
Léa writes (as `draft: true`) → Marc reviews → Léa applies Marc's fixes → user approves before `draft` is set to false.

## Rules for everyone
- No invented facts, numbers, Wikidata IDs or client results.
- Don't change visible business facts (address, positioning, prices) without the owner's confirmation.
- Don't commit or push unless the user asks.
