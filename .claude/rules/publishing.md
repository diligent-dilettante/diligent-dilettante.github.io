---
paths:
  - "**/*.html"
  - "sitemap.xml"
---

# Publishing checks

Run these before committing a page. They are mechanical, and each one has been
missed at least once.

## Links must resolve

Any URL the page asserts exists gets checked unauthenticated before the commit:

```bash
curl -s -o /dev/null -w "%{http_code}\n" <url>
```

A repo can be pushed with a synced remote and still be private. `git status` looks
identical either way.

## Structured data

- Every `application/ld+json` block must parse. Validate before pushing.
- The questions in a `FAQPage` block must match the visible `<h3>` questions on the
  page. Google requires the answer text to be visible; a schema-only question is a
  violation.
- New page means a new `<url>` entry in `sitemap.xml` with today's `lastmod`, and a
  row in the writing section of `index.html`.

## After the push

GitHub Pages takes about a minute. Confirm with a real request rather than assuming:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://diligent-dilettante.github.io/<page>.html
```

## Writeup structure

Posts are built for answer engines as well as readers:

- a definitional first sentence under the opening heading, quotable on its own
- question-shaped `h2`s that match how people actually search
- JSON-LD blocks: `TechArticle`, `SoftwareApplication`, `HowTo` for install steps,
  `FAQPage`
- concrete numbers, since those are what get cited

Keep them near 1,200 words. Cut how-it-was-tested sections, long credits lists, and
any FAQ entry that repeats a body section.

## Prose

Voice rules and the `humanizer` requirement live in the repo `CLAUDE.md`. Do not
restate them here; two copies drift and then contradict each other.
