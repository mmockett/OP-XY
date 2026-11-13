# OP–XY machines

Max Mockett's machines for the teenage engineering OP–XY, in one place:
[mmockett.github.io/OP-XY](https://mmockett.github.io/OP-XY/).

A static page with no build step. GitHub Pages serves it from `main`.

| File | Holds |
| --- | --- |
| `data.js` | Every project, machine, status, link and description |
| `app.js` | Draws the page from `data.js`, and checks statuses live |
| `style.css` | The look: a dark grey page, black screens, the header's grey steps |
| `assets/media/<project>/` | Screens: MP4, JPG poster, and `-t.jpg`, a small poster for the machine's tile |
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
   without a card. `cover` is the image its tile shows on the home.
3. Put the project on a shelf: add its `id` to one of `shelves` at the top of
   `data.js` (flagship, the suites, MNMD, more machines).
4. Commit and push. Pages republishes in about a minute.

Open `index.html` straight from disk to check it first.

## Statuses

| Status | Means |
| --- | --- |
| `live` | Published in the Open-XY catalog on `main`, so it is in the open-xy.com builder |
| `soon` | Coming soon: runs on the OP–XY, not yet in the builder |
| `diy` | Needs samples from your own ROM; built from source only |
| `lab` | Experimental: runs on the OP–XY but still being refined; built from source only |
| `dev` | In development: not yet installable or on the OP–XY |

Each time the page loads, it reads etcetc000/open-xy's
`catalog/machines.json` on `main`, and shows a machine published there as
`live`. A catalog
change reaches each builder with its next release, so a status can lead the
builder by a few days. A machine in open-xy.com links to its own page there
(`#preview/machines/<catalog id>`) and shows its catalog tag, the version that
builder installs; a project's heading shows those tags, each one when its
machines are on different releases, and its `version` (latest release) only
until the catalog loads.

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
into `assets/media` and rebuilds the grids and the small posters. Name projects
after either `build.py` command (`build.py tetragon`, `build.py --publish
tetragon`) to build or publish only those. The Tetragon kits are read from a
checkout of OP-XY-Tetragon beside this one, or wherever `XY_TETRAGON` points. Conductor's screens come from its own control and display code too,
compiled on the host into `tools/render/conductor.cpp`, since the browser preview
doesn't run a machine's control code. The font is
used for rendering only: it is never committed or served.

## The page

The page has two kinds of view, chosen by the address's hash, with no build
step and no reload between them:

- **The home** (no hash, or a shelf's id: `#flagship`, `#suites`, `#mnmd`,
  `#more`). A line on what the page is, then the flagship, Nexus, with its
  screen, its sound and a way in. Then a tile per project, shelf by shelf:
  its `cover`, name, kicker, tagline and machines' names. A project with
  `groups` (MNMD) gets a wide tile with a way into each group.
- **A project** (`#<project id>`, such as `#hexagon`). Its heading, screen
  and first paragraph, with the rest of its description and its specs behind
  "more about". Then its machines, each a screen, a summary (the
  description's opening), its preset clips and "details": the rest of the
  description, the screen line, its controls, CPU and links. Next and previous
  lead through the projects in the home's order.

A link to a machine (`#moth`, `#mdkit`) opens its project's page at that
machine with its details open, so older links still land. The bar's links go
to the shelves, and "all machines" opens an index of every project and
machine. Everything draws from `data.js`, so a new machine needs nothing
beyond its entry there.

The machines' film, `assets/media/machines/machines.mp4` (16:9, with a soundtrack), sits on the home after the flagship, from `film` in `data.js`. Its poster `machines.jpg` shows until a click; then it plays with sound and the browser's own controls, and a preset clip pauses it. It loads nothing but the poster until then.

A video gets its poster when it nears the view, and its file only once it has
stayed in view. Up to six play at once, two on a phone, and a reader saving
data gets posters, with a tap playing one in the lightbox.

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

Tetragon's cards play four bars of each kit's own demo grooves (the MP3s in
each kit's `docs/`), cut and encoded as `.m4a` into `assets/audio/tetragon/`.

Nexus's clips are rendered from its engine's Python model (the same voice,
its CS-80 chorus and spread) in the private OP-XY-Dev repository
(`media/flagship-synths/nexus_site_clips.py`, Tyrell from `nexus_cs80_demo.py`),
each an original phrase in D minor, about 20 to 24 s, at −14 LUFS and under
−1 dBTP. Sustained presets (pads, strings, choirs, bells) have a long hall
added after Nexus; their manifest rows carry `"reverb": true`, and their
buttons say "+ reverb". Bass and stabs play dry.
