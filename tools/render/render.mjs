// Renders every machine's screen from its own compiled display code, at the
// OP-XY's 480 x 220 (captured at 2x), in the device's font. Node 22, no deps.
//   node render.mjs [id ...]
import http from 'node:http';
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('.', import.meta.url).pathname;
const OUT = join(ROOT, 'out');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FPS = 30, DUR = 6.4;

// ---- scenarios ---------------------------------------------------------------
const held = (times, pitches, release) => times.flatMap((t, i) => [{ t, on: pitches[i] }, { t: release, off: pitches[i] }]);
const plucks = (from, to, every, pitches, len = 0.12) => {
  const out = [];
  for (let t = from, i = 0; t < to; t += every, i++) {
    const p = pitches[i % pitches.length];
    out.push({ t, on: p }, { t: t + len, off: p });
  }
  return out;
};
const sweep = (set, to, t0, t1) => ({ sweep: { set, to, t0, t1 } });
const CHORD = [48, 55, 60, 64];

const kit = (models) => models.flatMap((model, k) => {
  const t0 = 0.2 + k * 1.55;
  return [{ t: t0 - 0.05, model }, ...plucks(t0, t0 + 1.4, 0.55, [60], 0.08)];
});

const S = {
  // Hexagon Suite: the scenes of its README's animations
  wane:   { sdk: 'staging', preset: 'Attic', events: [...held([0.3, 0.8, 1.3, 1.8], CHORD, 5.7), sweep(4, 0.8, 3.0, 4.6)] },
  bloom:  { sdk: 'staging', preset: 'Tape Choir', events: [...held([0.3, 0.8, 1.3], CHORD, 5.7), sweep(3, 1, 2.4, 4.0), sweep(6, 0.7, 4.3, 5.3)] },
  hollow: { sdk: 'staging', preset: 'Ensemble', events: [...held([0.3, 0.8, 1.3, 1.8], CHORD, 5.7), sweep(1, 1, 2.6, 5.0)] },
  orbit:  { sdk: 'staging', preset: 'Dusty', events: [...held([0.3, 0.8, 1.3], CHORD, 5.7), sweep(3, 1, 2.3, 3.5), sweep(5, 1, 4.0, 4.2)] },
  bend:   { sdk: 'staging', preset: 'Haze', events: [...held([0.3, 0.8, 1.3], CHORD, 5.7), sweep(1, 0.9, 2.6, 4.6)] },
  moth:   { sdk: 'staging', preset: 'Ping', events: [...plucks(0.3, 5.8, 0.45, [60, 63, 67, 70, 72, 67]), sweep(0, 0.85, 2.8, 4.8)] },
  // Nonagon Suite: a preset playing, then the control that shows it best turned
  sand:      { sdk: 'staging', preset: 'Chladni', events: [...held([0.3, 0.8, 1.3], CHORD, 5.7), sweep(6, 0.9, 2.6, 4.4)] },
  cocoa:     { sdk: 'staging', preset: 'Hot Chocolate', events: [...plucks(0.3, 5.8, 1.1, [60, 64, 67, 72], 0.9), sweep(0, 0.9, 2.6, 4.6)] },
  ghost:     { sdk: 'pr3', sample: true, preset: 'Seance', events: [...held([0.3, 0.8, 1.3], CHORD, 5.7), sweep(2, 1, 2.6, 4.4)] },
  coin:      { sdk: 'staging', preset: 'Euler', events: [...held([0.3, 1.0], [48, 55], 5.7), sweep(7, 1, 3.0, 3.3)] },
  recur:     { sdk: 'pr3', sample: true, preset: 'Recur', events: [sweep(5, 4.5 / 7, 0, 0.05), ...held([0.3], [60], 3.6), sweep(3, 1, 4.0, 5.9)] },
  fermi:     { sdk: 'staging', preset: 'Breath', events: [...held([0.3, 0.8, 1.3], CHORD, 5.7), sweep(0, 0.9, 2.4, 4.4)] },
  mach:      { sdk: 'staging', preset: 'Flyby Pad', events: [...plucks(0.3, 5.8, 1.4, [48, 55, 60, 52], 1.0), sweep(0, 0.9, 3.0, 4.2)] },
  butterfly: { sdk: 'staging', preset: 'Specimen', events: [...held([0.3, 0.8, 1.3], CHORD, 5.7), sweep(0, 0.9, 2.6, 4.6)] },
  drop:      { sdk: 'staging', preset: 'Drop', events: [...held([0.3, 1.1, 1.9], [60, 64, 67], 5.7), sweep(0, 1, 2.8, 4.6)] },
  // Grains: a note held, pos scanned, then a minor chord
  grains: { sdk: 'pr3', sample: true, events: [...held([0.4], [60], 5.8), sweep(0, 0.55, 1.2, 3.4), sweep(5, 5.5 / 7, 3.8, 3.85)] },
  // Grains with no sample assigned, for its README
  'grains-empty': { machine: 'grains', sdk: 'pr3', events: [] },
  // MNMD's kits: four of each kit's machines, struck in turn
  mdtrx: { sdk: 'fork', events: kit([0, 1, 3, 5]) },    // BD SD CP CB
  mdefm: { sdk: 'fork', events: kit([3, 4, 6, 8]) },    // BD SD CP CB
  mdpi:  { sdk: 'fork', events: kit([3, 4, 5, 10]) },   // BD SD MT CC
  mde12: { sdk: 'fork', events: kit([0, 1, 4, 6]) },    // BD SD CP CB
  mmbbox: { sdk: 'fork', events: plucks(0.3, 5.9, 0.4, [48, 50, 52, 55]) },
};
// The Monomachine synths: a chord, then the first control turned
for (const id of ['mmsid', 'mmvo6', 'mmstat', 'mmpulse', 'mmens', 'mmpar', 'mmdyn', 'mmsaw', 'mmdens', 'mmwave', 'mmddrw']) {
  S[id] = { sdk: 'fork', events: [...held([0.3, 0.9, 1.5], [48, 55, 60], 5.7), sweep(0, '+0.35', 2.6, 4.6)] };
}
S.mmnois = { sdk: 'fork', events: [...held([0.3], [60], 5.7), sweep(1, '+0.5', 2.0, 4.6)] };
S.mmsin = { sdk: 'fork', events: [...held([0.3, 0.9, 1.5], [48, 55, 60], 5.7)] };

// Four decaying hits, as a drum loop's overview would look.
const peaks = Array.from({ length: 64 }, (_, i) => {
  const k = i % 16, hit = [255, 150, 230, 140][Math.floor(i / 16)];
  return Math.round(hit * Math.exp(-k / 3.2) + 12);
});
const SAMPLE = { frames: 48000 * 2.4, rate: 48000, peaks };
// Each kit machine's own control labels (kit.h), which the drum page's header shows.
const KIT_LABELS = JSON.parse(readFileSync(join(ROOT, 'kit-labels.json')));

function timeline(id) {
  const s = S[id];
  const def = JSON.parse(readFileSync(join(ROOT, 'm', s.machine || id, 'manifest.json'))).definition;
  const ps = def.parameters;
  const preset = s.preset ? def.presets[s.preset] : null;
  if (s.preset && !preset) throw new Error(`${id}: no preset ${s.preset}`);
  const values = ps.map(p => (p.absent ? 0 : preset && p.id in preset ? preset[p.id] : p.default));
  const frames = Math.round(DUR * FPS);
  const steps = Array.from({ length: frames }, () => []);
  const at = t => Math.min(frames - 1, Math.max(0, Math.round(t * FPS)));
  for (const e of s.events) {
    if (e.sweep) {
      const { set, t0, t1 } = e.sweep;
      const from = values[set];
      const to = typeof e.sweep.to === 'string' ? Math.min(1, from + Number(e.sweep.to)) : e.sweep.to;
      for (let f = at(t0); f <= at(t1); f++) {
        const x = (f / FPS - t0) / Math.max(1e-6, t1 - t0);
        steps[f].push({ set, value: from + (to - from) * Math.min(1, Math.max(0, x)) });
      }
    } else {
      const { t, ...rest } = e;
      steps[at(t)].push(rest);
    }
  }
  return { machine: s.machine || id, values, steps, sdk: s.sdk, sample: s.sample ? SAMPLE : null, labels: KIT_LABELS[id] || null };
}

// ---- server + browser ----------------------------------------------------------
const TYPES = { '.html': 'text/html', '.mjs': 'text/javascript', '.json': 'application/json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  const path = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!path.startsWith(ROOT) || !existsSync(path)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' });
  res.end(readFileSync(path));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const profile = join(ROOT, 'chrome-profile');
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9337',
  `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
let version;
for (let i = 0; i < 50 && !version; i++) {
  await new Promise(r => setTimeout(r, 200));
  try { version = await (await fetch('http://127.0.0.1:9337/json/version')).json(); } catch {}
}
const target = await (await fetch('http://127.0.0.1:9337/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((ok, no) => { ws.onopen = ok; ws.onerror = no; });
let seq = 0;
const pending = new Map();
ws.onmessage = ({ data }) => {
  const m = JSON.parse(data);
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.no(new Error(JSON.stringify(m.error))) : p.ok(m.result); }
};
const cdp = (method, params = {}) => new Promise((ok, no) => { const id = ++seq; pending.set(id, { ok, no }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async expression => {
  const r = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
await cdp('Emulation.setDeviceMetricsOverride', { width: 480, height: 220, deviceScaleFactor: 2, mobile: false });

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(S).filter(id => !S[id].machine);
mkdirSync(OUT, { recursive: true });
try {
  for (const id of ids) {
    const tl = timeline(id);
    await cdp('Page.navigate', { url: `${base}/render.html?${id}` });
    for (let i = 0; i < 50 && !(await evaluate('window.ready === true').catch(() => false)); i++) await new Promise(r => setTimeout(r, 100));
    const info = await evaluate(`setup(${JSON.stringify({ id: tl.machine, sdk: tl.sdk, values: tl.values, sample: tl.sample, labels: tl.labels })})`);
    const dir = join(OUT, id);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    for (let f = 0; f < tl.steps.length; f++) {
      await evaluate(`step(${JSON.stringify(tl.steps[f])}, ${1000 / FPS})`);
      const shot = await cdp('Page.captureScreenshot', { format: 'png' });
      writeFileSync(join(dir, `f${String(f).padStart(4, '0')}.png`), Buffer.from(shot.data, 'base64'));
    }
    const mp4 = join(OUT, `${id}.mp4`), poster = Math.round(tl.steps.length * 0.62);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', join(dir, 'f%04d.png'),
      '-movflags', '+faststart', '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-an', mp4]);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', join(dir, `f${String(poster).padStart(4, '0')}.png`), '-q:v', '3', join(OUT, `${id}.jpg`)]);
    console.log(`${id}: ${info.name}, ${tl.steps.length} frames`);
  }
} finally {
  ws.close(); chrome.kill(); server.close();
}
