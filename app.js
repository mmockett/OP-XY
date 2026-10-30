// Renders data.js. The screens' header is drawn with the SDK's own geometry:
// eight 60 x 20 steps, titles at 5 + 120 i (10 px), values at 65 + 120 i
// (20 px), and page 2 in grey below (docs/ux.md, sdk/browser/display.mjs).
(() => {
  const SITE = window.SITE;
  const RANK = { dev: 0, lab: 1, diy: 2, soon: 3, beta: 4, live: 5 };
  const ORDER = ["live", "beta", "soon", "diy", "lab", "dev"];
  const STEPS = ["#000000", "#323232", "#4B4B4B", "#646464", "#7D7D7D", "#969696", "#AFAFAF", "#CDCDCD"];
  // Each catalog branch feeds a builder: staging the beta site, main open-xy.com.
  const CATALOG = branch => `https://raw.githubusercontent.com/etcetc000/open-xy/${branch}/catalog/machines.json`;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
  let filter = "all";

  // Lucide icons (lucide.dev, ISC licence), inlined so the page needs no library.
  const ICONS = {
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  };
  const icon = name => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

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

  // A machine with no capture yet: its real header over a quiet stage.
  function blankScreen(m, project) {
    const [p1, p2] = m.pages;
    let s = `<svg class="xy blank" viewBox="0 0 480 220" role="img" aria-label="${esc(m.name)}: no screen capture yet">`;
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
    s += `<text x="240" y="204" text-anchor="middle" fill="#323232" font-size="9">${esc(project.name.toLowerCase())} · screen capture to come</text>`;
    return s + "</svg>";
  }

  // ---- media -------------------------------------------------------------
  function mediaHtml(md, eager = false) {
    if (!md) return "";
    if (md.type === "video") {
      return `<video muted loop playsinline ${reduced ? "controls" : ""} preload="${eager ? "auto" : "none"}" poster="${esc(md.poster)}" aria-label="${esc(md.alt)}"><source src="${esc(md.src)}" type="video/mp4"></video>`;
    }
    if (md.type === "youtube") {
      return `<iframe src="https://www.youtube-nocookie.com/embed/${esc(md.id)}?rel=0" title="${esc(md.alt || "video")}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;display:block"></iframe>`;
    }
    return `<img src="${esc(md.src)}" alt="${esc(md.alt)}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
  }

  const autoplay = new IntersectionObserver(entries => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); }
      else v.pause();
    }
  }, { threshold: 0.35 });
  function wireVideos(root) {
    if (reduced) return;
    root.querySelectorAll("video").forEach(v => autoplay.observe(v));
  }

  function zoomable(el, md) {
    if (!md || md.type === "youtube") return;
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

  // ---- pieces --------------------------------------------------------------
  const pill = st => `<span class="st st-${st}"><i aria-hidden="true"></i>${esc(SITE.statuses[st].label)}</span>`;
  const best = list => list.reduce((a, m) => (RANK[m.status] > RANK[a] ? m.status : a), "dev");
  const all = () => SITE.projects.flatMap(p => p.machines);
  const count = st => all().filter(m => m.status === st).length;
  // The builder a status installs from, if any, and a machine's own page there.
  const site = st => (st === "live" ? SITE.builder : st === "beta" ? SITE.beta : null);
  const install = m => (m.catalog && site(m.status) ? `${site(m.status)}/#preview/machines/${m.catalog}` : null);
  // The versions a project's machines install at from the builder, read from the
  // catalog: one tag, or each tag when its machines are on different releases.
  const shipped = p => [...new Set(p.machines.filter(install).map(m => m.tag).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true })).join(" · ");
  const ext = (href, label, cls = "btn", lead = "") => `<a class="${cls}" href="${esc(href)}">${lead ? icon(lead) : ""}${esc(label)}${icon("arrow-up-right")}</a>`;

  // A kit's controls are its first key's machine (bd); each key's machine has its own.
  function ctrlRows(m) {
    return m.pages.map((row, i) => `<span>${m.kit ? (i ? "" : "bd") : m.pages.length > 1 ? `page ${i + 1}` : "controls"}</span>` +
      row.map(c => (c ? `<b style="font-weight:400">${esc(c)}</b>` : `<em>–</em>`)).join("")).join("") +
      // An effect's shift row: the controls held Shift gives the encoders.
      (m.shift ? `<span>shift</span>` + m.shift.map(c => `<b style="font-weight:400">${esc(c)}</b>`).join("") : "");
  }

  function card(m, p) {
    const el = document.createElement("article");
    el.className = "card";
    el.dataset.status = m.status;
    el.dataset.machine = m.id;
    const rows = ctrlRows(m);
    const meta = [
      m.cpu ? `<span>${icon("cpu")}${esc(m.cpu)} ${esc(m.cpuNote || "a voice")}</span>` : "",
      m.source ? `<a href="${esc(m.source)}">${icon("code")}source</a>` : "",
      install(m) ? `<a href="${esc(install(m))}">${icon("download")}${m.status === "beta" ? "beta builder" : "builder"}${m.tag ? ` · ${esc(m.tag)}` : ""}</a>` : ""
    ].join("");
    const gallery = m.gallery ? [m.media, ...m.gallery] : null;
    el.innerHTML = `
      <div class="screen">${m.media ? mediaHtml(m.media) : blankScreen(m, p)}</div>
      ${gallery ? `<div class="thumbs">${gallery.map((g, i) => `<button type="button" aria-label="Show ${esc(g.alt)}" aria-current="${i === 0}"><img src="${esc(g.src)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
      <div class="card-h"><h3>${esc(m.name)}<small>${esc(m.kind)}${m.after ? ` · after ${esc(m.after)}` : ""}</small></h3>${pill(m.status)}</div>
      <p>${esc(m.description)}</p>
      ${m.screen ? `<p class="scr">${esc(m.screen)}</p>` : ""}
      ${m.kit ? `<div class="keys" aria-label="Machines in the kit">${m.kit.map(k => `<span>${esc(k)}</span>`).join("")}</div>` : ""}
      <div class="ctrls">${rows}</div>
      ${p.audio ? `<div class="sounds" aria-label="${esc(m.name)}'s presets" hidden></div>` : ""}
      ${meta ? `<div class="meta">${meta}</div>` : ""}`;
    if (m.media) zoomable($(".screen", el), m.media);
    if (gallery) el.querySelectorAll(".thumbs button").forEach((b, i) => b.addEventListener("click", () => {
      const fresh = document.createElement("div");
      fresh.className = "screen";
      fresh.innerHTML = mediaHtml(gallery[i], true);
      $(".screen", el).replaceWith(fresh);
      zoomable(fresh, gallery[i]);
      el.querySelectorAll(".thumbs button").forEach((x, j) => x.setAttribute("aria-current", String(i === j)));
    }));
    return el;
  }

  function project(p, i) {
    const sec = document.createElement("section");
    sec.className = "project wrap";
    sec.id = p.id;
    sec.setAttribute("aria-labelledby", `${p.id}-h`);
    // A project of one machine shows that machine's screen and controls itself, with no cards.
    const solo = p.machines.length === 1 ? p.machines[0] : null;
    const status = solo ? solo.status : RANK[p.status] > RANK[best(p.machines)] ? p.status : best(p.machines);
    if (solo) { sec.dataset.solo = ""; sec.dataset.status = status; }
    const tally = solo ? solo.kind : ORDER.map(st => [st, p.machines.filter(m => m.status === st).length]).filter(([, n]) => n)
      .map(([st, n]) => `${n} ${SITE.statuses[st].label}`).join(" · ");
    sec.innerHTML = `
      <div class="sec-head">
        <span class="num">${String(i + 1).padStart(2, "0")} · ${esc(p.kicker)}</span>
        <div>
          <h2 id="${p.id}-h">${esc(p.name)} <small${shipped(p) && shipped(p) !== p.version ? ` title="${esc(`In the builder; latest release ${p.version}`)}"` : ""}>${esc(shipped(p) || p.version)}</small></h2>
          <p class="sub">${esc(p.tagline)}</p>
        </div>
        <div class="sec-tools">${pill(status)}<span class="tally">${esc(tally)}</span></div>
      </div>
      ${p.specs ? specStrip(p.specs) : ""}
      ${solo ? `<figure class="device p-media solo"><div class="screen">${solo.media ? mediaHtml(solo.media) : blankScreen(solo, p)}</div></figure>` : ""}
      ${p.media ? `<figure class="device p-media"><div class="screen"${p.media.aspect ? ` style="aspect-ratio: ${esc(p.media.aspect)}"` : ""}></div></figure>` : ""}
      <div class="p-body">
        <div class="p-desc">${p.description.map(t => `<p>${esc(t)}</p>`).join("")}
          ${solo ? `<div class="ctrls">${ctrlRows(solo)}</div>` : ""}
          <p class="actions">${ext(p.repo, "repository", "btn btn-ink", "github")}${status === "beta" ? ext(SITE.beta, "beta builder") : ext(SITE.builder, "open-xy")}${p.links.map(l => ext(l.href, l.label)).join("")}</p>
        </div>
      </div>`;
    if (p.media) {
      const ms = $(".p-media .screen", sec);
      ms.innerHTML = mediaHtml(p.media);
      zoomable(ms, p.media);
    }
    if (solo) {
      if (solo.media) zoomable($(".p-media.solo .screen", sec), solo.media);
      return sec;
    }

    const groups = p.groups || [{ title: "" }];
    groups.forEach((g, gi) => {
      const list = p.machines.filter(m => (m.group ?? 0) === gi);
      if (g.title) {
        const h = document.createElement("div");
        h.className = "group-h";
        h.dataset.group = "";
        h.innerHTML = `<h3>${esc(g.title)}</h3><span>${esc(g.note || "")}</span>`;
        sec.append(h);
      }
      const grid = document.createElement("div");
      grid.className = "cards";
      list.forEach(m => grid.append(card(m, p)));
      sec.append(grid);
    });
    return sec;
  }

  // A project's specs as an OP–XY header: page 1 on the bar, page 2 in grey.
  // Phones get it as two halves, so the type stays readable.
  function specStrip(specs) {
    const pages = specs.map(row => row.map(([t]) => t));
    const values = specs.map(row => row.map(([, v]) => v));
    return `<div class="spec" role="group" aria-label="Specs">` +
      `<div class="screen hdr-wide">${header(pages, values, 0, 4, 4)}</div>` +
      `<div class="hdr-narrow"><div class="screen">${header(pages, values, 0, 2, 4)}</div><div class="screen">${header(pages, values, 2, 4, 4)}</div></div></div>`;
  }

  function legend() {
    $("#legend").innerHTML = ORDER.map(st => `<li>${pill(st)}<span>${esc(SITE.statuses[st].note)}</span></li>`).join("");
  }

  function chips() {
    const opts = [["all", "all", all().length], ...ORDER.map(st => [st, SITE.statuses[st].label, count(st)])];
    $("#filter").innerHTML = opts.map(([k, label, n]) =>
      `<button class="chip" type="button" data-f="${k}" aria-pressed="${filter === k}">${esc(label)} <b>${n}</b></button>`).join("");
    $("#filter").querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => { filter = b.dataset.f; chips(); applyFilter(); }));
  }

  function applyFilter() {
    let shown = 0;
    document.querySelectorAll(".project").forEach(sec => {
      if (sec.dataset.solo !== undefined) {
        const on = filter === "all" || sec.dataset.status === filter;
        sec.hidden = !on;
        shown += on;
        return;
      }
      let inSec = 0;
      sec.querySelectorAll(".cards").forEach(grid => {
        let inGrid = 0;
        grid.querySelectorAll(".card").forEach(c => {
          const on = filter === "all" || c.dataset.status === filter;
          c.hidden = !on;
          inGrid += on;
        });
        const h = grid.previousElementSibling;
        if (h && h.dataset.group !== undefined) h.hidden = !inGrid;
        grid.hidden = !inGrid;
        inSec += inGrid;
      });
      sec.hidden = !inSec;
      shown += inSec;
    });
    let empty = $("#empty");
    if (!shown) {
      if (!empty) { empty = document.createElement("p"); empty.id = "empty"; empty.className = "wrap lead"; $("#projects").append(empty); }
      empty.style.padding = "48px var(--gut)";
      empty.textContent = filter === "live"
        ? "Nothing is in the open-xy.com builder yet."
        : filter === "beta" ? "Nothing is in the beta builder yet."
        : "No machines with this status right now.";
    } else if (empty) empty.remove();
  }

  function nav() {
    $("#nav").innerHTML = SITE.projects.map(p => `<a href="#${p.id}">${esc(p.name.toLowerCase())}</a>`).join("") +
      `<a class="opt" href="${SITE.github}">${icon("github")}github</a>`;
  }

  // ---- preset clips ----------------------------------------------------------
  // A project's clips (assets/audio/<project>.json: machine id -> [{preset, src, phrase}])
  // become a row of buttons under each card. One clip plays at a time.
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
    player.src = btn.dataset.src;
    player.play().then(() => setPlaying(btn)).catch(() => setPlaying(null));
  }
  async function loadClips(p, sec) {
    let clips;
    try { clips = await json(p.audio); } catch { return; }
    sec.querySelectorAll(".card").forEach(card => {
      const list = clips[card.dataset.machine];
      const box = $(".sounds", card);
      if (!box || !list || !list.length) return;
      box.innerHTML = `<span class="label">listen</span>` + list.map(c =>
        `<button type="button" class="snd" aria-pressed="false" data-src="${esc(c.src)}" title="${esc(c.phrase || "")}" aria-label="Play ${esc(c.preset)}${c.phrase ? `: ${esc(c.phrase)}` : ""}">${icon("play")}${esc(c.preset)}</button>`).join("");
      box.hidden = false;
      box.querySelectorAll(".snd").forEach(b => b.addEventListener("click", () => play(b)));
    });
  }

  function render() {
    const host = $("#projects");
    host.textContent = "";
    SITE.projects.forEach((p, i) => {
      const sec = project(p, i);
      host.append(sec);
      if (p.audio) loadClips(p, sec);
    });
    wireVideos(host);
    legend(); chips(); applyFilter(); heroBuilder();
  }

  // The hero's builder button: open-xy.com once any machine is live there, the
  // beta builder while machines are only in beta.
  function heroBuilder() {
    const a = $("#hero-builder"), st = best(all());
    const beta = st === "beta";
    a.href = beta ? SITE.beta : SITE.builder;
    a.firstChild.textContent = beta ? "beta builder" : "open-xy builder";
  }

  // ---- live status ---------------------------------------------------------
  async function json(url) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }

  // A machine published on the catalog's staging branch is in the beta builder;
  // on main, in open-xy.com: live. Its tag there is the version it installs at.
  async function syncCatalog() {
    const [main, staging] = await Promise.allSettled(["main", "staging"].map(b => json(CATALOG(b))));
    if (main.status === "rejected" && staging.status === "rejected") throw main.reason;
    const published = r => new Map(r.status === "fulfilled"
      ? r.value.machines.filter(m => m.status === "published").map(m => [m.id, m.tag]) : []);
    const live = published(main), beta = published(staging);
    let changed = false;
    for (const m of all()) {
      if (!m.catalog) continue;
      const st = live.has(m.catalog) ? "live" : beta.has(m.catalog) ? "beta" : null;
      if (st && RANK[st] > RANK[m.status]) { m.status = st; changed = true; }
      const tag = (m.status === "live" ? live : m.status === "beta" ? beta : new Map()).get(m.catalog);
      if (tag && tag !== m.tag) { m.tag = tag; changed = true; }
    }
    return changed;
  }

  const hero = $("#hero-media");
  hero.innerHTML = mediaHtml(SITE.hero, true);
  zoomable(hero, SITE.hero);
  wireVideos(hero);
  nav();
  render();
  $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") e.target.close(); });
  $("#lightbox").addEventListener("close", () => { $("#lb-media").textContent = ""; });

  Promise.allSettled([syncCatalog()]).then(([cat]) => {
    if (cat.status === "fulfilled" && cat.value) render();
    $("#synced").textContent = cat.status === "fulfilled"
      ? "Statuses update from the Open-XY catalog."
      : "Statuses as last updated; the Open-XY catalog is unreachable.";
  });
})();
