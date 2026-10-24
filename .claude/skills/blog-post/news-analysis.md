# Mode B — News and Industry Analysis

For posts about news, launches, or industry moves the user did not work on. Research the topic, get a spec approved, then write.

## Step B1: Research

Use WebSearch to gather:
- Key facts, dates, numbers, and quotes
- The actual state of affairs — what happened, who is involved, why it matters
- 5–10 credible sources for the References section
- Any notable data points, quotes, or primary sources

## Step B2: Build a Blog Spec

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

Show the spec to the user and wait for approval before writing. If the user approves (or says "go", "looks good", "write it"), proceed to Step B3.

## Step B3: Write the Post

Write the full post strictly following the approved spec. For every section in the spec:
- Cover exactly what the spec says
- Apply the depth requirement: for each major claim, explain WHY it matters and WHAT changes because of it
- Do not add sections not in the spec; do not skip sections in the spec

**Voice and style:**
- Analytical, thoughtful, slightly bold — reason through ideas, don't just describe them
- Short paragraphs. One idea per paragraph.
- **Bold key terms, numbers, and names** on first mention (news posts only; Editor-mode posts follow Bold in `style-guide.md`)
- Blockquotes (`>`) for the most important takeaways — use them like pull quotes, 1–3 per post
- Horizontal rules (`---`) to break between major narrative shifts
- Superscript references (`<sup>[N](#references)</sup>`) inline when citing a specific fact
- End with a strong, memorable statement — something the reader carries with them

**Anti-patterns:**
- Do NOT summarize articles paragraph-by-paragraph
- Do NOT repeat the same idea in different wording
- Do NOT stay surface level — "this is a big deal" is worthless; "this shifts X to Y, which changes Z" is the goal
- Do NOT use hype language or generic AI buzzwords

Then write the file per "Output Target" in `SKILL.md`, ending with the `## References` section.
