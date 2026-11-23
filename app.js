/* Trejo Landscaping org chart: zoomable HQ map + bilingual list view. */
(function () {
  const DATA = JSON.parse(document.getElementById("payload").textContent);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const KEY = "trejo-org-lang";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const posterMode = /(?:\?|&)(?:export|poster)=/.test(location.search);
  const shotMode = /(?:\?|&)shot=/.test(location.search);
  const exportMode = posterMode;

  let lang = "en";
  const qs = new URLSearchParams(location.search).get("lang");
  let stored = null; try { stored = localStorage.getItem(KEY); } catch (e) {}
  if (qs === "es" || qs === "en") lang = qs;
  else if (stored === "es" || stored === "en") lang = stored;

  const BOT = {};
  const DEPT = {};
  const DIV = {};
  DATA.divisions.forEach((dv) => {
    DIV[dv.id] = dv;
    dv.depts.forEach((dp) => {
      DEPT[dp.id] = Object.assign({ div: dv }, dp);
      dp.bots.forEach((b) => { BOT[b.id] = Object.assign({ dept: dp, div: dv }, b); });
    });
  });

  const t = (k) => (DATA.ui[lang] && DATA.ui[lang][k]) || DATA.ui.en[k] || k;
  const tt = (obj) => (obj && (obj[lang] || obj.en)) || "";

  /* ---------- clip-art people (same language as the cartoon) ---------- */
  function personSVG(o) {
    const skin = o.skin || "#C9956A", shirt = o.shirt || "#3F9A36", pants = o.pants || "#5A5048";
    const boot = o.boot || "#3A2818", hair = o.hair || "#2A1C14";
    const hat = o.hat == null ? "cap" : o.hat;
    const hatColor = o.hatColor || "#1A2744", brim = o.brim || "#121A3A", id = o.id || "p";
    let hatG = "";
    if (hat === "none") {
      hatG = `<path d="M36 46c2-16 14-26 24-26s22 10 24 26" fill="${hair}" stroke="#201E21" stroke-width="2"/>`;
    } else if (hat === "beanie") {
      hatG = `<path d="M34 48c1-20 12-32 26-32s25 12 26 32v4H34z" fill="${hatColor}" stroke="#201E21" stroke-width="2.2" stroke-linejoin="round"/>
              <ellipse cx="60" cy="20" rx="8" ry="6" fill="${o.pom || "#E02020"}" stroke="#201E21" stroke-width="1.6"/>`;
    } else if (hat === "wide") {
      hatG = `<ellipse cx="60" cy="44" rx="42" ry="7" fill="${hatColor}" stroke="#201E21" stroke-width="2"/>
              <path d="M38 44c1-18 10-30 22-30s21 12 22 30" fill="${hatColor}" stroke="#201E21" stroke-width="2.2"/>`;
    } else if (hat === "visor") {
      hatG = `<path d="M36 46c2-10 12-16 24-16s22 6 24 16" fill="${hair}" stroke="#201E21" stroke-width="2"/>
              <path d="M34 46h52l18 5H30z" fill="${hatColor}" stroke="#201E21" stroke-width="2"/>`;
    } else {
      const badge = o.logo
        ? `<image href="logo.png" x="50" y="22" width="20" height="20" clip-path="url(#capclip-${id})"/>
           <clipPath id="capclip-${id}"><circle cx="60" cy="32" r="9"/></clipPath>
           <circle cx="60" cy="32" r="10" fill="none" stroke="#201E21" stroke-width="1.6"/>`
        : `<circle cx="60" cy="32" r="5" fill="#E02020" stroke="#201E21" stroke-width="1.2"/>`;
      hatG = `<path d="M32 48c2-20 14-34 28-34s26 14 28 34" fill="${hatColor}" stroke="#201E21" stroke-width="2.2" stroke-linejoin="round"/>
              <path d="M86 46c14 2 20 6 22 9H86z" fill="${brim}" stroke="#201E21" stroke-width="2"/>${badge}`;
    }
    const hairSide = (hat === "none" || hat === "visor") ? "" :
      `<path d="M34 58c-2 4-2 12 0 16 4-8 6-14 6-18z" fill="${hair}"/>
       <path d="M86 58c2 4 2 12 0 16-4-8-6-14-6-18z" fill="${hair}"/>`;
    const mustache = o.mustache ? `<path d="M48 72c6 6 10 6 12 2 2 4 6 4 12-2" fill="${hair}" stroke="#201E21" stroke-width="1.2" stroke-linecap="round"/>` : "";
    const beard = o.beard ? `<path d="M42 72c2 18 12 26 18 26s16-8 18-26c-4 6-10 8-18 8s-14-2-18-8z" fill="${hair}" stroke="#201E21" stroke-width="1.6"/>` : "";
    const goatee = o.goatee ? `<path d="M56 80c2 8 4 12 4 12s2-4 4-12c-2 1-6 1-8 0z" fill="${hair}"/>` : "";
    const glasses = o.glasses
      ? `<circle cx="48" cy="62" r="9" fill="none" stroke="#201E21" stroke-width="2.2"/>
         <circle cx="72" cy="62" r="9" fill="none" stroke="#201E21" stroke-width="2.2"/>
         <path d="M57 62h6" stroke="#201E21" stroke-width="2"/>` : "";
    const smile = `<path d="M50 74c4 9 16 9 20 0" fill="none" stroke="#201E21" stroke-width="2.2" stroke-linecap="round"/>`;
    const phone = o.phone
      ? `<g transform="translate(70,148) rotate(8)">
           <rect x="0" y="0" width="22" height="36" rx="4" fill="#201E21"/>
           <rect x="2" y="3" width="18" height="28" rx="2" fill="#E8F6FF"/>
           <rect x="4" y="6" width="14" height="3" rx="1" fill="#203890"/>
           <rect x="4" y="11" width="10" height="2" rx="1" fill="#8AA"/>
           <rect x="4" y="15" width="12" height="2" rx="1" fill="#8AA"/>
         </g>` : "";
    const armR = o.phone ? -22 : -12;
    const vest = o.vest ? `<path d="M46 92l6 60h16l6-60" fill="${o.vest}" fill-opacity=".85" stroke="#201E21" stroke-width="2"/>` : "";
    return `<svg viewBox="0 0 140 250" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="62" cy="240" rx="36" ry="7" fill="rgba(32,30,33,.22)"/>
      <rect x="42" y="154" width="18" height="62" rx="8" fill="${pants}" stroke="#201E21" stroke-width="2.2"/>
      <path d="M40 214h24l6 14H36z" fill="${boot}" stroke="#201E21" stroke-width="2.2" stroke-linejoin="round"/>
      <rect x="64" y="154" width="18" height="62" rx="8" fill="${pants}" stroke="#201E21" stroke-width="2.2"/>
      <path d="M62 214h24l8 14H58z" fill="${boot}" stroke="#201E21" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M44 90c-2 40 4 62 16 62s18-22 16-62c-6-5-12-7-16-7s-10 2-16 7z" fill="${shirt}" stroke="#201E21" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M48 90c2-6 6-9 12-9s10 3 12 9c-6-2-18-2-24 0z" fill="${shirt}" stroke="#201E21" stroke-width="2"/>
      ${vest}
      <rect x="54" y="86" width="16" height="16" rx="4" fill="${skin}" stroke="#201E21" stroke-width="2"/>
      <g transform="rotate(12 48 96)">
        <rect x="40" y="92" width="16" height="50" rx="8" fill="${shirt}" stroke="#201E21" stroke-width="2.2"/>
        <circle cx="48" cy="144" r="8" fill="${skin}" stroke="#201E21" stroke-width="2"/>
      </g>
      <g transform="rotate(${armR} 80 96)">
        <rect x="72" y="92" width="16" height="50" rx="8" fill="${shirt}" stroke="#201E21" stroke-width="2.2"/>
        <circle cx="80" cy="144" r="8" fill="${skin}" stroke="#201E21" stroke-width="2"/>
        ${phone}
      </g>
      <circle cx="28" cy="62" r="6" fill="${skin}" stroke="#201E21" stroke-width="2"/>
      <circle cx="92" cy="62" r="6" fill="${skin}" stroke="#201E21" stroke-width="2"/>
      <ellipse cx="60" cy="62" rx="30" ry="32" fill="${skin}" stroke="#201E21" stroke-width="2.4"/>
      ${hairSide}
      <ellipse cx="48" cy="62" rx="5" ry="6" fill="#201E21"/><ellipse cx="72" cy="62" rx="5" ry="6" fill="#201E21"/>
      <circle cx="49.5" cy="60.5" r="1.5" fill="#FBF6EC"/><circle cx="73.5" cy="60.5" r="1.5" fill="#FBF6EC"/>
      <path d="M58 66c1 4 4 6 5 6s4-2 5-6" fill="#E8A090" opacity=".7"/>
      ${beard}${smile}${mustache}${goatee}${glasses}${hatG}
    </svg>`;
  }

  const RICHI = { id: "richi", skin: "#C9956A", shirt: "#3F9A36", pants: "#5A5048", boot: "#3A2818", hair: "#2A1C14", hat: "cap", hatColor: "#121A3A", logo: true, phone: true };
  const CREW = [
    { id: "c1", skin: "#8D5524", shirt: "#C4392B", pants: "#2C3A4A", hair: "#1A1210", hat: "cap", hatColor: "#1A2744" },
    { id: "c2", skin: "#E0AC69", shirt: "#2B6EA3", pants: "#5A4634", hair: "#3A2718", hat: "beanie", hatColor: "#203890", pom: "#E02020" },
    { id: "c3", skin: "#C68642", shirt: "#E0B025", pants: "#3E3A36", hair: "#2A1C14", hat: "cap", hatColor: "#2A2A2A", beard: true },
    { id: "c4", skin: "#A56B3C", shirt: "#E07A2F", pants: "#3A332C", hair: "#2A1C14", hat: "visor", hatColor: "#203890", glasses: true },
    { id: "c5", skin: "#D4A574", shirt: "#4E7A5A", pants: "#4A4038", hair: "#2A1C14", hat: "wide", hatColor: "#8A6A32", mustache: true },
    { id: "c6", skin: "#8B5A2B", shirt: "#2A9A9A", pants: "#2C3A4A", hair: "#1A1210", hat: "none" },
    { id: "c7", skin: "#F1C27D", shirt: "#6A6E74", pants: "#3A332C", hair: "#3A2718", hat: "cap", hatColor: "#5A1E24", vest: "#4A3A2A", goatee: true }
  ];

  /* ---------- robots ---------- */
  function glyphPath(g) {
    const map = {
      brief: "M5 4h14v12H5zM8 7h8M8 10h6",
      report: "M7 3h8l4 4v14H7zM15 3v4h4M9 12h6M9 16h4",
      list: "M6 6h12M6 12h12M6 18h8",
      notes: "M6 4h9l5 5v11H6zM15 4v5h5",
      calendar: "M5 6h14v14H5zM5 10h14M9 6V3M15 6V3",
      stamp: "M8 4h8v4H8zM5 12h14v8H5z",
      pin: "M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12zM12 11a2 2 0 110-4 2 2 0 010 4z",
      translate: "M4 6h16M12 6v2M8 20l4-12 4 12M9 16h6",
      contract: "M7 3h8l4 4v14H7zM10 13h6M10 17h4",
      terms: "M6 4h12v16H6zM9 8h6M9 12h6M9 16h4",
      handshake: "M4 14l4-4 4 3 4-3 4 4-4 4-4-3-4 3z",
      bell: "M12 4a6 6 0 016 6v4l2 3H4l2-3V10a6 6 0 016-6zM10 20h4",
      shield: "M12 3l8 3v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z",
      book: "M5 4h6v16H5zM13 4h6v16h-6",
      folder: "M3 7h6l2 2h10v11H3z",
      chat: "M4 5h16v10H8l-4 4z",
      estimate: "M7 3h10v18H7zM10 8h4M10 12h4M10 16h3",
      lead: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21v-1a6 6 0 0112 0v1",
      follow: "M5 12h14M13 6l6 6-6 6",
      visit: "M12 21s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z",
      design: "M4 20l8-16 8 16H4z",
      deck: "M4 6h16v12H4zM8 6V4h8v2",
      search: "M11 17a6 6 0 100-12 6 6 0 000 12zM20 20l-4-4",
      spark: "M12 3l1.5 6.5L20 11l-6.5 1.5L12 19l-1.5-6.5L4 11l6.5-1.5z",
      social: "M7 10a3 3 0 110-6 3 3 0 010 6zM17 20a3 3 0 110-6 3 3 0 010 6zM8 12l8 4",
      google: "M12 4a8 8 0 108 8h-8",
      nextdoor: "M4 11l8-7 8 7v9H4z",
      facebook: "M13 9h3V6h-3c-2 0-3 1-3 3v2H8v3h2v7h3v-7h3l1-3h-4V9z",
      mail: "M3 6h18v12H3zM3 6l9 7 9-7",
      campaign: "M4 10v4h3l5 4V6L7 10H4zM16 9a4 4 0 010 6",
      flyer: "M6 3h12v18H6zM9 8h6",
      door: "M8 3h8v18H8zM14 13h1",
      seo: "M4 16l4-8 4 5 3-3 5 6H4",
      photos: "M4 7h4l2-2h4l2 2h4v12H4zM12 16a3 3 0 100-6 3 3 0 000 6z",
      referral: "M8 11a3 3 0 100-6 3 3 0 000 6zM16 21a3 3 0 100-6 3 3 0 000 6zM10 13l5 3",
      website: "M4 6h16v12H4zM4 10h16",
      voice: "M12 3v10M8 8a4 4 0 008 0",
      schedule: "M5 6h14v14H5zM8 11h8M8 15h5",
      route: "M5 18c4-8 4-8 14-12M15 4l4 2-2 4",
      weather: "M6 15a5 5 0 019-3 4 4 0 11.5 8H7a3 3 0 01-1-5z",
      send: "M3 12l18-8-8 18-2-7z",
      rain: "M8 4v4M12 3v4M16 4v4M6 14a4 4 0 018 1 3 3 0 114 0",
      repeat: "M6 8h11l-3-3M18 16H7l3 3",
      water: "M12 3s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z",
      alert: "M12 3l9 16H3zM12 10v4M12 17h.01",
      weed: "M12 21V10M12 10C8 10 5 6 5 4c4 0 7 4 7 6zM12 14c4 0 7-3 7-6-4 0-7 3-7 6z",
      tree: "M12 21V12M7 13l5-9 5 9z",
      tips: "M12 3a6 6 0 00-3 11v3h6v-3a6 6 0 00-3-11zM10 20h4",
      plant: "M12 21V11M12 11c-5 0-7-5-7-7 5 1 7 5 7 7zM12 11c5 0 7-5 7-7-5 1-7 5-7 7z",
      lawn: "M4 20c2-6 3-10 4-14M10 20c1-8 2-12 4-16M16 20c1-5 2-8 4-12",
      clipboard: "M8 5h2a2 2 0 004 0h2v16H8z",
      status: "M4 12h4l3 7 5-14 4 7",
      check: "M5 13l5 5L20 7",
      album: "M4 7h16v12H4zM8 7l2-3h4l2 3",
      truck: "M3 15V8h11v7H3zM14 11h5l3 4v0h-8zM7 18a2 2 0 11.001-4A2 2 0 017 18zM18 18a2 2 0 11.001-4A2 2 0 0118 18z",
      box: "M3 8l9-4 9 4-9 4zM3 8v8l9 4 9-4V8",
      vendor: "M4 10l8-6 8 6v10H4zM9 20v-6h6v6",
      permit: "M7 3h8l4 4v14H7zM9 13l2 2 5-5",
      house: "M3 11l9-7 9 7v9H3z",
      wrench: "M14 6a4 4 0 115 5L10 20H6v-4z",
      incident: "M12 3l9 16H3z",
      dump: "M5 10h14l-1 10H6zM9 10V7h6v3",
      invoice: "M7 3h10v18l-3-2-2 2-2-2-3 2z",
      dollar: "M12 3v18M17 7a4 4 0 00-5-2 4 4 0 000 8 4 4 0 015 2 4 4 0 01-5 2",
      deposit: "M12 4v8m0 0l-3-3m3 3l3-3M5 16h14v4H5z",
      pipeline: "M4 10h6v4H4zM10 12h4M14 8h6v8h-6",
      receipt: "M7 3h10v18l-2-1-2 1-2-1-2 1-2-1z",
      cash: "M3 7h18v10H3zM12 14a2 2 0 100-4 2 2 0 000 4z",
      bill: "M5 5h14v14H5zM8 9h8",
      budget: "M4 18V8l4 3 4-6 4 5 4-3v11z",
      grant: "M6 20h12M8 20V10l4-4 4 4v10",
      tax: "M7 5h10v14H7zM10 9h4",
      prices: "M4 7h16M4 12h16M4 17h10",
      jobpost: "M6 6h12v4H6zM8 14h8v6H8z",
      resume: "M8 4h8v16H8zM11 8h2",
      interview: "M8 11a3 3 0 100-6 3 3 0 000 6zM4 20v-1a4 4 0 018 0M15 11l5 5M15 16l5-5",
      offer: "M4 8h16v12H4zM8 8V6h8v2",
      guide: "M5 5h8v14H5zM13 8h6v11h-6",
      hardhat: "M5 14h14v3H5zM7 14a5 5 0 0110 0",
      onboard: "M12 3l2 4 5 .5-3.5 3 1 5L12 13l-4.5 2.5 1-5L5 7.5 10 7z",
      pto: "M5 6h14v14H5zM8 11h2M12 11h2M16 11h1",
      contacts: "M12 11a4 4 0 100-8 4 4 0 000 8zM4 21v-1a6 6 0 0116 0v1",
      reminder: "M12 5a7 7 0 017 7v4l2 2H3l2-2v-4a7 7 0 017-7zM10 21h4",
      phone: "M7 3h10v18H7zM10 18h4",
      inbox: "M3 12l3-7h12l3 7v8H3zM3 12h6l1 3h4l1-3h6",
      welcome: "M4 12l8-8 8 8v8H4z",
      faq: "M9 8a3 3 0 116 1c0 2-3 2-3 4M12 17h.01",
      smile: "M12 21a9 9 0 110-18 9 9 0 010 18zM8 10h.01M16 10h.01M8 14c1.5 2 6.5 2 8 0",
      star: "M12 3l2.4 6.6L21 11l-5 4.2L17.5 22 12 18.6 6.5 22 8 15.2 3 11l6.6-1.4z",
      reply: "M8 9L3 14l5 5M3 14h11a5 5 0 000-10H12",
      issue: "M12 8v5M12 16h.01M12 3l9 16H3z",
      seasonal: "M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5M8 12a4 4 0 108 0 4 4 0 00-8 0z",
      customers: "M9 11a3 3 0 100-6 3 3 0 000 6zM17 12a3 3 0 100-6 3 3 0 000 6zM3 20v-1a5 5 0 0110 0M13 20v-1a4 4 0 014-4 4 4 0 014 4v1",
      storm: "M12 3l2 6h5l-8 12 2-7H8z",
      holiday: "M6 10c4-6 8 0 12-6v16H6z",
      pref: "M12 3l2 6h6l-5 4 2 7-5-3-5 3 2-7-5-4h6z"
    };
    return map[g] || map.spark;
  }

  function robotSVG(b) {
    const color = (b.div && b.div.color) || "#1A2744";
    const accent = (b.div && b.div.accent) || "#ffd27a";
    const h = Math.abs(hash(b.id)) % 360;
    const body = color;
    const g = glyphPath(b.glyph);
    const ant = (hash(b.id) % 3);
    const antenna = ant === 0
      ? `<line x1="24" y1="10" x2="24" y2="2" stroke="#201E21" stroke-width="2"/><circle cx="24" cy="1.5" r="2.4" fill="${accent}" stroke="#201E21" stroke-width="1.2"/>`
      : ant === 1
        ? `<line x1="18" y1="10" x2="14" y2="2" stroke="#201E21" stroke-width="2"/><line x1="30" y1="10" x2="34" y2="2" stroke="#201E21" stroke-width="2"/><circle cx="14" cy="1.6" r="2" fill="${accent}" stroke="#201E21" stroke-width="1.1"/><circle cx="34" cy="1.6" r="2" fill="${accent}" stroke="#201E21" stroke-width="1.1"/>`
        : `<line x1="24" y1="10" x2="24" y2="3" stroke="#201E21" stroke-width="2"/><rect x="21" y="0" width="6" height="4" rx="1" fill="${accent}" stroke="#201E21" stroke-width="1.1"/>`;
    return `<svg viewBox="0 0 48 48" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${antenna}
      <rect x="8" y="10" width="32" height="28" rx="8" fill="${body}" stroke="#201E21" stroke-width="2"/>
      <rect x="12" y="15" width="24" height="14" rx="4" fill="#E8F6FF" stroke="#201E21" stroke-width="1.4"/>
      <g transform="translate(12 15) scale(.5)" fill="none" stroke="#201E21" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${g}"/></g>
      <rect x="16" y="31" width="16" height="3.5" rx="1.5" fill="${accent}"/>
      <rect x="2" y="20" width="6" height="10" rx="3" fill="${body}" stroke="#201E21" stroke-width="1.6"/>
      <rect x="40" y="20" width="6" height="10" rx="3" fill="${body}" stroke="#201E21" stroke-width="1.6"/>
    </svg>`;
  }
  function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

  /* ---------- render world ---------- */
  const world = $("#world");
  const stage = $("#stage");
  const app = $("#app");

  function delayStyle(i, base) { return `--d:${Math.min((base || 0) + i * 0.03, 1.15).toFixed(3)}s`; }

  function renderWorld() {
    const c = DATA.counts;
    const ticks = `<div class="ticks">
      <span><b>${c.divisions}</b> ${esc(t("ticker.divs"))}</span>
      <span><b>${c.departments}</b> ${esc(t("ticker.depts"))}</span>
      <span><b>${c.bots}</b> ${esc(t("ticker.bots"))}</span>
    </div>`;
    let crew = CREW.map((p, i) => `
      <article class="person-card crew pop" data-hub="crew-${i + 1}" style="${delayStyle(i, 0.55)}">
        <div class="fig">${personSVG(p)}</div>
        <h3>${esc(t("crew").replace("{n}", String(i + 1)))}</h3>
      </article>`).join("");
    let divs = DATA.divisions.map((dv, di) => {
      const depts = dv.depts.map((dp) => {
        const bots = dp.bots.map((b) => `
          <button type="button" class="bot-card pop" data-bot="${b.id}" style="${delayStyle(di * 8 + dp.bots.indexOf(b), 1.1)}">
            <div class="ico">${robotSVG(b)}</div>
            <div><div class="t">${esc(tt(b.t))}</div><div class="d">${esc(tt(b.d))}</div></div>
          </button>`).join("");
        return `<section class="dept" data-dept="${dp.id}">
          <h3>${esc(tt(dp.t))} <span class="n">${dp.bots.length}</span></h3>
          <div class="bots">${bots}</div>
        </section>`;
      }).join("");
      return `<section class="div-panel pop" data-div="${dv.id}" style="${delayStyle(di, 0.9)};--div:${dv.color}">
        <div class="div-head" style="background:${dv.color}" data-div-head="${dv.id}">
          <h2>${esc(tt(dv.t))}</h2>
          <p>${esc(tt(dv.blurb))}</p>
        </div>
        <div class="div-body">${depts}</div>
      </section>`;
    }).join("");

    world.innerHTML = `
      <div class="world-bg" aria-hidden="true">
        <svg viewBox="0 0 2880 700" width="2880" height="700" style="position:absolute;left:0;top:0;width:100%;height:420px" preserveAspectRatio="none">
          <rect width="2880" height="900" fill="#f6efe2"/>
          <path d="M0 260 L180 140 L360 210 L520 90 L760 200 L980 70 L1220 190 L1480 50 L1760 180 L2040 80 L2320 170 L2580 60 L2880 150 V700 H0Z" fill="#c9b48a"/>
          <path d="M0 340 L220 230 L480 310 L700 180 L1020 300 L1300 160 L1600 290 L1980 150 L2300 280 L2600 170 L2880 260 V700 H0Z" fill="#b89a68"/>
          <path d="M0 700 V480 Q720 400 1440 460 T2880 420 V700Z" fill="#e8d7b0"/>
        </svg>
      </div>
      <svg class="connectors" id="connectors"></svg>
      <div class="world-inner">
        <div class="hero-band pop" style="${delayStyle(0, 0)}">
          <div class="logo-row"><img src="logo-240.png" width="96" height="96" alt="Trejo Landscaping LLC logo"></div>
          <h1>${esc(t("headline"))}<br><em>${esc(t("headline.stat"))}</em></h1>
          <p class="sub">${esc(t("sub"))}</p>
          ${ticks}
        </div>
        <div class="richi-wrap" id="hub-richi">
          <article class="person-card richi pop" id="richi-card" style="${delayStyle(0, 0.2)}">
            <div class="fig">${personSVG(RICHI)}</div>
            <h3>${esc(t("richi.name"))}</h3>
            <div class="role">${esc(t("richi.role"))}</div>
            <div class="duty">${esc(t("richi.duty"))}</div>
          </article>
          <div class="badge-ok pop" id="badge-ok" style="${delayStyle(0, 0.35)}"><span class="dot"></span><span>${esc(t("approves"))}</span></div>
          <p class="badge-long pop" style="${delayStyle(0, 0.4)}">${esc(t("approves.long"))}</p>
        </div>
        <section class="field-sec" id="hub-field">
          <div class="sec-head pop" style="${delayStyle(0, 0.5)}">
            <h2>${esc(t("field"))}</h2>
            <p>${esc(t("field.sub"))}</p>
          </div>
          <div class="crew-row">${crew}</div>
        </section>
        <section class="office-sec" id="hub-office">
          <div class="sec-head pop" style="${delayStyle(0, 0.85)}">
            <h2>${esc(t("office"))}</h2>
            <p>${esc(t("office.sub"))}</p>
          </div>
          <div class="hq">${divs}</div>
        </section>
        <p class="legal-note">${esc(t("legal.note"))}</p>
        <p class="foot">${esc(t("foot"))}</p>
      </div>`;
    drawConnectors();
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function worldOffset(el) {
    const wr = world.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const s = cam.s || 1;
    return { x: (r.left - wr.left) / s, y: (r.top - wr.top) / s, w: r.width / s, h: r.height / s };
  }

  function drawConnectors() {
    const svg = $("#connectors");
    if (!svg) return;
    const richi = $("#richi-card");
    const field = $("#hub-field");
    const office = $("#hub-office");
    if (!richi || !field || !office) return;
    const a = worldOffset(richi), f = worldOffset(field), o = worldOffset(office);
    const x1 = a.x + a.w / 2, y1 = a.y + a.h;
    const fx = f.x + f.w / 2, fy = f.y;
    const ox = o.x + o.w / 2, oy = o.y;
    const midY = (y1 + Math.min(fy, oy)) / 2;
    const parts = [];
    const path = (d, delay) => `<path class="draw" pathLength="1" style="--d:${delay}s" d="${d}" fill="none" stroke="#201E21" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 10"/>`;
    parts.push(path(`M${x1} ${y1} V${midY}`, 0.4));
    parts.push(path(`M${x1} ${midY} L${fx} ${midY} V${fy}`, 0.5));
    parts.push(path(`M${x1} ${midY} L${ox} ${midY} V${oy}`, 0.55));
    $$(".div-panel").forEach((p, i) => {
      const r = worldOffset(p);
      const px = r.x + r.w / 2, py = r.y;
      parts.push(path(`M${ox} ${oy} L${ox} ${(oy + py) / 2} L${px} ${(oy + py) / 2} V${py}`, 0.7 + i * 0.05));
    });
    svg.setAttribute("viewBox", `0 0 ${world.scrollWidth} ${world.scrollHeight}`);
    svg.style.width = world.scrollWidth + "px";
    svg.style.height = world.scrollHeight + "px";
    svg.innerHTML = parts.join("");
  }

  /* ---------- list view ---------- */
  function renderList() {
    const q = ($("#q").value || "").trim().toLowerCase();
    const box = $("#listview");
    let html = "";
    let n = 0;
    DATA.divisions.forEach((dv) => {
      const depts = dv.depts.map((dp) => {
        const bots = dp.bots.filter((b) => matchBot(b, q));
        if (!bots.length && q && !tt(dp.t).toLowerCase().includes(q) && !tt(dv.t).toLowerCase().includes(q)) return "";
        n += bots.length;
        return `<div class="l-dept" data-dept="${dp.id}">
          <h3>${esc(tt(dp.t))} · ${bots.length}</h3>
          ${bots.map((b) => `<button type="button" class="l-bot" data-bot="${b.id}">
            <div class="ico">${robotSVG(b)}</div>
            <div><b>${esc(tt(b.t))}</b><span>${esc(tt(b.d))}</span></div>
          </button>`).join("")}
        </div>`;
      }).join("");
      if (!depts && q) return;
      html += `<details class="l-div" open>
        <summary style="background:${dv.color}">${esc(tt(dv.t))}<span>${dv.depts.reduce((s, d) => s + d.bots.length, 0)}</span></summary>
        <div class="l-body">${depts}</div>
      </details>`;
    });
    box.innerHTML = html || `<p class="l-empty">${esc(t("empty"))}</p>`;
    updateTicker(q ? n : null);
  }

  function matchBot(b, q) {
    if (!q) return true;
    const blob = [tt(b.t), tt(b.d), tt(b.s), tt(b.dept.t), tt(b.div.t), b.glyph].join(" ").toLowerCase();
    return blob.indexOf(q) !== -1;
  }

  function filterChart() {
    const q = ($("#q").value || "").trim().toLowerCase();
    if (!q) {
      $$(".bot-card,.dept,.div-panel,.person-card").forEach((el) => el.classList.remove("match", "dim"));
      updateTicker(null);
      return;
    }
    let n = 0;
    $$(".bot-card").forEach((el) => {
      const ok = matchBot(BOT[el.dataset.bot], q);
      el.classList.toggle("match", ok);
      el.classList.toggle("dim", !ok);
      if (ok) n++;
    });
    $$(".dept").forEach((el) => {
      const has = !!el.querySelector(".bot-card.match") || tt(DEPT[el.dataset.dept].t).toLowerCase().includes(q);
      el.classList.toggle("match", has);
      el.classList.toggle("dim", !has);
    });
    $$(".div-panel").forEach((el) => {
      const has = !!el.querySelector(".bot-card.match") || tt(DIV[el.dataset.div].t).toLowerCase().includes(q);
      el.classList.toggle("match", has);
      el.classList.toggle("dim", !has);
    });
    updateTicker(n);
  }

  function updateTicker(shown) {
    const c = DATA.counts;
    const extra = shown != null ? ` <span class="sep">·</span> ${esc(t("ticker.showing").replace("{n}", String(shown)))}` : "";
    $("#ticker").innerHTML = `<span><b>${c.divisions}</b> ${esc(t("ticker.divs"))}</span>
      <span><b>${c.departments}</b> ${esc(t("ticker.depts"))}</span>
      <span><b>${c.bots}</b> ${esc(t("ticker.bots"))}</span>${extra}`;
  }

  /* ---------- i18n apply (rebuild world text via render) ---------- */
  function applyLang(keepCam) {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    const desc = $("meta[name=description]"); if (desc) desc.setAttribute("content", t("meta.desc"));
    $$("[data-ui]").forEach((el) => { el.textContent = t(el.getAttribute("data-ui")); });
    $$("[data-ui-ph]").forEach((el) => { el.setAttribute("placeholder", t(el.getAttribute("data-ui-ph"))); });
    $$("[data-ui-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.getAttribute("data-ui-aria"))); });
    $$("[data-ui-title]").forEach((el) => { el.setAttribute("title", t(el.getAttribute("data-ui-title"))); });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)));
    const snap = keepCam ? { x: cam.x, y: cam.y, s: cam.s } : null;
    renderWorld();
    renderList();
    updateTicker(($("#q").value || "").trim() ? 0 : null);
    filterChart();
    if (!keepCam) fitAll(false);
    else { cam.x = snap.x; cam.y = snap.y; cam.s = snap.s; applyCam(); }
    if (!exportMode && !shotMode && !reduced) armIntro(false);
    else world.classList.add("play");
  }

  function setLang(l, push) {
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    if (push) {
      const u = new URL(location.href);
      u.searchParams.set("lang", l);
      history.replaceState(null, "", u);
    }
    applyLang(true);
  }

  /* ---------- camera / zoom ---------- */
  const cam = { x: 0, y: 0, s: 1 };
  let worldW = 2880, worldH = 2000;
  let movingTimer = 0;
  let animating = false;

  function measure() {
    worldW = world.scrollWidth || 2880;
    worldH = world.scrollHeight || 2000;
  }
  function stageSize() { return { w: stage.clientWidth, h: stage.clientHeight }; }
  function minScale() {
    const { w, h } = stageSize();
    if (!w || !h) return 0.1;
    return Math.min((w - 16) / worldW, (h - 16) / worldH);
  }
  function markMoving() {
    world.classList.add("moving");
    clearTimeout(movingTimer);
    movingTimer = setTimeout(() => world.classList.remove("moving"), 160);
  }
  function applyCam() {
    world.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`;
    const zl = $("#z-level");
    if (zl) zl.textContent = Math.round(cam.s * 100) + "%";
    drawMinimap();
  }
  function zoomAt(cx, cy, nextS) {
    const lo = Math.max(minScale() * 0.85, 0.04), hi = 3.2;
    nextS = clamp(nextS, lo, hi);
    const wx = (cx - cam.x) / cam.s, wy = (cy - cam.y) / cam.s;
    cam.s = nextS;
    cam.x = cx - wx * cam.s;
    cam.y = cy - wy * cam.s;
  }
  function setCam(x, y, s, animate) {
    s = clamp(s, Math.max(minScale() * 0.85, 0.04), 3.2);
    if (!animate || reduced || exportMode) { cam.x = x; cam.y = y; cam.s = s; applyCam(); return Promise.resolve(); }
    return animateCam(x, y, s);
  }
  function animateCam(x, y, s) {
    return new Promise((resolve) => {
      animating = true;
      markMoving();
      const x0 = cam.x, y0 = cam.y, s0 = cam.s, t0 = performance.now(), dur = 480;
      const ease = (u) => 1 - Math.pow(1 - u, 3);
      function tick(now) {
        const u = clamp((now - t0) / dur, 0, 1), e = ease(u);
        cam.x = x0 + (x - x0) * e; cam.y = y0 + (y - y0) * e; cam.s = s0 + (s - s0) * e;
        applyCam();
        if (u < 1) requestAnimationFrame(tick);
        else { animating = false; world.classList.remove("moving"); resolve(); }
      }
      requestAnimationFrame(tick);
    });
  }
  function fitAll(animate) {
    measure();
    const { w, h } = stageSize();
    const pad = 20;
    const s = Math.min((w - pad * 2) / worldW, (h - pad * 2) / worldH);
    const x = (w - worldW * s) / 2;
    const y = (h - worldH * s) / 2;
    return setCam(x, y, s, animate);
  }
  function flyTo(el, animate, pad) {
    if (!el) return fitAll(animate);
    measure();
    const { w, h } = stageSize();
    const r = worldOffset(el);
    const p = pad == null ? 0.86 : pad;
    const nextS = Math.min((w * p) / Math.max(r.w, 40), (h * p) / Math.max(r.h, 40), 3.2);
    const x = w / 2 - (r.x + r.w / 2) * nextS;
    const y = h / 2 - (r.y + r.h / 2) * nextS;
    return setCam(x, y, nextS, animate !== false);
  }
  window.__orgFitAll = () => fitAll(false);
  window.__orgFlyTo = (sel) => flyTo($(sel), false);
  window.__orgZoomAt = (cx, cy, s) => { zoomAt(cx, cy, s); applyCam(); };
  window.__orgCam = cam;

  /* minimap */
  function drawMinimap() {
    const c = $("#mm"); if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#f6efe2"; ctx.fillRect(0, 0, W, H);
    const sx = W / worldW, sy = H / worldH, k = Math.min(sx, sy);
    const ox = (W - worldW * k) / 2, oy = (H - worldH * k) / 2;
    ctx.fillStyle = "#e8d7b0"; ctx.fillRect(ox, oy, worldW * k, worldH * k);
    $$(".div-panel").forEach((p) => {
      const r = worldOffset(p);
      ctx.fillStyle = (DIV[p.dataset.div] && DIV[p.dataset.div].color) || "#1A2744";
      ctx.fillRect(ox + r.x * k, oy + r.y * k, r.w * k, r.h * k);
    });
    const richi = $("#richi-card");
    if (richi) {
      const r = worldOffset(richi);
      ctx.fillStyle = "#c8202a";
      ctx.fillRect(ox + r.x * k, oy + r.y * k, r.w * k, r.h * k);
    }
    const { w, h } = stageSize();
    const vx = (0 - cam.x) / cam.s, vy = (0 - cam.y) / cam.s, vw = w / cam.s, vh = h / cam.s;
    ctx.strokeStyle = "#c8202a"; ctx.lineWidth = 2;
    ctx.strokeRect(ox + vx * k, oy + vy * k, vw * k, vh * k);
    c._k = k; c._ox = ox; c._oy = oy;
  }
  function minimapToCam(mx, my) {
    const c = $("#mm");
    const k = c._k || (c.width / worldW), ox = c._ox || 0, oy = c._oy || 0;
    const wx = (mx - ox) / k, wy = (my - oy) / k;
    const { w, h } = stageSize();
    cam.x = w / 2 - wx * cam.s;
    cam.y = h / 2 - wy * cam.s;
    applyCam();
  }

  /* ---------- gestures ---------- */
  const pointers = new Map();
  let pan0 = null, pinch0 = null, didPan = false, lastTap = 0, lastTapX = 0, lastTapY = 0;

  function stagePt(e) {
    const r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  stage.addEventListener("wheel", (e) => {
    if (app.classList.contains("list")) return;
    e.preventDefault();
    markMoving();
    const p = stagePt(e);
    const factor = Math.exp(-e.deltaY * 0.00125);
    zoomAt(p.x, p.y, cam.s * factor);
    applyCam();
  }, { passive: false });

  stage.addEventListener("pointerdown", (e) => {
    if (app.classList.contains("list")) return;
    if (e.target.closest(".zoombar, .minimap, .chrome")) return;
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    didPan = false;
    if (pointers.size === 1) {
      pan0 = { x: cam.x, y: cam.y, px: e.clientX, py: e.clientY };
    } else if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      const dx = pts[1].x - pts[0].x, dy = pts[1].y - pts[0].y;
      const mid = stagePt({ clientX: (pts[0].x + pts[1].x) / 2, clientY: (pts[0].y + pts[1].y) / 2 });
      pinch0 = { dist: Math.hypot(dx, dy) || 1, s: cam.s, mid };
      pan0 = null;
    }
  });
  stage.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinch0) {
      const pts = Array.from(pointers.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y) || 1;
      markMoving();
      const mid = stagePt({ clientX: (pts[0].x + pts[1].x) / 2, clientY: (pts[0].y + pts[1].y) / 2 });
      zoomAt(mid.x, mid.y, pinch0.s * (dist / pinch0.dist));
      applyCam();
      didPan = true;
      return;
    }
    if (pan0 && pointers.size === 1) {
      const dx = e.clientX - pan0.px, dy = e.clientY - pan0.py;
      if (Math.hypot(dx, dy) > 4) {
        didPan = true;
        stage.classList.add("panning");
        markMoving();
        cam.x = pan0.x + dx; cam.y = pan0.y + dy;
        applyCam();
      }
    }
  });
  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch0 = null;
    if (pointers.size === 0) {
      stage.classList.remove("panning");
      pan0 = null;
    }
  }
  stage.addEventListener("pointerup", (e) => {
    const p = stagePt(e);
    const wasPan = didPan;
    endPointer(e);
    if (wasPan) return;
    if (e.target.closest(".zoombar, .minimap")) return;
    const now = performance.now();
    if (now - lastTap < 320 && Math.hypot(p.x - lastTapX, p.y - lastTapY) < 28) {
      lastTap = 0;
      markMoving();
      zoomAt(p.x, p.y, cam.s * 1.7);
      applyCam();
      return;
    }
    lastTap = now; lastTapX = p.x; lastTapY = p.y;
    handleTap(e);
  });
  stage.addEventListener("pointercancel", endPointer);

  function handleTap(e) {
    const bot = e.target.closest("[data-bot]");
    if (bot) {
      const el = bot;
      const r = el.getBoundingClientRect();
      if (r.height < 36) { flyTo(el.closest(".dept") || el, true); return; }
      openModal(bot.dataset.bot);
      return;
    }
    const dept = e.target.closest("[data-dept]");
    if (dept) { flyTo(dept, true); return; }
    const divH = e.target.closest("[data-div-head], [data-div]");
    if (divH) { flyTo(divH.closest(".div-panel") || divH, true); return; }
  }

  /* buttons */
  $("#z-in").addEventListener("click", () => { const { w, h } = stageSize(); markMoving(); zoomAt(w / 2, h / 2, cam.s * 1.3); applyCam(); });
  $("#z-out").addEventListener("click", () => { const { w, h } = stageSize(); markMoving(); zoomAt(w / 2, h / 2, cam.s / 1.3); applyCam(); });
  $("#z-fit").addEventListener("click", () => fitAll(true));
  $("#z-richi").addEventListener("click", () => flyTo($("#hub-richi"), true, 0.7));
  $("#z-replay").addEventListener("click", () => { fitAll(true); armIntro(true); });
  $("#brandlink").addEventListener("click", (e) => { e.preventDefault(); flyTo($("#hub-richi"), true, 0.7); });

  const mm = $("#minimap");
  function mmPos(e) {
    const r = $("#mm").getBoundingClientRect();
    const scaleX = $("#mm").width / r.width, scaleY = $("#mm").height / r.height;
    return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY };
  }
  mm.addEventListener("pointerdown", (e) => { e.stopPropagation(); mm.setPointerCapture(e.pointerId); const p = mmPos(e); minimapToCam(p.x, p.y); });
  mm.addEventListener("pointermove", (e) => { if (e.buttons) { const p = mmPos(e); minimapToCam(p.x, p.y); } });

  /* view toggle */
  function setView(mode) {
    const list = mode === "list";
    app.classList.toggle("list", list);
    $("#btn-chart").setAttribute("aria-pressed", String(!list));
    $("#btn-list").setAttribute("aria-pressed", String(list));
    if (!list) { measure(); applyCam(); }
  }
  $("#btn-chart").addEventListener("click", () => setView("chart"));
  $("#btn-list").addEventListener("click", () => setView("list"));

  /* search */
  $("#q").addEventListener("input", () => { filterChart(); renderList(); });
  $("#qclear").addEventListener("click", () => { $("#q").value = ""; filterChart(); renderList(); $("#q").focus(); });

  /* lang */
  $$(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.getAttribute("data-lang"), true)));

  /* modal */
  function openModal(id) {
    const b = BOT[id]; if (!b) return;
    $("#mico").innerHTML = robotSVG(b);
    $("#mtitle").textContent = tt(b.t);
    $("#mmeta").textContent = tt(b.div.t) + " · " + tt(b.dept.t);
    $("#mduty").textContent = tt(b.d);
    $("#mbody").textContent = tt(b.s);
    $("#modal").hidden = false;
    $("#mclose").focus();
  }
  function closeModal() { $("#modal").hidden = true; }
  $("#mclose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
  $("#listview").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-bot]");
    if (btn) openModal(btn.dataset.bot);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (e.key === "+" || e.key === "=") { const { w, h } = stageSize(); zoomAt(w / 2, h / 2, cam.s * 1.3); applyCam(); }
    if (e.key === "-" || e.key === "_") { const { w, h } = stageSize(); zoomAt(w / 2, h / 2, cam.s / 1.3); applyCam(); }
    if (e.key === "0") fitAll(true);
  });

  function armIntro(force) {
    world.classList.remove("anim", "play");
    if (exportMode || shotMode || (reduced && !force)) { world.classList.add("play"); return; }
    void world.offsetWidth;
    world.classList.add("anim");
    requestAnimationFrame(() => world.classList.add("play"));
  }

  /* resize */
  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => { measure(); drawConnectors(); drawMinimap(); }, 120);
  });

  if (posterMode) document.documentElement.classList.add("export");

  /* boot */
  applyLang(false);
  measure();
  fitAll(false);
  if (!exportMode && !shotMode && !reduced) armIntro(false);
  setTimeout(() => { measure(); drawConnectors(); fitAll(false); drawMinimap(); }, 60);
  setTimeout(() => { const h = $("#hint"); if (h && !exportMode) h.style.opacity = "1"; }, 800);
  setTimeout(() => { const h = $("#hint"); if (h) h.style.transition = "opacity .6s"; h && (h.style.opacity = "0"); }, 6000);

  window.__orgOpen = openModal;
  window.__orgSetView = setView;
})();
