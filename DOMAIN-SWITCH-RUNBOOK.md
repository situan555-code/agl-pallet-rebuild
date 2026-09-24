# Domain switch runbook

## HARD CONSTRAINT

`aglpallet.com` is live under a prior agency. Until Claude Liason or Nautis/Jerry explicitly lifts this constraint, agents must not:

- Run DNS or WHOIS lookups against `aglpallet.com`.
- Make any HTTP(S) request, crawl, monitor, or diff against live `aglpallet.com`, including `www.aglpallet.com`.
- Do Google Search Console or Bing verification, propose DNS TXT records, change CNAME or A records, contact the registrar, or request certificates for that domain.

Canonical, `og:url`, JSON-LD, and sitemap strings that name `https://aglpallet.com/...` in this repo stay as-is. Those strings are URL text only. They are not a network request.

Any runbook step that would require checking the live domain is BLOCKED until the constraint is lifted. Do not improvise. Flag it to Claude Liason.

Checklist for the later decision to serve this Next.js deployment at
`aglpallet.com`. The indexing gate is host-conditional and already in the
app. Pointing DNS at the project is the switch. Nothing in this file changes
DNS, Search Console, or Bing.

Canonicals, `og:url`, JSON-LD, and `sitemap.xml` stay on `https://aglpallet.com`
the whole time, including while the demo is only on `*.vercel.app`. They come
from `SITE_URL` (`lib/site-url.ts`, default `https://aglpallet.com`). Do not
set `SITE_URL` to a `vercel.app` host. A value that ends in `.vercel.app` is
ignored and the default is used.

## What is already in the deployment

- `middleware.ts` reads `request.headers.get("host")` on each request. When
  the hostname ends with `.vercel.app`, the response includes
  `X-Robots-Tag: noindex, nofollow`. `aglpallet.com` does not match, so the
  header is omitted. This covers the short alias
  (`nx7k-lab-m4.vercel.app`) and per-deployment preview aliases.
- `app/layout.tsx` `generateMetadata` uses the same host check and emits
  `<meta name="robots" content="noindex, nofollow">` only for those hosts.
- `app/robots.ts` allows `/` for `*` and the named crawlers. It does not
  `Disallow: /` on the Vercel host. Crawlers must be able to fetch the page
  and read the noindex tag.
- `app/sitemap.ts` lists `https://aglpallet.com/...` URLs (trailing slash).
  Sell/recycle is not in the sitemap.

This repository does not submit the sitemap anywhere. `lib/indexnow.ts`
returns without calling IndexNow unless `INDEXNOW_KEY` is set, and no key
file is in `public/`. Wave 0 recorded that Bing Webmaster submission was not
done. Before the switch, confirm in the Google Search Console and Bing
Webmaster accounts that neither `nx7k-lab-m4.vercel.app` nor `aglpallet.com`
is submitting this Next sitemap. Do not submit the `vercel.app` sitemap.

- robots.txt on nx7k-lab-m4.vercel.app has no Disallow: / — confirmed 2026-09-24.
- sitemap.xml is not currently submitted to Google Search Console or Bing Webmaster Tools under any host — confirmed 2026-09-24.

## Vercel default noindex vs this rule

Vercel documents an automatic `X-Robots-Tag: noindex` header (value
`noindex`, not `noindex, nofollow`) on Preview deployments and on outdated
Production deployments. It is not added to the current Production deployment.
Source: [Vercel response headers](https://vercel.com/docs/headers/response-headers).

That platform header is tied to deployment type, not to the hostname. The
rule in this repo is tied to the hostname.

| Request | Vercel platform header | This repo |
| --- | --- | --- |
| Current Production deployment at `https://nx7k-lab-m4.vercel.app` | Not added. The short alias would otherwise be indexable. | `X-Robots-Tag: noindex, nofollow` and the matching meta tag. This is the rule that governs that host. |
| Preview alias `https://<deployment>-<team>.vercel.app` | `X-Robots-Tag: noindex` | Same host check: `noindex, nofollow` plus the meta tag. Both can be present. Google combines `X-Robots-Tag` values and keeps the stricter directive, so the URL stays out of the index. |
| Current Production deployment after `aglpallet.com` is attached, request Host `aglpallet.com` | Not added | Header and meta omitted. Indexable, once you confirm with curl (section 2). That curl is **NOT TO BE RUN** while the hard constraint is in force. Post-cutover / after constraint lift only. |
| Outdated Production deployment URL | Platform adds `noindex` | Host still ends in `.vercel.app`, so this repo also sends `noindex, nofollow`. |

Do not turn off Vercel's preview header to "simplify" this. The hostname rule
has to keep covering the production `*.vercel.app` alias, which Vercel does
not noindex on its own.

Live header proof on `https://nx7k-lab-m4.vercel.app` is a post-deploy check
(see spot-checks). A local `next start` with a forged `Host` header is not a
substitute for that curl.

## 1. Point aglpallet.com at this Vercel project

Do this in the Vercel dashboard and at the DNS host. Do not change DNS from
the repo, a cloud agent, or this checklist's author.

1. Vercel project `nx7k-lab-m4` (team `situan555-codes-projects`). Confirm
   Production Branch is `main` so the deployment you reviewed is the one the
   domain will serve.
2. Project → Settings → Domains → add `aglpallet.com` (and `www` only if
   Nautis wants www). Vercel shows the record to create.
3. At the DNS host, create the record Vercel asks for (usually an `A` record
   to `76.76.21.21` for the apex, or a `CNAME` for `www` to
   `cname.vercel-dns.com`). Remove or replace the records that still point
   `aglpallet.com` at the WordPress host. Leave unrelated records alone.
4. Wait until Vercel shows the domain as valid and assigned to the current
   Production deployment. Do not start the indexing steps while the domain
   still serves WordPress.

`www.aglpallet.com` does not end in `.vercel.app`, so this noindex rule does
not fire there either. If www is added, pick one host as canonical (the app
uses `https://aglpallet.com`) and redirect the other in Vercel. Redirects are
a domain setting, not a code change.

## 2. Confirm noindex stopped on aglpallet.com

Automatic once the Host header is `aglpallet.com`. Verify. Do not assume.

**NOT TO BE RUN** while the hard constraint is in force. The three commands below hit `https://aglpallet.com`. They are post-cutover / after constraint lift only. Leave them in this runbook for later use.

```bash
# NOT TO BE RUN while the hard constraint is in force.
# Post-cutover / after constraint lift only.
curl -sI https://aglpallet.com/ | tr -d '\r' | grep -i -E 'HTTP/|x-robots-tag|location:'
curl -s https://aglpallet.com/ | grep -i 'name="robots"'
curl -s https://aglpallet.com/ | grep -i -E 'rel="canonical"|og:url'
```

Expect: no `X-Robots-Tag: noindex`, no `<meta name="robots" content="noindex, nofollow">`, canonical and `og:url` on `https://aglpallet.com/`.

Repeat with Host still on the alias. These must still noindex:

```bash
curl -sI https://nx7k-lab-m4.vercel.app/ | tr -d '\r' | grep -i x-robots-tag
```

Expect `x-robots-tag: noindex, nofollow`. If a preview deployment also shows
a second `x-robots-tag: noindex`, that second value is Vercel's platform
header. It does not replace the hostname rule.

## 3. Submit the sitemap

Only after step 2 passes.

- Sitemap URL: `https://aglpallet.com/sitemap.xml`
- Google Search Console: property `https://aglpallet.com`, Sitemaps, submit
  that URL.
- Bing Webmaster Tools: same URL on the `aglpallet.com` property.

Do not submit `https://nx7k-lab-m4.vercel.app/sitemap.xml`.

## 4. IndexNow

Still needs a real key from Nautis. Do not invent one and do not commit one.

1. Generate a key (hex, 8–128 characters).
2. Put that exact key in `public/<key>.txt` (the file body is the key only)
   and deploy.
3. Vercel → Project → Settings → Environment Variables → `INDEXNOW_KEY` =
   that key, Production. Redeploy so the server can read it.
4. Call `submitToIndexNow` with the `https://aglpallet.com/...` URL list
   (the helper no-ops when the key is missing). IndexNow host and
   `keyLocation` are derived from `SITE_URL`, so the ping names
   `aglpallet.com`, not the Vercel alias.
5. Ping again when a published URL set changes. There is no publish hook
   wired yet. Wiring that hook is a follow-up once the key exists.

Skip IndexNow until step 2 passes. Pinging earlier would advertise
`aglpallet.com` URLs that still belong to the previous site.

## 5. Spot-check URLs

After the domain responds as this deployment, run `curl -sI` and a body
grep. For each URL expect `200` (or the known `301`/`308` for the three
legacy paths), no `X-Robots-Tag` containing `noindex`, and a canonical of
`https://aglpallet.com` plus the path.

**NOT TO BE RUN** while the hard constraint is in force. Every example below that requests `https://aglpallet.com` is post-cutover / after constraint lift only. Leave the commands in this runbook for later use. The `nx7k-lab-m4.vercel.app` commands in the block further down do not hit the live domain.

- `https://aglpallet.com/`
- `https://aglpallet.com/products/`
- `https://aglpallet.com/who-we-are/`
- `https://aglpallet.com/faq/`
- `https://aglpallet.com/request-a-quote/`
- `https://aglpallet.com/resources/`
- `https://aglpallet.com/resources/gma-pallets-and-grades/`
- `https://aglpallet.com/resources/glossary/`
- `https://aglpallet.com/sitemap.xml` (locations are `https://aglpallet.com/...`, no `vercel.app`)
- `https://aglpallet.com/robots.txt` (`Allow: /`, no `Disallow: /`, sitemap line is `https://aglpallet.com/sitemap.xml`)

Also confirm `https://aglpallet.com/resources/sell-recycle-pallets/` stays
`404` and is absent from the sitemap. That confirm requests the live domain: **NOT TO BE RUN** while the hard constraint is in force. Post-cutover / after constraint lift only.

On the alias, the same paths should still send `X-Robots-Tag: noindex, nofollow`
and the robots meta, with canonicals that still say `aglpallet.com`.

```bash
# NOT TO BE RUN while the hard constraint is in force.
# Post-cutover / after constraint lift only. These two hit https://aglpallet.com.
curl -sI https://aglpallet.com/products/
curl -s https://aglpallet.com/products/ | grep -i -E 'rel="canonical"|og:url|name="robots"'
curl -sI https://nx7k-lab-m4.vercel.app/products/
curl -s https://nx7k-lab-m4.vercel.app/robots.txt
curl -s https://nx7k-lab-m4.vercel.app/sitemap.xml | grep -c vercel.app
```

The sitemap `grep -c` should print `0`.

## 6. Old aglpallet.com content — decision for Nautis and Jerry

Whether any content currently live at aglpallet.com needs to be reconciled, archived, or redirected at cutover is unresolved and requires a decision from Nautis/Jerry before DNS is pointed. Do not investigate the current live site to answer this — flag it, don't resolve it.

The WordPress site is what `aglpallet.com` serves until DNS moves. This Next
app replaces it. It does not import the WordPress page list.

Already redirected in `middleware.ts` and `next.config.mjs` (SPEC_V1):

- `/about` and `/about/` → `/who-we-are/` (301)
- `/logistics-process` and `/logistics-process/` → `/how-we-work/` (301)
- `/industries-served` and `/industries-served/` → `/industries/` (301)

Any other live WordPress URL (posts, extra landers, old media paths) will
404 on this app after the switch unless someone adds a redirect. That map is
a decision for Nautis and Jerry: redirect, reconcile onto an existing route,
or let it 404. Do not invent the map in a code change.

## 7. SITE_URL on Vercel

Optional. Unset means `https://aglpallet.com`.

1. Vercel → `nx7k-lab-m4` → Settings → Environment Variables.
2. Name: `SITE_URL`. Value: `https://aglpallet.com`. Environments:
   Production, Preview, and Development if you want them explicit.
3. Save, then redeploy. Next reads this when the server bundle is built and
   when server code runs. Changing it without a redeploy does nothing.
4. Do not set it to `https://nx7k-lab-m4.vercel.app` or any other
   `*.vercel.app` host. The code drops those values and uses the default,
   but the dashboard should still show the production origin.

The domain switch does not include changing `SITE_URL`.
