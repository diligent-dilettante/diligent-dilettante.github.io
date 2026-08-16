#!/usr/bin/env python3
"""
Pre-push validator for diligent-dilettante.github.io.

Checks the things that have actually broken, rather than everything that could:
JSON-LD validity, FAQ schema against visible questions, duplicate questions,
em dashes in body copy, internal link targets, sitemap coverage, and whether
every article is reachable from the index.

    python .claude/skills/site-writing/scripts/check.py

Exits non-zero if anything fails, so it can gate a commit.
"""

import glob
import json
import os
import re
import sys

# scripts/ -> site-writing/ -> skills/ -> .claude/ -> site/
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
FAIL = []
WARN = []


def strip(html):
    return re.sub(r"<[^>]+>", "", html).strip()


def norm(text):
    return re.sub(r"[^a-z0-9 ]", "", strip(text).lower()).strip()


def body_text(src):
    """Page text with script and style removed, so CSS content and JSON don't
    count toward prose checks."""
    return re.sub(r"<script.*?</script>|<style.*?</style>", "", src, flags=re.S)


# Terms that mean the article is explaining how a skill works rather than what it
# does for the reader. Word-boundary matched, because a naive substring search for
# "UDIN" matches "including" and reports three phantom leaks.
TECHNIQUE = [
    r"300 DPI", r"reserves movement", r"UDIN", r"clause 2[0-9]",
    r"clause 3[0-9]", r"cost of materials consumed", r"inverted sign convention",
    r"pre-debit notification window", r"tie check", r"Schedule III of the Companies",
]


def check_technique(name, body):
    for pat in TECHNIQUE:
        if re.search(pat, body, re.I):
            WARN.append(f"{name}: {pat} reads as method rather than benefit, see SKILL.md")


def check_page(path):
    name = os.path.basename(path)
    src = open(path, encoding="utf-8").read()
    body = body_text(src)

    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', src, re.S)
    parsed = []
    for i, blk in enumerate(blocks):
        try:
            parsed.append(json.loads(blk))
        except Exception as exc:
            FAIL.append(f"{name}: JSON-LD block {i} does not parse ({str(exc)[:60]})")

    visible = [strip(h) for h in re.findall(r"<h3>(.*?)</h3>", src, re.S)]
    vnorm = [norm(h) for h in visible]

    for doc in parsed:
        if doc.get("@type") != "FAQPage":
            continue
        questions = [q.get("name", "") for q in doc.get("mainEntity", [])]
        for q in questions:
            if norm(q) not in vnorm:
                FAIL.append(f"{name}: schema question has no visible <h3>: {q!r}")
        seen = set()
        for q in questions:
            if norm(q) in seen:
                FAIL.append(f"{name}: duplicate schema question: {q!r}")
            seen.add(norm(q))

    # CLAUDE.md bans em dashes. It does not ban en dashes, and the humanizer skill
    # that does is explicitly overridden by the author's own list. En dashes in date
    # ranges ("2021 – 24", "Apr 2025 – present") are correct typography and deliberate,
    # so only the em dash is a failure. An en dash outside a date is worth a look.
    if "—" in body:
        FAIL.append(f"{name}: contains an em dash, banned by the voice rules")
    stray = re.sub(r'<div class="row-date">.*?</div>', "", body, flags=re.S)
    if "–" in stray:
        WARN.append(f"{name}: en dash outside a date range, check it is intentional")

    if "“" in body or "”" in body:
        WARN.append(f"{name}: curly quotation marks in body copy")

    for target in sorted(set(re.findall(r'href="([a-z0-9][a-z0-9-]*\.html)"', src))):
        if not os.path.exists(os.path.join(ROOT, target)):
            FAIL.append(f"{name}: links to {target}, which does not exist")

    check_technique(name, body)

    words = len(strip(body).split())
    if name not in ("index.html", "404.html") and words < 1000:
        WARN.append(f"{name}: {words} words, under the ~1,200 target")

    return name, words, len(visible)


def main():
    pages = sorted(glob.glob(os.path.join(ROOT, "*.html")))
    if not pages:
        sys.exit(f"no pages found in {ROOT}")

    print(f"checking {len(pages)} pages in {ROOT}\n")
    rows = [check_page(p) for p in pages]
    for name, words, faqs in rows:
        print(f"  {name:32} {words:5} words   {faqs} FAQ")

    articles = {os.path.basename(p) for p in pages} - {"index.html", "404.html"}

    sitemap = os.path.join(ROOT, "sitemap.xml")
    if os.path.exists(sitemap):
        smap = open(sitemap, encoding="utf-8").read()
        for a in sorted(articles):
            if a not in smap:
                FAIL.append(f"sitemap.xml: missing an entry for {a}")
    else:
        FAIL.append("sitemap.xml not found")

    index = os.path.join(ROOT, "index.html")
    if os.path.exists(index):
        idx = open(index, encoding="utf-8").read()
        for a in sorted(articles):
            if a not in idx:
                FAIL.append(f"index.html: {a} is not linked, so nobody can reach it")
    else:
        FAIL.append("index.html not found")

    print()
    for w in WARN:
        print(f"  warn  {w}")
    for f in FAIL:
        print(f"  FAIL  {f}")

    print()
    if FAIL:
        print(f"{len(FAIL)} failure(s). Fix before pushing.")
        sys.exit(1)
    print("all checks pass" + (f" ({len(WARN)} warning(s))" if WARN else ""))


if __name__ == "__main__":
    main()
