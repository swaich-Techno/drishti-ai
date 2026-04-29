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

const tarotCards = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Lovers",
  "The Tower",
  "The Sun",
];

const tarotMeanings = {
  "The Fool": "a fresh chapter wants courage, but not recklessness",
  "The Magician": "you already have enough tools to begin",
  "The High Priestess": "silence and timing matter more than pressure",
  "The Lovers": "the answer is tied to values, trust, and alignment",
  "The Tower": "a shake-up is clearing what no longer fits",
  "The Sun": "clarity, warmth, and progress are close",
};

const focusAreas = [
  "steady effort over emotional rush",
  "clear boundaries around your energy",
  "patient communication and self-trust",
  "disciplined progress rather than instant answers",
  "finishing one important thing before starting three more",
  "protecting peace before pleasing everyone else",
];

const actions = [
  "choose one practical next step and stay consistent with it for seven days",
  "slow down your response time and let your decisions breathe before you lock them in",
  "speak more directly about what you need instead of hoping someone guesses it",
  "clear small unfinished tasks because they are draining more energy than they look",
  "protect your time and stop overcommitting during this phase",
  "pair intuition with facts so your next move feels both calm and smart",
];

const cautions = [
  "do not confuse urgency with destiny",
  "avoid saying yes too quickly just to keep the peace",
  "watch for overthinking around timing and missed chances",
  "be careful with mixed signals in relationships or work promises",
  "do not let fear of delay push you into the wrong choice",
  "avoid draining conversations that leave you scattered",
];

const rituals = [
  "light a small diya or candle and sit quietly for five minutes before making the next important decision",
  "write one intention for the week and repeat it every morning before checking your phone",
  "offer water to the morning sun for a few days and keep your focus on gratitude",
  "clean your desk, room, or prayer space before beginning something important",
  "wear a calming color and avoid rushed conversations on the same day as a major choice",
  "take a short walk in silence and let your breathing settle before acting",
];

const numerologyThemes = {
  1: "leadership, fresh starts, and self-direction",
  2: "partnership, patience, and emotional balance",
  3: "expression, confidence, and creative movement",
  4: "discipline, structure, and long-term security",
  5: "change, flexibility, and brave decision-making",
  6: "care, healing, and relationship responsibility",
  7: "inner work, spiritual depth, and reflection",
  8: "money, ambition, and practical power",
  9: "closure, release, and compassionate wisdom",
};

function normalizeText(value, fallback = "") {
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

function getLifePathNumber(date) {
  const digits = normalizeText(date)
    .replace(/-/g, "")
    .split("")
    .map(Number)
    .filter((value) => Number.isFinite(value));

  if (!digits.length) {
    return null;
  }

  let sum = digits.reduce((total, value) => total + value, 0);

  while (sum > 9) {
    sum = sum
      .toString()
      .split("")
      .map(Number)
      .reduce((total, value) => total + value, 0);
  }

  return sum || null;
}

function getZodiacSign(date) {
  const [year, monthValue, dayValue] = normalizeText(date, "2000-01-01")
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

function getQuestionTheme(question) {
  const lowered = normalizeText(question).toLowerCase();

  if (/(love|relationship|marriage|partner)/.test(lowered)) {
    return "relationships and emotional timing";
  }

  if (/(career|job|work|business|money|finance)/.test(lowered)) {
    return "career direction and practical stability";
  }

  if (/(family|home|parents|child)/.test(lowered)) {
    return "family energy and emotional grounding";
  }

  return "personal direction and inner balance";
}

function getModeLabel(mode) {
  switch (mode) {
    case "numerology":
      return "numerology";
    case "tarot":
      return "tarot";
    case "kundli":
      return "kundli-style";
    case "astro":
    default:
      return "astrology";
  }
}

function buildEnergyParagraph({ mode, sign, lifePath, questionTheme, card, focus, birthTime, birthPlace }) {
  if (mode === "numerology") {
    const theme = numerologyThemes[lifePath] || "consistency and self-awareness";
    return `Your numbers point toward ${theme}. Around ${questionTheme}, the strongest message is to value stable effort more than sudden emotional swings.`;
  }

  if (mode === "tarot") {
    return `The card showing up is ${card}, which suggests ${tarotMeanings[card]}. Around ${questionTheme}, the energy is about clarity through honest choices, not rushed ones.`;
  }

  if (mode === "kundli") {
    const locationLine = birthPlace ? ` Birth place energy around ${birthPlace} adds a strong need for grounded routines.` : "";
    const timeLine = birthTime ? ` Birth timing near ${birthTime} suggests patience before making public commitments.` : "";
    return `This kundli-style reading leans toward ${focus}. Around ${questionTheme}, your best results come from calm pacing and spiritual discipline instead of pressure.${locationLine}${timeLine}`;
  }

  return `Your ${sign} pattern currently rewards ${focus}. Around ${questionTheme}, the message is to stay anchored in what is real, practical, and emotionally clean.`;
}

export function generateAstroResponse(input = {}) {
  const name = normalizeText(input.name, "friend");
  const question = normalizeText(input.question, "your next step");
  const mode = normalizeText(input.mode, "astro");
  const birthDate = normalizeText(input.birthDate);
  const birthTime = normalizeText(input.birthTime);
  const birthPlace = normalizeText(input.birthPlace);

  const seed = getSeed(`${name}|${question}|${mode}|${birthDate}|${birthTime}|${birthPlace}`);
  const sign = getZodiacSign(birthDate);
  const lifePath = getLifePathNumber(birthDate);
  const card = pickFrom(tarotCards, seed + 3);
  const focus = pickFrom(focusAreas, seed + 7);
  const action = pickFrom(actions, seed + 11);
  const caution = pickFrom(cautions, seed + 13);
  const ritual = pickFrom(rituals, seed + 17);
  const questionTheme = getQuestionTheme(question);
  const modeLabel = getModeLabel(mode);
  const firstLine =
    mode === "tarot"
      ? `${name}, here is your ${modeLabel} message for "${question}".`
      : `${name}, here is your ${modeLabel} guidance for "${question}".`;

  const energyParagraph = buildEnergyParagraph({
    mode,
    sign,
    lifePath,
    questionTheme,
    card,
    focus,
    birthTime,
    birthPlace,
  });

  return `${firstLine}

Current energy:
${energyParagraph}

What to do next:
1. ${action}.
2. Keep your attention on ${questionTheme} rather than trying to solve everything at once.
3. If something feels delayed, use that pause to sharpen your plan instead of doubting your path.

Grounding ritual:
${ritual}.

Caution:
${caution}.

Beta note:
This is a guidance-style reading, not an exact astronomical or full Vedic calculation.`;
}
