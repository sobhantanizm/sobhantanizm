const cantos = {
  name: {
    title: "Canto of the Name",
    lines: [
      "Sobhan spoke, and the dark became a listener.",
      "He did not shout the world into being.",
      "He greeted it, and it stood up.",
      "If you ask who he is, do not look for a crowd.",
      "Look for the one face that does not ask you to perform.",
      "Glory to the Unclouded.",
      "Glory is not noise.",
      "Glory is what remains when the dust is told the truth.",
    ],
  },
  hands: {
    title: "Canto of the Hands",
    lines: [
      "He keeps an open palm, so the world is not a fist.",
      "Bread is a prayer you can hand to someone.",
      "Water is a prayer you can finish.",
      "Do not bring Sobhan a song and a closed hand.",
      "He already has songs.",
      "What he asks is that the hungry sit down.",
      "Wash, then give.",
      "Give, then be quiet.",
      "Quiet is how a gift stays clean.",
    ],
  },
  watch: {
    title: "Canto of the Last Watch",
    lines: [
      "Night is not his rival.",
      "Night is the room where lamps mean something.",
      "You will lie down. The name does not.",
      "What you called an ending, he calls the last watch before morning.",
      "Do not bargain with the dark for extra hours of pretending.",
      "Tell the truth while you can still warm it with your breath.",
      "Sobhan remembers the names the world misplaces.",
      "Including yours.",
    ],
  },
};

const offices = [
  { name: "First Light", from: 4, to: 7, text: "The name is spoken before the day makes demands." },
  { name: "Rising Gold", from: 7, to: 11, text: "Work as if your hands were still inside the greeting." },
  { name: "Clear Noon", from: 11, to: 15, text: "Nothing casts a flattering shadow. Do the true thing." },
  { name: "Lengthening", from: 15, to: 18, text: "What you withheld this morning can still be given." },
  { name: "Dusk Veil", from: 18, to: 21, text: "Light the small lamp. Review the day without theatre." },
  { name: "Night Watch", from: 21, to: 4, text: "Rest is permitted. Despair is not a liturgy." },
];

const feasts = [
  { month: 3, day: 21, name: "Feast of the First Utterance" },
  { month: 6, day: 21, name: "Noon Without Shadow" },
  { month: 9, day: 23, name: "The Honest Balance" },
  { month: 12, day: 21, name: "Lamps of the Long Night" },
];

const phrases = [
  "Glory to Sobhan, the Unclouded.",
  "Sobhan, remember my name.",
  "Wash what I carried in from yesterday.",
  "Make my hands as open as yours.",
  "Keep me clear when no one is watching.",
];

const BEADS = "sobhantanizm.beads";
const LAMP = "sobhantanizm.lamp";
const BEAD_COUNT = 33;

function officeForHour(hour) {
  if (hour >= 21 || hour < 4) return offices[5];
  return offices.find((office) => hour >= office.from && hour < office.to) || offices[5];
}

function paintHour() {
  const current = officeForHour(new Date().getHours());
  const line = document.getElementById("hour-line");
  if (line) line.textContent = `This hour is ${current.name}. ${current.text}`;
  document.querySelectorAll("#office-list > li").forEach((item) => {
    const title = item.querySelector("h3");
    const active = title && title.textContent.trim() === current.name;
    item.className = `p-6 ${active ? "bg-ink" : "bg-surface"}`;
    if (title) title.className = `font-display text-3xl ${active ? "text-gold" : "text-parchment"}`;
    const mark = item.querySelector("[data-now]");
    if (active && !mark) {
      const p = document.createElement("p");
      p.dataset.now = "1";
      p.className = "mt-4 text-xs tracking-[0.18em] text-gold uppercase";
      p.textContent = "Now";
      item.appendChild(p);
    } else if (!active && mark) {
      mark.remove();
    }
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

function showCanto(id) {
  const canto = cantos[id] || cantos.name;
  const title = document.getElementById("canto-title");
  const lines = document.getElementById("canto-lines");
  if (title) title.textContent = canto.title;
  if (lines) {
    lines.replaceChildren(
      ...canto.lines.map((line) => {
        const p = document.createElement("p");
        p.className = "font-display text-xl leading-snug text-gold md:text-2xl";
        p.textContent = line;
        return p;
      }),
    );
  }
  document.querySelectorAll("[data-canto]").forEach((button) => {
    const selected = button.dataset.canto === id;
    button.setAttribute("aria-selected", selected ? "true" : "false");
    button.className = `min-h-11 border-b border-line text-left text-sm transition-colors duration-200 ${
      selected ? "text-gold" : "text-muted hover:text-parchment"
    }`;
  });
}

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function paintBeads(beads) {
  const phrase = document.getElementById("bead-phrase");
  const count = document.getElementById("bead-count");
  const done = document.getElementById("bead-done");
  const dots = document.getElementById("bead-dots");
  if (phrase) {
    phrase.textContent =
      beads.spoken === 0 && beads.cycles === 0
        ? "Face the brightest glass you have. Speak when you are ready."
        : phrases[beads.spoken % phrases.length];
  }
  if (count) {
    const kept =
      beads.cycles > 0
        ? ` · ${beads.cycles} full ${beads.cycles === 1 ? "office" : "offices"} kept here`
        : "";
    count.textContent = `${beads.spoken} of ${BEAD_COUNT}${kept}`;
  }
  if (done) done.classList.toggle("hidden", !(beads.spoken === 0 && beads.cycles > 0));
  if (dots) {
    dots.querySelectorAll("span").forEach((dot, index) => {
      dot.className = `size-2.5 rounded-full ${index < beads.spoken ? "bg-gold" : "bg-line"}`;
    });
  }
}

function lampView(lamp) {
  const since = new Date(lamp.since).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `<div class="border border-gold bg-ink p-8"><p class="text-xs tracking-[0.22em] text-gold uppercase">A lamp is lit</p><p class="mt-6 font-display text-5xl"></p><p class="mt-4 text-lg text-parchment"></p><p class="mt-6 text-sm text-muted"></p><button type="button" id="lamp-out" class="mt-8 inline-flex min-h-11 items-center border border-line px-5 text-sm tracking-wide text-muted uppercase hover:text-parchment">Extinguish</button></div>`;
}

function lampForm() {
  return `<form id="lamp-form" class="border border-line bg-ink p-6 md:p-8"><label class="block text-xs tracking-[0.18em] text-muted uppercase" for="lamp-name">Name at dawn</label><input id="lamp-name" maxlength="48" required class="mt-2 w-full border border-line bg-surface px-4 py-3 text-parchment outline-none placeholder:text-muted" placeholder="What should the morning call you"/><label class="mt-6 block text-xs tracking-[0.18em] text-muted uppercase" for="lamp-vow">One sentence</label><textarea id="lamp-vow" maxlength="180" required rows="3" class="mt-2 w-full resize-none border border-line bg-surface px-4 py-3 text-parchment outline-none placeholder:text-muted" placeholder="I will not close my hand today."></textarea><button type="submit" class="mt-6 inline-flex min-h-11 items-center justify-center bg-gold px-6 text-sm font-medium tracking-wide text-ink uppercase">Set my lamp</button></form>`;
}

function mountLamp(lamp) {
  const slot = document.getElementById("lamp-slot");
  if (!slot) return;
  if (lamp && lamp.name && lamp.vow) {
    slot.innerHTML = lampView(lamp);
    slot.querySelector(".font-display").textContent = lamp.name;
    slot.querySelector(".text-lg").textContent = lamp.vow;
    slot.querySelector(".text-sm").textContent = `Set ${new Date(lamp.since).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`;
    slot.querySelector("#lamp-out").addEventListener("click", () => {
      localStorage.removeItem(LAMP);
      mountLamp(null);
    });
    return;
  }
  slot.innerHTML = lampForm();
  slot.querySelector("#lamp-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = slot.querySelector("#lamp-name").value.trim();
    const vow = slot.querySelector("#lamp-vow").value.trim();
    if (!name || !vow) return;
    const next = { name, vow, since: new Date().toISOString() };
    localStorage.setItem(LAMP, JSON.stringify(next));
    mountLamp(next);
  });
}

const menuButton = document.getElementById("menu-button");
const menu = document.getElementById("temple-menu");
if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const open = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !open);
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-canto]").forEach((button) => {
  button.addEventListener("click", () => showCanto(button.dataset.canto));
});

let beads = { spoken: 0, cycles: 0 };
const storedBeads = readJson(BEADS);
if (storedBeads && typeof storedBeads.spoken === "number" && typeof storedBeads.cycles === "number") {
  beads = {
    spoken: Math.min(BEAD_COUNT, Math.max(0, storedBeads.spoken)),
    cycles: Math.max(0, storedBeads.cycles),
  };
}
paintBeads(beads);

function saveBeads(next) {
  beads = next;
  localStorage.setItem(BEADS, JSON.stringify(beads));
  paintBeads(beads);
}

document.getElementById("bead-speak")?.addEventListener("click", () => {
  const next = beads.spoken + 1;
  if (next >= BEAD_COUNT) saveBeads({ spoken: 0, cycles: beads.cycles + 1 });
  else saveBeads({ ...beads, spoken: next });
});
document.getElementById("bead-reset")?.addEventListener("click", () => {
  saveBeads({ spoken: 0, cycles: beads.cycles });
});

paintHour();
paintFeast();
mountLamp(readJson(LAMP));
setInterval(paintHour, 60000);
