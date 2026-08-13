# dwiyuda.is-a.dev

Personal portfolio site. One scrolling page, nine sections, from enrolment in
September 2022 to graduation in July 2026.

Built with [Astro](https://astro.build). Static output, no client framework, no
CSS framework. The only JavaScript that ships is the theme toggle.

## Running it

```sh
npm install
npm run dev
```

Then open `http://localhost:4321`. `npm run build` writes the static site to
`dist/`.

## Layout

```
public/          static files served as-is
src/
├── assets/      source images, converted to WebP at build time
├── components/  one file per section
├── layouts/     page shell, fonts, theme toggle
├── pages/       index.astro composes the sections
└── styles/      palette tokens, type scale, shared classes
```

## Notes on the design

The palette is five colours. Teal marks anything that can be verified against a
document. Terracotta appears in exactly one place, the dataset audit case study,
and nowhere else.

Numbers are set in JetBrains Mono so they read as measurements rather than
marketing. Headings use Fraunces, body text Public Sans.

Light is the default theme rather than a fallback. Dark is available through the
toggle in the header.

Section numbers come from a CSS counter, so inserting a section does not mean
renumbering the rest.

## Notes on the content

Every figure on this site comes from a document: a transcript, an examination
record, a metrics file, or a published article. Nothing is rounded up and nothing
is estimated.

The accuracy figures in the projects section deserve a note. The model that ships
scores 1.0000 on a group-aware split at 1024×474. The lower range, 0.9606 to
0.9774, comes from a resolution ablation run at each architecture's native input
size. Those are two different experiments and the site says so.
