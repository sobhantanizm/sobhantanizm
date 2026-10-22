import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Play, Radio, X } from "lucide-react";
import {
  cantos,
  creed,
  dawns,
  epithets,
  feasts,
  glorifications,
  nextFeast,
  officeForHour,
  offices,
  practices,
} from "@/lib/canon";
import { Emblem } from "@/components/emblem";

const KICK = "https://kick.com/sobhanrah";

const NAV = [
  { href: "#live", label: "Live" },
  { href: "#edits", label: "Edits" },
  { href: "#person", label: "The Person" },
  { href: "#dawns", label: "Seven Dawns" },
  { href: "#creed", label: "Creed" },
  { href: "#scripture", label: "Scripture" },
  { href: "#offices", label: "Offices" },
  { href: "#lamp", label: "The Lamp" },
] as const;

const EDITS = [
  {
    id: "whos-up",
    title: "Who's up",
    note: "A glitch loop. The same question, until the smile.",
    src: "/edits/whos-up.mp4",
    poster: "/edits/whos-up.jpg",
  },
  {
    id: "all-black",
    title: "All black",
    note: "Drawn over the face. She met me in all black.",
    src: "/edits/all-black.mp4",
    poster: "/edits/all-black.jpg",
  },
  {
    id: "poor-little",
    title: "Poor little",
    note: "He never really quit. He just says he did.",
    src: "/edits/poor-little.mp4",
    poster: "/edits/poor-little.jpg",
  },
  {
    id: "read",
    title: "When he can read",
    note: "High contrast, bathroom light, the mouth still moving.",
    src: "/edits/read.mp4",
    poster: "/edits/read.jpg",
  },
  {
    id: "cobbles",
    title: "Cobbles",
    note: "Three of them on the stones. Grain, and then a close face.",
    src: "/edits/cobbles.mp4",
    poster: "/edits/cobbles.jpg",
  },
  {
    id: "night",
    title: "Night snow",
    note: "The walk outside, then the dare, then the dark.",
    src: "/edits/night.mp4",
    poster: "/edits/night.jpg",
  },
] as const;

const BEAD_COUNT = 33;
const LAMP_KEY = "sobhantanizm.lamp";
const BEADS_KEY = "sobhantanizm.beads";

type Lamp = { name: string; vow: string; since: string };
type Beads = { spoken: number; cycles: number };

export function TemplePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="temple-void min-h-screen bg-ink text-parchment">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="flex items-center gap-3 text-gold">
            <Emblem className="size-8" />
            <span className="font-sans text-xs font-medium tracking-[0.22em] uppercase">
              Sobhantanizm
            </span>
          </a>
          <nav className="hidden items-center gap-4 xl:flex" aria-label="Temple">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] text-muted transition-colors duration-200 hover:text-parchment"
              >
                {item.label}
              </a>
            ))}
            <a
              href={KICK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-9 items-center gap-2 border border-gold px-3 text-xs tracking-[0.16em] text-gold uppercase"
            >
              <Radio className="size-3.5" aria-hidden />
              Kick
            </a>
          </nav>
          <button
            id="menu-button"
            type="button"
            className="inline-flex size-11 items-center justify-center border border-line text-parchment xl:hidden"
            aria-expanded={open}
            aria-controls="temple-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
        <nav
          id="temple-menu"
          className={`${open ? "" : "hidden"} border-t border-line px-5 py-3 xl:hidden`}
          aria-label="Temple"
        >
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex min-h-11 items-center text-base text-parchment"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={KICK}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center text-base text-gold"
                  onClick={() => setOpen(false)}
                >
                  Kick — sobhanrah
                </a>
              </li>
            </ul>
          </nav>
      </header>

      <main id="top">
        <Hero />
        <Live />
        <Edits />
        <Person />
        <Dawns />
        <Creed />
        <Scripture />
        <Offices />
        <Feasts />
        <Lamp />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-3xl text-gold">Sobhan</p>
            <p className="mt-2 max-w-md text-sm text-muted">
              The public canon of Sobhantanizm. Read it as devotion. The stream, and the edits, sit
              beside it — not instead of it.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <a
              href={KICK}
              target="_blank"
              rel="noreferrer"
              className="text-sm tracking-[0.16em] text-gold uppercase"
            >
              kick.com/sobhanrah
            </a>
            <p className="text-xs tracking-[0.18em] text-muted uppercase">The dark keeps the name</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="px-5 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
      <div className="relative mx-auto max-w-6xl border border-line px-6 py-14 md:px-16 md:py-24">
        <Corner className="top-0 left-0" />
        <Corner className="top-0 right-0" />
        <Corner className="bottom-0 left-0" />
        <Corner className="right-0 bottom-0" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <Emblem className="pointer-events-none absolute top-8 size-72 text-gold opacity-10" />
          <p className="stagger-item text-xs tracking-[0.28em] text-gold uppercase">
            The sobhan temple
          </p>
          <div className="stagger-item mt-8 text-gold">
            <Emblem className="mx-auto size-16" />
          </div>
          <h1 className="stagger-item mt-8 font-display text-5xl leading-none text-parchment md:text-7xl">
            Sobhan is a Person.
            <span className="mt-3 block text-gold">And the dark knows it.</span>
          </h1>
          <p className="stagger-item mt-8 max-w-xl text-lg text-muted">
            Not an idea. Not a weather. Someone — clear, addressable, and without a rival — whose
            first act was to speak, and whose every dawn is that speech still going.
          </p>
          <div className="stagger-item mt-10 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#edits"
              className="inline-flex min-h-11 w-full items-center justify-center bg-gold px-6 text-sm font-medium tracking-wide text-ink uppercase transition-transform duration-150 ease-out active:scale-[0.96] sm:w-auto sm:min-w-40"
            >
              Watch the edits
            </a>
            <a href="#person" className="person-seal">
              <span className="person-seal-mark text-gold">
                <Emblem className="size-8" />
              </span>
              <span className="text-left">
                <span className="person-seal-kicker">The center</span>
                <span className="person-seal-title">The Person</span>
              </span>
            </a>
            <a
              href={KICK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-line px-6 text-sm tracking-wide text-parchment uppercase transition-colors duration-200 hover:border-gold hover:text-gold sm:w-auto sm:min-w-40"
            >
              <Radio className="size-4" aria-hidden />
              Live on Kick
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Live() {
  return (
    <section id="live" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
        <div className="md:col-span-4">
          <p className="flex items-center gap-2 text-xs tracking-[0.22em] text-gold uppercase">
            <span className="inline-block size-2 rounded-full bg-gold" aria-hidden />
            The stream
          </p>
          <h2 className="mt-4 font-display text-5xl leading-none">SobhanRah, live.</h2>
          <p className="mt-5 text-muted">
            The temple is the canon. The channel is the voice. When the lamp is on, it is on Kick —
            the same person, unscripted.
          </p>
          <a
            href={KICK}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-11 items-center justify-center bg-gold px-6 text-sm font-medium tracking-wide text-ink uppercase"
          >
            Open kick.com/sobhanrah
          </a>
        </div>
        <div className="border border-line bg-ink md:col-span-8">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-xs tracking-[0.18em] text-muted uppercase">kick.com/sobhanrah</p>
            <a href={KICK} target="_blank" rel="noreferrer" className="text-xs text-gold uppercase">
              Open
            </a>
          </div>
          <div className="aspect-video bg-surface">
            <iframe
              title="SobhanRah on Kick"
              src="https://player.kick.com/sobhanrah"
              className="h-full w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Edits() {
  const [id, setId] = useState<(typeof EDITS)[number]["id"]>(EDITS[0].id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const edit = EDITS.find((item) => item.id === id) ?? EDITS[0];

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    node.load();
  }, [edit.src]);

  return (
    <section id="edits" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] text-gold uppercase">The cuts</p>
          <h2 className="mt-4 font-display text-5xl leading-none">Six edits. Grain, and the face.</h2>
          <p className="mt-5 text-muted">
            Shot close, pushed until the blacks crush. Pick one. Sound is on when you press play.
          </p>
        </div>

        <div className="mt-10 border border-line bg-ink">
          <video
            id="edit-player"
            ref={videoRef}
            key={edit.src}
            className="aspect-video w-full bg-ink object-contain"
            controls
            playsInline
            poster={edit.poster}
            preload="metadata"
          >
            <source src={edit.src} type="video/mp4" />
          </video>
          <div className="flex flex-col gap-1 border-t border-line px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 id="edit-title" className="font-display text-3xl">{edit.title}</h3>
            <p id="edit-note" className="text-sm text-muted">{edit.note}</p>
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {EDITS.map((item) => {
            const selected = item.id === edit.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setId(item.id)}
                  aria-pressed={selected}
                  data-src={item.src}
                  data-poster={item.poster}
                  data-title={item.title}
                  data-note={item.note}
                  className={`edit-pick group w-full border text-left ${
                    selected ? "border-gold" : "border-line hover:border-gold"
                  }`}
                >
                  <span className="relative block aspect-video overflow-hidden bg-ink">
                    <img
                      src={item.poster}
                      alt=""
                      className="h-full w-full object-cover opacity-80 transition-opacity duration-200 group-hover:opacity-100"
                    />
                    <Play
                      className={`absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 ${
                        selected ? "text-gold" : "text-parchment/90"
                      }`}
                      aria-hidden
                    />
                  </span>
                  <span className="block px-3 py-3">
                    <span className="block font-display text-xl leading-none text-parchment">
                      {item.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 12 16" aria-hidden className={`absolute size-4 text-gold ${className}`}>
      <path d="M6 0v16M1.5 4.5h9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function Person() {
  return (
    <section id="person" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-4">
          <p className="text-xs tracking-[0.22em] text-gold uppercase">The Person</p>
          <h2 className="mt-4 font-display text-5xl leading-none md:text-6xl">
            God, and not less than someone.
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <p className="text-lg text-parchment">
            In Sobhantanizm these are not two claims. Sobhan is God, and God is not an impersonal
            force wearing a title. Forces cannot love, cannot be spoken to, and cannot keep a
            promise. Sobhan does all three.
          </p>
          <p className="mt-5 text-muted">
            The old root of his name is glory that has been washed — praise with the dust shaken
            out. That washing is not a slogan. It is who he is. Before calendars there was a hush
            the canon calls the Unlit: not evil, only unspoken. Sobhan said his own name once,
            without raising it. Light did not explode. It arrived the way a person enters a room,
            already themselves.
          </p>
          <p className="mt-5 text-muted">
            Dust came later. Not as his curse, but as the film that gathers when a greeting goes
            unanswered. He does not scrape the world clean by force. Each morning he offers water.
            The canon refuses a portrait. A likeness would only be a rumor about his face. He is
            met in address, not in an idol.
          </p>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {epithets.map((epithet) => (
              <div key={epithet.name} className="grid gap-1 py-4 sm:grid-cols-5 sm:gap-6">
                <dt className="font-display text-2xl text-gold sm:col-span-2">
                  {epithet.name}
                </dt>
                <dd className="text-muted sm:col-span-3 sm:pt-1">{epithet.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Dawns() {
  return (
    <section id="dawns" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] text-gold uppercase">Cosmos</p>
          <h2 className="mt-4 font-display text-5xl leading-none">The Seven Dawns</h2>
          <p className="mt-5 text-muted">
            Not seven gods. Seven ways the one Person gives the world back to itself.
          </p>
        </div>
        <ol className="mt-12 border-t border-line">
          {dawns.map((dawn) => (
            <li
              key={dawn.title}
              className="grid gap-3 border-b border-line py-6 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <span className="font-display text-3xl text-gold md:col-span-1">{dawn.n}</span>
              <h3 className="font-display text-3xl md:col-span-3">{dawn.title}</h3>
              <p className="text-muted md:col-span-8">{dawn.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Creed() {
  return (
    <section id="creed" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p className="text-xs tracking-[0.22em] text-gold uppercase">The Clear Seven</p>
        <h2 className="mt-4 max-w-xl font-display text-5xl leading-none">What is kept, and what is refused.</h2>
        <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {creed.map((article, index) => (
            <li key={article} className="bg-ink p-6 md:p-8">
              <span className="font-display text-2xl text-gold tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-lg leading-snug">{article}</p>
            </li>
          ))}
          <li className="flex flex-col justify-end bg-ink p-6 md:p-8">
            <p className="font-display text-3xl text-gold">He is not a tribe’s private possession.</p>
            <p className="mt-4 text-sm text-muted">
              Sobhan does not need your fear in order to be large. Kindness is worship done with the
              hands.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}

function Scripture() {
  const [id, setId] = useState<(typeof cantos)[number]["id"]>("name");
  const canto = cantos.find((item) => item.id === id) ?? cantos[0];

  return (
    <section id="scripture" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-4">
          <p className="text-xs tracking-[0.22em] text-gold uppercase">Scripture</p>
          <h2 className="mt-4 font-display text-5xl leading-none">Three cantos, spoken low.</h2>
          <div className="mt-8 flex flex-col" role="tablist" aria-label="Cantos">
            {cantos.map((item) => {
              const selected = item.id === canto.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setId(item.id)}
                  className={`min-h-11 border-b border-line text-left text-sm transition-colors duration-200 ${
                    selected ? "text-gold" : "text-muted hover:text-parchment"
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>
        <article
          role="tabpanel"
          className="border border-line bg-ink px-6 py-10 text-parchment md:col-span-8 md:px-12 md:py-14"
        >
          <p className="text-xs tracking-[0.22em] text-gold uppercase">{canto.title}</p>
          <div className="mt-8 space-y-4">
            {canto.lines.map((line) => (
              <p key={line} className="font-display text-xl leading-snug text-gold md:text-2xl">
                {line}
              </p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function Offices() {
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    const read = () => setHour(new Date().getHours());
    read();
    const id = window.setInterval(read, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const current = hour === null ? null : officeForHour(hour);

  return (
    <section id="offices" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-xs tracking-[0.22em] text-gold uppercase">The day</p>
            <h2 className="mt-4 font-display text-5xl leading-none">Six offices. One Person.</h2>
            <p className="mt-5 text-muted">
              The hours are not magic. They are a way of not sleepwalking through a day that was
              given as a greeting.
            </p>
          </div>
          <p id="office-now" className="font-display text-3xl text-gold md:col-span-6 md:col-start-7 md:pt-10">
            {current
              ? `This hour is ${current.name}. ${current.text}`
              : "Reading the hour of this place…"}
          </p>
        </div>

        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {offices.map((office) => {
            const active = current?.id === office.id;
            return (
              <li key={office.id} className={`p-6 ${active ? "bg-ink" : "bg-surface"}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className={`font-display text-3xl ${active ? "text-gold" : "text-parchment"}`}>
                    {office.name}
                  </h3>
                  <span className="text-xs tracking-wide text-muted tabular-nums">{office.hours}</span>
                </div>
                <p className="mt-3 text-sm text-muted">{office.text}</p>
                {active ? (
                  <p className="mt-4 text-xs tracking-[0.18em] text-gold uppercase">Now</p>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-4xl">What the hands do</h3>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {practices.map((practice) => (
                <li key={practice.title} className="py-5">
                  <p className="font-display text-2xl text-gold">{practice.title}</p>
                  <p className="mt-2 text-muted">{practice.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <DawnOffice />
        </div>
      </div>
    </section>
  );
}

function DawnOffice() {
  const [beads, setBeads] = useState<Beads>({ spoken: 0, cycles: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEADS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Beads;
        if (typeof parsed.spoken === "number" && typeof parsed.cycles === "number") {
          setBeads({
            spoken: Math.min(BEAD_COUNT, Math.max(0, parsed.spoken)),
            cycles: Math.max(0, parsed.cycles),
          });
        }
      }
    } catch {
      /* ignore a damaged local record */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(BEADS_KEY, JSON.stringify(beads));
  }, [beads, ready]);

  const phrase = glorifications[beads.spoken % glorifications.length];
  const done = beads.spoken === 0 && beads.cycles > 0;

  function speak() {
    setBeads((current) => {
      const next = current.spoken + 1;
      if (next >= BEAD_COUNT) return { spoken: 0, cycles: current.cycles + 1 };
      return { ...current, spoken: next };
    });
  }

  return (
    <div className="border border-line bg-ink p-6 md:p-8">
      <p className="text-xs tracking-[0.22em] text-gold uppercase">Dawn office</p>
      <h3 className="mt-3 font-display text-4xl">Thirty-three, and then quiet.</h3>
      <p id="bead-phrase" className="mt-6 min-h-16 font-sans text-2xl text-parchment italic" aria-live="polite">
        {beads.spoken === 0 && beads.cycles === 0
          ? "Face the brightest glass you have. Speak when you are ready."
          : phrase}
      </p>
      <p id="bead-count" className="mt-2 text-sm text-muted tabular-nums">
        {beads.spoken} of {BEAD_COUNT}
        {beads.cycles > 0 ? ` · ${beads.cycles} full ${beads.cycles === 1 ? "office" : "offices"} kept here` : ""}
      </p>
      <div id="bead-dots" className="mt-6 flex max-w-md flex-wrap gap-1.5" aria-hidden="true">
        {Array.from({ length: BEAD_COUNT }, (_, index) => (
          <span
            key={index}
            className={`size-2.5 rounded-full ${index < beads.spoken ? "bg-gold" : "bg-line"}`}
          />
        ))}
      </div>
      <p id="bead-done" className={`mt-6 text-sm text-gold ${done ? "" : "hidden"}`}>
        A full glorification. The morning keeps it.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          id="bead-speak"
          type="button"
          onClick={speak}
          className="inline-flex min-h-11 items-center justify-center bg-gold px-6 text-sm font-medium tracking-wide text-ink uppercase transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          Speak
        </button>
        <button
          id="bead-reset"
          type="button"
          onClick={() => setBeads({ spoken: 0, cycles: beads.cycles })}
          className="inline-flex min-h-11 items-center justify-center border border-line px-6 text-sm tracking-wide text-parchment uppercase"
        >
          Begin this count again
        </button>
      </div>
    </div>
  );
}

function Feasts() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const upcoming = useMemo(() => (now ? nextFeast(now) : null), [now]);

  return (
    <section id="feasts" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.22em] text-gold uppercase">The year</p>
            <h2 className="mt-4 font-display text-5xl leading-none">Four feasts, and one weekly palm.</h2>
          </div>
          <p id="feast-next" className="max-w-sm text-sm text-muted">
            {upcoming
              ? `Next: ${upcoming.name}, ${upcoming.date.toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                })}.`
              : "Finding the next feast…"}
          </p>
        </div>
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {feasts.map((feast) => (
            <li key={feast.name} className="grid gap-2 py-6 md:grid-cols-12 md:gap-8">
              <p className="text-sm text-gold tabular-nums md:col-span-2">
                {monthName(feast.month)} {feast.day}
              </p>
              <h3 className="font-display text-3xl md:col-span-4">{feast.name}</h3>
              <p className="text-muted md:col-span-6">{feast.text}</p>
            </li>
          ))}
          <li className="grid gap-2 py-6 md:grid-cols-12 md:gap-8">
            <p className="text-sm text-gold md:col-span-2">Each Sunday</p>
            <h3 className="font-display text-3xl md:col-span-4">Open Palm</h3>
            <p className="text-muted md:col-span-6">
              At first light the hands are washed, and one portion of food leaves the house.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}

function monthName(month: number) {
  return new Date(2000, month - 1, 1).toLocaleDateString(undefined, { month: "long" });
}

function Lamp() {
  const [lamp, setLamp] = useState<Lamp | null>(null);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [vow, setVow] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAMP_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Lamp;
        if (parsed?.name && parsed?.vow) setLamp(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (lamp) localStorage.setItem(LAMP_KEY, JSON.stringify(lamp));
    else localStorage.removeItem(LAMP_KEY);
  }, [lamp, ready]);

  function set() {
    const cleanName = name.trim();
    const cleanVow = vow.trim();
    if (!cleanName || !cleanVow) return;
    setLamp({ name: cleanName, vow: cleanVow, since: new Date().toISOString() });
    setName("");
    setVow("");
  }

  const since = lamp
    ? new Date(lamp.since).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <section id="lamp" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-5">
          <p className="text-xs tracking-[0.22em] text-gold uppercase">Enter</p>
          <h2 className="mt-4 font-display text-5xl leading-none">You do not sign. You set a lamp.</h2>
          <p className="mt-5 text-muted">
            Sobhantanizm is kept by address, not by enrollment. Leave the name you want spoken at
            dawn, and one sentence you intend to live. It stays on this device. No one else receives
            it.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {lamp ? (
            <div className="border border-gold bg-ink p-8">
              <p className="text-xs tracking-[0.22em] text-gold uppercase">A lamp is lit</p>
              <p className="mt-6 font-display text-5xl">{lamp.name}</p>
              <p className="mt-4 text-lg text-parchment">{lamp.vow}</p>
              <p className="mt-6 text-sm text-muted">Set {since}</p>
              <button
                type="button"
                onClick={() => setLamp(null)}
                className="mt-8 inline-flex min-h-11 items-center border border-line px-5 text-sm tracking-wide text-muted uppercase hover:text-parchment"
              >
                Extinguish
              </button>
            </div>
          ) : (
            <form
              className="border border-line bg-ink p-6 md:p-8"
              onSubmit={(event) => {
                event.preventDefault();
                set();
              }}
            >
              <label className="block text-xs tracking-[0.18em] text-muted uppercase" htmlFor="lamp-name">
                Name at dawn
              </label>
              <input
                id="lamp-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={48}
                required
                className="mt-2 w-full border border-line bg-surface px-4 py-3 text-parchment outline-none placeholder:text-muted"
                placeholder="What should the morning call you"
              />
              <label className="mt-6 block text-xs tracking-[0.18em] text-muted uppercase" htmlFor="lamp-vow">
                One sentence
              </label>
              <textarea
                id="lamp-vow"
                value={vow}
                onChange={(event) => setVow(event.target.value)}
                maxLength={180}
                required
                rows={3}
                className="mt-2 w-full resize-none border border-line bg-surface px-4 py-3 text-parchment outline-none placeholder:text-muted"
                placeholder="I will not close my hand today."
              />
              <button
                type="submit"
                className="mt-6 inline-flex min-h-11 items-center justify-center bg-gold px-6 text-sm font-medium tracking-wide text-ink uppercase transition-transform duration-150 ease-out active:scale-[0.96]"
              >
                Set my lamp
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
