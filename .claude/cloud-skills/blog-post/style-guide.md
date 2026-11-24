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

### Making a technical case

An argument post ("why X in the age of Y") is convincing when every reason rests on something real, not on opinion:

- **Quote real artifacts:** the exact command a tool ran, a number read off a real screen or log ("loaded 10 of 52 plugins in about 88 ms"), a pipe that works (`git diff | claude -p "…"`).
- **Read the source before explaining how a tool works:** protocol details, file locations, and API names come from the code or official docs, never from memory.
- **Check every absolute word:** "all", "every", "only", "never" claims are the ones readers catch. "All of the review happens in an editor" was false, because the agent's CLI shows diffs itself; the accurate claim was "as soon as a change needs more than yes or no, you're editing."
- **Show every language or tool claim working:** a claim like "the borrow checker rejects X" or "a `Result` forces the caller to handle errors" gets a small runnable snippet as a listing, then the real compiler or command output under a plain lead-in. Write the code the way the mistake really happens (an agent forgetting a `match` arm, treating a `Result` as a plain value), not a toy. If the intro states a rule that a later listing shows, point to it ("**Listing 1.2**, later in this post, shows …") instead of showing it twice.
- **Contrast with the language the reader knows:** one line on how **Python** or **TypeScript** handles the same case ("`int(\"abc\")` raises a `ValueError`, and nothing in `-> int` warns you") makes the Rust behavior land.
- **Back adoption claims with named projects and their own numbers:** not "AI teams are moving to Rust" but the project, the size, the time and the measured result ("535,496 lines of Zig ported in 11 days", "5.25 seconds to 292 milliseconds"), each read from the project's own post. When secondary coverage disagrees on a number, use the primary source, and when a primary post gives two different numbers for the same thing, use the one in its table and say which one you used.
- **Cover the costs as thoroughly as the benefits:** compile times, learning curve, escape hatches like `unsafe`, and the project's own caveat ("This is in no way a claim that every large TypeScript program should become Rust"). Quote the community's own survey text when its percentages only live in charts you can't read, and never invent the number.
- **A video or article the user admires is a coverage checklist, not a source to copy:** compare its sections to the post's to find gaps (adoption examples, why now, costs), then research each gap from primary sources and write it in your own words. Cite the video only for what it says itself, quote it from the transcript, and flag auto-caption quotes for a listen-through. Introduce its creator with checkable facts ("over 100,000 subscribers"), not "famous".
- **Order the reasons so each answers the question the last one raised,** and give them unnumbered `###` headings under one `##`; the `##` heading already says how many there are.

Snippets: 5–30 lines, trimmed with `// ...`, language tag on every fence, explained after the code. Use `diff` fences for before/after.

Terminal commands start with a prompt so readers know they run in a shell: `$ ` in `sh`/`bash` fences (`PS> ` in `powershell` fences), on every command line. Comment lines, `\` continuation lines and printed output get no prompt, and inline commands in prose stay bare (`` `cargo build` ``). File contents that list commands, such as a `CLAUDE.md` or a `Makefile`, are not terminal samples and get no prompt:

```sh
# macOS
$ brew install neovim ripgrep \
  fd lazygit
$ nvim --version
NVIM v0.11.5
```

Command output must be what the command really printed: run the exact snippet the post shows (same file, same line numbers, comments included), capture it in full with `--color=always` into an ```` ```ansi ```` fence, and start the block with the `$ ` command line. Never trim it: keep the `Compiling`/`Checking` line, every `note`/`help` line, and the closing `error: could not compile ...` line. If the output would print a private path (a home directory, a scratch folder), change where the command runs, not the output: mount the project at a neutral path such as `/home/you/<crate>` with `bwrap --dev-bind / / --tmpfs /home --bind <project> /home/you/<crate> --setenv HOME /home/you --chdir /home/you/<crate> cargo build --color=always`.

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

## Structure and Skimmability

The user wants posts that are engaging to skim, not essays. A reader scrolling on a phone should be able to follow the post from the headings, the bold lines and the pull quotes alone.

- **Headings generously.** Give every major idea its own `##`, and split a section that does two jobs into `###` subsections (the backstory and the turn, or "On the stream" and "At work"). A full post usually has 8–15 headings. Headings stay plain and descriptive (Tutorials and Guides below), never slogans.
- **Numbered lessons.** When a post teaches several takeaways, give each its own heading: `## Lesson 1: Great leaders design the win around someone else`, or `### 1. Give away the final hit` under a parent section. The heading states the lesson as a plain sentence.
- **Pair the story with the meaning.** When a section has an event and a lesson, split it into `### On the [stream / job / project]` and `### At work` (or `### What it taught me`) so the reader sees both halves.
- **Project posts lead with the actual results.** Show the real output (the result table, the measured numbers, the surprising rows) and the insight each one gives, taken from the repo's generated results file or tables, never estimated. The results are the payoff; the pipeline explains how they were reached.
- **Stat tables for the numbers.** When a story has 3–5 numbers that matter (hours, attempts, deaths, users, latency), put them in a small table near the top instead of a sentence full of figures. Always give the table a header row; an empty one renders as a blank bordered row.
- **Pull quotes.** Use 1–3 blockquotes (`>`) for the lines someone would screenshot, usually after the section that earns them. Not one under every heading.
- **Show the real moment.** Embed the actual tweet, clip or screenshot (`<TweetEmbed>` on the portfolio) where the post describes it, as a visual rather than a citation.
- **Introduce the cast early.** When the story depends on people or companies the reader may not know, a short `## Meet the team` section (one `###` each) comes before the events (Introduce People below).
- **End on a takeaway list when it fits.** Reflection and career posts close with a short bulleted list where each bullet opens with a bold commitment ("**Set other people up to win:** …", colon, never a period), then the closing reflection and the echo of the hook.

Example skeleton (from "What a 73-Hour Minecraft Stream Taught Me About Great Teams"):

```text
three-line hook → why it matters to me
## Meet the team            ### Jynxzi  ### StableRonaldo (Ron)  ### LosPollos (Los)
## The run in 60 seconds    stat table + embedded tweet
## Lesson 1: ...            ### On the stream  ### At work  > pull quote
## Lesson 2–4: ...
## What I'm taking into my career   bold-led bullets
## The kind of teammate I want to be   reflection + echo
```

## Voice

Thoughtful, conversational, technically competent. A developer thinking through something they actually encountered.

The author:
- enjoys software engineering and likes knowing why tools are designed the way they are
- cares about developer tooling and architecture
- likes Nix, Rust, modern TypeScript tooling, infrastructure, and unusual technical ideas
- questions their own previous assumptions and is still learning
- prefers interesting ideas over prestige or corporate branding

Not personal branding. The technical idea is the interesting part.

**Warmly introduce every new thing where it first appears:** this is what makes Vimjoyer's and No Boilerplate's technical videos easy to follow. Every tool, term, key, or concept gets a short, friendly introduction the first time it shows up, before the post uses it ("Before we install it, let's meet AstroNvim. AstroNvim is a Neovim distribution, a complete configuration that…", "Meet the leader key: it's a key you press before a shortcut, and in this setup it's Space"). Check by first use, not by whether a definition exists somewhere later in the post, and turn later definitions into back-references ("the leader key from earlier"). Only do this for things the reader needs to follow the post's main path; a side detail (how the clips were recorded, an API or a socket in an aside) can stay unexplained.

**Match the author's writing sample:** the user's own prose is in `~/uiuc/go-mama-27/portfolio/src/content/blog/halloween-candy-food-allergies/index.mdx`. Read its opening and one results section before drafting, and match it, including when running the `humanizer` skill (a writing sample overrides its default patterns). Its habits:
- opens on a relatable second-person scene ("If you had gone trick-or-treating anytime during your youth, chances are…")
- curious first person that leads into the work ("I was curious to see…", then "So I built…")
- "we" when walking the reader through what comes next ("Later on, we will see…")
- every tool or term explained inline in plain words ("Kaggle, a website where people share free datasets")
- casual, warm word choices and the occasional exclamation ("pretty much everywhere", "quite common", "built around peanut butter!") instead of neutral, clipped phrasing
- bold claims that open with a colon, and every number labeled

**Write as the author, in first person:** the writer names and guides, not the document. Write "I'll refer to this as **the review loop**, as shown in **Figure 1.3**" and "For the rest of this post, I'll build the editor with you step by step", not "this post calls it the review loop" or "the rest of this post builds the editor". Using "this post" as a place is fine ("later in this post"); using it as the one doing something is not.

**Prefer:** short paragraphs, clear sentences that flow into each other (the user's voice: connected, conversational sentences joined with "but rather", "so", "because", not stacks of two-word fragments), specific language, natural first-person reflection, confidence without pretending to know everything, sections that flow into each other, rhetorical questions when useful, code and diagrams between prose.

**Avoid:** choppy runs of fragments ("Nothing wrong with it. It works.", "Same query, same builder.", "Checkmark."), which the user reads as choppy; keep staccato lines for the closing beat only. Also avoid corporate marketing language, fake enthusiasm, piles of adjectives, motivational LinkedIn tone, "I'm thrilled to announce", "In today's rapidly evolving technological landscape", generic AI introductions, constant bullet lists, walls of text with no headings, the thesis repeated word for word in every section, excessive em dashes, a motivational line closing every section.

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
- **No idioms or figurative phrases, even common ones.** The user reads them as weird and vague. Say the literal thing: "never meant to meet" → "collected separately and share no common ID"; "and friends" → "and others"; "fails loudly" → "fails with an error"; "leak allergens into" → "make one candy look like it contains"; "outvote" → "override"; "tighten the warnings" → "add allergen warnings"; "a minefield" → "a problem"; "the way a parent reads a wrapper" → "to find allergens". Similes ("a bit like Wikipedia for…") count too; cut them when the plain description already says it.
- **Label every number with what it measures.** A bare "keeps 68.7%" makes the reader guess; write "a 68.7% popularity score", "a 59.2% win rate", "7.9 points of popularity score". Use the measure's name from the post's definitions table every time, including in comparisons ("from 78.0% to 85.9%" names the measure once in the same sentence).
- **Explain a loaded word the first time it carries an argument,** with "which means that": "'May contain' warnings are voluntary, which means that no US law requires them or sets rules for when to use them". Never swap a defined term for a plainer one that changes its meaning (the "unrestricted bowl" is full of allergens, so it can never be called "allergen-free").
- **No meta lead-ins.** "You do not need a data pipeline to use these results:" makes the reader wonder why they would. Lead into a list with what it gives them: "Here is what the results mean the next time you buy candy for trick-or-treaters:".
- Read the sentence aloud. If you would not say it that way to a friend, rewrite it.

## Paragraph Breaks

Flowing sentences still need white space. Break a paragraph when it changes jobs, not only when it gets long:

- Keep paragraphs to about 2–4 sentences or 75 words. Past that, find the turn and split there.
- Split between context and action: "We develop on Ubuntu under WSL, where setup is imperative…" and "I declared everything in Nix instead…" are two paragraphs.
- Give a bold conclusion its own short paragraph when it follows an explanation, so the skim path lands on a line by itself.
- Split before a sentence that starts a new idea with "And because…", "I think that's what…", or "I assumed…".
- Don't split one thought across paragraphs to look airy; a lone sentence is reserved for the opening and closing beats (Flowing Sentences).

## Formatting Pass

Run this on every finished post, whatever its mode, before the humanizer pass:

- **Paragraphs:** none over about 75 words or 4 sentences; split at the turn (Paragraph Breaks).
- **Bold:** every `##`, `###`, and section intro has 1–3 bold key lines; reading only the bold tells the argument; bold followed by more text ends with a colon, otherwise the bold line gets its own paragraph (Bold).
- **Language names:** **Python**, **Lua**, **JSON** bold in prose, never in backticks.
- **Pull quotes:** 1–3 blockquotes, each at the end of the section that earns it.
- **Figures, tables and listings:** numbered in order, introduced in bold in the sentence before ("In **Figure 1.2**, …"), captioned underneath. Code the prose discusses is a listing ("**Listing 1.1:** the agent added `Cancelled` but missed the `match`"), the way The Rust Book does it. The command output that follows gets a plain lead-in ("Here's the error:") and no caption or number. One-line commands and two-line config stay uncaptioned. Captions say plainly what the code does, naming its identifiers ("`parse_port` in Rust returns a `Result`, and `main` tries to use it as a plain `u16`"), never a clever turn of phrase ("a function that can fail, called as if it couldn't"). Captions go through the humanizer like any other prose. Each type keeps its own counter in reading order (Listing 1.1, Figure 1.1, Listing 1.2, Table 1.1).
- **Punctuation:** no em or en dashes in prose.
- **Build:** run the target's build check last.

A quick way to find gaps: list each section's bold lines longer than about 20 characters (skipping language names and defined terms) and flag any section with none.

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
- **Explain how the pieces fit before the first install command.** Before any `git clone` or config file, say in plain words what each moving part is and why it exists (for Neovim: the config folder, what a plugin is, what the plugin manager does and why it's named that, the distribution, the external tools), ideally with a small diagram of how they load. Jumping straight into a tool's UI ("now run `:Lazy`") loses beginners.
- **Show each claim working right after you state it,** the way fast technical creators do: a short muted, looping clip with the keys visible on screen, or a screenshot, directly under the sentence it proves.

## Bold

Bold is a skim path, not decoration. A reader who reads only the bold text should still follow the argument, so each bold phrase is one step of it.

- Bold generously: the user wants the key points and the lines that stand out to pop. Expect 1–3 per section and roughly 15–25 in a full post, and treat a section with no bold, including the reflection paragraphs near the end, as a miss.
- Bold the sentence or clause where a section turns: the realization, the reframe, the line that connects one example to the next, and any line a reader would quote or remember. Always bold the thesis sentence when it finally lands.
- Bold the thesis in the opening paragraph too. The hook's setup (a joke, a scene, a question) stays plain, and the clause that states the post's claim is bold, so a reader skimming only the bold gets the argument from the first paragraph: "Vim is famous for one joke: nobody can figure out how to quit it. … **the editor's job is reading, checking, and fixing that draft, and an editor that lives in the terminal is the one built for it.**"
- Section intros count as sections. The paragraph under a `##` before its first `###`, and short setup sections (a sample project, a prerequisites list), each get a bold key line.
- Prefer a clause over a single word. "**the database stopped being something the function grabs from a module and became something it asks for**" beats "**dependency**".
- Also bold **language and format names** when they matter in prose (**Lua**, **JSON**, **Python**, **TypeScript**, **Rust**). That is emphasis, not code.
- Bold **consumer brand names** when a post introduces the companies behind a real-world problem (**Lay's**, **Doritos**, **Oreo**, **Cadbury**), so the reader recognizes the products at a glance.
- **A bold sentence followed by more text in the same paragraph or bullet ends with a colon, inside the bold, never a period:** "**These products share two traits:** each one ships in…", "**Count usable capacity, not idle capacity:** check materials…". Continue in lowercase. This covers takeaway bullets and bold turns mid-paragraph. A period is only for a bold line that stands alone with nothing after it.

Do not bold:
- tool or company names used as résumé tokens (Effect, Nix, Cloudflare as a list) — different from language names above
- pull quotes (the blockquote already sets them apart)
- text that repeats a heading
- the final echo lines (the last two or three short lines that mirror the opening hook land through white space, not weight); the reflection paragraphs before them still get bold
- UI labels that are not code (Find Word, Marketplace, Settings Sync): leave plain
- the setup line of a hook (the joke, the scene); bold the claim it leads to instead

Bolding in bulk is error-prone in MDX: never add bold inside inline code, link text, or a sentence that is already bold (nested `**` renders as literal asterisks). After any bolding pass, grep for `****` and run the build.

## Inline code (backticks)

A tool you run by its command name takes backticks in prose too, even when the sentence means the whole tool: `cargo`, not Cargo ("Rust also comes with `cargo`, its build tool"). File names keep their own case (`Cargo.toml`).

Use backticks only for things that are code or point at code. Everything else stays plain or bold per the rules above.

**Backtick:**
- file and directory paths: `settings.json`, `lua/plugins/catppuccin.lua`, `~/.config/nvim`
- commands and keys: `nvim`, `:Lazy`, `:Mason`, `ciw`, `<Leader>ff`, `F7`, `Esc`
- identifiers, options, and code tokens: `opts`, `nil`, `priority`, `SignColumn`, `owner/repo`, `pack.python`
- plugin / package / binary ids when naming the installable: `lualine`, `bufferline`, `lazygit`, `claudecode.nvim`, `ty`, `ruff`, `lua_ls`, `catppuccin` (as a colorscheme id), `which-key`
- short inline snippets: `opts = { ... }`, `"catppuccin/nvim"`

**Do not backtick:**
- language or format names in running prose: write **Lua** / **JSON**, not `Lua` / `JSON`
- product or UI chrome in plain English: Explorer, Marketplace, Command Palette, Find Word, Bookmarks
- ordinary words that happen to be technical (session, dashboard, plugin, extension) unless you mean a specific code symbol

Wrong: `Lua` files, a `JSON` blob, open the `Marketplace`
Right: **Lua** files, a **JSON** blob, open the Marketplace; edit `settings.json`; run `:Lazy`

### Vim / Neovim mode names (portfolio)

When a post names editor modes in prose (not inside a code fence), use the `VimMode` chip so they match the catppuccin statusline: blue Normal, green Insert, mauve Visual, peach Command, pink Terminal.

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

No roadmap paragraph. The intro ends on the bold thesis, never on "In this post, I'll explain X, show Y, and finish with Z." The headings already show the order, and readers skim them.

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

## Project Posts Need Context

A post about a personal project (a simulation, a demo, a tool) must stand on its own for a reader who has never heard of it. After the hook and before the details, cover:
- **The real problem.** Why it matters outside the project, with sourced facts (a trade-group stat, a company's public launch) linked inline. Name real companies only for what their public sources say, and introduce them (what they make).
- **The companies it matters to, highlighted.** Pick the companies in the exact industry the project models (a candy simulation → candy makers like Hershey, Mars, Mondelez, not chip makers like PepsiCo). Fold them into the problem section as one short paragraph each, no subheadings: what it makes, its best-known brands in bold (linked to the company's official brand page), and its public product tied to the problem (a seasonal launch, a recall). No size or rank claims ("the largest", "its closest rival") unless a source says so; quote the sourced number instead.
- **Where the data comes from.** Real dataset (name and link it), generated, or scraped. Check the repo even when the user names a source, and flag any mismatch instead of writing it.
- **Nothing from the data before the data section.** The problem and company paragraphs use only outside sources and general facts (what a company makes, what a product contains). Do not cite ranks, votes, bowls, or results there ("Twix places 3rd in the vote", "Starburst tops the peanut-free bowl") because the reader hasn't met the dataset yet; save them for the results.
- **What the data looks like, before any pipeline or model.** Its own `##` section right after the problem: who or what is in it (the named factories, products, customers), a small table of the sources or tables with what each holds and its row count (from the repo's actual output files), one real sample row in a fenced block, and the validation it passes before modeling. A reader should understand the data before reading about bronze/silver/gold or the simulation.
- **A `## References` section at the end.** Every project or research post closes with a list of every outside source it cites, numbered (`1.`) when the post cites inline with `<sup>[N]`, so [N] is item N, and bulleted (`-`) otherwise: datasets (with license), statistics, legal or company facts, the project repo, and the cover photo's credit. Format each as `[Title, Publisher](url)` with commas, no em dashes, and `<a name="references"></a>` under the heading (`portfolio.md`). Inline links stay where the fact is used; the list is the one place a reader can audit them all.
- **Define every measure before the results, like a formal analysis report or datathon write-up.** Put a `### How to read the results` subsection right before the first results table: a `Measure | Definition | Example` table covering each metric, column, and named baseline the results use (e.g. win rate, candies allowed, bowl, the unrestricted bowl, popularity kept). Each definition says where the number comes from (source column, sample size), how it is computed (the formula, thresholds, exclusions), and each example works one real value through it ("59.5% ÷ 76.3% = 78.0%"). Then one bold line telling the reader how to interpret the headline measure. Never use a term in a table that the post has not defined.
- **Number, caption and reference every table, like a formal report.** Number tables in order (`Table 1.1`, `Table 1.2`, …). Introduce each one in the sentence before it, with the table name in bold ("In **Table 1.3**, each allergy restriction is shown with…"); bold every in-text mention of a table, bold the caption label too (`<strong>Table 1.1:</strong>`, which renders green), and put a caption that describes what the table shows directly under it. On the portfolio, the caption is `<p class="text-sm text-nvim-gray -mt-4 text-center"><strong>Table 1.1:</strong> …</p>` with blank lines around it (`portfolio.md`). The stat table near the top of a narrative post counts too when the post is a data analysis.
- **End with advice for the person who acts on the result.** The closing section speaks to the reader who would use it (for the candy post, the hosts buying and handing out candy), as bold-led bullets with concrete actions taken from the results. Companies belong in the problem section, not the ending, unless the post is written for them.
- **Results can go past reporting.** When the data allows it, add one or two analyses that change a decision: a scenario comparison (with and without a rule), a closest-alternative search, or a small optimization. Each gets its own `###`, a figure, and a bold line saying what it means for the reader.
- **Number and caption every figure like the tables.** `Figure 1.1`, `Figure 1.2`, … in order of appearance, introduced in the sentence before with the name in bold ("In **Figure 1.5**, …"), captioned underneath with the same centered caption style as tables. Every chart titles both axes; numbers drawn on the chart need an axis or legend that says what they are.

## Titles

Idea-driven, not employer-driven. The job goes in the subtitle.

**A title must make sense to someone who has not read the post.** Read it cold, as a stranger scrolling a blog index: they should know what the post is about and why they might care. The user reads cryptic twist titles as choppy and meaningless. Avoid:
- punchline titles that only make sense after the ending ("The Halloween Bottleneck Was Printed Plastic", "The Patch Window Went Negative")
- metaphors and abstract nouns ("Learning Happens at the Seams")
- slogans in title case ("Reproducibility Is a Team Feature")

Prefer the "What X taught me about Y" or "Why X didn't Y" shape: name the concrete thing that happened, then the topic of the lesson in plain words. The twist belongs in the post, not the title.

Weak: "My First Month at Brunswick", "What I Learned During My First Month", "My Software Engineering Internship Experience" (résumé titles), and "The Halloween Bottleneck Was Printed Plastic" (cryptic).

Better: "What a 73-Hour Minecraft Stream Taught Me About Great Teams", "What a Halloween Factory Simulation Taught Me About Spare Capacity", "Learn It Again", "The Things Your Development Environment Isn't Telling You".

Offer 2–3 options at Stage 3 and recommend the plainest one.

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
