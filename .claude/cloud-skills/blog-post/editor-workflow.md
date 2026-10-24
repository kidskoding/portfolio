# Editor Workflow

Six stages. Stop after Stages 1–4 for the user's input unless they explicitly asked for a complete draft. Read `style-guide.md` before Stage 2.

## Stage 1 — Extract

Gather raw material, then list what is there.

**Sources, in order of value:**
- **The user.** Ask for moments, not summaries. Up to 6 questions in one message, skipping what is already known:
  1. What surprised you?
  2. When did you realize you didn't understand something you thought you knew?
  3. What did you have to explain to someone else, or have explained to you?
  4. What broke, and what did fixing it teach you?
  5. What assumption did you hold before that you don't now?
  6. What do you keep thinking about after work?
- **Their notes or drafts**, if they paste any.
- **Portfolio data.** For the user's portfolio, `portfolio.md` lists where roles, dates, milestones, and project write-ups live.
- **Code they own.** For personal projects: the repo, `git log --oneline`, reverted and `fix:` commits. Never read or quote employer code into the post.

**Output a short inventory:**
- experiences
- technologies
- interesting engineering decisions
- surprising moments
- mistakes or changed assumptions
- things learned
- possible broader themes

## Stage 2 — Find the Throughline

Ask internally:
1. What surprised the author?
2. What changed how they think about engineering?
3. What did they understand differently after doing the work?
4. What assumption did they hold before?
5. What tension connects the technologies or experiences?
6. Why would another engineer care?

**Output 3–5 thesis candidates, ranked.** For each:
- the thesis in one sentence (shorter is better)
- which experiences support it, and how they connect, ideally as a small diagram
- why another engineer would care
- its weakness (thin evidence, too generic, too close to résumé)

Example of connecting experiences:

```text
Effect              → makes application dependencies explicit
Nix                 → makes development-environment dependencies explicit
Cloudflare Workers  → makes runtime boundaries explicit
                              ↓
          GOOD SYSTEMS MAKE THEIR ASSUMPTIONS EXPLICIT
```

A good thesis is something the rest of the post can keep returning to. If no candidate is strong, say so and ask the user for more material instead of forcing one.

## Stage 3 — Build the Narrative

Structure the chosen thesis as a progression, usually small to large:

```text
Hook
  ↓
Concrete experience
  ↓
Technical explanation (only what the thesis needs)
  ↓
What surprised me
  ↓
Second experience that expands the idea
  ↓
Larger architectural implication
  ↓
Reflection
  ↓
Return to hook
```

Look for a conceptual ladder that makes separate experiences feel like one article:

```text
CODE            Drizzle + Effect     "How should these abstractions compose?"
      ↓
ENVIRONMENT     Nix                  "Can another developer reproduce my assumptions?"
      ↓
INFRASTRUCTURE  Cloudflare Workers   "What assumptions should production make?"
      ↓
PRINCIPLE       Good engineering makes assumptions explicit.
```

**Output:** the outline with one line per section saying what it argues, plus 2–3 title options and a subtitle (see Titles in `style-guide.md`), plus the proposed opening lines.

## Stage 4 — Visual Plan

List each proposed visual with:
- where it goes
- what idea it communicates in one sentence
- type: architecture, dependency boundary, conceptual transformation, before/after, code snippet, type signature, config snippet, screenshot

Cut any visual that only decorates. A reader should understand each diagram within a few seconds.

## Stage 5 — Draft

Write the file for the output target (see "Output Target" in `SKILL.md`), following the approved outline and `style-guide.md`. Keep one voice throughout. Length follows the idea; do not pad to a word count. Place the bold skim path (Bold in `style-guide.md`) while drafting, not as an afterthought. Draft in flowing, connected sentences from the start (Flowing Sentences in `style-guide.md`); smoothing choppy prose later costs a full extra pass.

## Stage 6 — Edit

Review the draft and report findings before changing anything large. Check for:
- weak hook
- unnecessary explanation
- résumé language
- repetitive thesis statements
- generic AI wording
- choppy fragment runs outside the opening hook and closing beat (see Flowing Sentences in `style-guide.md`); merge them
- run-on or abstract-noun sentences ("The reason is that...", stacked "that ... and that ..." clauses) and figurative wording; rewrite them as subject + verb + because (see Plain Grammar in `style-guide.md`)
- in tutorials: keys, commands, or syntax used before they're explained, dense key lists, slogan headings, taglines under headings, or repeated label scaffolds (see Tutorials and Guides in `style-guide.md`)
- sections that don't serve the central argument
- overly long paragraphs: over ~75 words or doing two jobs (see Paragraph Breaks in `style-guide.md`)
- weak transitions
- technical details without purpose
- unsupported claims
- accidental disclosure of proprietary information (confidentiality check in `style-guide.md`)
- an ending that does not resolve the opening
- bold that is missing, decorative, or on tool names (see Bold in `style-guide.md`): read only the bold text and check it still tells the argument, and that every section, including the closing reflection, has its key line bolded

Recommend deleting entire sections when they don't earn their place.

For a harder second opinion, dispatch a fresh subagent with only the draft path, `style-guide.md`, and this checklist. A reviewer that did not write the draft is less forgiving of it.

Apply the edits the user agrees to, then run the target's build check if it has one.

## Critique Mode

When the user brings an existing draft, do NOT rewrite it. First answer:

1. What the article is currently about.
2. What it should probably be about.
3. The strongest paragraph or idea.
4. The weakest sections.
5. Where the narrative loses momentum.
6. Where technical depth is missing.
7. Where technical explanation becomes excessive.
8. What should be cut.
9. Which diagrams could replace prose.
10. Whether the ending actually resolves the opening.

Then suggest a revised structure. Rewrite only when asked.

## LinkedIn Companion (optional)

When the post is done, offer a short LinkedIn post that points to it. Same voice rules as the article, so no "Excited to share", no motivational closer, no emoji bullets.
- First ~200 characters carry the hook, because LinkedIn truncates with "see more". Lead with the thesis or the opening contradiction.
- 3–5 short lines that tease the idea, not the job.
- One line linking the full post. Ask for the site domain if unknown.
- Give it in chat; do not save it to the repo.
