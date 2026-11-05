# Nodev site

Static site: no build step, no backend.

## Before launch
Edit only `config.js`:
- `ca`: the $NODEV mint. Empty = "Launching soon" + countdown. Filled = CA box, Copy, Raydium and DexScreener buttons and live market data go live.
- `launcher`: the public launcher wallet (shown on the token card with a live "holds nothing" balance check).
- `launchesOpen`: the date launches open for everyone (shown on the Reserve section).
- `links.x`: your X link.

## Deploy (GitHub + Vercel)
Upload the **contents of this folder with its folders intact** (`assets/`, `assets/fonts/`). GitHub's web upload flattens folders, so drag the folders themselves, or use git:
```
git init && git add . && git commit -m "Nodev site"
git branch -M main
git remote add origin https://github.com/<you>/nodev.git
git push -u origin main
```
Vercel: Add New → Project → import the repo → Framework "Other", no build command → Deploy.

## Files
- `index.html`, `styles.css`, `app.js`: the page (intro, hero, why, how it works, reserve-a-ticker card maker, token card).
- `mark.svg`: the Ø mark used in the nav; `assets/pfp.png` is the same mark as a 1000x1000 image.
- `assets/og.png`: the link preview image; `favicon.png`, `assets/apple-touch.png`: icons.
