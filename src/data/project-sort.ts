import type { CollectionEntry } from 'astro:content';

export function byProjectOrderThenDate(
  a: CollectionEntry<'projects'>,
  b: CollectionEntry<'projects'>,
): number {
  const order = (a.data.order ?? Number.POSITIVE_INFINITY)
    - (b.data.order ?? Number.POSITIVE_INFINITY);
  return order || b.data.date.valueOf() - a.data.date.valueOf();
}
