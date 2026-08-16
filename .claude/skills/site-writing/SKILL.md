---
name: site-writing
description: Write, restructure or publish a page on diligent-dilettante.github.io. Covers the shared page skeleton, how titles are framed, the two-family nesting in the writing section, when a cross-link is earned, and the checks that run before anything is pushed. Use this whenever adding a new writeup, editing an existing page, renaming or reframing a title, changing the writing section, or touching sitemap.xml or index.html. Also use it when a skill gets a companion article, since those nest rather than sit beside their parent.
---

# Writing on the site

The site is a personal site for credibility, recruiting and an audience for things
Krishna builds. Writing is the "building in public" half: useful things he has made,
shared because a reader benefits. It may be monetised later, so the writing section is
structured as a body of work rather than a chronological feed.

`CLAUDE.md` in the repo root holds the voice rules, the settled decisions and the fact
table. `.claude/rules/publishing.md` holds the mechanical pre-push checks. **Read both.**
This file covers what neither does: how a page is shaped, how titles are framed, and how
pages relate to each other.

---

## Before anything else: check the branch

```bash
git branch --show-current
```

This repo is often left on a leftover feature branch. Committing onto whatever happens to
be checked out entangles unrelated work and neither piece can be merged without dragging
the other. Branch from `main` for new work.

Merging to `main` publishes. GitHub Pages serves from `main` and the change is live about
a minute later, so treat that merge as the publish decision, not a housekeeping step.

---

## Title framing

**Lead with what the reader gets, and keep the category noun.**

Two failure modes, and the site has hit both:

- **Input framing.** "a claude skill that reads indian bank statements" describes what the
  tool ingests. That is the plumbing, and it is not why anyone clicks.
- **Losing the category.** Correcting the above to "a claude skill that tells you where
  your money went" over-swung: outcome-framed but naming no category, so in a list of five
  entries you cannot tell which skill it is.

The shape that works carries both: **`a <category> skill that <outcome>`**.

```
a personal finance skill that tells you where your money went
a business finance skill that reads your company's books
a payments skill for taking money in india
```

Two exceptions worth preserving. `business-planner` and `life-planning` use essay voice
("why i built a business planner that argues with you"). That is a genre choice rather than
a mistake, and it earns its place because those pages are about the making.

**Do not inherit a construction from a sibling page for symmetry.** That was the actual
cause of the input-framing error: an existing page said "reads bank statements" so the new
one said "reads company accounts". Check the title against the reader, not against the
neighbour.

Also check the packaging against the body. The payments page gave half its headline to
subscriptions while the text mentioned recurring 6 times, settlement 8 and checkout 3. The
article was fine; the title was describing a narrower thing than the page delivered.

---

## Who reads this, including the one that is easy to forget

Four readers, and they want different things. A line that serves one can cost you with
another.

| Reader | Wants | Serve them with |
|---|---|---|
| **Hiring manager** (primary) | evidence of clear thinking and shipped work | a precisely described problem, an honest outcome, dry tone |
| **Someone with the problem** | to feel understood before they trust anything | problem detail specific enough that they recognise themselves |
| **A future customer** | to believe it works and know what it costs them | what they end up holding, and the honest limits |
| **A competitor** | your roadmap, free | nothing. see below |

**The competitor is a real reader of this site.** The foundry operates in a small market
with named rivals who can and do read a public bio.

**State what exists. Never state what is planned.** No roadmaps, no target markets not yet
entered, no capability being built, no capex direction. "the current push is precision and
vacuum casting, aimed at defence and aerospace" told a competitor exactly which market to
defend and which capability to price against, and it appeared twice on the homepage before
it was caught.

Current and committed is fine. Solar that is already generating, a year that was busier
than the one before. Those are facts a competitor learns anyway, and they carry the
operator credibility the site needs.

The same restraint applies to the skills. What a skill does is public. What is coming next
is not.

---

## What a skill article may and may not give away

**This governs every skill-related article.** Free-form and opinion pieces are a different
genre and this section does not bind them.

The skills may be productised later, the repos may go private, and a product layer may sit
on top. An article that explains how a skill works is a build guide for whoever wants to
clone it, and the reader gets nothing from it either.

**Keep the problem precise. Keep the outcome precise. Drop the method.**

| Write this | Not this |
|---|---|
| the problem, in enough detail that someone with it recognises themselves | the technique that solves it |
| what the reader ends up holding | the steps that produce it |
| what it refuses to do, and why that is a choice | the internal rules that enforce it |
| that it handles a hard class of input | the enumerated list of what makes that input hard |

Problem detail is not a giveaway. Anyone who has opened an Indian bank statement can see
what is odd about it, and describing that accurately is what makes a reader think this
person has actually done the work. Method detail is the asset.

**Do not overcorrect into marketing.** Stripping specifics and leaving "handles all the
edge cases" is vaguer, less convincing and less honest than what it replaced. The
specificity moves from the solution to the problem and the outcome. It does not disappear.

**JSON-LD `featureList` is where this leaks worst.** It is invisible to readers, so it
delivers no value, and it tends to get written as an implementation checklist. Five pages
carried 51 enumerated capability items before this was caught, including a full framework
stack and a payments edge-case list. Keep it to about six lines about what the reader gets.

Worked examples of the line, all from real edits:

- *"a partial period read as a full year invents a decline that never happened"* keeps the
  problem. Naming the field to check and the rule for detecting it would have been method.
- *"three tied statements in the classification indian institutions actually read"* keeps
  the outcome. The tie-check formulas and the line names were method, and were cut.
- *"it treats city tiers as structurally different markets rather than a wealth ladder"*
  keeps the insight. The rent deltas, attrition figures and retail-share numbers were the
  research, and were cut.

---

## The writing section is two families

```
money
  india-finance              your own money          (parent)
    ↳ india-finance-business your company's money
    ↳ india-payments         taking payments

planning
  business-planner           planning a business     (parent)
    ↳ life-planning          planning a life
```

Group labels use `<div class="grp">`, in the site's idiom: mono, tracked, lowercase, muted.
Children nest inside the parent's `row-text` as `<span class="sub nested">`, which draws a
hairline rule on the left.

```html
<div class="grp">money</div>

<div class="row">
  <div class="row-date">Aug 2026</div>
  <div class="row-text">
    <a href="parent.html">a personal finance skill that tells you where your money went</a>
    <span class="sub">the one-line description</span>
    <span class="sub nested"><a href="child.html">child title</a> · what it adds</span>
  </div>
</div>
```

A new page joins a family or starts one. An article with no expressed relationship reads as
an orphan, which is what life-planning looked like before it was paired.

---

## Page skeleton

Every article shares one skeleton. Copy the nearest existing page and replace the content
rather than building from scratch, so the palette and type scale stay identical across all
of them (a settled decision in `CLAUDE.md`).

| Part | Notes |
|---|---|
| `<head>` meta | title, description, canonical, two `theme-color`, og ×4, twitter ×3. **Properly capitalised**, unlike body copy |
| JSON-LD ×3 | `TechArticle`, `SoftwareApplication`, `FAQPage` |
| nav | home, source link, clock, theme switch |
| `<h1>` + byline | date, read time, author link, code link |
| `.tldr` | one block, opens with what the reader gets |
| `<h2>` sections | question-shaped, matching how people search |
| `<h3>` questions | the FAQ, which **must** match the schema, see below |
| try it | close with the repo link and an invitation to write back |

Target ~1,200 words. `business-planner` sits at 811 and is the thinnest page on the site
despite being the biggest thing in the repo.

---

## FAQ parity is the check that keeps failing

Google requires the answer text to be visible on the page. A schema-only question is a
violation, and four of six pages were failing this before it was caught.

Three distinct faults, all of which have occurred here:

1. **Orphan questions.** `business-planner` carried "What is Business Planner?" and "How do
   I install Business Planner?" in schema with no `<h3>` anywhere on the page.
2. **Phrasing drift.** Schema written formally for keywords ("Is India Finance free?") while
   the visible heading uses the site's casual voice ("is it free?"). Same question, but the
   rule in `publishing.md` asks for a match.
3. **Duplicates.** Two schema questions collapsing onto one visible heading when they are
   naively aligned.

The site's `<h2>`s already carry the search keywords, so align the schema text to the
visible `<h3>` text rather than the reverse. Voice survives, compliance holds.

Run `scripts/check.py` rather than eyeballing it.

---

## Cross-links are earned, not decorative

Link only where a reader would actually follow. A forced hop is worse than no link, because
it teaches the reader that the links are filler.

Worked example. business-planner → india-finance-business is a real sequence: plan the
thing, then read its books. india-payments → india-finance-business was tried on the
reasoning that settlements eventually become accounts, and removed as too tenuous a hop.

A page with zero outbound links is worth a second look, but only that. If no next step is
genuine, leave the reader to go home.

---

## Before pushing

```bash
python .claude/skills/site-writing/scripts/check.py
```

It validates JSON-LD, FAQ parity, duplicate questions, em dashes, internal link targets,
sitemap coverage and index coverage across every page at once.

One deliberate nuance: `CLAUDE.md` bans **em** dashes and says nothing about en dashes.
The `humanizer` skill bans both, and `CLAUDE.md` explicitly wins where they disagree. The
en dashes in the homepage date ranges (`2021 – 24`, `Apr 2025 – present`) are correct
typography and intentional, so the checker fails on em dashes only and merely warns about
an en dash found outside a date.

Then the mechanical steps from `publishing.md`: every asserted URL checked unauthenticated,
a new `<url>` in `sitemap.xml` with today's `lastmod`, a row in the writing section, and a
real request against the live URL after the push rather than assuming.

**Run the `humanizer` skill over the prose before committing.** Required by `CLAUDE.md`,
and it catches the negative parallelisms and repeated paragraph openings that survive a
first draft.
