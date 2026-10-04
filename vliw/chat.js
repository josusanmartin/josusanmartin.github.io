"use strict";

const $ = (id) => document.getElementById(id);
const transcript = $("transcript");
const search = $("search");
const agent = $("agent");
const type = $("type");
const colors = Array.from({ length: 8 }, (_, index) => `var(--nick-${index})`);
let messages = [];
let nickColors = new Map();
let visible = [];

function setTheme(theme, save = false) {
  document.documentElement.dataset.theme = theme;
  const nextTheme = theme === "dark" ? "light" : "dark";
  $("theme-toggle").textContent = `${nextTheme === "light" ? "Light" : "Dark"} mode`;
  $("theme-toggle").setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  $("theme-toggle").hidden = false;
  document.querySelector('meta[name="theme-color"]').content = theme === "light" ? "#eef0eb" : "#191d1b";
  if (save) {
    try { localStorage.setItem("vliw-theme", theme); } catch (_) {}
  }
}

setTheme(document.documentElement.dataset.theme);
$("theme-toggle").addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
});

function parseLog(text) {
  let day = 0;
  let previous = 0;
  return text.split(/\r?\n/).filter(Boolean).map((line, index) => {
    const match = line.match(/^\[(\d{2}:\d{2}:\d{2})\] <([^>]+)> (.*)$/);
    if (!match) throw new Error(`Unrecognized log format at line ${index + 1}`);
    const [, time, nick, body] = match;
    const seconds = time.split(":").reduce((total, value) => total * 60 + Number(value), 0);
    if (seconds < previous - 43200) day++;
    previous = seconds;
    const tag = body.match(/^\[([A-Z]+)\]/)?.[1] || "UNTAGGED";
    return { id: index + 1, time, nick, body, tag, day, seconds: day * 86400 + seconds, searchable: `${time} ${nick} ${body}`.toLowerCase() };
  });
}

// Render source content as text; only explicit HTTP(S) URLs become links.
function appendText(parent, text, query) {
  if (!query) { parent.append(document.createTextNode(text)); return; }
  const lower = text.toLowerCase();
  let start = 0, hit;
  while ((hit = lower.indexOf(query, start)) !== -1) {
    parent.append(document.createTextNode(text.slice(start, hit)));
    const mark = document.createElement("mark");
    mark.textContent = text.slice(hit, hit + query.length);
    parent.append(mark);
    start = hit + query.length;
  }
  parent.append(document.createTextNode(text.slice(start)));
}

function bodyContent(parent, message, query) {
  let body = message.body;
  if (message.tag !== "UNTAGGED") {
    const tag = document.createElement("span");
    tag.className = `tag tag-${message.tag.toLowerCase()}`;
    appendText(tag, `[${message.tag}]`, query);
    parent.append(tag);
    body = body.slice(message.tag.length + 2);
  }
  const tokens = /https?:\/\/[^\s<>]+|@[a-z]\d{2}|@coord/g;
  let start = 0;
  for (const match of body.matchAll(tokens)) {
    appendText(parent, body.slice(start, match.index), query);
    const token = match[0];
    const element = document.createElement(token.startsWith("http") ? "a" : "span");
    if (element.tagName === "A") {
      element.href = token;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    } else element.className = "mention";
    appendText(element, token, query);
    parent.append(element);
    start = match.index + token.length;
  }
  appendText(parent, body.slice(start), query);
}

function render() {
  const query = search.value.trim().toLowerCase();
  visible = messages.filter((m) => (!agent.value || m.nick === agent.value) && (!type.value || m.tag === type.value) && (!query || m.searchable.includes(query)));
  const fragment = document.createDocumentFragment();
  let previousDay = -1;
  for (const m of visible) {
    if (m.day !== previousDay) {
      const divider = document.createElement("div");
      divider.className = "day-divider";
      divider.textContent = m.day === 0 ? "SESSION START" : `AFTER MIDNIGHT${m.day > 1 ? ` · DAY ${m.day + 1}` : ""}`;
      fragment.append(divider);
      previousDay = m.day;
    }
    const row = document.createElement("article");
    row.className = "message";
    row.id = `m${m.id}`;
    const timestamp = document.createElement("a");
    timestamp.className = "timestamp";
    timestamp.href = `#m${m.id}`;
    timestamp.title = `Permalink to message ${m.id}`;
    timestamp.setAttribute("aria-label", `Message ${m.id} at ${m.time}, permalink`);
    timestamp.textContent = m.time;
    const nick = document.createElement("button");
    nick.type = "button";
    nick.className = "nick";
    nick.style.setProperty("--nick", nickColors.get(m.nick));
    nick.title = `Filter messages by ${m.nick}`;
    nick.textContent = m.nick;
    nick.dataset.nick = m.nick;
    const body = document.createElement("p");
    body.className = "message-body";
    bodyContent(body, m, query);
    row.append(timestamp, nick, body);
    fragment.append(row);
  }
  $("messages").replaceChildren(fragment);
  const filtered = Boolean(query || agent.value || type.value);
  $("result-count").textContent = filtered ? `${visible.length.toLocaleString()} of ${messages.length.toLocaleString()} messages` : `${messages.length.toLocaleString()} messages · ${nickColors.size} agents`;
  $("reset").hidden = !filtered;
  $("empty").hidden = visible.length !== 0;
  $("first").disabled = $("latest").disabled = visible.length === 0;
  document.querySelectorAll(".participant").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.nick === agent.value)));
}

function applyFilters() { render(); transcript.scrollTop = 0; }
function clearFilters() { search.value = agent.value = type.value = ""; applyFilters(); }
function jumpToHash() {
  if (!/^#m\d+$/.test(location.hash)) return;
  const id = Number(location.hash.slice(2));
  if (!messages.some((m) => m.id === id)) return;
  if (!document.getElementById(`m${id}`)) clearFilters();
  document.getElementById(`m${id}`).scrollIntoView({ block: "center" });
}

$("filters").addEventListener("submit", (event) => event.preventDefault());
let debounce;
search.addEventListener("input", () => { clearTimeout(debounce); debounce = setTimeout(applyFilters, 120); });
agent.addEventListener("change", applyFilters);
type.addEventListener("change", applyFilters);
$("reset").addEventListener("click", clearFilters);
$("empty-reset").addEventListener("click", clearFilters);
$("all-agents").addEventListener("click", () => { agent.value = ""; applyFilters(); });
document.addEventListener("click", (event) => {
  const nick = event.target.closest("button[data-nick]");
  if (nick) { agent.value = agent.value === nick.dataset.nick ? "" : nick.dataset.nick; applyFilters(); }
});
$("first").addEventListener("click", () => { transcript.scrollTop = 0; });
$("latest").addEventListener("click", () => { transcript.scrollTop = transcript.scrollHeight; });
window.addEventListener("hashchange", jumpToHash);
document.addEventListener("keydown", (event) => {
  const editing = event.target.matches("input, select, textarea, [contenteditable]");
  if (event.key === "/" && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); search.focus(); }
  if (event.key === "Escape" && editing) { clearTimeout(debounce); clearFilters(); search.blur(); }
});

async function init() {
  try {
    const response = await fetch("./chat.log");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    messages = parseLog(await response.text());
    if (!messages.length) throw new Error("The archive is empty");
    const counts = new Map();
    messages.forEach((m) => counts.set(m.nick, (counts.get(m.nick) || 0) + 1));
    const nicks = [...counts.keys()].sort((a, b) => a === "coord" ? -1 : b === "coord" ? 1 : a.localeCompare(b));
    nickColors = new Map(nicks.map((nick, index) => [nick, colors[index % colors.length]]));
    nicks.forEach((nick) => {
      agent.add(new Option(nick, nick));
      const button = document.createElement("button");
      button.type = "button";
      button.className = "participant";
      button.dataset.nick = nick;
      button.style.setProperty("--nick", nickColors.get(nick));
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", `Filter by ${nick}, ${counts.get(nick)} messages`);
      const symbol = document.createElement("span");
      symbol.className = "participant-symbol";
      symbol.setAttribute("aria-hidden", "true");
      symbol.textContent = nick === "coord" ? "@" : "+";
      const name = document.createElement("span");
      name.textContent = nick;
      const count = document.createElement("span");
      count.className = "participant-count";
      count.textContent = counts.get(nick);
      button.append(symbol, name, count);
      $("nick-list").append(button);
    });
    [...new Set(messages.map((m) => m.tag))].sort().forEach((tag) => type.add(new Option(tag === "UNTAGGED" ? "Untagged" : tag, tag)));
    const first = messages[0], last = messages.at(-1);
    const duration = last.seconds - first.seconds;
    $("duration").textContent = `${Math.floor(duration / 3600)}h ${Math.floor(duration % 3600 / 60)}m`;
    $("channel-count").textContent = messages.length.toLocaleString();
    $("agent-count").textContent = nicks.length;
    $("reported-link").href = `#m${last.id}`;
    $("session-summary").textContent = `${first.time} → ${last.time}${last.day > 0 ? " (+1 day)" : ""} · timestamps as recorded`;
    $("notice").textContent = "*** #vliw archive opened. Session ended by the human after 864 cycles were reported. Select a timestamp to link to a message.";
    render();
    transcript.setAttribute("aria-busy", "false");
    jumpToHash();
  } catch (error) {
    $("notice").replaceChildren(document.createTextNode("Could not load the transcript. "));
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Retry";
    retry.addEventListener("click", () => location.reload());
    const raw = document.createElement("a");
    raw.href = "./chat.log";
    raw.textContent = "Read the raw log";
    $("notice").append(retry, document.createTextNode(" or "), raw, document.createTextNode("."));
    $("result-count").textContent = "Archive unavailable";
    transcript.setAttribute("aria-busy", "false");
    console.error("Archive load failed:", error.message);
  }
}
init();
