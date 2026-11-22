/**
 * /articles.json — machine-readable list of published articles, newest first.
 * Read by the social media automation (ujjwal-seo-agent) to promote the
 * newest article first, and by the monthly blog automation.
 */
import { getCollection } from 'astro:content';
import standalonePosts from '../data/standalone-posts.json';
import { SITE_URL } from '../utils/seo';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const list = [
    ...posts.map((p) => {
      const slug = p.id.replace(/\.mdx?$/, '');
      return {
        url: `${SITE_URL}/blog/${slug}/`,
        slug,
        title: p.data.title,
        description: p.data.description,
        pubDate: p.data.pubDate.toISOString().slice(0, 10),
        categories: p.data.categories,
      };
    }),
    ...standalonePosts.map((p) => ({
      url: `${SITE_URL}${p.href}`,
      slug: p.slug,
      title: p.title,
      description: p.description,
      pubDate: p.pubDate,
      categories: p.categories,
    })),
  ].sort((a, b) => b.pubDate.localeCompare(a.pubDate));

  return new Response(JSON.stringify(list, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
