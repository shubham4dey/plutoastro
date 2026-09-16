/**
 * ==========================================================
 *  PlutoAstro — Calculators
 *  Numerology service
 *
 *  Real numerology arithmetic (no generated numbers):
 *  - Life Path / Birthday from the date of birth
 *  - Expression (Destiny), Soul Urge, Personality from the
 *    name using either the Pythagorean or Chaldean table
 *  - Master numbers 11 / 22 / 33 are never reduced further
 *  Every result carries its step by step calculation.
 * ==========================================================
 */

const MASTER_NUMBERS = [11, 22, 33];

const PYTHAGOREAN_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

/* Chaldean table — no letter is assigned the value 9 */
const CHALDEAN_VALUES = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

const SYSTEMS = {
  pythagorean: {
    key: "pythagorean",
    name: "Pythagorean",
    description:
      "Letters A-Z are valued 1-9 in repeating order and every number is reduced to a single digit, while the master numbers 11, 22 and 33 keep their power.",
  },
  chaldean: {
    key: "chaldean",
    name: "Chaldean",
    description:
      "The older Chaldean system: letters are valued 1-8 by sound and the number 9 is considered sacred, so no letter carries it.",
  },
};

const NUMBER_MEANINGS = {
  1: { title: "The Leader", keywords: ["initiative", "courage", "independence"], core: "You are here to stand on your own feet, start things and lead from the front." },
  2: { title: "The Diplomat", keywords: ["harmony", "sensitivity", "partnership"], core: "Your strength lies in balance, patience and reading the feelings of others." },
  3: { title: "The Communicator", keywords: ["expression", "creativity", "joy"], core: "You express yourself naturally and lift the mood of everyone around you." },
  4: { title: "The Builder", keywords: ["structure", "discipline", "reliability"], core: "You turn ideas into solid systems and can be trusted to finish what you start." },
  5: { title: "The Explorer", keywords: ["freedom", "change", "versatility"], core: "You need movement and variety, and you adapt faster than most people." },
  6: { title: "The Nurturer", keywords: ["responsibility", "care", "home"], core: "You are drawn to care for family, community and beauty in daily life." },
  7: { title: "The Seeker", keywords: ["analysis", "wisdom", "inner life"], core: "You need to understand the deeper reason behind things before you act." },
  8: { title: "The Achiever", keywords: ["authority", "ambition", "abundance"], core: "You are built for material mastery, management and long term results." },
  9: { title: "The Humanitarian", keywords: ["compassion", "idealism", "giving"], core: "You see the bigger picture and feel responsible for the wider world." },
  11: { title: "The Intuitive Master", keywords: ["inspiration", "insight", "illumination"], core: "A master number of heightened intuition — you inspire others before you are fully aware of it yourself." },
  22: { title: "The Master Builder", keywords: ["vision", "structure", "legacy"], core: "A master number that can turn a large dream into something solid and lasting." },
  33: { title: "The Master Teacher", keywords: ["healing", "guidance", "devotion"], core: "A rare master number of selfless guidance — teaching and lifting others is your path." },
};

const ROLE_TEXT = {
  lifePath: {
    label: "Life Path Number",
    intro: "Your Life Path comes from the complete date of birth and shows the road you walk in this lifetime.",
    guidance: "Use it to judge whether a decision moves with your current or against it.",
  },
  birthday: {
    label: "Birthday Number",
    intro: "Your Birthday Number is the day of the month reduced — a talent you brought in with you.",
    guidance: "It describes the gift that is always immediately available to you.",
  },
  expression: {
    label: "Expression (Destiny) Number",
    intro: "Your Expression number comes from every letter of your full birth name and shows how you naturally work and what you are here to do.",
    guidance: "Careers and vocations align best with this number.",
  },
  soulUrge: {
    label: "Soul Urge (Heart's Desire) Number",
    intro: "Your Soul Urge is calculated from the vowels of your full birth name and describes what your heart quietly wants.",
    guidance: "When it is honoured, motivation stops feeling like effort.",
  },
  personality: {
    label: "Personality Number",
    intro: "Your Personality number comes from the consonants of your full birth name — the impression people get before they know you.",
    guidance: "It is how the world first reads you.",
  },
  maturity: {
    label: "Maturity Number",
    intro: "Your Maturity number combines the Life Path and the Expression number and describes the energy that grows stronger after the mid thirties.",
    guidance: "It becomes the main theme of the second half of life.",
  },
};

/* =========================
   REDUCTION HELPERS
========================= */

/**
 * Reduce a number to a single digit, keeping master numbers.
 * @returns {{value:number, steps:string[]}}
 */
const reduceNumber = (input, options = {}) => {
  const { keepMaster = true } = options;
  const steps = [];
  let value = Number(input);
  while (value > 9) {
    if (keepMaster && MASTER_NUMBERS.includes(value)) {
      steps.push(`${value} is a master number and is not reduced further`);
      break;
    }
    const digits = String(value).split("");
    const next = digits.reduce((sum, digit) => sum + Number(digit), 0);
    steps.push(`${digits.join(" + ")} = ${next}`);
    value = next;
  }
  return { value, steps };
};

const digitArray = (text) =>
  String(text)
    .replace(/\D/g, "")
    .split("")
    .map(Number);

/* =========================
   DATE BASED NUMBERS
========================= */

const lifePathNumber = (dateOfBirth) => {
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const digits = digitArray(dateOfBirth);
  const total = digits.reduce((sum, digit) => sum + digit, 0);
  const reduced = reduceNumber(total);
  return {
    number: reduced.value,
    calculation: {
      method: "Every digit of the date of birth is added together, then reduced.",
      digits,
      total,
      steps: [`${digits.join(" + ")} = ${total}`, ...reduced.steps],
    },
    dateParts: { day, month, year },
  };
};

const birthdayNumber = (dateOfBirth) => {
  const day = Number(dateOfBirth.split("-")[2]);
  const reduced = reduceNumber(day);
  return {
    number: reduced.value,
    calculation: {
      method: "The day of the month is reduced to a single digit.",
      total: day,
      steps: [
        day <= 9 ? `${day} is already a single digit` : `${day} reduces to ${reduced.value}`,
        ...reduced.steps,
      ],
    },
  };
};

/* =========================
   NAME BASED NUMBERS
========================= */

const lettersWithValues = (fullName, system) => {
  const table = system === "chaldean" ? CHALDEAN_VALUES : PYTHAGOREAN_VALUES;
  const letters = [];
  for (const character of fullName.toUpperCase()) {
    if (/[A-Z]/.test(character)) {
      letters.push({ letter: character, value: table[character] });
    }
  }
  return letters;
};

const nameNumber = (fullName, system, filter) => {
  const all = lettersWithValues(fullName, system);
  const used = filter ? all.filter((item) => filter(item.letter)) : all;
  if (!used.length) {
    return { number: 0, calculation: { letters: [], total: 0, steps: ["No letters were available for this number."] } };
  }
  const total = used.reduce((sum, item) => sum + item.value, 0);
  const reduced = reduceNumber(total);
  const table = system === "chaldean" ? "Chaldean" : "Pythagorean";
  return {
    number: reduced.value,
    calculation: {
      method: `${table} letter values summed, then reduced.`,
      letters: used.map((item) => `${item.letter}=${item.value}`),
      total,
      steps: [
        `Letters used: ${used.map((item) => item.letter).join("")}`,
        `${used.map((item) => item.value).join(" + ")} = ${total}`,
        ...reduced.steps,
      ],
    },
  };
};

const cleanName = (fullName) => fullName.trim().replace(/\s+/g, " ");

const buildMeaning = (role, number) => {
  const roleText = ROLE_TEXT[role];
  const meaning =
    NUMBER_MEANINGS[number] || NUMBER_MEANINGS[Number(String(number).charAt(0))] || NUMBER_MEANINGS[1];
  return {
    number,
    label: roleText.label,
    title: meaning.title,
    keywords: meaning.keywords,
    interpretation: `${roleText.intro} ${meaning.core} ${roleText.guidance}`,
  };
};

/* =========================
   PUBLIC API
========================= */

const calculate = ({ fullName, dateOfBirth, system }) => {
  const chosenSystem = SYSTEMS[system] || SYSTEMS.pythagorean;
  const cleanFullName = fullName ? cleanName(fullName) : null;

  const lifePath = lifePathNumber(dateOfBirth);
  const birthday = birthdayNumber(dateOfBirth);

  const payload = {
    calculator: "numerology",
    system: chosenSystem,
    input: { fullName: cleanFullName, dateOfBirth },
    numbers: {
      lifePath: { ...buildMeaning("lifePath", lifePath.number), calculation: lifePath.calculation },
      birthday: { ...buildMeaning("birthday", birthday.number), calculation: birthday.calculation },
      expression: null,
      soulUrge: null,
      personality: null,
      maturity: null,
    },
    highlights: [],
    notes: [],
  };

  if (cleanFullName) {
    const expression = nameNumber(cleanFullName, chosenSystem.key);
    const soulUrge = nameNumber(cleanFullName, chosenSystem.key, (letter) => VOWELS.has(letter));
    const personality = nameNumber(cleanFullName, chosenSystem.key, (letter) => !VOWELS.has(letter));
    const maturityTotal = lifePath.number + expression.number;
    const maturity = reduceNumber(maturityTotal);

    payload.numbers.expression = {
      ...buildMeaning("expression", expression.number),
      calculation: expression.calculation,
    };
    payload.numbers.soulUrge = {
      ...buildMeaning("soulUrge", soulUrge.number),
      calculation: soulUrge.calculation,
    };
    payload.numbers.personality = {
      ...buildMeaning("personality", personality.number),
      calculation: personality.calculation,
    };
    payload.numbers.maturity = {
      ...buildMeaning("maturity", maturity.value),
      calculation: {
        method: "Life Path number plus Expression number, then reduced.",
        total: maturityTotal,
        steps: [`${lifePath.number} + ${expression.number} = ${maturityTotal}`, ...maturity.steps],
      },
    };
  } else {
    payload.notes.push(
      "Add your full birth name to unlock the Expression, Soul Urge, Personality and Maturity numbers."
    );
  }

  payload.highlights = [
    `Life Path ${payload.numbers.lifePath.number} — ${payload.numbers.lifePath.title}: ${payload.numbers.lifePath.keywords.join(", ")}.`,
    `Birthday ${payload.numbers.birthday.number} — ${payload.numbers.birthday.title}: ${payload.numbers.birthday.keywords.join(", ")}.`,
  ];
  if (payload.numbers.expression) {
    payload.highlights.push(
      `Expression ${payload.numbers.expression.number} — ${payload.numbers.expression.title}: ${payload.numbers.expression.keywords.join(", ")}.`
    );
  }
  if (payload.numbers.soulUrge) {
    payload.highlights.push(
      `Soul Urge ${payload.numbers.soulUrge.number} — what your heart wants is ${payload.numbers.soulUrge.keywords.join(", ")}.`
    );
  }

  return payload;
};

module.exports = {
  calculate,
  reduceNumber,
  SYSTEM_LIST: Object.values(SYSTEMS),
  NUMBER_MEANINGS,
  SYSTEMS,
};