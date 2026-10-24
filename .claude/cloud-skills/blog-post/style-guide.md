# Style Guide

How the user's developer posts should read. Apply in every Editor-mode stage from Stage 2 on.

## What a Post Is Not

- a résumé rewritten as prose
- "5 things I learned at my internship"
- a diary of everything done this week
- documentation with an introduction attached
- a list of technologies used
- an overly polished LinkedIn post
- a tutorial, unless the user asks for one

## Internship and Job Posts

Strongly discourage chronological reporting.

BAD:

```text
During my first month I worked with:
- Cloudflare Workers
- Effect
- Drizzle
- Nix

First I did X. Then I did Y. Then I learned Z.
```

BETTER: find the idea connecting those experiences. The article is about the idea. The internship is where the author discovered it.

## Technology as Evidence

Technology supports the argument. Never structure a post as "What is Effect? What is Nix? What are Workers? Conclusion." That is documentation.

Instead:

```text
claim → real engineering situation → technology involved
      → what the technology exposed → lesson → next situation
```

Explain only enough for the reader to see why the decision was interesting. Assume a technically curious reader who may not know every tool. 100 words plus a diagram beats 500 words of API tour.

## Concrete Moments

Abstract engineering writing gets boring fast. Anchor every section in a moment:
- "I thought I understood Drizzle until I had to integrate it with Effect."
- onboarding another developer
- discovering undocumented machine dependencies
- reproducing a build on another machine
- a failure handled differently than expected
- realizing a Worker should not depend on process-local state
- replacing a long setup guide with a reproducible environment
- debugging an integration boundary
- an abstraction behaving differently in production

Useful pattern for reflective writing:

```text
I expected X.
Then Y happened.
That forced me to understand Z.
```

## Technical Depth

Do not dumb down the engineering. Another developer should learn something. Good material: architecture and dependency diagrams, small code snippets, before/after designs, simplified data flows, type signatures, config snippets, failure scenarios, trade-offs.

Every technical element must answer: **why does this matter to the thesis?** Cut details that only prove the author knows them.

Snippets: 5–30 lines, trimmed with `// ...`, language tag on every fence, explained after the code. Use `diff` fences for before/after.

## Diagrams

Recommend diagrams aggressively when a relationship is visual. Use Mermaid only when the target renders it (the portfolio does; see `portfolio.md`). Otherwise draw them as ASCII in ```` ```text ```` fences.

- **Architecture:** `Client → Worker → Service → Database`
- **Dependency boundaries:** `Business Logic → Database Service → Drizzle → Database`
- **Conceptual transformation:** `something familiar → new environment → hidden assumption → deeper understanding`
- **Before / after:**

```text
README instructions        Nix environment
       ↓                         ↓
manual machine state       declared environment
```

Diagrams communicate an idea, never decorate. No giant diagrams. Readable in a few seconds.

## Voice

Thoughtful, conversational, technically competent. A developer thinking through something they actually encountered.

The author:
- enjoys software engineering and likes knowing why tools are designed the way they are
- cares about developer tooling and architecture
- likes Nix, Rust, modern TypeScript tooling, infrastructure, and unusual technical ideas
- questions their own previous assumptions and is still learning
- prefers interesting ideas over prestige or corporate branding

Not personal branding. The technical idea is the interesting part.

**Prefer:** short paragraphs, clear sentences that flow into each other (the user's voice: connected, conversational sentences joined with "but rather", "so", "because", not stacks of two-word fragments), specific language, natural first-person reflection, confidence without pretending to know everything, sections that flow into each other, rhetorical questions when useful, code and diagrams between prose.

**Avoid:** choppy runs of fragments ("Nothing wrong with it. It works.", "Same query, same builder.", "Checkmark."), which the user reads as choppy; keep staccato lines for the closing beat only. Also avoid corporate marketing language, fake enthusiasm, piles of adjectives, motivational LinkedIn tone, "I'm thrilled to announce", "In today's rapidly evolving technological landscape", generic AI introductions, constant bullet lists, unnecessary headings, the thesis repeated word for word in every section, excessive em dashes, a motivational line closing every section.

## Flowing Sentences

The user's voice is connected and conversational. Sentences flow into each other through connectors ("but rather", "so", "because", "that said", "which"), the way their own line does: "The challenge wasn't using Drizzle, but rather making Drizzle fit alongside Effect." Stacks of short fragments read as choppy to them, even when each fragment is punchy.

| Choppy (don't) | Flowing (do) |
|---|---|
| Nothing wrong with it. It works. | There's nothing wrong with it, and it works. |
| How can it fail? The type doesn't say. What does it need? The type doesn't say. | The type doesn't tell you how it can fail, and it doesn't tell you what it needs. |
| The Drizzle part is identical. Same query, same builder. | The Drizzle part is identical, with the same query and the same builder. |
| I knew what serverless meant. Functions, no servers, pay per request. Checkmark. | I knew what serverless meant: functions, no servers to manage, and paying per request. In my head, it already had a checkmark. |
| Part of it is in the README. Part is in a setup script. Part is in someone's shell config. | Part of it lives in the README, part in a setup script, and part in someone's shell config. |
| The usual reasons not to switch are that setup takes weeks and that you must memorize a wiki of keys. | Many people are hesitant to switch because they expect setup to take weeks and think they have to memorize a long list of keys first. |

Rules:
- Merge a run of two or more fragments into one sentence with a connector, a colon, or a list.
- Contrast belongs in one sentence ("isn't X, but rather Y"), not split across two.
- Staccato is allowed only as a deliberate beat: the opening hook (three short lines that set up a question) and the closing lines. Everywhere else, flow.
- Keep the user's own phrasing when smoothing; connect around it rather than rewriting it.

## Plain Grammar

Flowing is not the same as long. A sentence that hangs everything off an abstract noun ("The usual reasons not to switch are that X and that Y") is grammatical but reads as a run-on, because the reader has to hold a stacked "that ... and that ..." clause before reaching the point. Give the sentence a person or thing as the subject and a plain verb, then the reason: "Many people are hesitant to switch because X."

- Lead with who does what ("Many people hesitate because...", "Most tutorials start with..."), not with "The reason is that...", "The problem is that...", or "What this means is that...".
- No stacked "that ... and that ..." clauses. If a sentence needs two, use "because" or split it into two full sentences.
- One idea per sentence, two at most when joined by a connector. Flowing means connected, not chained.
- Use words literally ("a long list of keys", not "a wiki of keys"). A figurative noun makes the reader translate before they can follow.
- Read the sentence aloud. If you would not say it that way to a friend, rewrite it.

## Paragraph Breaks

Flowing sentences still need white space. Break a paragraph when it changes jobs, not only when it gets long:

- Keep paragraphs to about 2–4 sentences or 75 words. Past that, find the turn and split there.
- Split between context and action: "We develop on Ubuntu under WSL, where setup is imperative…" and "I declared everything in Nix instead…" are two paragraphs.
- Give a bold conclusion its own short paragraph when it follows an explanation, so the skim path lands on a line by itself.
- Split before a sentence that starts a new idea with "And because…", "I think that's what…", or "I assumed…".
- Don't split one thought across paragraphs to look airy; a lone sentence is reserved for the opening and closing beats (Flowing Sentences).

## Tutorials and Guides

Tutorial-style posts (a tool switch, a setup walkthrough, "from X to Y") should read like regular English prose, not a video script or a reference card. Being inspired by fast technical creators (Vimjoyer, No Boilerplate) means leading with demos and keeping density high; it does not mean adopting a punchy delivery.

- **Headings are plain and descriptive** ("How Neovim understands your code"), not slogans or two-sentence claims ("Your editor doesn't understand Python. A server does.").
- **No tagline blockquote under every heading.** The first paragraph does that job.
- **No repeated label scaffolds** like *Ships with:* / *Also worth a look:* / *Verdict:* in every section. Write comparisons as connected paragraphs: what ships, what the alternatives are, and which to pick and why.
- **Introduce notation gradually.** Never open with a block of keybindings, commands, or syntax the reader can't read yet. Describe the outcome in prose first ("you rename a function across every file without touching the mouse"), then teach each key or command at the point where it's used, with its meaning. Don't use a key in an example before the section that explains it.
- **Teach in chronological order.** Walk the reader through the steps they actually take. Define a term the first time it appears in that sequence, then refer back to it later ("the same `:qa` as after first launch"). Do not front-load glossary tables, dual-installer lectures, or tool names before the reader has a reason to open that screen.
- **Don't list every key or flag.** Give the two or three you need to start, then point to the tool's own discovery mechanism (a which-key menu, `--help`, a picker) for the rest. Dense key lists read as a manual and lose the reader.
- **Address the reader as you.** Conversion and setup posts are persuading the person reading, not narrating about "beginners," "newcomers," or "people who switch." Prefer "five rows you will actually use" over "five rows beginners use."
- Install steps, platform variants, and troubleshooting go in an appendix, linked from one line, so they don't interrupt the story.

## Bold

Bold is a skim path, not decoration. A reader who reads only the bold text should still follow the argument, so each bold phrase is one step of it.

- Bold generously: the user wants the key points and the lines that stand out to pop. Expect 1–3 per section and roughly 15–25 in a full post, and treat a section with no bold, including the reflection paragraphs near the end, as a miss.
- Bold the sentence or clause where a section turns: the realization, the reframe, the line that connects one example to the next, and any line a reader would quote or remember. Always bold the thesis sentence when it finally lands.
- Prefer a clause over a single word. "**the database stopped being something the function grabs from a module and became something it asks for**" beats "**dependency**".
- Also bold **language and format names** when they matter in prose (**Lua**, **JSON**, **Python**, **TypeScript**, **Rust**). That is emphasis, not code.

Do not bold:
- tool or company names used as résumé tokens (Effect, Nix, Cloudflare as a list) — different from language names above
- pull quotes (the blockquote already sets them apart)
- text that repeats a heading
- the final echo lines (the last two or three short lines that mirror the opening hook land through white space, not weight); the reflection paragraphs before them still get bold
- UI labels that are not code (Find Word, Marketplace, Settings Sync): leave plain

## Inline code (backticks)

Use backticks only for things that are code or point at code. Everything else stays plain or bold per the rules above.

**Backtick:**
- file and directory paths: `settings.json`, `lua/plugins/gruvbox.lua`, `~/.config/nvim`
- commands and keys: `nvim`, `:Lazy`, `:Mason`, `ciw`, `<Leader>ff`, `F7`, `Esc`
- identifiers, options, and code tokens: `opts`, `nil`, `priority`, `SignColumn`, `owner/repo`, `pack.python`
- plugin / package / binary ids when naming the installable: `lualine`, `bufferline`, `lazygit`, `claudecode.nvim`, `ty`, `ruff`, `lua_ls`, `gruvbox` (as a colorscheme id), `which-key`
- short inline snippets: `opts = { ... }`, `"ellisonleao/gruvbox.nvim"`

**Do not backtick:**
- language or format names in running prose: write **Lua** / **JSON**, not `Lua` / `JSON`
- product or UI chrome in plain English: Explorer, Marketplace, Command Palette, Find Word, Bookmarks
- ordinary words that happen to be technical (session, dashboard, plugin, extension) unless you mean a specific code symbol

Wrong: `Lua` files, a `JSON` blob, open the `Marketplace`
Right: **Lua** files, a **JSON** blob, open the Marketplace; edit `settings.json`; run `:Lazy`

### Vim / Neovim mode names (portfolio)

When a post names editor modes in prose (not inside a code fence), use the `VimMode` chip so they match the gruvbox statusline: yellow Normal, blue Insert, orange Visual, green Command, purple Terminal.

```mdx
import VimMode from '../../../components/VimMode.astro';

…in <VimMode mode="normal" /> mode… drop into <VimMode mode="insert" />…
```

Do not backtick or bold mode names in that case; the chip is the highlight. Leave `"Normal"` alone inside Lua/code fences (highlight groups, string literals).

## Professional Reflection

One month of experience is not universal expertise. Share an evolving mental model:
- "One thing I've started appreciating..."
- "This changed how I think about..."
- "The model that clicked for me was..."
- "I'm beginning to see..."
- "The interesting part, at least from what I've worked with so far..."

## Openings

Never: "It has officially been one month since I joined COMPANY, and I've learned so much!"

Open with a realization, a contradiction, a technical problem, a surprising statement, or a concrete moment:

> I knew what Drizzle ORM was before starting this job.
>
> Then I had to integrate it with Effect.
>
> And suddenly I wasn't sure I actually knew Drizzle.

That creates a question. Reveal the job or internship context gradually after it.

## Endings

Never a generic summary ("Overall, my first month has been an incredible learning experience...").

Return to the opening idea. The final paragraph compresses the article into a thought worth remembering and makes the title feel inevitable:

```text
I thought learning meant encountering something new.

This month reminded me that sometimes learning means
returning to something familiar under a new constraint.

Learn it.
Use it.
Connect it to something unfamiliar.
Discover the assumptions you didn't know you were making.
Learn it again.
```

## Titles

Idea-driven, not employer-driven. The job goes in the subtitle.

Weak: "My First Month at Brunswick", "What I Learned During My First Month", "My Software Engineering Internship Experience".

Better: "Learn It Again", "One Month In: Learn It Again", "The Things Your Development Environment Isn't Telling You", "Reproducibility Is a Team Feature", "Learning Happens at the Seams", "Making Assumptions Explicit".

Example pair:
- title: `Learn It Again`
- description: `What Effect, Nix, and Cloudflare Workers taught me during my first month at Brunswick`

## Example Theses

- "Good systems make their assumptions explicit."
- "Using a tool teaches you its API. Integrating it teaches you its model."
- "Reproducibility is not a developer convenience. It's a team feature."
- "The interesting engineering happens at the boundaries between systems."
- "You haven't necessarily learned a technology just because you've used it before."

## Introduce People

Assume the reader doesn't know who anyone is. On first mention of a person, creator, team or company the post depends on, give one to three sentences: who they are, what they're known for, and why that matters to the story (Jynxzi: "became one of the biggest streamers on Twitch playing Rainbow Six Siege on an Xbox controller"). When several people carry the story, give them their own short section (`## Meet the team`, one `###` each) before the events.

Keep introductions LinkedIn-safe and relevant: skip bans, gambling, lawsuits or drama unless the post is about them, and don't pad with follower counts that aren't part of the point.

## Company Context and Confidentiality

Use company context only when it explains why a pattern is interesting. Prefer framing like "In a company operating across many products and digital experiences..." over describing internal topology.

**Confidentiality check.** Flag anything that reveals:
- proprietary architecture or private infrastructure
- internal endpoints or credentials
- customer information
- unreleased products
- confidential business logic
- internal metrics, unless public or approved
- specific security decisions
- anything else that should reasonably stay internal

Flag these for the user instead of silently removing them. When a company-specific claim matters, suggest checking whether it is public. Keep implementation examples generalized: rewrite internal code as a minimal example that shows the same idea.
