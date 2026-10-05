/*
 * app.js — fetches the 2026 season live from ESPN's public, CORS-enabled API.
 *
 * Endpoints used (no key required):
 *   /apis/site/v2/sports/football/college-football/teams/{id}/schedule
 *   /apis/site/v2/sports/football/college-football/teams/{id}
 *
 * We pull every MASCAC team's schedule, merge the games by ESPN event id, then
 * derive standings, the unified schedule and the player cards.
 */

const API = "https://site.api.espn.com/apis/site/v2/sports/football/college-football";

const TEAM_BY_ID = new Map(TEAMS.map((t) => [t.espnId, t]));
const LOGO_FALLBACK = new Map(TEAMS.map((t) => [t.espnId, `https://a.espncdn.com/i/teamlogos/ncaa/500/${t.espnId}.png`]));

let ALL_GAMES = [];
let STANDINGS = [];

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function getJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

function teamName(id, fallback) {
  const t = TEAM_BY_ID.get(id);
  return t ? t.name : fallback || "TBD";
}

function sideOf(competitor) {
  const team = competitor.team || {};
  const id = Number(team.id);
  return {
    id,
    name: teamName(id, team.shortDisplayName || team.displayName || team.name),
    full: team.displayName || team.name || "",
    logo: (team.logos && team.logos[0] && team.logos[0].href) || LOGO_FALLBACK.get(id) || "",
    score: competitor.score && competitor.score.value != null ? Number(competitor.score.value) : null,
    winner: !!competitor.winner,
    mascac: MASCAC_IDS.has(id),
  };
}

function normalizeEvent(ev) {
  const comp = (ev.competitions || [])[0];
  if (!comp) return null;
  const competitors = comp.competitors || [];
  const awayC = competitors.find((c) => c.homeAway === "away");
  const homeC = competitors.find((c) => c.homeAway === "home");
  if (!awayC || !homeC) return null;

  const status = (comp.status && comp.status.type) || (ev.status && ev.status.type) || {};
  const state = status.state || "pre";
  const name = status.name || "";
  const desc = status.description || "";
  const canceled = /CANCEL/i.test(name) || /cancel/i.test(desc);
  const postponed = /POSTPON/i.test(name) || /postpon/i.test(desc);
  const completed = !!status.completed && !canceled;

  const away = sideOf(awayC);
  const home = sideOf(homeC);

  return {
    id: String(ev.id || comp.id),
    date: new Date(comp.date || ev.date),
    away,
    home,
    state,
    completed,
    canceled,
    postponed,
    inProgress: state === "in",
    detail: status.shortDetail || status.detail || "",
    venue: (comp.venue && comp.venue.fullName) || "",
    conference: away.mascac && home.mascac,
  };
}

// ---- Loading --------------------------------------------------------------

async function loadSeason() {
  setStatus("Loading the 2026 season from ESPN…");

  const results = await Promise.allSettled(
    TEAMS.map((t) =>
      getJSON(`${API}/teams/${t.espnId}/schedule?season=${SEASON}`)
    )
  );

  const games = new Map();
  let ok = 0;
  const failures = [];

  results.forEach((r, i) => {
    if (r.status !== "fulfilled") {
      failures.push(TEAMS[i].name);
      return;
    }
    ok++;
    for (const ev of r.value.events || []) {
      const g = normalizeEvent(ev);
      if (g && !games.has(g.id)) games.set(g.id, g);
    }
  });

  ALL_GAMES = [...games.values()].sort((a, b) => a.date - b.date);
  STANDINGS = computeStandings(ALL_GAMES);

  render(ok, failures);
}

function setStatus(msg, isError) {
  const el = $("#status");
  el.textContent = msg || "";
  el.hidden = !msg;
  el.classList.toggle("error", !!isError);
}

// ---- Standings ------------------------------------------------------------

function computeStandings(games) {
  const rows = new Map(
    TEAMS.map((t) => [t.espnId, { team: t, confW: 0, confL: 0, ovW: 0, ovL: 0, pf: 0, pa: 0 }])
  );

  for (const g of games) {
    if (g.canceled || g.postponed || !g.completed) continue;
    for (const me of [g.away, g.home]) {
      const row = rows.get(me.id);
      if (!row) continue;
      const opp = me === g.away ? g.home : g.away;
      const win = me.score > opp.score;
      const tie = me.score === opp.score;
      if (!tie) {
        if (win) row.ovW++; else row.ovL++;
        if (g.conference) { if (win) row.confW++; else row.confL++; }
      }
      row.pf += me.score;
      row.pa += opp.score;
    }
  }

  const pct = (w, l) => {
    const gp = w + l;
    return gp ? w / gp : 0;
  };

  return [...rows.values()].sort((a, b) => {
    const c = pct(b.confW, b.confL) - pct(a.confW, a.confL);
    if (c) return c;
    const o = pct(b.ovW, b.ovL) - pct(a.ovW, a.ovL);
    if (o) return o;
    const d = (b.pf - b.pa) - (a.pf - a.pa);
    if (d) return d;
    return a.team.name.localeCompare(b.team.name);
  });
}

function pctStr(w, l) {
  const gp = w + l;
  if (!gp) return "—";
  return (w / gp).toFixed(3).replace(/^0/, "");
}

// ---- Rendering ------------------------------------------------------------

function render(ok, failures) {
  renderSummary();
  renderStandings();
  renderFilters();
  renderSchedule();
  renderPlayers();
  renderUpdated();

  if (failures.length) {
    setStatus(`Loaded ${ok} of ${TEAMS.length} team schedules. Could not load: ${failures.join(", ")}.`, true);
  } else {
    setStatus("");
  }
}

function renderUpdated() {
  $("#updated").textContent = `Updated ${new Date().toLocaleString()}`;
}

function renderSummary() {
  const played = ALL_GAMES.filter((g) => g.completed && !g.canceled).length;
  const upcoming = ALL_GAMES.filter((g) => !g.completed && !g.canceled && !g.postponed).length;
  const days = new Set(ALL_GAMES.map((g) => dayKey(g.date))).size;
  $("#stat-teams").textContent = TEAMS.length;
  $("#stat-played").textContent = played;
  $("#stat-upcoming").textContent = upcoming;
  $("#stat-weeks").textContent = days;
}

function renderStandings() {
  const body = $("#standings tbody");
  body.innerHTML = STANDINGS.map((r, i) => {
    const diff = r.pf - r.pa;
    const rankClass = i === 0 ? "lead rank-1" : "";
    return `<tr>
      <td class="col-rank ${rankClass}">${i + 1}</td>
      <td class="col-team">
        <span class="team-cell">
          <img src="${esc(r.team.espnId ? logoFor(r.team.espnId) : "")}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
          <span class="${i === 0 ? "lead" : ""}">${esc(r.team.name)}</span>
        </span>
      </td>
      <td class="${i === 0 ? "lead" : ""}">${r.confW}-${r.confL}</td>
      <td>${pctStr(r.confW, r.confL)}</td>
      <td>${r.ovW}-${r.ovL}</td>
      <td class="col-hide">${r.pf}</td>
      <td class="col-hide">${r.pa}</td>
      <td class="col-hide">${diff > 0 ? "+" : ""}${diff}</td>
    </tr>`;
  }).join("");
}

function logoFor(id) {
  return LOGO_FALLBACK.get(id) || "";
}

function renderFilters() {
  const sel = $("#team-filter");
  sel.innerHTML =
    `<option value="all">All teams</option>` +
    TEAMS.map((t) => `<option value="${t.espnId}">${esc(t.name)}</option>`).join("");
}

function dayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function applyFilters() {
  const team = $("#team-filter").value;
  const status = $("#status-filter").value;

  return ALL_GAMES.filter((g) => {
    if (team !== "all") {
      const id = Number(team);
      if (g.away.id !== id && g.home.id !== id) return false;
    }
    if (status === "completed" && !(g.completed || g.canceled)) return false;
    if (status === "upcoming" && (g.completed || g.canceled || g.postponed)) return false;
    if (status === "conference" && !g.conference) return false;
    return true;
  });
}

function renderSchedule() {
  const games = applyFilters();
  const list = $("#schedule-list");

  if (!games.length) {
    list.innerHTML = `<p class="empty">No games match this filter.</p>`;
    return;
  }

  const byDay = new Map();
  for (const g of games) {
    const k = dayKey(g.date);
    if (!byDay.has(k)) byDay.set(k, { date: g.date, games: [] });
    byDay.get(k).games.push(g);
  }

  const html = [...byDay.values()].map(({ date, games: dayGames }) => {
    const label = date.toLocaleDateString(undefined, {
      weekday: "long", month: "long", day: "numeric",
    });
    const rows = dayGames
      .sort((a, b) => a.date - b.date)
      .map(gameHTML)
      .join("");
    return `<div class="day"><div class="day-head">${esc(label)}</div>${rows}</div>`;
  }).join("");

  list.innerHTML = html;
}

function gameHTML(g) {
  const awayCls = g.completed ? (g.away.winner ? "winner" : "loser") : "";
  const homeCls = g.completed ? (g.home.winner ? "winner" : "loser") : "";

  let mid;
  if (g.completed) {
    mid = `<div class="score">${g.away.score}<span class="sep">–</span>${g.home.score}</div>
           <span class="status-badge final">Final</span>`;
  } else if (g.canceled) {
    mid = `<div class="canceled">Canceled</div>`;
  } else if (g.postponed) {
    mid = `<div class="canceled">Postponed</div>`;
  } else if (g.inProgress) {
    mid = `<div class="time">Live</div><span class="status-badge live">${esc(g.detail || "In progress")}</span>`;
  } else {
    mid = `<div class="time">${esc(fmtTime(g.date))}</div>
           <span class="status-badge">Scheduled</span>`;
  }

  const confTag = g.conference
    ? `<span class="conf-tag"><span class="conf-dot"></span>MASCAC</span>`
    : "";

  return `<div class="game">
    <div class="side ${awayCls}">
      <img src="${esc(g.away.logo)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
      <span class="who">
        <span class="name">${esc(g.away.name)}</span>
        <span class="tag">${g.away.mascac ? "" : "Non-conf."}</span>
      </span>
    </div>
    <div class="mid">${mid}${confTag}</div>
    <div class="side home ${homeCls}">
      <img src="${esc(g.home.logo)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
      <span class="who">
        <span class="name">${esc(g.home.name)}</span>
        <span class="tag">${g.home.mascac ? "" : "Non-conf."}</span>
      </span>
    </div>
  </div>`;
}

function fmtTime(d) {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function renderPlayers() {
  $("#players-asof").textContent = `One standout from every team · stats as of ${PLAYER_NOTES_AS_OF}.`;

  $("#players").innerHTML = TEAMS.map((t) => {
    const p = PLAYERS[t.espnId] || {};
    const row = STANDINGS.find((r) => r.team.espnId === t.espnId);
    const record = row ? `${row.ovW}-${row.ovL}` : "";
    return `<article class="player-card" style="--team:${esc(t.color || "#0b5d3b")}">
      <div class="top">
        <img src="${esc(logoFor(t.espnId))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
        <span>
          <span class="team-name">${esc(t.fullName || t.name)}</span><br>
          <span class="team-record">${record} overall</span>
        </span>
      </div>
      <h3>${esc(p.player || t.name)}</h3>
      <p class="pos">${esc(p.position || "")}</p>
      <p>${esc(p.note || "")}</p>
    </article>`;
  }).join("");
}

// ---- Wire up --------------------------------------------------------------

$("#team-filter").addEventListener("change", renderSchedule);
$("#status-filter").addEventListener("change", renderSchedule);
$("#refresh").addEventListener("click", async () => {
  const btn = $("#refresh");
  btn.disabled = true;
  try {
    await loadSeason();
  } catch (err) {
    setStatus("Could not reach ESPN. Check your connection and try Refresh.", true);
  } finally {
    btn.disabled = false;
  }
});

loadSeason().catch((err) => {
  console.error(err);
  setStatus("Could not reach ESPN. Check your connection and try Refresh.", true);
});
