# OP–XY machines

Max Mockett's machines for the teenage engineering OP–XY, in one place:
[mmockett.github.io/OP-XY](https://mmockett.github.io/OP-XY/).

A static page with no build step. GitHub Pages serves it from `main`.

| File | Holds |
| --- | --- |
| `data.js` | Every project, machine, status, link and description |
| `app.js` | Draws the page from `data.js`, and checks statuses live |
| `style.css` | The look: aluminium body, black screens, the header's grey steps |
| `assets/media/<project>/` | Screens: MP4 + JPG poster, or PNG |

## Adding a machine or project

1. Put its media in `assets/media/<project>/`.
2. Add an entry to `data.js`, copying one beside it. A machine needs `id`,
   `name`, `kind`, `status`, `description` and `pages` (its control labels,
   four per page, `""` for an empty slot). `catalog` is its ID in the
   Open-XY catalog. Without `media` the page draws a blank OP–XY screen with
   its real control labels.
3. Commit and push. Pages republishes in about a minute.

Open `index.html` straight from disk to check it first.

## Statuses

| Status | Means |
| --- | --- |
| `live` | Published in the Open-XY catalog on `main`, so it is in the open-xy.com builder |
| `review` | A draft in the catalog, or a pull request submitting it |
| `soon` | Plays on an OP–XY, waiting on SDK changes |
| `diy` | Needs samples from the owner's own ROM; built from source only |

Each time the page loads, it reads `catalog/machines.json` from
etcetc000/open-xy's `main` and `staging`, and moves a machine up to `review`
(a draft) or `live` (published on `main`) by itself. It never moves one down,
so set a status by hand in `data.js` if a machine is retired. The SDK pull
requests' states are read from GitHub the same way.

## Media

Screen recordings come from each machine's own display code, through the
SDK's browser preview. GIFs are heavy, so convert them to MP4 with a poster:

```bash
ffmpeg -i wane.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 22 -preset slow -an wane.mp4
```

```bash
ffmpeg -ss 4 -i wane.mp4 -frames:v 1 -q:v 3 wane.jpg
```

Screens are 480 × 220; keep that ratio (or 960 × 440) so the cards line up.

## Fonts

The OP–XY draws its screen in Univers. The page uses it when it's installed
on the reader's machine and falls back to Helvetica Neue. To serve a
licensed Univers webfont to everyone, add it as `assets/fonts/xy.woff2` and
add its `url()` to the `@font-face` at the top of `style.css`. The recorded
screens were rendered with Helvetica Neue standing in for Univers.

## Icons

[Lucide](https://lucide.dev) (ISC licence), inlined as SVG: the page's own
icons in `index.html`, the rest in `ICONS` at the top of `app.js`. Copy a new
one's paths from its page on lucide.dev. No emoji or arrow glyphs.

## Licence

MIT. Not affiliated with teenage engineering or Elektron.
