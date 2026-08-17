# dwiyuda.pages.dev

Source for my portfolio site. **[Live here](https://dwiyuda.pages.dev)**

A single scrolling page covering the years from enrolment in September 2022 to
finishing in July 2026: who I am, a timeline, four projects, two jobs, student
organisation work, one publication, the academic record, and how to reach me.

I am Dwi Yuda, an informatics graduate from Universitas Islam Riau working on
computer vision and LLM applications.

![The site's link preview card: the name Dwi Yuda over the line "I audit my own
work before someone else has to", with GPA, dataset size, undergraduates taught
and thesis grade along the bottom](public/og.png)

Built with [Astro](https://astro.build). Static output, no client framework, no
CSS framework, no animation library. The build produces no separate JavaScript
bundle at all — the theme toggle, the lightbox, the audit diagram and the
before/after slider all run from small inline scripts.

## Running it

```sh
npm install
npm run dev
```

Then open `http://localhost:4321`.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 4321, hot reload |
| `npm run build` | Static site into `dist/` |
| `npm run preview` | Serves the built `dist/`, closer to production than `dev` |

Check `npm run preview` before deploying anything visual. `dev` does not
optimise images the same way.

## Layout

```
assets/            raw camera sources, gitignored, never committed
public/            files served as-is: CV, transcript, preview card, robots.txt
scripts/           one-off image tooling, run by hand
src/
├── assets/        processed images, turned into WebP at build time
├── components/    one file per section, plus Compare and AuditDiagram
├── layouts/       page shell: fonts, theme, lightbox, section spy
├── pages/         index.astro and 404.astro
└── styles/        palette tokens, type scale, motion, shared classes
```

## Image tooling

Raw photographs stay out of the repository. `assets/` holds the originals from
the camera and is gitignored; `src/assets/` holds the cropped and resized
results, and those are committed. Three scripts bridge the two:

```sh
node scripts/prep-assets.mjs    # crop and resize ordinary photographs
node scripts/prep-screens.mjs   # crop screenshots AND blur the ID cards in them
node scripts/make-og.mjs public/og.png   # rebuild the link preview card
```

`prep-screens.mjs` is not optional. The raw detector screenshots contain other
people's identity cards, so every card region is blurred until nothing reads
before anything ships. If you add a screenshot, add its blur regions to that
script rather than committing the raw file.

## Things worth knowing before editing

Longer version in [CONTEXT.md](CONTEXT.md): what was decided while building
this, why each section has a different shape, and the traps already hit.

**`site` in `astro.config.mjs` must be an address that actually answers.** It
fills `canonical`, `og:url` and `og:image`. Pointing it at a domain that still
redirects means link previews on WhatsApp and LinkedIn come out blank, with no
sign of a problem on the site itself.

**Astro trims trailing whitespace before an inline tag.** Writing

```astro
Accuracy fell to between
<span class="figure">0.9606</span>
```

renders as `between0.9606`. Use an explicit `{" "}`. To check, grep the built
output rather than the source:

```sh
grep -oE '[a-z]<(a|em|code|span)|</span>[a-z]' dist/index.html
```

**Motion is CSS, not JavaScript.** Reveals use `animation-timeline: view()`,
the reading progress bar uses `scroll()`. Everything sits behind `@supports`
so unsupported browsers render the content plainly, and
`prefers-reduced-motion` cancels `animation-timeline` explicitly, since a
scroll timeline ignores `animation-duration`.

**Every figure traces to a document.** Numbers come from a transcript, an
examination record, a metrics file or a published article. Nothing is rounded
up and nothing is estimated. If a number cannot be traced, it does not go on
the page.

The accuracy figures in the projects section deserve a note. The model that
ships scores 1.0000 on a group-aware split at 1024×474. The lower range, 0.9606
to 0.9774, comes from a resolution ablation at each architecture's native input
size. Those are two different experiments and the page says so. The 29% leak
that was found and fixed did **not** change the accuracy — the ablation did.

## To do

- [ ] Point `site` at `https://dwiyuda.is-a.dev` once
      [is-a-dev/register#47149](https://github.com/is-a-dev/register/pull/47149)
      is merged, the custom domain is added in Cloudflare Pages, **and**
      `https://dwiyuda.is-a.dev/og.png` returns 200. In that order.
- [ ] Decide whether the ITJRD manuscript belongs in the publication section;
      currently held back because its publication status is unconfirmed.
- [ ] The hero portrait is 528×584 at source, so it is cropped at native
      resolution rather than upscaled. That caps how large the hero can show
      it. A higher-resolution shot would open up a bolder opening.

## Design notes

Five colours. Teal marks anything verifiable against a document. Terracotta
appears in exactly one place, the dataset audit case study, and nowhere else.

Numbers are set in JetBrains Mono so they read as measurements rather than
marketing. Headings use Fraunces, body text Public Sans.

Light is the default theme rather than a fallback. Dark is available from the
header toggle and switches through the View Transitions API.

Section numbers come from a CSS counter, so inserting a section does not mean
renumbering the rest.

Each section deliberately has its own shape: the timeline is a spine, Experience
is a sticky spec column beside flowing text, Organisation is a ledger led by
numbers, Publication is a bibliography entry with a hanging indent. Uniform
sections read as machine-made, which is the one thing this page is trying not
to be.

## Using any of this

The code is here to be read, and you are welcome to borrow an approach from it.
The scroll-driven reveals, the before/after slider built on a real
`input[type=range]`, and the audit diagram using the View Transitions API are
all plain enough to lift.

What is not reusable is the content: the writing, the photographs, the CV, and
the academic records are mine and are not licensed for reuse. No formal licence
file, which under copyright means all rights reserved by default. If you want to
use something and are unsure, ask.
