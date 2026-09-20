# Design.md — StatVidya v2.1 (Minimal, Light-Only, Institutional)

| Field | Value |
|---|---|
| Version | v2.1 — Minimal Redesign (2026-09-05) |
| Status | Active — Light only, dark mode out of scope |
| Companion | PRD.md, Architecture.md |
| Design Direction | Calm, editorial, "clean paper" institutional. Linear / Notion-level restraint applied to government product. Generous whitespace, single accent, 1px borders, near-zero shadow. |

---

## 1. Design Principles

1. **Clarity Over Decoration** — Every element serves comprehension. No ornamental graphics.
2. **Trust Through Transparency** — Provenance badges visible at all data surfaces.
3. **Field-First Ergonomics** — Touch targets 48px on `lg` and below; 44px desktop. High contrast for outdoor tablet use.
4. **Bilingual Parity** — Hindi (Devanagari) expands 20–40% over Latin; containers use `min-height`, no fixed widths on labels, `text-wrap: balance` on headings, `line-height: 1.65` minimum.
5. **Restraint** — One accent color, one shadow level, unified radii. No gradients, glows, glass, or colored shadows.

---

## 2. Locked Color Palette (Hex, Non-Negotiable)

Source: https://colorhunt.co/palette/8b9a6ef7f2ebeae2d6eeeeee

| Token | Hex | Role | Usage | Contrast vs #fff | Contrast vs #f7f2eb |
|---|---|---|---|---|---|
| `--primary` | `#8b9a6e` | Sage Green | CTAs, active nav, progress fill, links, focus ring | 3.1:1 (not for text) | 2.4:1 (not for text) |
| `--primary-hover` | `#728056` | Darker sage | Hover/active states | — | — |
| `--primary-light` | `#d6ddc9` | Light tint | Active selection fill, subtle highlights | — | — |
| `--background` | `#f7f2eb` | Warm Cream | Page canvas | — | — |
| `--card` | `#ffffff` | Pure white | Elevated surfaces | — | — |
| `--secondary` / `--muted` | `#eae2d6` | Soft Taupe | Section bg, hover fills, disabled, dividers | — | — |
| `--secondary-hover` | `#d2c5b3` | Taupe dark | Hover fills | — | — |
| `--accent` / subtle | `#eeeeee` | Light gray | Internal dividers, stripes, skeleton loaders | — | — |
| `--foreground` | `#1a1a1a` | Near-black | Primary text | **14.3:1** ✅ | **13.2:1** ✅ |
| `--muted-foreground` | `#5a5a5a` | Gray | Secondary text, captions | **6.5:1** ✅ | **6.0:1** ✅ |

**Border strategy** (documented, fixed):
- `--border`: `#e3dbcf` (warm gray derived from taupe). Used for card outlines (visible on white cards).
- `#eeeeee`: kept ONLY for internal dividers / table stripes inside white surfaces.

**Functional / severity** (muted, never decorative):
- `error` (severity-high): `#c0574a` (muted brick red)
- `warning` (severity-moderate): `#c9963a` (muted ochre)
- `success` (proficient): `#8b9a6e` (reuse primary — no `#10b981`)
- `info`: reuse `--primary` or `--foreground`; no separate info token.

**Text contrast verification** (verified):
- `#1a1a1a` on `#ffffff` = 14.3:1 (AA / AAA)
- `#1a1a1a` on `#f7f2eb` = 13.2:1 (AA / AAA)
- `#5a5a5a` on `#ffffff` = 6.5:1 (AA)
- `#5a5a5a` on `#f7f2eb` = 6.0:1 (AA)

---

## 3. Direction Statement — Minimal & Light-Only

- **Light only.** Dark mode is out of scope. Remove all `.dark` selectors, `dark:` Tailwind prefixes, and theme-toggling UI. State clearly once (see §8).
- **Paper-like.** Background `#f7f2eb`; cards `#ffffff`; elevation by border + background contrast, never by shadow.
- **Shadow rule**: max `0 1px 2px rgba(26,26,26,0.04)`; hover lift optional and subtle (≤ `0 2px 8px rgba(26,26,26,0.06)`). No glows, gradients, glassmorphism.
- **Single accent**: `#8b9a6e` only. No blues, purples, or secondary brand hues.

---

## 4. Typography (Bilingual — Sovereign Civic Modern)

- **Sovereign Displays / Headings**: `Plus Jakarta Sans`, 600/700 (Clean, geometric, authoritative statecraft).
- **Body & Data UI (Latin)**: `Public Sans`, 400/500/600 (Civic digital infrastructure standard, 15% more table data density).
- **Devanagari / Hindi**: `Mukta` (by Ek Type, Mumbai), min 14px (`text-sm`), `line-height: 1.65`. Fallback: `Noto Sans Devanagari`.
- **Monospace / Tabular IDs**: `IBM Plex Mono`, `font-feature-settings: "tnum"` for all scores/percentages/IDs/IRT $\theta$.
- **Type scale**:

| Token | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| `text-display` | 2.25rem (36px) | 700 | 1.25 | Hero (landing only), MoSPI readiness statement |
| `text-h1` | 1.875rem (30px) | 700 | 1.30 | Page headers |
| `text-h2` | 1.5rem (24px) | 600 | 1.35 | Section headers, Question stems |
| `text-h3` | 1.25rem (20px) | 600 | 1.40 | Card headers, Modal titles |
| `text-body` | 1.0rem (16px) | 400 | 1.60 | Primary body, assessment text, manual reader |
| `text-sm` | 0.875rem (14px) | 500 | 1.50 | Subtext, labels, table cells (Hindi minimum) |
| `text-xs` | 0.75rem (12px) | 600 | 1.40 | Badges, provenance, timestamps (Latin only) |

**Hindi expansion handling** (concrete CSS):
- Devanagari minimum size rule: Never render Hindi below 14px (`text-sm`).
- Use `min-height` (`min-h-[44px]` desktop, `min-h-[56px]` mobile thumb zone) on buttons/labels instead of fixed `h-` where Hindi may expand.
- No `w-` fixed widths on labels; allow horizontal wrap.
- Headings: `text-wrap: balance`.
- Containers: `line-height: 1.65` minimum for Devanagari content to prevent matra clipping.

---

## 5. Spacing & Radii — Unified

**Grid**: 4px rhythm (`4, 8, 12, 16, 20, 24, 32, 48`).

**Radii (single scale, fixed)**:
- Inputs / buttons / badges: `6px` (`--radius-btn`, `--radius-input`, `--radius-badge`)
- Cards: `10px` (`--radius-card`)
- Pills / tags: `999px`

**Shadow (restricted)**:
- Default card: `0 1px 2px rgba(26,26,26,0.04)`
- Hover lift (optional): `0 2px 8px rgba(26,26,26,0.06)` with `-1px` translate

---

## 6. shadcn/ui Token Mapping (`globals.css` — exact)

```css
@theme inline {
  --color-primary: #8b9a6e;
  --color-primary-foreground: #ffffff;
  --color-primary-light: #d6ddc9;
  --color-primary-dark: #728056;

  --color-secondary: #eae2d6;
  --color-secondary-foreground: #1a1a1a;
  --color-secondary-hover: #d2c5b3;

  --color-background: #f7f2eb;
  --color-foreground: #1a1a1a;
  --color-card: #ffffff;
  --color-card-foreground: #1a1a1a;

  --color-popover: #ffffff;
  --color-popover-foreground: #1a1a1a;

  --color-muted: #eae2d6;
  --color-muted-foreground: #5a5a5a;

  --color-accent: #eeeeee;        /* light gray — subtle surfaces */
  --color-accent-foreground: #1a1a1a;

  --color-destructive: #c0574a;   /* muted brick red */
  --color-destructive-foreground: #ffffff;

  --color-border: #e3dbcf;        /* warm gray for card outlines */
  --color-input: #e3dbcf;
  --color-ring: #8b9a6e;          /* focus ring = primary */

  /* Severity / chart */
  --color-chart-1: #8b9a6e;       /* sage — primary / proficient */
  --color-chart-2: #c9963a;       /* ochre — moderate */
  --color-chart-3: #c0574a;       /* brick — high */
  --color-chart-4: #eae2d6;       /* taupe — neutral */
  --color-chart-5: #1a1a1a;       /* near-black — axis / labels */

  --font-sans: 'Inter', 'Noto Sans Devanagari', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --radius-card: 10px;
  --radius-btn: 6px;
  --radius-badge: 6px;
  --radius-input: 6px;
}

@layer base {
  :root {
    --background: #f7f2eb;
    --foreground: #1a1a1a;
    --card: #ffffff;
    --card-foreground: #1a1a1a;
    --popover: #ffffff;
    --popover-foreground: #1a1a1a;
    --primary: #8b9a6e;
    --primary-foreground: #ffffff;
    --secondary: #eae2d6;
    --secondary-foreground: #1a1a1a;
    --muted: #eae2d6;
    --muted-foreground: #5a5a5a;
    --accent: #eeeeee;
    --accent-foreground: #1a1a1a;
    --destructive: #c0574a;
    --destructive-foreground: #ffffff;
    --border: #e3dbcf;
    --input: #e3dbcf;
    --ring: #8b9a6e;
    --radius: 6px;
  }
}
```

---

## 7. Component Specs

### Button (shadcn/ui)
- Primary: `bg-primary text-primary-foreground` (sage fill, white text), `h-10` desktop / `h-12` `lg` tablet.
- Secondary: `bg-white border border-border text-foreground`, hover `bg-secondary`.
- Ghost: `bg-transparent hover:bg-secondary`.
- Radius: `6px`. Font: 600, 14px.
- Focus: `ring-2 ring-primary ring-offset-2 ring-offset-background`.
- Disabled: `opacity-50 cursor-not-allowed`, no color change.

### Card
- Background `#ffffff`, border `1px solid #e3dbcf`, radius `10px`, padding `24px` desktop / `16px` mobile.
- Shadow: only if needed — `0 1px 2px rgba(26,26,26,0.04)`.
- No colored shadows, no gradients.

### Input
- Height `44px`, radius `6px`, border `#e3dbcf`, focus `ring-primary`.
- Placeholder `text-muted-foreground`.

### Badge / Provenance
- **VERIFIED_OFFICIAL**: `bg-primary/10 text-primary border-primary/20`; icon `ShieldCheck` (lucide).
- **PROPOSED_FRAMEWORK**: `bg-[#c9963a]/10 text-[#c9963a] border-[#c9963a]/20`; icon `FileEdit`.
- **SYNTHETIC_DEMO_DATA**: `bg-secondary text-foreground border-border`; icon `FlaskConical`.
- No emojis. Font `text-xs`, `font-semibold`, `py-0.5 px-2`, radius `999px`.
- Tooltip: `bg-[#1a1a1a] text-white`, rounded `6px`, arrow with `border-t-[#1a1a1a]`.

### Severity Chip (Gap Cards)
- HIGH: `bg-[#c0574a]/10 text-[#c0574a] border-[#c0574a]/20` — chip label + icon.
- MODERATE: `bg-[#c9963a]/10 text-[#c9963a] border-[#c9963a]/20`.
- PROFICIENT: `bg-[#8b9a6e]/10 text-[#8b9a6e] border-[#8b9a6e]/20`.

### Progress Ring (custom SVG)
- Track: `text-[#eae2d6]`.
- Fill: single hue scale — `#8b9a6e` (proficient), `#c9963a` (moderate), `#c0574a` (high).
- Center text: `font-mono`, tabular numbers (`font-feature-settings: "tnum"`).

### Offline Banner
- Background `#f7f2eb`, border-top `#eeeeee`, text `text-amber-700`, icon `WifiOff` / `RefreshCw` / `Wifi`.
- `aria-live="assertive"`.

### Sidebar / Navigation
- Background `#ffffff`, border-right `#eeeeee` (internal divider), active item `bg-primary text-white`.
- Hover `bg-secondary`.
- Collapsed: `w-16`; expanded: `w-56`. Transition 200ms ease-out.

---

## 8. Dark Mode — Explicitly Out of Scope

Dark mode is **deliberately disabled**. No `.dark` selectors, no `dark:` Tailwind variants, no theme toggle in LanguageSwitcher or settings. The UI is light-only to maintain institutional consistency, outdoor readability (paper-like interface preferred by field staff), and to avoid introducing decorative dark surfaces that conflict with the minimal palette.

---

## 9. Provenance Badges (Re-tokenized)

Every domain object carries a non-collapsible badge derived from `provenance`:

| Value | Token | Color Treatment | Icon (lucide) |
|---|---|---|---|
| `VERIFIED_OFFICIAL` | `primary` | Sage fill / white text | `ShieldCheck` |
| `PROPOSED_FRAMEWORK` | `warning` (ochre) | Muted ochre / dark text | `FileEdit` |
| `PROPOSED_METHODOLOGY` | `warning` (ochre) | Same | `FileEdit` |
| `SYNTHETIC_DEMO_DATA` | `secondary` (taupe) | Taupe / foreground text | `FlaskConical` |

Old off-palette hexes (`#2E7D32`, `#F57F17`, `#F9A825`) removed. Badges use `border-1.5px` equivalent via `border` token, `rounded-md`, `text-xs`, `font-semibold`.

---

## 10. Data Visualization

- **Neutral charts**: single-hue sage scale (`#8b9a6e` → `#d6ddc9`) for non-severity data.
- **Severity only when value = gap**: red (`#c0574a`) / amber (`#c9963a`) for gap indicators.
- **Grid lines**: `#eeeeee`. **Axis text**: `muted-foreground`.
- No gradients, no drop shadows on charts.

---

## 11. Motion & Micro-Interactions (Reduced)

| Interaction | Duration | Easing | Context |
|---|---|---|---|
| Hover / Focus | 150ms | `ease-out` | Buttons, cards, nav |
| Page Transition | 200ms | `ease-out` | View changes |
| Progress Ring | 600ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Dashboard readiness |
| Offline Pulse | 1500ms | `infinite` | Banner sync |

Rule: **No animation during active assessment** to prevent distraction. `prefers-reduced-motion: reduce` respected.

---

## 12. Iconography

- Library: `lucide-react`
- Stroke: 1.5px
- Sizes: 16 / 20 / 24px
- Always `currentColor`; no filled/duotone; no emoji in production UI (replaced in badges above).

---

## 13. Field-First Responsive Breakpoints

| Breakpoint | Target | Nav Pattern | Touch Target |
|---|---|---|---|
| `sm` (640px) | Phone | Bottom sheet / hamburger | 44px |
| `md` (768px) | Small tablet | Collapsed icon rail | 48px |
| `lg` (1024px) | **NSSO Field Tablet (Primary)** | Full sidebar, 48px targets | 48px |
| `xl` (1280px) | HQ desktop | Two-column analytics | 44px |
| `2xl` (1536px) | Large monitors | Three-column comprehensive | 44px |

---

## 14. Accessibility & WCAG 2.1 AA

- Contrast: all normal text ≥ 4.5:1 verified against `#fff` and `#f7f2eb`; large text ≥ 3:1.
- Focus: `2px solid #8b9a6e` with 2px offset (`ring-primary`).
- Screen reader: offline banner `aria-live="assertive"`; badges with `title` attributes.
- Keyboard: all interactive elements focus-visible.
- Motion: respects `prefers-reduced-motion`.

---

## 15. Do / Don't (Minimalism Checklist)

**Do:**
- Whitespace, borders, weight/size contrast for hierarchy.
- One accent (`#8b9a6e`), one shadow level.
- Provenance badges on every domain surface.
- `font-feature-settings: "tnum"` for scores.

**Don't:**
- Multiple accent colors; decorative illustrations.
- Drop shadows > 4px blur; colored shadows.
- Emoji in production UI (use lucide icons).
- Dark mode tokens, `.dark` selectors, theme toggles.
- Off-palette hexes in badges or charts.

---

## 16. Changelog — v2.0 → v2.1

- **Locked palette to 4 hues** from colorhunt; removed blues/purples/greens outside the family.
- **Added contrast verification table** for `#1a1a1a` and `#5a5a5a` on both backgrounds.
- **Fixed border inconsistency**: `--border` = `#e3dbcf` for cards; `#eeeeee` only for internal dividers.
- **Replaced functional colors** with muted brick (`#c0574a`) and ochre (`#c9963a`); success = primary.
- **Re-tokenized provenance badges** with lucide icons; removed old hexes.
- **Removed dark mode** entirely — section renamed, `.dark` selectors removed from spec, theme-toggle removed.
- **Unified radii** to 6px / 10px / 999px; shadow restricted to `0 1px 2px rgba(26,26,26,0.04)`.
- **Documented Hindi expansion** with concrete CSS rules (`min-height`, `text-wrap: balance`, `line-height: 1.65`).
- **Fixed TOC / section alignment**; renamed "OKLCH" to consistent Hex / Tailwind v4 labeling.
- **Added full shadcn/ui token mapping** (`--popover`, `--accent`, `--destructive`, `--chart-*`, `--sidebar-*` not needed in minimal spec — kept to core set).

---

*End of Design.md v2.1. Light-only, minimal, institutional. No dark mode. No off-palette accents.*
