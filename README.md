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
- Selected publications and books: `src/data/publications.ts`
- Positions, academic projects, and editorial roles: `src/data/experience.ts`

## Production build

```bash
npm run build
npm run preview
```

The production output is written to `dist/` and can be deployed to GitHub Pages.

## Deployment

Pushing to the `main` branch automatically builds and publishes the website to
GitHub Pages through the workflow in `.github/workflows/deploy-pages.yml`.
