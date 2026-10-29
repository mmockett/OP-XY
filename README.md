# OP–XY machines

Max Mockett's machines for the teenage engineering OP–XY, in one place:
[mmockett.github.io/OP-XY](https://mmockett.github.io/OP-XY/).

A static page with no build step. GitHub Pages serves it from `main`.

| File | Holds |
| --- | --- |
| `data.js` | Every project, machine, status, link and description |
| `app.js` | Draws the page from `data.js`, and checks statuses live |
| `style.css` | The look: aluminium body, black screens, the header's grey steps |
| `assets/media/<project>/` | Screens: MP4 + JPG poster |
| `tools/render/` | Renders the screens from each machine's display code |
| `assets/audio/<project>/` and `<project>.json` | Preset clips and their list; each card plays them |

## Adding a machine or project

1. Render its screen (below) into `assets/media/<project>/`.
2. Add an entry to `data.js`, copying one beside it. A machine needs `id`,
   `name`, `kind`, `status`, `description` and `pages` (its control labels,
   four per page, `""` for an empty slot). `catalog` is its ID in the
   Open-XY catalog. `specs` is the project's header strip: two rows of four
   `[title, value]` pairs, values kept to about five characters. Without
   `media` the page draws a blank OP–XY screen with its real control labels.
   A project with one machine shows its screen and controls directly,
   without a card.
3. Commit and push. Pages republishes in about a minute.

Open `index.html` straight from disk to check it first.

## Statuses

| Status | Means |
| --- | --- |
| `live` | Published in the Open-XY catalog on `main`, so it is in the open-xy.com builder |
| `soon` | Coming soon: runs on the OP–XY, not yet in the builder |
| `diy` | Needs samples from your own ROM; built from source only |
| `lab` | Experimental: runs on the OP–XY but still being refined; built from source only |

Each time the page loads, it reads etcetc000/open-xy's
`catalog/machines.json` on `main` and shows a published machine as `live`.

## Screens

Every screen is rendered from the machine's own display code, the same C++
that runs on the OP–XY, at its 480 × 220 (captured at 2×), in its screen font,
Univers Next Pro Light. `tools/render` does it, on a Mac with the machine
repositories and SDK checkouts beside this one, Node, Chrome and ffmpeg:

```bash
XY_FONT="$HOME/Downloads/univers-next-pro/Univers Next Pro Light.ttf" python3 tools/render/build.py
```

```bash
node tools/render/render.mjs
```

```bash
python3 tools/render/build.py --publish
```

The first builds each machine's browser preview, the second plays notes and
turns controls through each one (the scenes are in `render.mjs`; name
machines to render only those), and the third copies the MP4s and posters
into `assets/media` and rebuilds the hero and MNMD grids. The font is used
for rendering only: it is never committed or served.

## Daily sync

A Claude Code cloud routine runs every day at 00:00 UTC (9am Tokyo). It
compares mmockett's `OP-XY*` repositories and the Open-XY catalog with
`.sync/state.json`, the state this page last reflected. When something
changed, it updates `data.js` and `.sync/state.json` and pushes to `main`.
It can't render screens, so a new machine goes up with a blank screen until
it is rendered here. When nothing changed, it commits nothing. Manage it at
[claude.ai/code/routines](https://claude.ai/code/routines).

## Fonts

The page itself uses Univers when it's installed on the reader's machine
and falls back to Helvetica Neue. To serve a licensed Univers webfont to
everyone, add it as `assets/fonts/xy.woff2` and add its `url()` to the
`@font-face` at the top of `style.css`.

## Icons

[Lucide](https://lucide.dev) (ISC licence), inlined as SVG: the page's own
icons in `index.html`, the rest in `ICONS` at the top of `app.js`. Copy a new
one's paths from its page on lucide.dev. No emoji or arrow glyphs.

## Licence

MIT. Not affiliated with teenage engineering or Elektron.

## Preset clips

Each Hexagon and Nonagon card has a row of preset buttons that play a short
phrase suited to the preset (chords for pads, arpeggios for keys, a bassline for
bass), all in A minor at 100 BPM and levelled to about −16 LUFS. They are
rendered on a computer from each machine's own engine code, not recorded on an
OP–XY, by the private OP-XY-Dev repository's `tools/audition`, which writes the
`.m4a` files and `assets/audio/<project>.json`. Samples Ghost and Recur play are
synthesised there too.
