# Gautham K K — Portfolio

A minimal, terminal/code-editor themed personal portfolio site.

## Structure

```
portfolio/
├── index.html       # main site
├── 404.html          # 404 page with a playable pixel shooter game
├── css/
│   ├── style.css     # all shared styling, design tokens, animations, themes
│   └── 404.css        # styling for the 404 page + game UI
├── js/
│   ├── main.js        # typewriter, scroll reveals, nav indicator, theme toggle,
│   │                     contact terminal, case-study modals, command palette,
│   │                     contact form, achievement toast
│   └── 404-game.js    # the pixel shooter game logic
└── README.md
```

## Running locally

No build step or dependencies — it's plain HTML/CSS/JS. Just open `index.html`
in a browser, or serve the folder locally:

```bash
# from inside the portfolio/ folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

(Opening `index.html` directly by double-clicking also works, since there
are no ES module imports.)

## Deploying

Since this is fully static, it deploys as-is to any static host:

- **GitHub Pages** — push this folder to a repo, enable Pages on the `main`
  branch.
- **Vercel / Netlify** — drag-and-drop the folder or connect the repo, no
  build command needed.

## Editing content

All real content (name, bio, skills, projects, experience, links) lives
directly in `index.html`. Section order on the page (and in the nav) is:

```
Hero → Work (Featured: Spendly + Other Projects) → What I Do →
Experience → Skills → About → Contact
```

Search for the section comments (`<!-- ================= WORK ================= -->`
etc.) to find each part quickly. Spendly is treated as the featured
project with its own larger presentation; other projects use the
standard project card.

Design tokens (colors, fonts, spacing) are declared as CSS custom
properties at the top of `css/style.css` under `:root` (dark theme) and
`:root[data-theme="light"]` (light theme) — change them there to re-theme
the whole site.

## Features

- **Light / dark theme toggle** — respects system preference on first visit,
  remembers your choice after.
- **Command palette** — `Ctrl/Cmd + K` or the "⌘K" button in the nav bar.
  Fuzzy-searches sections, project case studies, and external links.
- **Case study modals** — click "case study" on a project card for a full
  screenshot gallery, feature list, tech stack table, and roadmap, pulled
  from each project's own README.
- **404 game page** — the "404" badge in the nav bar opens a playable pixel
  shooter (`404.html`). Arrow keys / A·D to move, space to shoot, with
  on-screen buttons on mobile.
- **Dynamic tab title** — the browser tab title updates as you scroll
  between sections.
- **Achievement toast** — a small notification appears once a visitor has
  scrolled through every section (once per browser session).
- **Hidden terminal command** — try typing `sudo hire-me` in the contact
  terminal.

## Setup required (two features need your own accounts)

### 1. Contact form
The contact form posts to [Formspree](https://formspree.io) — free, no
backend needed.

1. Sign up at formspree.io and create a new form.
2. Copy your form endpoint (looks like `https://formspree.io/f/abc123xyz`).
3. In `index.html`, find:
   ```html
   <form id="contactForm" class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   and replace `YOUR_FORM_ID` with your real endpoint.

Until you do this, the form shows a friendly "not connected yet" message
instead of silently failing.

### 2. "Now playing" panel
This is a **device now-playing panel**, not a Spotify integration — there's
no login button and it never asks for Spotify/account access.

**Why:** there is no web-standard API that lets a webpage read what's
playing in *other* apps (Spotify desktop, Apple Music, VLC, etc.) or even
other browser tabs. The Media Session API only works in one direction — a
page can set metadata/controls for its *own* audio, which the OS then
surfaces on lock screens and hardware media keys. It cannot read another
app's state. That's an intentional privacy boundary of the web platform,
not a missing feature.

So the panel does exactly what's legitimately possible:
- **Idle state** ("Nothing is currently playing") until the visitor presses
  play — never fakes a detected track.
- **Active state** once they play the portfolio's own demo playlist —
  real track title/artist, working seek/volume/prev/next, and a proper
  `navigator.mediaSession` integration so OS media keys and lock-screen
  controls work too.
- Labeled "Portfolio Player" so it's never mistaken for external detection.

It currently plays a small royalty-free demo playlist (hosted by
SoundHelix, commonly used for exactly this purpose). To use your own
tracks, edit the `playlist` array in the "now playing / device now-playing
panel" section of `js/main.js`:
```js
var playlist = [
  { title: 'Track title', artist: 'Artist', src: 'https://your-host/track.mp3' },
  ...
];
```
Host your own mp3s anywhere (GitHub Releases, a CDN, etc.) and point
`src` at them.

## Still to do

- [ ] Wire up the résumé download button with a real PDF
- [ ] Connect the contact form (see above)
- [ ] Swap in your own tracks for the now-playing player (see above)
- [ ] Add live-demo/GitHub links if you ship more projects
