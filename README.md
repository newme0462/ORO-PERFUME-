# ÒRÓ — A Scent That Stays

A cinematic, scroll-driven perfume landing page built with **React 18**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Lucide React** (Three.js is installed and pre-configured for any future 3D work).

## Tech stack

- **React 18** + **Vite 5** — fast dev server and build
- **Tailwind CSS 3** — utility-first styling
- **Framer Motion** — scroll-linked and gesture animations
- **Lucide React** — icon set
- **Three.js** — installed & pre-configured in `vite.config.js` (`optimizeDeps.include`), ready to use for any 3D scenes

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

## Build

```bash
npm run build
npm run preview   # preview the production build locally
```

The production build is output to the `dist/` folder.

## Project structure

```
oro-perfume/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions workflow — builds & deploys to GitHub Pages on push to main
├── src/
│   ├── App.jsx               # Main landing page component
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind directives + global styles
├── .gitignore
├── index.html                 # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Deploying to GitHub Pages

There are two ways to deploy. Pick one.

### Option A — Automatic, via GitHub Actions (recommended)

1. Push this project to a GitHub repository.
2. In `vite.config.js`, set `base` to match your repo name exactly:
   ```js
   base: '/your-repo-name/',
   ```
   (If deploying to a user/org page like `you.github.io`, or a custom domain, use `base: '/'` instead.)
3. In your repository settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Push to the `main` branch. The included workflow at `.github/workflows/deploy.yml` will automatically build the app and publish the `dist/` folder to GitHub Pages.

### Option B — Manual, via the `gh-pages` package

1. Set the correct `base` in `vite.config.js` as described above.
2. Make sure your repo has a `gh-pages` branch available (the package creates it for you).
3. Run:
   ```bash
   npm run deploy
   ```
   This builds the app and pushes the `dist/` folder to the `gh-pages` branch using the `gh-pages` npm package.
4. In **Settings → Pages**, set **Source** to the `gh-pages` branch.

Your site will be live at `https://<username>.github.io/<repo-name>/`.

## Notes

- All images in `App.jsx` are loaded from external URLs (Unsplash / ibb.co). Swap these for your own hosted assets if you'd prefer not to depend on third-party image hosts in production.
- Tailwind's `content` paths in `tailwind.config.js` already cover `index.html` and every file in `src/`, so any new components will pick up styles automatically.
