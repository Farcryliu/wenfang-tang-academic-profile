# Wenfang Tang academic profile

React + Vite source for Professor Wenfang Tang's academic personal website.

Live website: <https://farcryliu.github.io/wenfang-tang-academic-profile/>

## Local development

```bash
npm install
npm run dev
```

## Content maintenance

- Personal details, research areas, contact information, and education: `src/data/profile.ts`
- Selected publications and homepage previews: `src/data/publications.ts`
- Complete books, edited volumes, articles, and blogs: `src/data/archive.json`
- Archive types, labels, and page links: `src/data/archive.ts`
- Original website bibliography and link snapshot (retrieved October 11, 2026): `src/data/legacy-publications.json`
- Positions, academic projects, and editorial roles: `src/data/experience.ts`

The homepage keeps its About, Selected Publications, and Experience sections.
The complete directories are separate static pages: `books.html`,
`edited-volumes.html`, `articles.html`, and `blogs.html`. Each can be opened
directly or refreshed on GitHub Pages, including under the repository subpath.

The archive contains 9 books, 5 edited volumes/editions, 55 primary article
entries (with reprint and alternate-version notes), and 85 blog entries
(with repost notes). The legacy site's original category membership is retained.
Book covers are local assets in `public/assets/covers/`. Covers link to the
legacy Amazon listings; where no product link was supplied (the Russian edition,
the 1996 Chinese monograph, and the 1988 journal issue), the link is explicitly
labelled “Search on Amazon”. Original full-text links remain available.
Entries with no source date or link are retained without invented metadata.

## Production build

```bash
npm run build
npm run preview
```

The production output is written to `dist/` and can be deployed to GitHub Pages.

## Deployment

Pushing to the `main` branch automatically builds and publishes the website to
GitHub Pages through the workflow in `.github/workflows/deploy-pages.yml`.
