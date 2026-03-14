---
name: blog-post
description: This skill should be used when the user asks to "write a blog post", "create a blog post", "draft a blog", "generate a post", or wants to add a new article to the portfolio blog. Creates fully-formatted MDX blog posts in the correct Astro content collection structure.
disable-model-invocation: true
allowed-tools: Read, Write, WebSearch, WebFetch, Glob
---

# Blog Post Generator

Create a new MDX blog post for the Astro portfolio at `src/content/blog/`.

## Arguments

$ARGUMENTS

If no argument is given, ask the user for a topic before proceeding.

## Step 1: Determine the Mode

**Check what the user provided:**

### Mode A — DEV.to import (URL or pasted content)

If `$ARGUMENTS` is a `dev.to` URL or the user pastes DEV.to article text:

1. If it's a URL, use WebFetch to retrieve the full article content.
2. Extract the original content exactly — do not rewrite or paraphrase. Preserve the author's words, structure, and intent.
3. Convert DEV.to formatting to proper MDX:
   - DEV.to uses standard Markdown — carry it over directly
   - Convert any `{% embed %}` liquid tags:
     - `{% embed https://twitter.com/... %}` or `{% twitter ... %}` → `<TweetEmbed url="..." />` (add the import line)
     - `{% embed https://youtube.com/... %}` → plain link or note for manual handling
   - Convert any `{% link %}` tags to standard markdown links
   - Strip DEV.to-specific UI elements (tags, reactions, etc.)
4. Pull the title, description, and publish date from the DEV.to post frontmatter/header.
5. Set the DEV link at the bottom to the actual post URL.

### Mode B — New post from topic or research

If `$ARGUMENTS` is a topic, keyword, or news event (not a DEV.to URL):

1. Use WebSearch to gather:
   - Key facts, dates, numbers, and quotes
   - 5–10 credible sources for the References section
   - Any notable tweets worth embedding
2. Write the post in Anirudh's voice — punchy, analytical, conversational, confident:
   - **Lead with a bold, surprising fact or framing** — don't ease in, drop the reader into the story
   - **Short paragraphs.** One idea per paragraph. Use blank lines liberally.
   - **Bold key terms, numbers, and company names** on first mention
   - **Blockquotes (`>`) for the most important takeaways** — use them like pull quotes, 1–3 per post
   - **Horizontal rules (`---`) to section-break** between major shifts in the narrative
   - **Superscript references** (`<sup>[N](#references)</sup>`) inline whenever citing a fact
   - **End with a punchy insight or call to action** — something the reader walks away thinking about

## Step 3: Create the File

**File naming:** kebab-case slug derived from the title, e.g. `my-post-title.mdx`
**File location:** `src/content/blog/<slug>.mdx`

Use this template:

```mdx
---
title: "<post title>"
description: "<one-sentence description for SEO and the blog listing page>"
pubDate: <YYYY-MM-DD using today's date>
coverImage: "/blog/<slug>-cover.<ext>"
---

[post body here]

---

## References
<a name="references"></a>
1. [Source title](URL)
2. [Source title](URL)
...

---

*Originally published on [DEV](https://dev.to/anikoni2010/).*
```

**Notes on the template:**
- `draft: true` can be added to frontmatter if the user wants to save without publishing
- `coverImage` is optional — include it if a relevant image is suggested or the user provides one; otherwise omit the field
- If the post embeds a tweet, add `import TweetEmbed from '../../components/TweetEmbed.astro';` below the frontmatter and use `<TweetEmbed url="<tweet-url>" />` inline
- The DEV link at the bottom can be left as a placeholder if not yet published: `*Originally published on [DEV](https://dev.to/anikoni2010/).*`

## Step 4: Confirm with the User

After writing the file, summarize:
- The file path created
- The title and slug
- Any sources used
- Whether a cover image is still needed
