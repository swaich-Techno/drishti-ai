import { getLifePathNumber } from "./numerology";
import { getTarotCard } from "./tarot";

const zodiacRanges = [
  { sign: "Capricorn", start: [1, 1], end: [1, 19] },
  { sign: "Aquarius", start: [1, 20], end: [2, 18] },
  { sign: "Pisces", start: [2, 19], end: [3, 20] },
  { sign: "Aries", start: [3, 21], end: [4, 19] },
  { sign: "Taurus", start: [4, 20], end: [5, 20] },
  { sign: "Gemini", start: [5, 21], end: [6, 20] },
  { sign: "Cancer", start: [6, 21], end: [7, 22] },
  { sign: "Leo", start: [7, 23], end: [8, 22] },
  { sign: "Virgo", start: [8, 23], end: [9, 22] },
  { sign: "Libra", start: [9, 23], end: [10, 22] },
  { sign: "Scorpio", start: [10, 23], end: [11, 21] },
  { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
  { sign: "Capricorn", start: [12, 22], end: [12, 31] },
];

const astroFocus = [
  "clearer routines and consistency",
  "stronger communication and patience",
  "trusting your long-term plans",
  "protecting your emotional energy",
  "disciplined money decisions",
  "better boundaries in relationships",
];

const astroActions = [
  "move slowly and choose one practical next step",
  "say yes only to what supports your peace",
  "focus on consistency instead of speed",
  "avoid overthinking and revisit the basics",
  "finish pending work before starting something new",
  "listen to intuition, but confirm the facts",
];

const remedies = [
  "light a diya on Monday evening and sit quietly for five minutes",
  "start the day with a short gratitude prayer and one written intention",
  "wear a calm color on important days and avoid rushed decisions",
  "offer water to the rising sun for seven mornings",
  "keep your workspace clean and repeat a grounding mantra daily",
  "avoid gossip and protect the energy around your plans",
];

const tarotInsights = {
  "The Fool": "A clean beginning is opening, but it will work only if you stay brave and grounded.",
  "The Magician": "You already have the tools. The message is to act with intention instead of waiting for perfect timing.",
  "The High Priestess": "The answer is not loud right now. Silence, timing and intuition matter more than pressure.",
  "The Lovers": "A heart-centered choice is coming. Choose what aligns with your values, not just convenience.",
  "The Tower": "A sudden change may feel intense, but it clears what was no longer stable.",
  "The Sun": "This is a bright sign for progress, recognition and healing momentum.",
};

function normalizeText(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = value.trim();
  return cleaned || fallback;
}

function getSeed(value) {
  return normalizeText(value, "drishti")
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
}

function pickFrom(list, seed) {
  return list[seed % list.length];
}

function getZodiacSign(dob) {
  const [year, monthValue, dayValue] = normalizeText(dob, "2000-01-01")
    .split("-")
    .map(Number);

  if (!year || !monthValue || !dayValue) {
    return "Cosmic";
  }

  const match = zodiacRanges.find(({ start, end }) => {
    const [startMonth, startDay] = start;
    const [endMonth, endDay] = end;

    if (monthValue === startMonth && dayValue >= startDay) {
      return true;
    }

    if (monthValue === endMonth && dayValue <= endDay) {
      return true;
    }

    return false;
  });

  return match?.sign || "Cosmic";
}

function buildAstroReading(input) {
  const name = normalizeText(input.name, "friend");
  const dob = normalizeText(input.dob, "your date");
  const time = normalizeText(input.time, "your birth time");
  const place = normalizeText(input.place, "your birth place");
  const question = normalizeText(input.question, "your current path");
  const zodiac = getZodiacSign(dob);
  const seed = getSeed(`${name}${dob}${time}${place}${question}`);
  const focus = pickFrom(astroFocus, seed);
  const action = pickFrom(astroActions, seed + 7);
  const remedy = pickFrom(remedies, seed + 11);

  return `${name}, your ${zodiac} pattern shows a period that rewards ${focus}. Around the question "${question}", the chart suggests that your best result comes when you ${action}. Birth details around ${dob}, ${time} and ${place} point toward steady improvement instead of instant change. Remedy: ${remedy}.`;
}

function buildNumerologyReading(input) {
  const name = normalizeText(input.name, "friend");
  const question = normalizeText(input.question, "your next move");
  const dob = normalizeText(input.dob, "2000-01-01");
  const lifePath = getLifePathNumber(dob);

  const themes = {
    1: "leadership and fresh starts",
    2: "partnership, patience and emotional balance",
    3: "creative expression and confidence",
    4: "discipline, structure and long-term security",
    5: "change, travel and adaptability",
    6: "family, healing and responsibility",
    7: "inner work, study and spiritual depth",
    8: "money, power and practical ambition",
    9: "release, compassion and completion",
  };

  const theme = themes[lifePath] || "stability and personal focus";

  return `${name}, your life path number is ${lifePath}, which highlights ${theme}. For "${question}", numerology says progress comes when you make fewer promises and stronger commitments. Focus on one key result for the next 30 days and let the rest wait.`;
}

function buildTarotReading(input) {
  const name = normalizeText(input.name, "friend");
  const question = normalizeText(input.question, "your next chapter");
  const card = getTarotCard();
  const insight = tarotInsights[card] || "Clarity comes through patience and grounded action.";

  return `${name}, your tarot card is ${card}. For "${question}", the message is: ${insight} Keep your next decision simple, honest and practical.`;
}

function buildVedicReading(input) {
  const name = normalizeText(input.name, "friend");
  const question = normalizeText(input.question, "your present concern");
  const seed = getSeed(`${input.dob}${input.place}${question}`);
  const focus = pickFrom(
    [
      "discipline in daily rituals",
      "respect for timing",
      "less emotional overreaction",
      "financial steadiness",
      "stronger family communication",
      "more trust in slow progress",
    ],
    seed,
  );

  return `${name}, your Vedic reading suggests that this phase improves through ${focus}. In relation to "${question}", avoid rushed conclusions for the next few weeks. A slow and spiritual approach will serve you better than a reactive one.`;
}

function buildPalmistryReading(input) {
  const name = normalizeText(input.name, "friend");
  const question = normalizeText(input.question, "your situation");
  const seed = getSeed(`${name}${question}`);
  const message = pickFrom(
    [
      "a stronger head line points to better results when you trust logic over pressure",
      "a deeper heart line suggests emotional honesty will unlock progress",
      "a balanced life line shows stamina, but only if rest is protected",
      "a branching fate line hints at a career or location shift ahead",
    ],
    seed,
  );

  return `${name}, your palmistry guidance says ${message}. For "${question}", take a careful step that protects both your time and energy.`;
}

function buildKundliReading(input) {
  const firstDob = normalizeText(input.p1dob, "2000-01-01");
  const secondDob = normalizeText(input.p2dob, "2000-01-01");
  const firstValue = firstDob.replace(/-/g, "").split("").reduce((sum, digit) => sum + Number(digit), 0);
  const secondValue = secondDob.replace(/-/g, "").split("").reduce((sum, digit) => sum + Number(digit), 0);
  const difference = Math.abs(firstValue - secondValue);
  const score = Math.max(62, 92 - difference);
  const guidance =
    score >= 80
      ? "This is a supportive match with strong emotional rhythm and shared long-term energy."
      : "This match can work, but it needs patience, honest communication and family alignment.";

  return `Kundli match score: ${score}/100. ${guidance}`;
}

export function buildReading(input = {}) {
  const mode = normalizeText(input.mode, "astro");

  switch (mode) {
    case "numerology":
      return buildNumerologyReading(input);
    case "tarot":
      return buildTarotReading(input);
    case "vedic":
      return buildVedicReading(input);
    case "palmistry":
      return buildPalmistryReading(input);
    case "kundli":
      return buildKundliReading(input);
    case "astro":
    default:
      return buildAstroReading(input);
  }
}
