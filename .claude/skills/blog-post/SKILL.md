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

#### Step 2A: Research

Use WebSearch to gather:
- Key facts, dates, numbers, and quotes
- The actual state of affairs — what happened, who is involved, why it matters
- 5–10 credible sources for the References section
- Any notable data points, quotes, or primary sources

#### Step 2B: Build a BLOG SPEC

Before writing a single word of the post, produce a structured spec for this specific topic. The spec is your plan — it determines what the post will argue, how it will be structured, and what the reader will walk away understanding.

Output the spec in this format (adapt section names to fit the topic):

```
# BLOG SPEC: [Title]

## Objective
- What this post explains
- The core argument or insight
- What the reader walks away understanding (not just knowing)

## Structure (MANDATORY ORDER)

### 1. Hook (Narrative Opening)
- What framing to open with
- The contrast or tension to establish
- The "so what" that ends the hook

### 2. [Section Name] (Concrete Explanation)
- Specific facts and details to include
- What to explain and how

### 3. [Section Name] (Zoom Out)
- The broader context
- The framework or mental model to introduce

### 4–N. [Additional Sections]
- Continue for every major section the post needs
- Each section: what it covers, what it argues, what the reader learns

### Final. Conclusion (Forward-Looking Insight)
- How to tie everything together
- The lasting takeaway

## Writing Style Requirements
- Tone: [analytical / conversational / technical / etc.]
- What to avoid
- What to emphasize

## Depth Requirements
For each major claim:
- Explain WHY it matters
- Explain WHAT changes because of it

## Sources to Use
- List the specific sources from research and what they support

## Anti-Patterns to Avoid
- What NOT to do in this post specifically

## Final Goal
One sentence: what the reader should think or feel after finishing.
```

Show the spec to the user and wait for approval before writing. If the user approves (or says "go", "looks good", "write it"), proceed to Step 2C.

#### Step 2C: Write the Post

Write the full post strictly following the approved spec. For every section in the spec:
- Cover exactly what the spec says
- Apply the depth requirement: for each major claim, explain WHY it matters and WHAT changes because of it
- Do not add sections not in the spec; do not skip sections in the spec

**Voice and style:**
- Analytical, thoughtful, slightly bold — reason through ideas, don't just describe them
- Short paragraphs. One idea per paragraph.
- **Bold key terms, numbers, and names** on first mention
- Blockquotes (`>`) for the most important takeaways — use them like pull quotes, 1–3 per post
- Horizontal rules (`---`) to break between major narrative shifts
- Superscript references (`<sup>[N](#references)</sup>`) inline when citing a specific fact
- End with a strong, memorable statement — something the reader carries with them

**Anti-patterns:**
- Do NOT summarize articles paragraph-by-paragraph
- Do NOT repeat the same idea in different wording
- Do NOT stay surface level — "this is a big deal" is worthless; "this shifts X to Y, which changes Z" is the goal
- Do NOT use hype language or generic AI buzzwords

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
- The DEV link at the bottom can be left as a placeholder if not yet published

## Step 4: Confirm with the User

After writing the file, summarize:
- The file path created
- The title and slug
- Any sources used
- Whether a cover image is still needed
