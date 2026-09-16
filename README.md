# The Cabin Network

A cabin connectivity strategy for Emirates — capacity, coverage, the cabin radio and the policy
layer in between. The models are interactive: the capacity model, the authorisation globes and the
route overlay all recompute in the browser.

**Prepared by Aleh Fadzin (aka Oleg Fadin), September 2026.**

**Live site:** https://olegfadin.github.io/cabin-network/

Hosted on GitHub Pages from the `main` branch, repository root. The site URL and link-preview metadata are configured.

---

## Publishing this on GitHub Pages

The site is entirely static — no build step, no framework, no server. Every model runs in the
browser and the data is compiled into `assets/data.js`, so GitHub Pages serves it as-is.

### 1. Create the repository

On github.com, create a **new public repository**. Call it something like `cabin-network`.
Do not add a README, licence or .gitignore — this folder already has what it needs.

> Pages is free on public repositories. It also works on private repositories, but only on a paid
> GitHub plan. See **Keeping it off search engines** below if you want it public but not findable.

### 2. Push this folder

From inside this folder:

```bash
git init -b main
git add .
git commit -m "The Cabin Network"
git remote add origin https://github.com/USERNAME/cabin-network.git
git push -u origin main
```

Replace `USERNAME` with your GitHub username.

### 3. Turn Pages on

In the repository: **Settings → Pages → Build and deployment**.
Set **Source** to `Deploy from a branch`, **Branch** to `main`, folder `/ (root)`. Save.

Give it a minute or two. Your URL will be:

```
https://USERNAME.github.io/cabin-network/
```

### 4. Fix the link previews — one command

`index.html` ships with a placeholder so that pasting the link into LinkedIn, WhatsApp, Slack or
an email shows the cover card instead of a bare URL. Run this once, with your real address:

```bash
sed -i '' 's|SITE_URL|https://USERNAME.github.io/cabin-network|g' index.html
git commit -am "Set site URL" && git push
```

(On Linux, drop the `''` after `-i`.)

---

## Using your own domain

If you would rather it lived at, say, `cabin.example.com`:

1. Create a file named `CNAME` in this folder containing only your domain, e.g. `cabin.example.com`
2. At your DNS provider, add a `CNAME` record pointing that name at `USERNAME.github.io`
3. In **Settings → Pages**, enter the domain under *Custom domain* and tick **Enforce HTTPS**
4. Re-run the `sed` command in step 4 above with the new address

---

## Keeping it off search engines

A public repository is public, and Pages sites get indexed. If you want the link to work for
anyone you send it to but not turn up in a search for your name, add a file called `robots.txt`
containing:

```
User-agent: *
Disallow: /
```

That is a request, not a wall — treat the URL as shareable-but-quiet, not private. For genuine
access control, host it somewhere with password protection instead (Cloudflare Pages and Netlify
both offer this on their free tiers, and both accept a drag-and-drop of this folder).

---

## What is in here

```
index.html          the whole paper — structure, styles and copy
assets/data.js      country outlines and Emirates route geometry
assets/app.js       navigation, vendor marks, the fleet capacity model
assets/app2.js      authorisation globes, route overlay, constellation tables
assets/app3.js      the SVG figures — 2.4 GHz, flight profile, eSIM flow, roadmap
img/                cover, cabin photography, aircraft profiles
logos/              vendor and airline marks
og.jpg              the link-preview card
favicon.svg
.nojekyll           tells Pages to serve the files as they are
```

To edit the text, edit `index.html`. To change a model's assumptions, the constants sit at the top
of the relevant file in `assets/` — `PRESETS` and `CLASSES` in `app.js` drive the capacity model.

## Credits and caveats

Aircraft profiles and cabin photography are Emirates material, reproduced for discussion.
Vendor names and marks appear as category examples and imply no recommendation or relationship;
all marks remain the property of their owners. Capacity and traffic figures are modelled
assumptions and are identified as such throughout.
