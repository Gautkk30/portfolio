# PORTFOLIO DESIGN SYSTEM & ARCHITECTURE REFERENCE

> **Owner:** Gautham K K  
> **Repository:** `portfolio`  
> **Architecture:** Pure Vanilla HTML5 / CSS3 / ES6 JavaScript (Zero Build Steps / Zero External Dependencies)  
> **Status:** Production Reference Document  

---

## 1. Project Architecture & File Mapping

The portfolio is architected as a lightweight, high-performance static application requiring no build process or framework runtime.

```text
portfolio/
├── index.html                  # Single-page application structure & content
├── 404.html                    # 404 Error page containing interactive pixel shooter game
├── css/
│   ├── style.css               # Core design tokens, dark/light themes, typography, layout & components
│   └── 404.css                 # 404 page & game canvas styling
├── js/
│   ├── main.js                 # App state, theme toggle, typewriter, scroll reveals, command palette, 
│   │                           case study modal, tech popovers, music player, terminal & toasts
│   └── 404-game.js             # HTML5 Canvas 2D Space Invaders arcade game loop & touch controls
├── PORTFOLIO_DESIGN_SYSTEM.md  # Comprehensive design system & engineering reference (This file)
└── README.md                   # Project description & deployment instructions
```

### Module Responsibilities

| File | Primary Responsibility | Key Functions / Elements Controlled |
| :--- | :--- | :--- |
| `index.html` | Content & Structure | Semantic HTML5 layout (Hero, Work, What I Do, Experience, Skills, About, GitHub Activity, Contact, Music Player, Modals, Command Palette) |
| `404.html` | Hidden Arcade / 404 | Error message shell, Canvas element, HUD display, touch controls |
| `css/style.css` | Global Styling & Tokens | `:root` custom properties (Dark/Light), typography rules, topbar, grid systems, progress rail, custom cursors, animations |
| `css/404.css` | Arcade Styling | Canvas sizing, pixelated rendering, overlay modal, touch control layout |
| `js/main.js` | Main Interactivity | • Theme switching (`localStorage` key: `portfolio-theme`)<br>• Hero typewriter animation (`roleText`)<br>• IntersectionObserver scroll reveals (`.reveal`) & active section tabs<br>• Contact terminal (`sudo hire gautham`, `sudo hire-me`, `email`, `github`, `linkedin`, `instagram`)<br>• Case study modal generator (`window.__openCaseStudy`)<br>• Command Palette (`Ctrl/Cmd+K` & shortcuts)<br>• Interactive Tech Popover (`.chip[data-tech]`, `.tag[data-tech]`)<br>• Music Player audio controls & `navigator.mediaSession` integration<br>• Exploration achievement toast (`sessionStorage` key: `portfolio-achievement-shown`) |
| `js/404-game.js` | Game Engine | RequestAnimationFrame game loop, player/bullet collision detection, wave spawner, HUD state, keyboard (`Arrow`/`A`/`D`/`Space`) and touch event bindings |

---

## 2. Design System Tokens (CSS Variables)

The design system operates on dual-theme CSS variables attached to `:root` (dark default) and `:root[data-theme="light"]`.

### Color Palette

| Token Name | Dark Theme (`:root`) | Light Theme (`:root[data-theme="light"]`) | Usage / Purpose |
| :--- | :--- | :--- | :--- |
| `--bg-void` | `#0a0f0c` | `#f4f7f4` | Base body background color |
| `--bg-panel` | `#0f1712` | `#ffffff` | Primary surface background (cards, modals, panels) |
| `--bg-panel-2` | `#0c130f` | `#eef3ee` | Secondary surface background (terminal, code tags) |
| `--border` | `#1e2b22` | `#d7e3da` | Standard border color for cards and section dividers |
| `--border-hi` | `#2c4636` | `#b9ccbd` | Highlighted/hover border color |
| `--text` | `#d3f5df` | `#142018` | Primary text color |
| `--text-dim` | `#5f7d6c` | `#4b6350` | Secondary / body prose text color |
| `--text-faint` | `#3c5347` | `#8ba190` | Muted labels, comments, and meta information |
| `--green` | `#4ade80` | `#15803d` | **Primary Accent**: Terminal sigil, active tabs, buttons, success indicators |
| `--green-dim` | `#2f9e5c` | `#16a34a` | Subdued green for borders and selection backgrounds |
| `--cyan` | `#22d3ee` | `#0e7490` | **Secondary Accent**: Section eyebrows, role lines, links, code variables |
| `--amber` | `#f0b429` | `#b45309` | Status tags (e.g. `shipped`), git log commit hashes |
| `--red` | `#ef4444` | `#dc2626` | Terminal close dots, error states, 404 badges |
| `--ambient-glow` | `rgba(74,222,128,0.07)` | `rgba(21,128,61,0.06)` | Radial background gradient overlay |
| `--scanline` | `rgba(255,255,255,0.012)` | `rgba(0,0,0,0.014)` | CRT scanline pattern gradient |
| `--selection-bg` | `var(--green-dim)` | `#bbf7d0` | Text highlight background |
| `--selection-fg` | `#04140a` | `#052e12` | Text highlight foreground |

---

## 3. Typography & Micro-Layout Rules

### Font Families
* **Monospace (`--mono`)**: `'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace`  
  *Used for code, terminal prompts, navigation tabs, buttons, metadata, tags, and progress indicators.*
* **Display (`--font-display`)**: `'Space Grotesk', var(--mono)`  
  *Used for Headings (`h1`, `h2`, `h3`), section titles, card titles, and modal headlines.*
* **Body (`--font-body`)**: `'Inter', var(--mono)`  
  *Used for descriptive body paragraphs, about prose, and feature lists.*

### Font Scale & Hierarchy
* **Hero Headline (`h1`)**: `clamp(36px, 6.4vw, 60px)`, font-weight: `700`, line-height: `1.06`, letter-spacing: `-0.02em`
* **Section Title (`h2`)**: `26px`, font-weight: `700`, letter-spacing: `-0.01em`
* **Featured Project Title (`h3`)**: `clamp(26px, 4vw, 34px)`, font-weight: `700`, letter-spacing: `-0.01em`
* **Card Title / Modal Headline**: `15px` – `24px`, font-weight: `600` / `700`
* **Body Paragraphs (`p`)**: `14px` – `15.5px`, line-height: `1.7` – `1.75`
* **Sub-labels / Eyebrows / Badges**: `10.5px` – `12.5px`, font-weight: `600`, letter-spacing: `.08em` – `.1em`

---

## 4. Visual Identity & Personality

The portfolio features a deliberate **Developer / Code Editor / Terminal** visual identity:
1. **Window Control Dots**: Three dot indicators (`#ef4444`, `#f0b429`, `#4ade80`) in the sticky topbar and modals.
2. **Terminal Prompts**: Hero greeting (`visitor@portfolio:~$ whoami`), contact prompt, and git log history visualization.
3. **Custom SVG Cursors**: Desktop fine-pointer crosshair cursor (`#4ade80`) for body, arrow pointer for interactive elements, and external link pointer for cards.
4. **Git Log History**: Experience section modeled after a `git log` graph with branch badges (`main`, `freelance`, `ieee`, `school`) and commit hashes (`#f3a1c9`, `#7c04ba`, etc.).
5. **Scanline & Ambient Glow**: Fixed background grid pattern with subtle 22-second infinite keyframe animation (`ambientDrift`).

---

## 5. Layout & Responsive Breakpoints

* **Maximum Content Width (`--maxw`)**: `880px` centered with `margin: 0 auto`.
* **Sticky Topbar**: `position: sticky; top: 0; z-index: 100; height: 46px; backdrop-filter: blur(10px);`.
* **Progress Rail**: Fixed right rail (`right: 22px; top: 50%`) with dot markers and hover tooltips. Hidden on screens `< 1024px`.
* **Breakpoints**:
  * `1024px`: Progress rail hides.
  * `680px` / `640px`: Hero flex direction switches to `column-reverse`; project grid & "What I Do" grid collapse to `1fr`.
  * `560px` / `480px`: Stats grid switches to `1fr 1fr`; topbar metadata simplifies; touch controls enable on 404 game.

---

## 6. Key Interactive Components & User Experience

### Navigation & Topbar
* **Tabs & Indicator**: Clicking or scrolling to sections (`#work`, `#experience`, `#skills`, `#about`, `#contact`) updates active class and smoothly translates the green tab indicator line (`#tabIndicator`).
* **Section Progress Rail**: Interactive vertical timeline navigation rail on the right edge of desktop screens (`right: 22px`). Features a vertical timeline connecting track, numbered section badges (`01 Work` through `06 Contact`), glowing green active indicator, and smooth section scrolling synchronized with `setActive(id)`, topbar tabs, and `document.title`. Automatically hides on screens `< 1023px`.

### Command Palette (`Ctrl/Cmd + K` or `/`)
* Accessible via navbar button `⌘K`, shortcut `/`, or `Ctrl/Cmd+K`.
* Fuzzy searches sections, project case studies, contact links, theme toggle, and hidden 404 game.
* Accessible keyboard navigation using `Up`/`Down` arrows and `Enter`.

### Case Study Modals
* Triggered by `Case Study` buttons on project cards.
* Dynamically populates modal structure (`.modal-body`) with screenshot gallery, feature list, tech stack table, and roadmap from JavaScript data models.

### Interactive Tech Chips & Popovers
* Clicking tech chips/tags (`.chip[data-tech]`, `.tag[data-tech]`) opens an interactive popover tooltip displaying the technology name in uppercase, an explicit bulleted project list ("Used in: • Project"), and a concise purpose description ("Purpose"). Positions dynamically with viewport boundary clamping and mobile responsive bounds (`calc(100vw - 24px)`).

### Contact Terminal
* Interactive command line interface (`#termInput`).
* Supports commands: `email`, `github`, `linkedin`, `instagram`, `contact`, `resume`, `sudo hire me`, `sudo hire-me`, and `sudo hire gautham`.

### Downloadable Resume Feature
* **Asset Location**: Single source of truth PDF at `assets/Gautham_KK_resume.pdf` (65,823 bytes).
* **UI Actions**: Native "Download Resume" buttons in Hero section and Contact links area using standard HTML `download="Gautham_KK_resume.pdf"` attribute.
* **Integrations**: Integrated into Command Palette (`Download Resume`) and Contact Terminal (`resume` command).

### Now Playing Music Player
* Pure client-side audio player for demo lofi tracks hosted via SoundHelix.
* Integrates with standard HTML5 `<audio>` element and `navigator.mediaSession` API for native OS media controls and lock screen metadata.
* Equalizer bar animation (`.eq-bars`) synced with playing state.

### GitHub Activity Component
* Positioned in `#github-activity` section between About and Contact.
* Displays developer pitch description, `@Gautkk30` handle tag, and a direct profile button (`https://github.com/Gautkk30`).
* Asynchronously fetches real public events from GitHub API (`api.github.com/users/Gautkk30/events/public`) to render a 12-week activity visualization grid with event-count tooltips and theme-aware green intensity tokens (`.lvl-0` to `.lvl-3`).
* Includes silent fallback (gracefully hiding the grid while leaving the profile card intact) if network or rate limits prevent API access.

### 404 Pixel Shooter Arcade
* Standalone 2D Space Invaders-style arcade game rendered on HTML5 `<canvas>` (`404.html` & `js/404-game.js`).
* Features score tracking, wave escalation, player lives, keyboard controls (`Arrow`/`A`/`D`/`Space`), and on-screen touch buttons for mobile.
* Programmatic Web Audio API sound synthesis engine generating lightweight retro sound effects (laser shoot, enemy explosion, life lost, wave transition, game over, start chirp) with master volume scaling, rapid-fire rate limiting, HUD mute toggle button (`#soundToggle`), and `localStorage` preference persistence (`'404-game-sound'`).

---

## 7. Verified Personal Information & Core Projects

### Gautham K K Personal Metadata
* **Name**: Gautham K K
* **Degree**: B.Tech in Computer Science and Engineering
* **Institution**: College of Engineering, Attingal (APJ Abdul Kalam Technological University)
* **Graduation**: Class of 2028
* **Target Role**: Software Development Internships / Frontend Development
* **Primary Skills**: Frontend Development, Web Development, UI/UX Design
* **GitHub Handle**: `Gautkk30`

### Major Projects Reference
1. **DEVDROP**:
   * **Role**: Primary Featured Project
   * **Description**: Browser-native P2P file sharing built with WebRTC DataChannels, chunked streaming, backpressure, and SHA-256 integrity verification.
   * **Stack**: React, TypeScript, WebRTC, Node.js, WebSocket, Redis.
   * **Engineering Highlights**: Direct WebRTC DataChannel browser-to-browser transfer, chunked streaming with adaptive backpressure, Web Crypto SHA-256 integrity verification on both peers, WebSocket signaling, Redis-backed ephemeral room state with TTL expiration, QR-based room pairing, zero server-side file storage.
2. **SPENDLY**:
   * **Role**: Project
   * **Description**: Full-stack personal finance platform with cloud persistence.
   * **Stack**: React, TypeScript, Node.js, Express, MongoDB Atlas, Google OAuth 2.0, Cloud Run.
   * **Engineering Highlights**: Real user-owned wallet architecture, MongoDB Atlas cloud migration, budget planning, transaction CRUD, inline categories, legacy data migration.
3. **MUSI**:
   * **Description**: Modern music player web application.
   * **Stack**: HTML, CSS, JavaScript, Java, Firebase, iTunes Search API.
   * **Features**: Local audio playback, 30s preview iTunes search, customizable equalizer, multiple themes.

---

## 8. Incremental Maintenance Rules

1. **Zero Framework Pollution**: Preserve vanilla HTML/CSS/JS structure unless explicitly commanded.
2. **Never Break Existing Features**: Any new feature or edit must leave existing navigation, shortcuts, modals, theme toggling, terminal, 404 game, and audio player fully operational.
3. **Preserve Visual Cohesion**: All future UI elements must use predefined CSS custom properties (`--green`, `--cyan`, `--bg-panel`, `--mono`, etc.).
4. **No Content Fabrication**: Never invent fake stats, clients, testimonials, or unauthorized experience claims.
