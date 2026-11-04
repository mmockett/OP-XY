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

// A drum kit's key: its machine (the drum kind's model) and its controls, 0..127.
const key = (t, model, values) => ({ t, key: { model, values: values.map(v => v / 127) } });

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
  // MD E12: four sampled machines on the tape, each with a control turned
  mde12: { sdk: 'drum', events: [
    key(0, 0, [64, 110, 0, 40, 0, 0, 64, 64]), ...plucks(0.2, 1.5, 0.45, [36], 0.08), sweep(3, 0.9, 0.4, 1.3),       // BD: SPLN
    key(1.6, 1, [64, 110, 0, 0, 0, 0, 64, 64]), ...plucks(1.7, 3.1, 0.45, [37], 0.08), sweep(4, 0.6, 1.9, 2.9),     // SD: STRT
    key(3.2, 4, [64, 110, 0, 0, 0, 0, 64, 64]), ...plucks(3.3, 4.7, 0.45, [41], 0.08), sweep(0, 0.85, 3.5, 4.5),    // CP: PTCH
    key(4.8, 8, [64, 110, 0, 0, 0, 0, 64, 64]), ...plucks(4.9, 6.3, 0.45, [45], 0.08), sweep(3, 0.9, 5.0, 6.0),     // OH: STOP
  ] },
  mmbbox: { sdk: 'pr3', events: plucks(0.3, 5.9, 0.4, [48, 50, 52, 55]) },
  // ModFX: Chroma's bench on Halo, its three modules turned up, then Shift held
  // to change each module's effect; Omnifilter's iris closed, sharpened, its
  // rings turned, then opened; Lint's bays turned up, then the shift row's order,
  // loop and wobble changed.
  chroma: { sdk: 'effects', preset: 'Halo', events: [sweep(2, 0.9, 0.3, 1.2), sweep(1, 0.75, 1.2, 2.1), sweep(0, 0.7, 2.1, 2.9),
    { t: 3.2, shift: true }, { t: 3.5, choice: [0, 3] }, { t: 4.0, choice: [1, 2] }, { t: 4.5, choice: [2, 3] }, { t: 5.0, choice: [3, 6] },
    { t: 5.6, shift: false }] },
  omnifilter: { sdk: 'aux', preset: 'open', events: [sweep(0, 0.12, 0.3, 1.9), sweep(1, 0.9, 2.1, 3.2),
    sweep(2, 0.75, 3.4, 4.2), sweep(3, 0.85, 4.2, 5.0), sweep(0, 0.85, 5.2, 6.2)] },
  lint: { sdk: 'effects', preset: 'Dusty', events: [sweep(0, 0.85, 0.3, 1.4), sweep(1, 0.9, 1.3, 2.4), sweep(2, 0.9, 2.2, 3.0),
    { t: 3.3, shift: true }, { t: 3.7, choice: [0, 5] }, { t: 4.3, choice: [1, 1] }, { t: 4.9, choice: [2, 1] },
    { t: 5.7, shift: false }] },
};
// Conductor: its own control and display code, played on the host by the
// harness build.py compiles (conductor.cpp), Pop playing at 120 bpm. M1's
// phrase as dens turns up; M2's lanes, Shift held to reroll the drums; M3 on
// the drum lane's voices, then (through M2's lane) on the arp's notes; M4 with
// the arp rerouted from track 5 to 7.
const page = (t, n) => ({ t, page: n }), turn = (t, slot, dir = 1) => ({ t, turn: [slot, dir] });
S.conductor = { harness: true, preset: 'Pop', dur: 12.8, poster: 2.6, events: [
  page(0, 1), sweep(3, 0.9, 1.0, 2.2),
  page(3.2, 2), { t: 4.1, shift: true }, turn(4.5, 0), turn(5.0, 0), { t: 5.7, shift: false },
  page(6.4, 3), page(7.9, 2), turn(8.0, 0), turn(8.07, 0), turn(8.13, 0), turn(8.2, 0), page(8.4, 3),
  page(9.6, 4), turn(10.6, 1), turn(11.3, 1),
] };

// The Monomachine synths: a chord, then the first control turned
for (const id of ['mmsid', 'mmvo6', 'mmstat', 'mmpulse', 'mmens', 'mmpar', 'mmdyn', 'mmsaw', 'mmdens', 'mmwave', 'mmddrw']) {
  S[id] = { sdk: 'pr3', events: [...held([0.3, 0.9, 1.5], [48, 55, 60], 5.7), sweep(0, '+0.35', 2.6, 4.6)] };
}
S.mmnois = { sdk: 'pr3', events: [...held([0.3], [60], 5.7), sweep(1, '+0.5', 2.0, 4.6)] };
S.mmsin = { sdk: 'pr3', events: [...held([0.3, 0.9, 1.5], [48, 55, 60], 5.7)] };

// MD KIT (drum SDK): nine of its machines for its
// grid, across its four families, each struck while one of its controls turns.
const mdkit = (model, values, set, to, every) => ({ machine: 'mdkit', sdk: 'drum', events: [
  key(0, model, values), ...plucks(0.3, 6.3, every, [60], 0.08), sweep(set, to, 2.2, 4.6)] });
Object.assign(S, {
  'mdkit-bd': mdkit(0, [40, 52, 44, 36, 0, 12, 0, 0], 2, 0.95, 0.8),       // TRX-BD: RAMP
  'mdkit-cb': mdkit(5, [64, 60, 20, 0, 64, 0, 0, 0], 2, 0.9, 0.6),         // TRX-CB: ENH
  'mdkit-cp': mdkit(3, [80, 64, 64, 40, 64, 40, 50, 64], 5, 0.9, 1.2),     // TRX-CP: ROOM
  'mdkit-xt': mdkit(15, [64, 70, 40, 40, 20, 64, 64, 0], 4, 0.9, 0.9),     // EFM-XT: MOD
  'mdkit-oh': mdkit(7, [10, 64, 0, 127, 64, 0, 0, 0], 0, 0.8, 0.7),        // TRX-OH: GAP
  'mdkit-ma': mdkit(9, [0, 40, 0, 0, 20, 0, 64, 64], 4, 0.9, 0.5),         // TRX-MA: RATL
  'mdkit-ml': mdkit(24, [64, 64, 40, 40, 0, 0, 0, 0], 2, 0.9, 1.0),        // P-I ML: HARD
  'mdkit-sn': mdkit(30, [40, 70, 40, 40, 0, 0, 0, 0], 0, 0.85, 0.8),       // GND-SN: PTCH
  'mdkit-ns': mdkit(31, [30, 0, 0, 0, 0, 0, 0, 0], 0, 0.9, 0.9),           // GND-NS: DEC
});

// Four decaying hits, as a drum loop's overview would look: 96 bins, 0..1.
const levels = Array.from({ length: 96 }, (_, i) => {
  const k = i % 24, hit = [1, .59, .9, .55][Math.floor(i / 24)];
  return Math.min(1, hit * Math.exp(-k / 4.8) + .05);
});
const SAMPLE = { frames: 48000 * 2.4, rate: 48000, levels };
// Each kit machine's own control labels (kit.h), which the drum page's header shows.
const KIT_LABELS = JSON.parse(readFileSync(join(ROOT, 'kit-labels.json')));

function timeline(id) {
  const s = S[id];
  const def = JSON.parse(readFileSync(join(ROOT, 'm', s.machine || id, 'manifest.json'))).definition;
  const ps = def.parameters;
  const preset = s.preset ? def.presets[s.preset] : null;
  if (s.preset && !preset) throw new Error(`${id}: no preset ${s.preset}`);
  const values = ps.map(p => (p.absent ? 0 : preset && p.id in preset ? preset[p.id] : p.default));
  const frames = Math.round((s.dur || DUR) * FPS);
  const steps = Array.from({ length: frames }, () => []);
  const at = t => Math.min(frames - 1, Math.max(0, Math.round(t * FPS)));
  // The values a sweep starts from: the scenario's, or the last drum key's before it.
  let current = values.slice();
  for (const e of s.events) {
    if (e.key) current = e.key.values.slice();
    if (e.sweep) {
      const { set, t0, t1 } = e.sweep;
      const from = current[set];
      const to = typeof e.sweep.to === 'string' ? Math.min(1, from + Number(e.sweep.to)) : e.sweep.to;
      for (let f = at(t0); f <= at(t1); f++) {
        const x = (f / FPS - t0) / Math.max(1e-6, t1 - t0);
        steps[f].push({ set, value: from + (to - from) * Math.min(1, Math.max(0, x)) });
      }
      current[set] = to;
    } else {
      const { t, ...rest } = e;
      steps[at(t)].push(rest);
    }
  }
  // An effect's shift row (build.py writes it), for the header while Shift is held.
  const shift = join(ROOT, 'm', `${s.machine || id}-shift.json`);
  return { machine: s.machine || id, values, steps, sdk: s.sdk, sample: s.sample ? SAMPLE : null, labels: KIT_LABELS[id] || null,
           shift: existsSync(shift) ? JSON.parse(readFileSync(shift)) : null };
}

// A harness's frames (Conductor): the scene as its cues, one a line, then each
// frame's nodes and texts applied to the artwork as the SDK's preview applies them.
const Q31 = 0x7fffffff, q31 = v => Math.round(Math.max(0, Math.min(1, v)) * Q31);
const dec = w => String(Math.round(w / 1024 * 1000) / 1000);
const xml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function harnessFrames(id) {
  const s = S[id], dir = join(ROOT, 'm', id);
  const def = JSON.parse(readFileSync(join(dir, 'definition.json')));
  const preset = def.presets[s.preset];
  if (!preset) throw new Error(`${id}: no preset ${s.preset}`);
  const frames = Math.round(s.dur * FPS), at = t => Math.min(frames - 1, Math.max(0, Math.round(t * FPS)));
  const values = def.parameters.map(p => (p.id in preset ? preset[p.id] : p.default));
  const cues = [`frames ${frames}`, ...values.map((v, i) => `0 global ${i} ${q31(v)}`)];
  for (const e of s.events) {
    if (e.sweep) {
      const { set, to, t0, t1 } = e.sweep, from = values[set];
      for (let f = at(t0); f <= at(t1); f++) cues.push(`${f} global ${set} ${q31(from + (to - from) * Math.min(1, (f / FPS - t0) / (t1 - t0)))}`);
      values[set] = to;
    }
    if (e.page) cues.push(`${at(e.t)} page ${e.page}`);
    if (e.turn) cues.push(`${at(e.t)} turn ${e.turn[0]} ${e.turn[1]}`);
    if (e.shift !== undefined) cues.push(`${at(e.t)} shift ${Number(e.shift)}`);
    if (e.row !== undefined) cues.push(`${at(e.t)} row ${e.row}`);
  }
  const dump = execFileSync(join(dir, id), { input: cues.join('\n') + '\n', maxBuffer: 1 << 28 }).toString();
  const art = readFileSync(join(dir, 'panel.svg.fragment'), 'utf8');
  const attr = (el, name) => (el.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
  const palette = {};
  for (const [el, i] of art.matchAll(new RegExp(`<\\w+ id="${id}_palette_(\\d+)"[^>]*>`, 'g')))
    palette[i] = { fill: attr(el, 'fill'), stroke: attr(el, 'stroke'), width: attr(el, 'stroke-width') };
  const out = [];
  for (const chunk of dump.split(/^f \d+\n/m).slice(1)) {
    const nodes = {}, texts = {};
    for (const line of chunk.split('\n')) {
      if (line.startsWith('n ')) { const p = line.split(' ').map(Number); nodes[p[1]] = p.slice(2); }
      else if (line.startsWith('t ')) { const p = line.split(' '); texts[p[1]] = [...p.slice(2, 5).map(Number), p.slice(5).join(' ')]; }
    }
    let svg = art.replace(new RegExp(`<(path|circle) id="${id}_node_(\\d+)"[^>]*/>`, 'g'), (el, _, i) => {
      const [x, y, scale, cos, sin, shade, paint] = nodes[i];
      const a = Math.floor(scale * cos / 1024), b = Math.floor(scale * sin / 1024);
      el = el.replace(/transform="[^"]*"/, `transform="matrix(${dec(a)} ${dec(b)} ${dec(-b)} ${dec(a)} ${dec(x)} ${dec(y)})"`);
      if (paint) {
        const entry = palette[shade];
        el = el.replace(/stroke="[^"]*"/, `stroke="${entry.stroke}"`).replace(/stroke-width="[^"]*"/, `stroke-width="${entry.width}"`);
        if (paint === 2 && (attr(el, 'fill') || 'none') !== 'none') el = el.replace(/fill="[^"]*"/, `fill="${entry.fill}"`);
      }
      return el;
    });
    svg = svg.replace(new RegExp(`<text id="${id}_text_(\\d+)"([^>]*)>[^<]*</text>`, 'g'), (el, i, attrs) => {
      const [x, y, scale, text] = texts[i];
      return `<text id="${id}_text_${i}"${attrs.replace(/transform="[^"]*"/, `transform="matrix(${dec(scale)} 0 0 ${dec(scale)} ${dec(x)} ${dec(y)})"`)}>${xml(text)}</text>`;
    });
    out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 220"><rect width="480" height="220" fill="#000"/>${svg}</svg>`);
  }
  if (out.length !== frames) throw new Error(`${id}: ${out.length} frames of ${frames}`);
  return out;
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

// A machine's frames as its MP4, and one of them as its poster.
function encode(id, dir, poster) {
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', join(dir, 'f%04d.png'),
    '-movflags', '+faststart', '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-an', join(OUT, `${id}.mp4`)]);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', join(dir, `f${String(poster).padStart(4, '0')}.png`), '-q:v', '3', join(OUT, `${id}.jpg`)]);
}

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(S).filter(id => id !== 'grains-empty');
mkdirSync(OUT, { recursive: true });
try {
  for (const id of ids) {
    if (S[id].harness) {
      const svgs = harnessFrames(id);
      await cdp('Page.navigate', { url: `${base}/render.html?${id}` });
      for (let i = 0; i < 50 && !(await evaluate('window.ready === true').catch(() => false)); i++) await new Promise(r => setTimeout(r, 100));
      const dir = join(OUT, id);
      rmSync(dir, { recursive: true, force: true });
      mkdirSync(dir, { recursive: true });
      for (let f = 0; f < svgs.length; f++) {
        await evaluate(`draw(${JSON.stringify(svgs[f])})`);
        const shot = await cdp('Page.captureScreenshot', { format: 'png' });
        writeFileSync(join(dir, `f${String(f).padStart(4, '0')}.png`), Buffer.from(shot.data, 'base64'));
      }
      encode(id, dir, Math.round(S[id].poster * FPS));
      console.log(`${id}: ${svgs.length} frames from its harness`);
      continue;
    }
    const tl = timeline(id);
    await cdp('Page.navigate', { url: `${base}/render.html?${id}` });
    for (let i = 0; i < 50 && !(await evaluate('window.ready === true').catch(() => false)); i++) await new Promise(r => setTimeout(r, 100));
    const info = await evaluate(`setup(${JSON.stringify({ id: tl.machine, sdk: tl.sdk, values: tl.values, sample: tl.sample, labels: tl.labels, shift: tl.shift })})`);
    const dir = join(OUT, id);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
    for (let f = 0; f < tl.steps.length; f++) {
      await evaluate(`step(${JSON.stringify(tl.steps[f])}, ${1000 / FPS})`);
      const shot = await cdp('Page.captureScreenshot', { format: 'png' });
      writeFileSync(join(dir, `f${String(f).padStart(4, '0')}.png`), Buffer.from(shot.data, 'base64'));
    }
    encode(id, dir, Math.round(tl.steps.length * 0.62));
    console.log(`${id}: ${info.name}, ${tl.steps.length} frames`);
  }
} finally {
  ws.close(); chrome.kill(); server.close();
}
