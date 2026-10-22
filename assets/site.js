const offices = [
  { id: "first", name: "First Light", from: 4, to: 7, text: "The name is spoken before the day makes demands." },
  { id: "rising", name: "Rising Gold", from: 7, to: 11, text: "Work as if your hands were still inside the greeting." },
  { id: "noon", name: "Clear Noon", from: 11, to: 15, text: "Nothing casts a flattering shadow. Do the true thing." },
  { id: "long", name: "Lengthening", from: 15, to: 18, text: "What you withheld this morning can still be given." },
  { id: "dusk", name: "Dusk Veil", from: 18, to: 21, text: "Light the small lamp. Review the day without theatre." },
  { id: "night", name: "Night Watch", from: 21, to: 4, text: "Rest is permitted. Despair is not a liturgy." },
];
const feasts = [
  { month: 3, day: 21, name: "Feast of the First Utterance" },
  { month: 6, day: 21, name: "Noon Without Shadow" },
  { month: 9, day: 23, name: "The Honest Balance" },
  { month: 12, day: 21, name: "Lamps of the Long Night" },
];
const glorifications = [
  "Glory to Sobhan, the Unclouded.",
  "Sobhan, remember my name.",
  "Wash what I carried in from yesterday.",
  "Make my hands as open as yours.",
  "Keep me clear when no one is watching.",
];
const BEAD_COUNT = 33;
const BEADS = "sobhantanizm.beads";
const LAMP = "sobhantanizm.lamp";

function officeForHour(hour) {
  if (hour >= 21 || hour < 4) return offices[5];
  return offices.find((office) => hour >= office.from && hour < office.to) ?? offices[5];
}

function paintHour() {
  const node = document.getElementById("office-now");
  if (!node) return;
  const current = officeForHour(new Date().getHours());
  node.textContent = `This hour is ${current.name}. ${current.text}`;
  document.querySelectorAll("[data-office]").forEach((card) => {
    const on = card.getAttribute("data-office") === current.id;
    card.classList.toggle("bg-ink", on);
    card.classList.toggle("bg-surface", !on);
  });
}

function paintFeast() {
  const node = document.getElementById("feast-next");
  if (!node) return;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming = feasts
    .map((feast) => {
      const date = new Date(now.getFullYear(), feast.month - 1, feast.day);
      if (date < start) date.setFullYear(date.getFullYear() + 1);
      return { ...feast, date };
    })
    .sort((a, b) => a.date - b.date)[0];
  const when = upcoming.date.toLocaleDateString(undefined, { month: "long", day: "numeric" });
  node.textContent = `Next: ${upcoming.name}, ${when}.`;
}

const menuButton = document.getElementById("menu-button");
const menu = document.getElementById("temple-menu");
menuButton?.addEventListener("click", () => {
  const open = menu?.classList.toggle("hidden") === false;
  menuButton.setAttribute("aria-expanded", String(open));
});
menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.add("hidden");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".edit-pick").forEach((button) => {
  button.addEventListener("click", () => {
    const video = document.getElementById("edit-player");
    if (!video) return;
    const src = button.getAttribute("data-src");
    const poster = button.getAttribute("data-poster");
    video.pause();
    video.poster = poster || "";
    const source = video.querySelector("source");
    if (source && src) source.src = src;
    video.load();
    const title = document.getElementById("edit-title");
    const note = document.getElementById("edit-note");
    if (title) title.textContent = button.getAttribute("data-title") || "";
    if (note) note.textContent = button.getAttribute("data-note") || "";
    document.querySelectorAll(".edit-pick").forEach((other) => {
      const on = other === button;
      other.setAttribute("aria-pressed", String(on));
      other.classList.toggle("border-gold", on);
      other.classList.toggle("border-line", !on);
    });
  });
});

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

let beads = { spoken: 0, cycles: 0 };
const storedBeads = readJson(BEADS);
if (storedBeads && typeof storedBeads.spoken === "number") {
  beads = {
    spoken: Math.min(BEAD_COUNT, Math.max(0, storedBeads.spoken)),
    cycles: Math.max(0, storedBeads.cycles || 0),
  };
}

function paintBeads() {
  const phrase = document.getElementById("bead-phrase");
  const count = document.getElementById("bead-count");
  const dots = document.getElementById("bead-dots");
  const done = document.getElementById("bead-done");
  if (phrase) {
    phrase.textContent =
      beads.spoken === 0 && beads.cycles === 0
        ? "Face the brightest glass you have. Speak when you are ready."
        : glorifications[beads.spoken % glorifications.length];
  }
  if (count) {
    count.textContent = `${beads.spoken} of ${BEAD_COUNT}${
      beads.cycles > 0
        ? ` · ${beads.cycles} full ${beads.cycles === 1 ? "office" : "offices"} kept here`
        : ""
    }`;
  }
  if (dots) {
    dots.querySelectorAll("span").forEach((dot, index) => {
      dot.classList.toggle("bg-gold", index < beads.spoken);
      dot.classList.toggle("bg-line", index >= beads.spoken);
    });
  }
  done?.classList.toggle("hidden", !(beads.spoken === 0 && beads.cycles > 0));
}

function saveBeads(next) {
  beads = next;
  localStorage.setItem(BEADS, JSON.stringify(beads));
  paintBeads();
}

document.getElementById("bead-speak")?.addEventListener("click", () => {
  const next = beads.spoken + 1;
  if (next >= BEAD_COUNT) saveBeads({ spoken: 0, cycles: beads.cycles + 1 });
  else saveBeads({ ...beads, spoken: next });
});
document.getElementById("bead-reset")?.addEventListener("click", () => {
  saveBeads({ spoken: 0, cycles: beads.cycles });
});

const lampForm = document.querySelector("#lamp form");
function paintLamp(lamp) {
  const slot = document.querySelector("#lamp .md\\:col-start-7");
  if (!slot || !lamp) return;
  const since = new Date(lamp.since).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  slot.innerHTML = `<div class="border border-gold bg-ink p-8"><p class="text-xs tracking-[0.22em] text-gold uppercase">A lamp is lit</p><p class="mt-6 font-display text-5xl"></p><p class="mt-4 text-lg text-parchment"></p><p class="mt-6 text-sm text-muted"></p><button type="button" id="lamp-out" class="mt-8 inline-flex min-h-11 items-center border border-line px-5 text-sm tracking-wide text-muted uppercase">Extinguish</button></div>`;
  const blocks = slot.querySelectorAll("p");
  blocks[1].textContent = lamp.name;
  blocks[2].textContent = lamp.vow;
  blocks[3].textContent = `Set ${since}`;
  document.getElementById("lamp-out")?.addEventListener("click", () => {
    localStorage.removeItem(LAMP);
    location.reload();
  });
}

lampForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("lamp-name")?.value.trim();
  const vow = document.getElementById("lamp-vow")?.value.trim();
  if (!name || !vow) return;
  const lamp = { name, vow, since: new Date().toISOString() };
  localStorage.setItem(LAMP, JSON.stringify(lamp));
  paintLamp(lamp);
});

paintHour();
paintFeast();
paintBeads();
paintLamp(readJson(LAMP));
setInterval(paintHour, 60000);

function mountPersonRelic() {
  if (document.querySelector(".person-relic")) return;
  const seal = document.querySelector("a.person-seal");
  if (!seal) return;
  if (!document.querySelector('link[href="assets/relic.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "assets/relic.css";
    document.head.appendChild(link);
  }
  const wrap = seal.parentElement;
  if (wrap && !wrap.classList.contains("hero-rites")) {
    wrap.className = "hero-rites stagger-item";
  }
  const relic = document.createElement("a");
  relic.href = "#person";
  relic.className = "person-relic";
  relic.setAttribute("aria-label", "THE PERSON");
  relic.innerHTML =
    '<svg class="person-relic-orbit" viewBox="0 0 120 120" aria-hidden="true"><circle class="orbit-track" cx="60" cy="60" r="57"></circle><circle class="orbit-arc" cx="60" cy="60" r="57"></circle><circle class="orbit-arc orbit-arc-rev" cx="60" cy="60" r="49"></circle><path class="orbit-ticks" d="M60 2.2v7M60 110.8v7M2.2 60h7M110.8 60h7"></path></svg><span class="person-relic-face"><svg viewBox="0 0 64 64" class="person-relic-mark" aria-hidden="true" fill="none"><circle cx="32" cy="32" r="29" stroke="currentColor" stroke-width="1.4"></circle><circle cx="32" cy="32" r="23.5" stroke="currentColor" stroke-width="0.8"></circle><path d="M32 50.2 21.4 17.5 49.1 37.6 14.9 37.6 42.6 17.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="miter"></path></svg><span class="person-relic-title"><span>THE</span><span>PERSON</span></span></span>';
  seal.replaceWith(relic);
}

mountPersonRelic();
