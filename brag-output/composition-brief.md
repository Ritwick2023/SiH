# Hyperframes Composition Brief: StatVidya (स्टैटविद्या)

## Objective
Create a short, ultra-polished launch/brag video for **StatVidya**, India's official workforce competency intelligence platform for MoSPI and NSSTA under Mission Karmayogi (SIH 26101).

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: `landscape` — 1920x1080
- Duration: 22.0 seconds
- FPS: 60 fps (or 30 fps high-fidelity)

## Source Material
- Project root: `/Users/jayanthpranaykonada/SiH`
- Primary files read:
  - `README.md`
  - `src/app/page.tsx`
  - `src/app/globals.css`
  - `src/messages/en.json` & `src/messages/hi.json`
  - `public/images/karmayogi-emblem.jpg`
- Product name: **StatVidya** (स्टैटविद्या)
- Tagline / strongest claim: *"Workforce Competency Intelligence Platform for India's Official Statistical System"*
- Key UI moments to recreate:
  1. Live Hexagonal Competency Radar with dynamic L1–L5 polygon animation
  2. Bilingual NSSO FOD Offline Field Assessment Card with IndexedDB sync status
  3. NSSTA AI PDF Manual MCQ Generation Interface with verified provenance badges
  4. MoSPI ADG Executive Command Desk correlating training hours with survey error reductions (-42%)
- Copy that must appear verbatim:
  - *"StatVidya"*
  - *"Workforce Competency Intelligence Platform"*
  - *"MoSPI · NSSTA · Mission Karmayogi"*
  - *"From Village Field Surveys to National Policy"*

## Creative Direction
- Tone preset: `polished`
- Creative direction: "Sovereign Civic Tech Launch — Mission Karmayogi meets Silicon Valley product craft"
- Interpretation: Dignified, sharp, high-tempo pacing. Takes national governance seriously while projecting cutting-edge technical execution.
- Hook: "10 Million Civil Servants. One Question: How do you guarantee statistical data quality?" $\to$ "Meet StatVidya."
- Outro: "From Village Field Surveys to National Policy. StatVidya · MoSPI & NSSTA."
- Avoid:
  - Generic SaaS buzzwords ("Streamline your workflows", "All-in-one platform")
  - Abstract filler graphics
  - Distorted or unbranded color palettes

## Visual Identity
- Canvas / Surface: `#EDF0F7` (Lavender Grey canvas) & `#1F273A` (Dark Slate / Sovereign Navy)
- Primary Brand: `#1C4CA1` (Ministry Navy)
- Secondary Brand: `#1164BE` (Vibrant Blue)
- Primary Accent: `#FFA72F` (Saffron / SSS Orange) & `#F4962F`
- Severity Proficient: `#15803D` (Official Emerald)
- Display font: `'Plus Jakarta Sans', system-ui, sans-serif`
- Body font: `'Public Sans', -apple-system, sans-serif`
- Hindi font: `'Mukta', 'Noto Sans Devanagari', sans-serif`
- Assets staged in composition:
  - Music: `brag-output/composition/assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3`
  - SFX: `brag-output/composition/assets/sfx/`
  - Logos: `brag-output/composition/assets/images/karmayogi-emblem.jpg`

## Storyboard & Timing
See `brag-output/brag-plan.md` for full beat-by-beat storyboard.

Scene Breakdown:
1. **Scene 1 (0.0s – 3.2s)**: The Sovereign Hook ("10 Million Civil Servants...")
2. **Scene 2 (3.2s – 8.0s)**: StatVidya Reveal & Interactive Competency Radar
3. **Scene 3 (8.0s – 12.8s)**: Offline Field-First PWA (Sunita Devi · Bilingual Hindi/English)
4. **Scene 4 (12.8s – 17.0s)**: AI Survey Manual MCQ Engine (400-page MoSPI PDF $\to$ Verified MCQs)
5. **Scene 5 (17.0s – 20.2s)**: Executive Outcome Correlation (Training Spending $\leftrightarrow$ Error Reduction)
6. **Scene 6 (20.2s – 22.0s)**: Final Logo Lock & Official Outro

## Audio & Music Synchronization
- Track: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` (120.19 BPM)
- Strong cues:
  - `3.02s`: Bass drop $\to$ StatVidya Brand Entrance
  - `4.02s`: Main visual lock $\to$ Radar nodes ignite
  - `8.0s`: Kick transition $\to$ Field PWA slide
  - `12.8s`: Beat transition $\to$ AI Engine split view
  - `17.0s`: Climax $\to$ Executive Dashboard
  - `20.2s`: Music ducks gently into final emblem lock
- SFX: Subtle, tactile interface clicks and soft card-drop sounds matching visual entrances.

## Hyperframes Instructions
- Use the installed Hyperframes skills (`hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`).
- Follow the composition structure under `brag-output/composition/`.
- Ensure all DOM text elements are crisp and readable throughout playback.
- Validate with `npx hyperframes check` prior to rendering.
