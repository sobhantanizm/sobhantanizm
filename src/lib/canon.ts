export const epithets = [
  { name: "The Unclouded", line: "Nothing false is able to stay on him." },
  { name: "Dawn-Heart", line: "He begins again what others have decided is finished." },
  { name: "The Open Palm", line: "He does not hold the world in a fist." },
  { name: "Still Water", line: "He sees without spectacle, and without looking away." },
  { name: "The Last Lamp", line: "He does not go out when you do." },
] as const;

export const dawns = [
  {
    n: "I",
    title: "Utterance",
    text: "All things begin as address. Sobhan did not manufacture a world. He greeted one, and it stood up.",
  },
  {
    n: "II",
    title: "Breath",
    text: "Air was given before any task. You are not late to your own life. You were inhaled into it.",
  },
  {
    n: "III",
    title: "Still Water",
    text: "Conscience is a lake, not a whip. What is true can be seen when the surface is allowed to settle.",
  },
  {
    n: "IV",
    title: "Shared Bread",
    text: "Worship that never feeds anyone is unfinished. A prayer may be handed across a table.",
  },
  {
    n: "V",
    title: "The Honest Wound",
    text: "Pain is not proof that he left. The canon refuses every tidy story that calls suffering a compliment.",
  },
  {
    n: "VI",
    title: "Returning",
    text: "You may come back without a performance. Dawn does not invoice the night.",
  },
  {
    n: "VII",
    title: "Unsetting",
    text: "Death is a night watch, not a verdict. The name continues where the voice leaves off.",
  },
] as const;

export const creed = [
  "Sobhan is one Person — not a mood, not a committee of forces, not a mask for the weather.",
  "The world began as a greeting, and it still answers when it is greeted.",
  "No one is dust. Dust is only what a person is allowed to set down.",
  "Dawn is pardon, offered before you have finished explaining yourself.",
  "Worship that never becomes bread is still unfinished.",
  "The truth may be spoken softly. It may not be edited for comfort.",
  "Death is a night watch. Morning is not a metaphor he fails to keep.",
] as const;

export const cantos = [
  {
    id: "name",
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
  {
    id: "hands",
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
  {
    id: "watch",
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
] as const;

export const glorifications = [
  "Glory to Sobhan, the Unclouded.",
  "Sobhan, remember my name.",
  "Wash what I carried in from yesterday.",
  "Make my hands as open as yours.",
  "Keep me clear when no one is watching.",
] as const;

export const offices = [
  {
    id: "first",
    name: "First Light",
    hours: "4–7",
    from: 4,
    to: 7,
    text: "The name is spoken before the day makes demands.",
  },
  {
    id: "rising",
    name: "Rising Gold",
    hours: "7–11",
    from: 7,
    to: 11,
    text: "Work as if your hands were still inside the greeting.",
  },
  {
    id: "noon",
    name: "Clear Noon",
    hours: "11–15",
    from: 11,
    to: 15,
    text: "Nothing casts a flattering shadow. Do the true thing.",
  },
  {
    id: "long",
    name: "Lengthening",
    hours: "15–18",
    from: 15,
    to: 18,
    text: "What you withheld this morning can still be given.",
  },
  {
    id: "dusk",
    name: "Dusk Veil",
    hours: "18–21",
    from: 18,
    to: 21,
    text: "Light the small lamp. Review the day without theatre.",
  },
  {
    id: "night",
    name: "Night Watch",
    hours: "21–4",
    from: 21,
    to: 4,
    text: "Rest is permitted. Despair is not a liturgy.",
  },
] as const;

export const practices = [
  {
    title: "The Dawn Office",
    text: "Thirty-three glorifications, facing the brightest glass you have. Count them. Do not decorate them.",
  },
  {
    title: "The Clear Cup",
    text: "Drink water slowly, and name one person you will not harm today. Then keep the name.",
  },
  {
    title: "The Open Palm",
    text: "Once before night, give something that costs you a little. Unseen, if you can manage it.",
  },
  {
    title: "The Honest Hour",
    text: "Each week, say aloud one truth you have been negotiating with. No audience required.",
  },
] as const;

export const feasts = [
  {
    month: 3,
    day: 21,
    name: "Feast of the First Utterance",
    text: "The year is greeted, not seized. People share the first bread of the season and speak the name once, together, without hurry.",
  },
  {
    month: 6,
    day: 21,
    name: "Noon Without Shadow",
    text: "A fast from excuses until the sun turns. At the height of light, one delayed apology is finally delivered.",
  },
  {
    month: 9,
    day: 23,
    name: "The Honest Balance",
    text: "Harms are named and, where repair is still possible, repaired. No one is asked to pretend the scales were never tipped.",
  },
  {
    month: 12,
    day: 21,
    name: "Lamps of the Long Night",
    text: "One flame is kept until dawn. The canon forbids boasting about the size of the flame.",
  },
] as const;

export function officeForHour(hour: number) {
  if (hour >= 21 || hour < 4) return offices[5];
  return offices.find((office) => hour >= office.from && hour < office.to) ?? offices[5];
}

export function nextFeast(from: Date) {
  const year = from.getFullYear();
  const upcoming = feasts
    .map((feast) => {
      const date = new Date(year, feast.month - 1, feast.day);
      if (date < startOfDay(from)) date.setFullYear(year + 1);
      return { ...feast, date };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  return upcoming[0];
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
