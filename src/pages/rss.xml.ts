import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getCollection, render } from 'astro:content';
import { getContainerRenderer } from '@astrojs/mdx/container-renderer';

export async function GET(context: APIContext) {
  const site = context.site ?? new URL('/', context.url);
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/blog/${post.id}/`,
        // Feed readers have no base URL, so root-relative image and link paths must be absolute
        content: html.replace(/(src|href)="\/(?!\/)/g, `$1="${site.origin}/`),
      };
    }),
  );

  return rss({
    title: 'Anirudh Konidala',
    description: 'Blog posts by Anirudh Konidala',
    site,
    items,
  });
}
