// Renders data.js as two kinds of view, chosen by the address's hash:
//   the home (no hash, or a shelf's id): the flagship, then a tile per project,
//     shelf by shelf (SITE.shelves);
//   a project (#<project id>), with its machines; #<machine id> opens the
//     machine's project at that machine, with its details open.
// The screens' header is drawn with the SDK's own geometry: eight 60 x 20 steps,
// titles at 5 + 120 i (10 px), values at 65 + 120 i (20 px), and page 2 in grey
// below (docs/ux.md, sdk/browser/display.mjs).
(() => {
  const SITE = window.SITE;
  const RANK = { dev: 0, lab: 1, diy: 2, soon: 3, live: 4 };
  const ORDER = ["live", "soon", "diy", "lab", "dev"];
  const STEPS = ["#000000", "#323232", "#4B4B4B", "#646464", "#7D7D7D", "#969696", "#AFAFAF", "#CDCDCD"];
  // The catalog: main is what open-xy.com offers.
  const CATALOG = branch => `https://raw.githubusercontent.com/etcetc000/open-xy/${branch}/catalog/machines.json`;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
  // Text that names the OP–XY, kept from breaking at its dash.
  const txt = s => esc(s).replace(/OP–XY/g, '<span class="nb">OP–XY</span>');

  // Lucide icons (lucide.dev, ISC licence), inlined so the page needs no library.
  const ICONS = {
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  };
  const icon = name => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

  // ---- data ------------------------------------------------------------------
  // A project on no shelf joins the last one, so a new entry always shows.
  for (const p of SITE.projects) if (!SITE.shelves.some(s => s.projects.includes(p.id))) SITE.shelves.at(-1).projects.push(p.id);
  const project = id => SITE.projects.find(p => p.id === id);
  const all = () => SITE.projects.flatMap(p => p.machines);
  const ownerOf = id => SITE.projects.find(p => p.machines.some(m => m.id === id));
  const shelfOf = p => SITE.shelves.find(s => s.projects.includes(p.id));
  // Projects in the home's order, shelf by shelf.
  const ordered = () => SITE.shelves.flatMap(s => s.projects.map(project)).filter(Boolean);
  // A project's machines in the order its page shows them: by group.
  const inOrder = p => (p.groups || [{}]).flatMap((_, gi) => p.machines.filter(m => (m.group ?? 0) === gi));
  const best = list => list.reduce((a, m) => (RANK[m.status] > RANK[a] ? m.status : a), "dev");
  const projectStatus = p => (p.machines.length === 1 ? p.machines[0].status : RANK[p.status] > RANK[best(p.machines)] ? p.status : best(p.machines));
  const tallyOf = p => (p.machines.length === 1 ? p.machines[0].kind : ORDER.map(st => [st, p.machines.filter(m => m.status === st).length]).filter(([, n]) => n)
    .map(([st, n]) => `${n} ${SITE.statuses[st].label}`).join(" · "));
  // A machine's own page in the builder, when it's live there.
  const install = m => (m.catalog && m.status === "live" ? `${SITE.builder}/#preview/machines/${m.catalog}` : null);
  // The versions a project's machines install at from the builder, read from the
  // catalog: one tag, or each tag when its machines are on different releases.
  const shipped = p => [...new Set(p.machines.filter(install).map(m => m.tag).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true })).join(" · ");
  const version = p => shipped(p) || p.version;
  // A description's opening, for a summary: its first sentence, or two when the
  // first is only a few words.
  const firstSentence = t => {
    const parts = t.match(/[^.!?]+[.!?]+(?=\s|$)/g) || [t];
    let out = "";
    for (const s of parts) { out += s; if (out.trim().length >= 70) break; }
    return out.trim();
  };

  // ---- pieces ------------------------------------------------------------------
  const pill = st => `<span class="st st-${st}"><i aria-hidden="true"></i>${esc(SITE.statuses[st].label)}</span>`;
  const dot = st => `<i class="dot st-${st}" title="${esc(SITE.statuses[st].label)}" aria-hidden="true"></i>`;
  const ext = (href, label, cls = "btn", lead = "") => `<a class="${cls}" href="${esc(href)}">${lead ? icon(lead) : ""}${esc(label)}${icon("arrow-up-right")}</a>`;
  const flag = `<span class="flag">${icon("star")}flagship</span>`;

  // ---- the OP–XY screen header ------------------------------------------
  function header(pages, values = [[], []], from = 0, to = 4, pad = 0) {
    const [p1, p2] = pages;
    const h = (p2 ? 38 : 20) + pad;
    let s = `<svg class="xy" viewBox="${from * 120} 0 ${(to - from) * 120} ${h}" role="img" aria-label="${esc(p1.filter(Boolean).join(", "))}">`;
    s += `<rect x="${from * 120}" width="${(to - from) * 120}" height="${h}" fill="#000"/>`;
    for (let i = from * 2; i < to * 2; i++) s += `<rect x="${i * 60}" width="60" height="20" fill="${STEPS[i]}"/>`;
    for (let i = from; i < to; i++) {
      const ink = i < 2 ? "#CBCBCB" : "#000000", x = 120 * i;
      s += `<text x="${x + 5}" y="10" fill="${ink}" font-size="10">${esc(p1[i])}</text>`;
      s += `<text x="${x + 65}" y="17.44" fill="${ink}" font-size="20">${esc(values[0][i])}</text>`;
      if (p2) {
        s += `<text x="${x + 5}" y="33" fill="#5A5A5A" font-size="10">${esc(p2[i])}</text>`;
        s += `<text x="${x + 65}" y="33" fill="#707070" font-size="13">${esc(values[1][i])}</text>`;
      }
    }
    return s + "</svg>";
  }

  // A machine with no capture: its real header over a quiet stage.
  function blankScreen(m) {
    const [p1, p2] = m.pages;
    let s = `<svg class="xy blank" viewBox="0 0 480 220" role="img" aria-label="${esc(m.name)}: its controls">`;
    s += `<rect width="480" height="220" fill="#000"/>`;
    for (let i = 0; i < 8; i++) s += `<rect x="${i * 60}" width="60" height="20" fill="${STEPS[i]}"/>`;
    for (let i = 0; i < 4; i++) {
      const ink = i < 2 ? "#CBCBCB" : "#000000";
      s += `<text x="${120 * i + 5}" y="10" fill="${ink}" font-size="10">${esc(p1[i])}</text>`;
      if (p2) s += `<text x="${120 * i + 5}" y="33" fill="#5A5A5A" font-size="10">${esc(p2[i])}</text>`;
    }
    s += `<text x="240" y="${m.kit ? 112 : 124}" text-anchor="middle" fill="#CBCBCB" font-size="34" font-weight="300">${esc(m.name.toLowerCase())}</text>`;
    if (m.kit) {
      const w = 26, gap = 4, n = m.kit.length, keyW = n === 1 ? 92 : w;
      const total = n * keyW + (n - 1) * gap;
      m.kit.forEach((k, i) => {
        const x = 240 - total / 2 + i * (keyW + gap);
        s += `<rect x="${x}" y="140" width="${keyW}" height="18" rx="2" fill="none" stroke="#707070" stroke-width="1"/>`;
        s += `<text x="${x + keyW / 2}" y="152.5" text-anchor="middle" fill="#969696" font-size="9">${esc(k.toLowerCase())}</text>`;
      });
    } else if (m.presets) {
      s += `<text x="240" y="152" text-anchor="middle" fill="#707070" font-size="11">${esc(m.presets.map(p => p.toLowerCase()).join("  ·  "))}</text>`;
    }
    return s + "</svg>";
  }

  // ---- media -------------------------------------------------------------
  // A video gets its poster when it nears the view and its file only once it has
  // stayed in view, so scrolling past costs nothing. The lightbox loads at once.
  function mediaHtml(given, eager = false) {
    if (!given) return "";
    // A phone gets the lighter file where there is one.
    const md = given.small && innerWidth < 720 ? { ...given, ...given.small } : given;
    if (md.type === "video") {
      return eager
        ? `<video muted loop playsinline ${reduced ? "controls" : ""} preload="auto" poster="${esc(md.poster)}" src="${esc(md.src)}" aria-label="${esc(md.alt)}"></video>`
        : `<video muted loop playsinline ${reduced ? "controls" : ""} preload="none" data-poster="${esc(md.poster)}" data-src="${esc(md.src)}" aria-label="${esc(md.alt)}"></video>`;
    }
    return `<img src="${esc(md.src)}" alt="${esc(md.alt)}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
  }

  // Phones play two at a time, and a reader saving data gets posters: a tap on
  // one plays it in the lightbox.
  const net = navigator.connection || {};
  const frugal = reduced || net.saveData || /2g/.test(net.effectiveType || "");
  const inView = new Set();
  let settle;
  const load = v => { if (v.dataset.src && !v.getAttribute("src")) v.src = v.dataset.src; };
  function playVisible() {
    const most = innerWidth < 720 ? 2 : 6;
    let n = 0;
    for (const v of inView) {
      if (frugal || n >= most) { v.pause(); continue; }
      n++;
      load(v);
      v.play().catch(() => {});
    }
  }
  const nearby = new IntersectionObserver(entries => {
    for (const { target: v, isIntersecting } of entries) {
      if (isIntersecting) { if (v.dataset.poster && !v.getAttribute("poster")) v.poster = v.dataset.poster; }
      else if (v.dataset.src && v.getAttribute("src")) { v.pause(); v.removeAttribute("src"); v.load(); }
    }
  }, { rootMargin: "1200px 0px" });
  const visible = new IntersectionObserver(entries => {
    for (const { target: v, isIntersecting } of entries) {
      if (isIntersecting) inView.add(v);
      else { inView.delete(v); v.pause(); }
    }
    clearTimeout(settle);
    settle = setTimeout(playVisible, 200);
  }, { threshold: 0.35 });
  function wireVideos(root) {
    // Only the muted screen loops play themselves; the film waits for a click.
    $$("video[data-src]", root).forEach(v => { nearby.observe(v); visible.observe(v); });
  }
  // Leaving a view: its videos stop and are forgotten.
  function unwireVideos(root) {
    $$("video", root).forEach(v => { v.pause(); nearby.unobserve(v); visible.unobserve(v); inView.delete(v); });
  }

  function zoomable(el, md) {
    if (!el || !md) return;
    el.classList.add("zoom");
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `Enlarge: ${md.alt || ""}`);
    const open = () => {
      const box = $("#lightbox");
      $("#lb-media").innerHTML = mediaHtml(md, true);
      $("#lb-cap").textContent = md.alt || "";
      const v = $("#lb-media video");
      if (v) { v.controls = true; v.play().catch(() => {}); }
      box.showModal();
    };
    el.addEventListener("click", open);
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  }

  // A kit's controls are its first key's machine; each key's machine has its own.
  // pageNames names the rows where a machine has pages of its own (Conductor's M1–M4).
  function ctrlRows(m) {
    return m.pages.map((row, i) => `<span>${m.pageNames ? esc(m.pageNames[i] || "") : m.kit ? (i ? "" : "bd") : m.pages.length > 1 ? `page ${i + 1}` : "controls"}</span>` +
      row.map(c => (c ? `<b>${esc(c)}</b>` : `<em>–</em>`)).join("")).join("") +
      // The Shift row: the controls held Shift gives the encoders, four to a line.
      (m.shift ? m.shift.map((c, i) => (i % 4 ? "" : `<span>${i ? "" : "shift"}</span>`) + (c ? `<b>${esc(c)}</b>` : `<em>–</em>`)).join("") : "");
  }

  const metaHtml = m => [
    m.cpu ? `<span>${icon("cpu")}${esc(m.cpu)} ${esc(m.cpuNote || "a voice")}</span>` : "",
    m.source ? `<a href="${esc(m.source)}">${icon("code")}source</a>` : "",
    install(m) ? `<a href="${esc(install(m))}">${icon("download")}builder${m.tag ? ` · ${esc(m.tag)}` : ""}</a>` : ""
  ].join("");

  // A project's specs as an OP–XY header: page 1 on the bar, page 2 in grey.
  // Phones get it as two halves, so the type stays readable.
  function specStrip(specs) {
    const pages = specs.map(row => row.map(([t]) => t));
    const values = specs.map(row => row.map(([, v]) => v));
    return `<div class="spec" role="group" aria-label="Specs">` +
      `<div class="screen hdr-wide">${header(pages, values, 0, 4, 4)}</div>` +
      `<div class="hdr-narrow"><div class="screen">${header(pages, values, 0, 2, 4)}</div><div class="screen">${header(pages, values, 2, 4, 4)}</div></div></div>`;
  }

  // A project's links: the builder (its own page there, for a machine of its
  // own that's live), then its repository.
  const actionsHtml = (p, ink = true) => {
    const solo = p.machines.length === 1 ? p.machines[0] : null;
    const cls = ink ? "btn btn-ink" : "btn";
    const builder = solo && install(solo) ? ext(install(solo), "open-xy builder", cls, "download") : ext(SITE.builder, "open-xy builder", cls);
    return builder + ext(p.repo, "repository", "btn", "github") + p.links.map(l => ext(l.href, l.label)).join("");
  };
  const verTag = p => `<small data-ver="${esc(p.id)}">${esc(version(p))}</small>`;
  const sounds = (p, m) => (p.audio ? `<div class="sounds" data-clips="${esc(m.id)}" data-audio="${esc(p.audio)}" aria-label="${esc(m.name)}'s presets" hidden></div>` : "");

  // ---- the home -----------------------------------------------------------------
  // The flagship: its screen at the full width, with its sound and a way in.
  function flagshipHtml(p, s) {
    const m = p.machines[0];
    return `<section class="showcase wrap" id="${esc(s.id)}" aria-labelledby="show-h">
      <figure class="device show-media"><div class="screen" data-zoom="${esc(m.id)}">${m.media ? mediaHtml(m.media) : blankScreen(m)}</div></figure>
      <div class="show-copy">
        <div>
          <p class="show-tags">${flag}<span data-pill-p="${esc(p.id)}">${pill(projectStatus(p))}</span></p>
          <h2 id="show-h">${esc(p.name)} <span class="ver">${verTag(p)}</span></h2>
          <p class="show-tag">${txt(p.tagline)}</p>
        </div>
        <div>
          <p class="show-desc">${txt(firstSentence(p.description[0]))}</p>
          ${sounds(p, m)}
          <p class="actions"><a class="btn btn-ink" href="#${esc(p.id)}">explore ${esc(p.name.toLowerCase())}${icon("arrow-right")}</a><span class="actions-in" data-actions="${esc(p.id)}" data-ink="0">${actionsHtml(p, false)}</span></p>
        </div>
      </div>
    </section>`;
  }

  const coverHtml = p => (p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy" decoding="async">` : blankScreen(p.machines[0]));
  // A cover keeps its own shape: a suite's is its grid of screens.
  const coverStyle = p => (p.coverAspect ? ` style="aspect-ratio: ${esc(p.coverAspect)}"` : "");

  // A project as a tile: its cover, its name and kicker, its line, and its machines' names.
  function tileHtml(p, size) {
    const names = p.machines.length > 1 ? `<p class="tile-names">${inOrder(p).map(m => esc(m.name.toLowerCase())).join(" · ")}</p>` : "";
    return `<a class="tile ${size}" href="#${esc(p.id)}" data-project="${esc(p.id)}">
      <div class="screen tile-screen"${coverStyle(p)}>${coverHtml(p)}</div>
      <div class="tile-body">
        <div class="tile-h"><h3>${esc(p.name)}</h3><span data-pill-p="${esc(p.id)}">${pill(projectStatus(p))}</span></div>
        <p class="tile-kicker">${esc(p.kicker)}</p>
        <p class="tile-tag">${txt(p.tagline)}</p>
        ${names}
        <span class="tile-go">${p.machines.length > 1 ? `see all ${p.machines.length}` : `see ${esc(p.name.toLowerCase())}`}${icon("arrow-right")}</span>
      </div>
    </a>`;
  }

  // A project with families of machines (MNMD) runs wide, each family a way into its page.
  function wideHtml(p, s) {
    const fam = (p.groups || []).map((g, gi) => {
      const list = p.machines.filter(m => (m.group ?? 0) === gi);
      return `<a class="fam" href="#${esc(list[0].id)}"><b>${list.length} ${esc(g.title)}${icon("arrow-right")}</b><span>${list.map(m => esc(m.name)).join(" · ")}</span></a>`;
    }).join("");
    return `<section class="shelf wrap" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-h">
      <div class="shelf-h"><h2 id="${esc(s.id)}-h">${esc(s.title)}</h2><p>${esc(p.kicker)}</p></div>
      <div class="wide-tile">
        <a class="screen tile-screen" href="#${esc(p.id)}" aria-label="${esc(p.name)}">${coverHtml(p)}</a>
        <div class="tile-body">
          <div class="tile-h"><h3>${txt(p.tagline)}</h3><span data-pill-p="${esc(p.id)}">${pill(projectStatus(p))}</span></div>
          <p class="tile-tag">${txt(p.description[0])}</p>
          <div class="fams">${fam}</div>
          <p class="actions"><a class="btn btn-ink" href="#${esc(p.id)}">see all ${p.machines.length}${icon("arrow-right")}</a></p>
        </div>
      </div>
    </section>`;
  }

  // The machines' film: a soundtrack made from their own sounds, so it waits for
  // a click. Until then its poster shows with one button on it.
  function filmHtml(f) {
    return `<section class="shelf wrap film-shelf" id="film" aria-label="${esc(f.title)}">
      <figure class="device film">
        <div class="screen screen-film">
          <video playsinline preload="none" poster="${esc(f.poster)}" aria-label="${esc(f.alt)}"><source src="${esc(f.src)}" type="video/mp4"></video>
          <button class="film-play" type="button">${icon("play")}<span>play the film</span><small>${esc(f.length)} · sound on</small></button>
        </div>
      </figure>
    </section>`;
  }
  // It plays with sound and the browser's own controls; a preset clip and the film never play over each other.
  function wireFilm(root) {
    const film = $(".screen-film video", root), button = $(".film-play", root);
    if (!film) return;
    const start = () => { film.muted = false; film.play().catch(() => {}); };
    button.addEventListener("click", start);
    film.addEventListener("click", () => { if (!film.controls) start(); });
    film.addEventListener("play", () => {
      film.controls = true;
      button.hidden = true;
      if (playing) { player.pause(); setPlaying(null); }
    });
    film.addEventListener("ended", () => { film.controls = false; button.hidden = false; });
  }

  function homeHtml() {
    return SITE.shelves.map(s => {
      const list = s.projects.map(project).filter(Boolean);
      if (s.id === "flagship") return list.map(p => flagshipHtml(p, s)).join("") + (SITE.film ? filmHtml(SITE.film) : "");
      if (list.length === 1 && list[0].groups) return wideHtml(list[0], s);
      const rows = s.id === "suites";
      return `<section class="shelf wrap" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-h">
        <div class="shelf-h"><h2 id="${esc(s.id)}-h">${esc(s.title)}</h2>${s.note ? `<p>${txt(s.note)}</p>` : ""}</div>
        <div class="tiles ${rows ? "rows" : "four"}">${list.map(p => tileHtml(p, rows ? "row" : "small")).join("")}</div>
      </section>`;
    }).join("");
  }

  // ---- a project's page -----------------------------------------------------------
  // A machine: its screen and a one-line summary; the rest opens beneath it.
  function card(m, p) {
    const el = document.createElement("article");
    el.className = "card";
    el.id = m.id;
    el.dataset.machine = m.id;
    const sum = firstSentence(m.description);
    const rest = m.description.slice(m.description.indexOf(sum) + sum.length).trim();
    el.innerHTML = `
      <div class="screen"${m.media?.aspect ? ` style="aspect-ratio: ${esc(m.media.aspect)}"` : ""}>${m.media ? mediaHtml(m.media) : blankScreen(m)}</div>
      <div class="card-h"><h3>${esc(m.name)}<small>${esc(m.kind)}${m.after ? ` · after ${esc(m.after)}` : ""}</small></h3><span data-pill-m="${esc(m.id)}">${pill(m.status)}</span></div>
      <p class="card-sum">${txt(sum)}</p>
      ${sounds(p, m)}
      <details class="more">
        <summary>details${icon("chevron-down")}</summary>
        <div class="more-body">
          ${rest ? `<p>${txt(rest)}</p>` : ""}
          ${m.screen ? `<p class="scr">${esc(m.screen)}</p>` : ""}
          ${m.kit ? `<div class="keys" aria-label="Machines in the kit">${m.kit.map(k => `<span>${esc(k)}</span>`).join("")}</div>` : ""}
          <div class="ctrls">${ctrlRows(m)}</div>
          <div class="meta" data-meta="${esc(m.id)}">${metaHtml(m)}</div>
        </div>
      </details>`;
    if (m.media) zoomable($(".screen", el), m.media);
    return el;
  }

  function projectView(p) {
    const sec = document.createElement("article");
    sec.className = "project wrap";
    sec.dataset.project = p.id;
    const solo = p.machines.length === 1 ? p.machines[0] : null;
    const shelf = shelfOf(p);
    const media = p.media || solo?.media;
    const list = ordered(), at = list.indexOf(p);
    const prev = list[at - 1], next = list[at + 1];
    sec.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#${esc(shelf.id)}">${icon("arrow-left")}all machines</a><span>${esc(shelf.title)}</span></nav>
      <div class="steps" aria-hidden="true"></div>
      <header class="sec-head">
        <span class="num">${esc(p.kicker)}</span>
        <h1 id="${esc(p.id)}-h">${esc(p.name)} <span class="ver">${verTag(p)}</span></h1>
        <p class="sub">${txt(p.tagline)}</p>
        <div class="sec-tools">${p.flagship ? flag : ""}<span data-pill-p="${esc(p.id)}">${pill(projectStatus(p))}</span><span class="tally" data-tally="${esc(p.id)}">${esc(tallyOf(p))}</span></div>
      </header>
      ${media ? `<figure class="device p-media${solo ? " solo" : ""}"><div class="screen"${media.aspect ? ` style="aspect-ratio: ${esc(media.aspect)}"` : ""}>${mediaHtml(media)}</div></figure>` : solo ? `<figure class="device p-media solo"><div class="screen">${blankScreen(solo)}</div></figure>` : ""}
      <div class="p-body">
        <div class="p-desc">
          <p>${txt(p.description[0])}</p>
          ${solo ? sounds(p, solo) : ""}
          <p class="actions" data-actions="${esc(p.id)}" data-ink="1">${actionsHtml(p)}</p>
        </div>
        <details class="about">
          <summary>${solo ? "more, with controls and specs" : `more about ${esc(p.name.toLowerCase())}, with specs`}${icon("chevron-down")}</summary>
          <div class="about-body">
            ${p.description.slice(1).map(t => `<p>${txt(t)}</p>`).join("")}
            ${solo?.screen ? `<p class="scr">${esc(solo.screen)}</p>` : ""}
            ${solo ? `<div class="ctrls">${ctrlRows(solo)}</div><div class="meta" data-meta="${esc(solo.id)}">${metaHtml(solo)}</div>` : ""}
            ${p.specs ? specStrip(p.specs) : ""}
          </div>
        </details>
      </div>
      <div class="p-machines"></div>
      <nav class="pager" aria-label="Projects">
        ${prev ? `<a href="#${esc(prev.id)}" rel="prev"><small>${icon("arrow-left")}previous</small>${esc(prev.name)}</a>` : `<a href="#top" rel="prev"><small>${icon("arrow-left")}home</small>all machines</a>`}
        ${next ? `<a href="#${esc(next.id)}" rel="next"><small>next${icon("arrow-right")}</small>${esc(next.name)}</a>` : `<a href="#top" rel="next"><small>home${icon("arrow-right")}</small>all machines</a>`}
      </nav>`;
    if (media) zoomable($(".p-media .screen", sec), media);
    if (!solo) {
      const host = $(".p-machines", sec);
      // A jump list of the project's machines, when there are more than a few.
      if (p.machines.length > 3) {
        host.insertAdjacentHTML("beforeend", `<nav class="jump" aria-label="${esc(p.name)}'s machines">${inOrder(p).map(m => `<a href="#${esc(m.id)}" data-jump="${esc(m.id)}">${dot(m.status)}${esc(m.name.toLowerCase())}</a>`).join("")}</nav>`);
      }
      (p.groups || [{ title: "" }]).forEach((g, gi) => {
        const ms = p.machines.filter(m => (m.group ?? 0) === gi);
        if (g.title) host.insertAdjacentHTML("beforeend", `<div class="group-h"><h2>${esc(g.title)}</h2><span>${esc(g.note || "")}</span></div>`);
        const grid = document.createElement("div");
        grid.className = "cards";
        ms.forEach(m => grid.append(card(m, p)));
        host.append(grid);
      });
    }
    return sec;
  }

  // ---- preset clips ----------------------------------------------------------
  // A project's clips (assets/audio/<project>.json: machine id -> [{preset, src, phrase}])
  // become a row of buttons. One clip plays at a time.
  const player = new Audio();
  player.preload = "none";
  let playing = null;
  function setPlaying(btn) {
    if (playing) { playing.setAttribute("aria-pressed", "false"); playing.querySelector(".i").outerHTML = icon("play"); playing.style.removeProperty("--done"); }
    playing = btn;
    if (btn) { btn.setAttribute("aria-pressed", "true"); btn.querySelector(".i").outerHTML = icon("pause"); }
  }
  player.addEventListener("ended", () => setPlaying(null));
  player.addEventListener("timeupdate", () => {
    if (playing && player.duration) playing.style.setProperty("--done", `${(100 * player.currentTime / player.duration).toFixed(1)}%`);
  });
  function play(btn) {
    if (playing === btn) { player.pause(); setPlaying(null); return; }
    $(".screen-film video")?.pause();
    player.src = btn.dataset.src;
    player.play().then(() => setPlaying(btn)).catch(() => setPlaying(null));
  }
  const clipCache = new Map();
  const clipsOf = url => { if (!clipCache.has(url)) clipCache.set(url, json(url).catch(() => ({}))); return clipCache.get(url); };
  function loadClips(root) {
    return Promise.all($$(".sounds[data-clips]", root).map(async box => {
      const list = (await clipsOf(box.dataset.audio))[box.dataset.clips];
      if (!list || !list.length) return;
      box.innerHTML = `<span class="label">listen</span>` + list.map(c =>
        `<button type="button" class="snd" aria-pressed="false" data-src="${esc(c.src)}" title="${esc(c.phrase || "")}" aria-label="Play ${esc(c.preset)}${c.phrase ? `: ${esc(c.phrase)}` : ""}">${icon("play")}${esc(c.preset)}</button>`).join("");
      box.hidden = false;
      $$(".snd", box).forEach(b => b.addEventListener("click", () => play(b)));
    }));
  }

  // ---- the index: every project and machine, in a sheet ------------------------
  function drawIndex() {
    $("#index-list").innerHTML = SITE.shelves.map(s => `<li class="ix-shelf"><span class="ix-label">${esc(s.title)}</span><ul>` +
      s.projects.map(project).filter(Boolean).map(p => `<li class="ix-suite" data-project="${p.id}">
        <a class="ix-head" href="#${p.id}">${esc(p.name.toLowerCase())}<span>${p.machines.length > 1 ? p.machines.length : esc(p.kicker)}</span></a>
        ${p.machines.length > 1 ? `<ul>${inOrder(p).map(m => `<li data-machine="${m.id}"><a href="#${m.id}">${dot(m.status)}${esc(m.name.toLowerCase())}</a></li>`).join("")}</ul>` : ""}
      </li>`).join("") + `</ul></li>`).join("");
  }

  // The bar: a link per shelf, named for what's on it.
  const navName = s => (s.id === "flagship" ? s.projects[0] : s.id === "more" ? "more" : s.title.replace(/^the /, ""));
  function nav() {
    $("#nav").innerHTML = SITE.shelves.map(s => `<a href="#${esc(s.id)}" data-shelf="${esc(s.id)}">${esc(navName(s))}</a>`).join("") +
      `<a class="opt" href="${SITE.github}">${icon("github")}github</a>`;
  }
  // The bar marks the shelf you're on: on a project's page, the project's shelf.
  function markNav(shelfId) {
    $$("#nav a[data-shelf]").forEach(a => (a.dataset.shelf === shelfId ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
  }

  // ---- routing -------------------------------------------------------------------
  const view = $("#view");
  let current = null; // "home" or a project id
  let shelfSpy = null;
  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    const p = project(id) || ownerOf(id);
    const machine = p && !project(id) ? id : null;
    const want = p ? p.id : "home";
    if (want !== current) {
      unwireVideos(view);
      $(".screen-film video", view)?.pause();
      if (playing) { player.pause(); setPlaying(null); }
      shelfSpy?.disconnect();
      view.textContent = "";
      if (p) view.append(projectView(p));
      else view.innerHTML = `<div class="home">${homeHtml()}</div>`;
      $$("[data-zoom]", view).forEach(el => zoomable(el, all().find(x => x.id === el.dataset.zoom)?.media));
      if (!p) wireFilm(view);
      wireVideos(view);
      current = want;
      $(".intro").hidden = !!p;
      document.title = p ? `${p.name} · OP–XY machines · ${SITE.owner}` : `OP–XY machines · ${SITE.owner}`;
      // On the home, the bar follows the shelf you're reading.
      if (!p) {
        shelfSpy = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) markNav(e.target.id); }, { rootMargin: "-40% 0px -55% 0px" });
        $$(".home > section", view).forEach(s => shelfSpy.observe(s));
      }
      // Clips arrive later and push what's below down: land again once they're in.
      const at = location.hash;
      loadClips(view).then(() => { if (location.hash === at && !moved) land(id); });
    }
    markNav(p ? shelfOf(p).id : SITE.shelves.some(s => s.id === id) ? id : null);
    $("#where").textContent = p ? p.name.toLowerCase() : "all machines";
    if (machine) { const d = $(`#${CSS.escape(machine)} details`); if (d) d.open = true; }
    moved = false;
    land(id);
  }
  // Land on the hash's target: a machine, a shelf, or the top of a new view.
  function land(id) {
    const el = id && document.getElementById(id);
    if (el && el !== view.firstElementChild && !el.matches(".showcase")) el.scrollIntoView({ behavior: "instant", block: "start" });
    else scrollTo({ top: 0, behavior: "instant" });
  }
  // A reader who has scrolled since isn't moved again by a late landing.
  let moved = false;
  for (const ev of ["wheel", "touchmove", "keydown"]) addEventListener(ev, () => { moved = true; }, { passive: true });
  addEventListener("hashchange", route);

  // ---- live status ---------------------------------------------------------
  async function json(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }

  // A machine published on the catalog's main branch is in open-xy.com: live.
  // Its tag there is the version it installs at.
  async function syncCatalog() {
    const live = new Map((await json(CATALOG("main"))).machines
      .filter(m => m.status === "published").map(m => [m.id, m.tag]));
    let changed = false;
    for (const m of all()) {
      if (!m.catalog) continue;
      if (live.has(m.catalog) && RANK.live > RANK[m.status]) { m.status = "live"; changed = true; }
      const tag = m.status === "live" ? live.get(m.catalog) : null;
      if (tag && tag !== m.tag) { m.tag = tag; changed = true; }
    }
    return changed;
  }

  // After the catalog: statuses, versions and links change in place, so nothing playing restarts.
  function refresh() {
    for (const p of SITE.projects) {
      $$(`[data-pill-p="${p.id}"]`).forEach(el => { el.innerHTML = pill(projectStatus(p)); });
      $$(`[data-ver="${p.id}"]`).forEach(el => { el.textContent = version(p); });
      $$(`[data-tally="${p.id}"]`).forEach(el => { el.textContent = tallyOf(p); });
      $$(`[data-actions="${p.id}"]`).forEach(el => { el.innerHTML = actionsHtml(p, el.dataset.ink === "1"); });
      for (const m of p.machines) {
        $$(`[data-pill-m="${m.id}"]`).forEach(el => { el.innerHTML = pill(m.status); });
        $$(`[data-meta="${m.id}"]`).forEach(el => { el.innerHTML = metaHtml(m); });
        $$(`[data-machine="${m.id}"] .dot, [data-jump="${m.id}"] .dot`).forEach(d => { d.className = `dot st-${m.status}`; d.title = SITE.statuses[m.status].label; });
      }
    }
  }

  // ---- start ---------------------------------------------------------------------
  nav();
  drawIndex();
  route();

  // The index: a sheet over the page, closed by choosing a machine.
  const sheet = $("#sheet");
  $("#index-btn").addEventListener("click", () => sheet.showModal());
  sheet.addEventListener("click", e => { if (e.target === sheet || e.target.closest("#index-list a")) sheet.close(); });

  $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") e.target.close(); });
  $("#lightbox").addEventListener("close", () => { $("#lb-media").textContent = ""; });

  syncCatalog().then(changed => { if (changed) { refresh(); drawIndex(); } })
    .catch(() => { $("#synced").textContent = "Statuses as last updated; the Open-XY catalog is unreachable."; })
    .finally(() => document.documentElement.classList.add("settled"));
})();
