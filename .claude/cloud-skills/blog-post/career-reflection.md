# Mode C — Career Reflection (LinkedIn)

For posts that use a moment the user didn't work on (a stream, a game, a sports run, a viral clip, a news story) as the hook for **workplace and career lessons**. The goal is a post that raises the user's professional profile on LinkedIn: the event gets people reading, the lessons are why they remember the author.

The blog post is the full piece. The LinkedIn post is a preview that links to it.

## Step C1: Research the moment

Use WebSearch for the facts: dates, numbers, rules, who did what, and the one or two moments people talked about. Fan posts and clips are fine sources for a reflection, but never state a number, quote or event the research doesn't support. When sources conflict (127 deaths vs. 128 attempts), pick a consistent pair and say only what the pair implies.

Also gather a short, LinkedIn-safe background on every person or group involved (see Introduce People in `style-guide.md`). Leave out controversies, bans, gambling or legal trouble unless the post is about them.

## Step C2: Find the lessons

Ask what the moment shows about how good teams, leaders or careers work. Aim for 3–5 lessons, each one a real workplace behavior (delegation, shared ownership, blameless postmortems, judging by results, resilience, psychological safety), not a slogan. Rank them and drop any that only restate another.

If the user wants it fast, go straight to the draft; otherwise show the lessons and a title before writing.

## Structure

The workplace is the post; the event is the hook. Keep the story short and put most words into "at work".

```text
Hook (staccato, 2–3 lines from the event)
  ↓
Why it matters to the user's career (one or two sentences; their role, from portfolio data)
  ↓
## Meet the [people]       one ### per person: who they are, what they're known for, in 2–3 sentences
  ↓
## The [event] in 60 seconds   the facts, a scoreboard table, one embed
  ↓
## Lesson 1: <workplace behavior>
   ### On the [stream / field / show]
   ### At work
  ↓
...Lessons 2–4
  ↓
## What I'm taking into my career   bullet list, each bullet opens with a bold commitment
  ↓
Closing reflection + echo of the hook
```

- **Title:** about the lesson and the reader, not the event's in-jokes. "What a 73-Hour Minecraft Stream Taught Me About Great Teams" beats "Let Los Hit the Dragon". Keep a fun phrase for the slug or the closing line if the user likes it.
- **Headings:** more than a technical post. Every lesson gets an `##`, and its two halves get `###`.
- **Bold:** generously, per Bold in `style-guide.md`; aim for the top of the range.
- **Pull quotes:** 1–3 blockquotes with the lines someone would screenshot.
- **Embeds:** one or two `<TweetEmbed>` (or links) of the actual moment, as visuals, not citations.
- **References:** optional. Skip the References section when the user says they don't need sources.

## Voice

Inspirational is fine here, and the user asked for it, but it should come from a specific moment, not from adjectives. Keep the style-guide rules: flowing sentences, plain grammar, no em dashes, no "I'm thrilled", no motivational closer on every section.

## Speaking for the user

These posts are full of first-person lines ("the engineers I learn the most from...", "what I'm taking into my career"). Use only facts the user has published (roles and dates from `src/data/experience.ts` and earlier posts) and never invent an anecdote from their job. When you write a first-person reflection or commitment yourself, **list it for the user to confirm** before they publish.

## LinkedIn companion

Always offer it, in chat, per "LinkedIn Companion" in `editor-workflow.md`, adapted for this mode:
- The first two lines repeat the post's hook.
- One line of what happened, one line of the turn.
- The lessons as a short `→` list (the post's lesson headings).
- One first-person line tying it to the user's career, then the post's URL (`site` in `astro.config.mjs` + `/blog/<slug>`).
- Update it whenever the post's title, lessons or claims change.
