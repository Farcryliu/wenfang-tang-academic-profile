# Wenfang Tang academic profile

React + Vite source for Professor Wenfang Tang's academic personal website.

Production URL: <https://tangwenfang.org/>

The `www` address redirects to the apex domain after DNS and HTTPS are active.

## Local development

```bash
npm ci
npm run dev
```

## Content maintenance

- Personal details, research areas, contact information, and education: `src/data/profile.ts`
- Homepage biography: `src/data/biography.json`, editable through [Pages CMS](https://app.pagescms.org/) using `.pages.yml`. Leave a blank line between paragraphs.
- Books, edited volumes, articles, and op-eds: `src/data/archive.json`
- Archive types, labels, and page links: `src/data/archive.ts`
- Original website bibliography and link snapshot (retrieved October 11, 2026): `src/data/legacy-publications.json`
- Positions, academic projects, and editorial roles: `src/data/experience.ts`

The homepage includes About, Publication list, and Experience sections.
The complete directories are separate static pages: `books.html`,
`edited-volumes.html`, `articles.html`, and `blogs.html`. Each can be opened
directly or refreshed on GitHub Pages. The old `/blog.html` address redirects
to `/blogs.html`. Publication attachments from the old site are served at
their original `uploads/` paths from `public/uploads/`.

The archive contains 9 books, 5 edited volumes/editions, 55 primary article
entries (with reprint and alternate-version notes), and 28 op-ed entries
(with repost notes).
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
The workflow reads the site path from GitHub Pages. It builds at `/` when a
custom domain is set and uses the repository path for the default Pages URL.

### Custom domain

1. In the repository's **Settings → Pages**, keep **Source** set to **GitHub
   Actions**. Set **Custom domain** to `tangwenfang.org` and save.
2. Back up the DNS zone in Weebly. Replace the apex `A` record with the four
   addresses below. Replace the `www` `A` record with the `CNAME` below. Keep
   the existing nameservers, wildcard, and mail records in place.

   | Host | Type | Value |
   | --- | --- | --- |
   | `@` | `A` | `185.199.108.153` |
   | `@` | `A` | `185.199.109.153` |
   | `@` | `A` | `185.199.110.153` |
   | `@` | `A` | `185.199.111.153` |
   | `www` | `CNAME` | `farcryliu.github.io` |

3. Run **Deploy to GitHub Pages** from the **Actions** tab if a push did not
   already trigger a build after the domain was configured. Wait for the
   deployment and the **Pages** DNS check to pass. Turn on **Enforce HTTPS**
   once the certificate is ready.

See the [GitHub Pages custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

### Verify or roll back

- Open the production homepage and each of the four archive pages. Check the
  homepage links, book covers, and representative publications and PDFs.
  Confirm `https://www.tangwenfang.org/` redirects to `https://tangwenfang.org/`
  and that HTTPS works on both hosts.
- To restore the Weebly site, restore the saved apex and `www` records, which
  both pointed to `199.34.228.134` before the cutover. Keep the existing mail
  records. Clear the custom domain under **Settings → Pages** and rerun the
  deployment to restore the default GitHub Pages project URL.

## AI editor for Professor Tang

Run `npm run dev:editor` to try the Chinese editing interface on this computer.
Use the four example buttons to generate changes, compare them in the desktop
and phone previews, and simulate publication. The demo uses scripted responses
and resets when the local server stops.

The hosted editor accepts Chinese instructions. It can revise the homepage
biography, reorder its three sections, adjust the name heading, section
headings and biography text, or add, edit or remove one publication per
request. For an addition, paste the citation or bibliographic details and an
optional HTTPS source link. The editor does not retrieve article metadata from
a URL. Changes stay in the preview until the teacher clicks 确认发布.

### Set up the hosted editor

1. Put the editor code and the initial `src/data/layout.json` on the website's
   GitHub `main` branch. Build with `npm run build:editor` and deploy the
   separate Cloudflare Worker using `npx wrangler deploy`. Use the Worker
   address for the teacher's bookmark. The public website continues to use
   GitHub Pages and the regular `npm run build` output.
2. In the Worker's Access settings, protect its production address with
   [Cloudflare Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/).
   Enable [one-time PIN login](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/)
   and allow only the approved teacher email addresses. The Worker also checks
   the Access application's signed identity and the same allowlist.
3. Add these runtime values to the Worker as secrets. Use the Cloudflare
   dashboard or run `npx wrangler secret put SECRET_NAME` from this directory.
   - `ACCESS_TEAM_DOMAIN` is the Access team host ending in
     `.cloudflareaccess.com`, without `https://` or a trailing slash.
   - `ACCESS_AUDIENCE` is the production Access application's AUD tag.
   - `EDITOR_EMAILS` is the comma-separated list of approved addresses.
   - `OPENAI_API_KEY` is a project key with access to the model in `wrangler.toml`.
   - `GITHUB_TOKEN` is a fine-grained token scoped to this repository. Grant
     **Contents: Read and write** and **Actions: Read**. The token's account
     must be able to commit to `main` under the repository's existing rules.
   - `EDITOR_SIGNING_SECRET` is a random secret of at least 32 characters.
     Generate one locally with `openssl rand -hex 32`.
4. Sign in with an approved email, generate a draft and check both previews.
   Publish a real, approved update and verify it on the public site. The
   editor commits the reviewed changes in one GitHub commit and shows the
   status of the existing Pages deployment for that commit.

When changing the public site's React components or styles, rebuild and redeploy
the editor too so its previews use the latest templates. Edits to the biography,
publication archive or layout are loaded directly from GitHub and appear in the
editor without rebuilding it. To undo a published edit, revert that commit on
`main` and let the Pages deployment run again.
