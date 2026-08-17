# Build context

What was decided while building this site, and why. Written for whoever picks
this up next, including me in six months.

`README.md` covers how to run it. This file covers why it is the way it is.

Built 13–14 August 2026.

---

## What this site is

A portfolio for four different readers at once: technical recruiters, the Apple
Developer Academy admissions panel, lecturers who might write a reference, and
possible freelance clients. That mix is the reason it takes the shape of a
career narrative rather than a grid of projects.

The binding rule: **every section carries at least one number or one artefact.**
A section with neither does not ship.

---

## Structure, and why it changed

The original plan had nine sections with Projects fifth. The site now has ten,
with Projects fourth.

Research on developer portfolios is fairly blunt: projects should come first,
and burying them behind a personal introduction is the common mistake. But that
advice assumes one kind of reader, and recruiters give a homepage roughly ten to
fifteen seconds.

The compromise: introduction and timeline still open the page, because the
narrative is the point, but Projects moved above Experience so a reader with ten
seconds reaches the strongest evidence before their attention runs out.

A closing section was added because the page previously stopped dead at a
contact list.

### Projects are abstract-first

Each project opens with two or three sentences naming the problem, the role and
the outcome, then a row of figure chips, then depth behind a disclosure.

This is deliberate. Proper case studies are what separate portfolios that get
interviews, but overlong ones read as unfiltered documentation rather than
structured thinking. Layering satisfies both: a fast reader gets the gist, a
serious one can dig.

The audit case study is the exception. Its summary and its diagram stay open,
because it is the single most distinguishing thing on the page and hiding it
behind a click would waste it.

---

## The numbers, and one thing that is easy to get wrong

**Every figure traces to a document** — a transcript, an examination record, a
metrics file, or a published article. Nothing is rounded up. If a number cannot
be traced, it does not go on the page.

The accuracy figures need care, because the obvious reading of them is wrong.

- The model that **ships** scores **1.0000** on a group-aware split at 1024×474.
- The range **0.9606 to 0.9774** comes from a **resolution ablation** at each
  architecture's native input size.

Those are two different experiments.

The 29% card-level leak was found, and fixing it did **not** change the
accuracy — it stayed at 1.0000, and a five-fold group-aware cross-validation
agreed. What lowered the numbers was the ablation, run after examiners objected
that four models all scoring 1.0 gave no basis for comparison.

Putting the leak and the lower figure next to each other implies a causal link
that does not exist. An earlier version of the CV did exactly that. Do not
reintroduce it.

---

## Technical decisions

| Decision | Why |
|---|---|
| Astro, no Tailwind | Five colours and a fixed type scale is precisely what CSS custom properties solve. A framework and a config file would have added a dependency to do less. |
| No animation library | Motion is driven by scroll position through `animation-timeline`, which runs on the compositor. GSAP and Lenis would have added weight to do the same thing on the main thread. |
| No smooth-scroll library, no custom cursor | Both hijack control from the reader, and smooth-scroll libraries fight CSS scroll-driven animation. |
| Section numbers from a CSS counter | Inserting a section does not mean renumbering the rest. |
| Images through `astro:assets` | WebP and srcset at build time, so there is no manual conversion step. |
| Pipeline diagram as an HTML list, not SVG | More accessible, and it reflows on its own. |
| Lightbox on native `<dialog>` | Escape, focus handling and the backdrop come free. |
| Cloudflare Pages, not Workers | Workers custom domains require a zone you own. `is-a.dev` belongs to someone else, so Pages is the only route that works with CNAME verification. |

The build produces **no separate JavaScript bundle**. The theme toggle, the
lightbox, the audit diagram and the before/after slider all run from small
inline scripts.

---

## Each section has its own shape

Uniform sections read as machine-made, which is the one thing this page is
trying not to be. The PRD warned about "uniform perfection" and the first build
ignored it, producing eight sections with identical structure.

- **Timeline** is a spine, with dates in the left margin and the line filling
  with teal as you scroll past.
- **Projects** is a full-bleed ink block, the one dark stop on the page. It
  redefines the palette tokens in its own scope, so everything inside follows.
- **Experience** is a sticky spec column beside flowing text, so the figures
  stay readable while you read the detail.
- **Organisation** is a ledger led by large numbers, because its strength is
  headcount, not task lists.
- **Publication** is a bibliography entry with a hanging indent, the convention
  the subject actually uses. Author position is shown as eleven pips with the
  seventh filled, rather than asserted in prose.

Terracotta appears in exactly one place, the audit case study. Teal marks
anything verifiable against a document.

---

## Privacy

This matters more than anything else in this file.

Raw camera sources live in `assets/`, which is **gitignored**. Processed results
live in `src/assets/` and are committed. The scripts in `scripts/` bridge the
two.

Some raw screenshots contain other people's identity cards. **One contains a
full national ID with its NIK, address and signature; it is not used and must
never be.** Every card region in the screenshots that do ship is blurred by
`scripts/prep-screens.mjs` until nothing reads.

The grading system's Excel output contains student names, email addresses and
marks. Only the three-sheet column layout is shown, with a line saying why.

Photographs containing other people's faces have their permission confirmed, and
the full-resolution originals stay out of the public repo.

If you add a screenshot, add its blur regions to the script. Do not commit the
raw file.

---

## Traps already hit

**`site` in `astro.config.mjs` must be an address that answers.** It fills
`canonical`, `og:url` and `og:image`. Pointing it at a domain that still
redirects meant `og:image` resolved to a redirect, and link previews on WhatsApp
and LinkedIn came out blank with no sign of a problem on the site itself.

**Astro trims trailing whitespace before an inline tag.** This glued four pairs
of words together in the rendered output before it was caught: `165test`,
`165contaminated`, `342.https://`, `between0.9606`. Use `{" "}`, and check the
built output rather than the source:

```sh
grep -oE '[a-z]<(a|em|code|span)|</span>[a-z]' dist/index.html
```

**A bare `assets/` gitignore pattern also matches `src/assets/`.** That silently
dropped every site image from a commit. The leading slash in `/assets/` is what
makes it root-only.

**Grid children escape their column.** A photo block placed outside
`.post__body` became the third child of a two-column grid, landed under the
sticky spec plate, and collided with it while scrolling.

**`prefers-reduced-motion` must cancel `animation-timeline` explicitly.** A
scroll timeline ignores `animation-duration`, so the usual reset does nothing.

---

## A PDF version exists

The Apple Developer Academy form requires a PDF under 5 MB. Printing the site
directly produces a poor result: sticky columns lose their meaning, grids break
across pages, and content hidden behind disclosures disappears.

A separate print-first document was built instead, with the same content in a
linear layout and every disclosure opened. It is generated with Chrome headless
and lives outside this repo, in the scratchpad. Georgia, Segoe UI and Consolas
replace the web fonts, since a headless render is not guaranteed network access
and a failed font substitution is worse than a well-matched system face.

Nine pages, 413 KB.

---

## Where the rest of the context lives

Full project documentation is in an Obsidian vault at `D:\History`, which is not
a git repository and is not published anywhere. The notes under
`D:\History\Project\Portofolio Dwi Yuda\` carry the session log, the locked
decisions, the media inventory with its privacy rules, and the prompts for
picking this up in a new session.

Open items are tracked in `README.md`.
