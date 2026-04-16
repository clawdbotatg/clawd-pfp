// Mad Libs-style random prompt generator for the "Surprise Me" button on the
// CLAWD PFP Generator. The goal is playful, creative, PG-ish combinations.
// Keeping arrays here (instead of inline in the component) keeps the form
// component readable and makes the word banks easy to extend.

const ADJECTIVES = [
  "grumpy",
  "majestic",
  "disheveled",
  "suspicious",
  "radiant",
  "existential",
  "overconfident",
  "world-weary",
  "caffeinated",
  "enlightened",
  "bewildered",
  "dapper",
  "sleep-deprived",
  "philosophical",
  "triumphant",
  "heartbroken",
  "scheming",
  "zen",
  "melancholy",
  "mischievous",
  "stoic",
  "flustered",
  "glamorous",
  "paranoid",
  "smug",
];

const SUBJECTS = [
  "accountant",
  "pirate captain",
  "yoga instructor",
  "detective",
  "astronaut",
  "barista",
  "librarian",
  "carnival barker",
  "wizard",
  "stand-up comedian",
  "chess grandmaster",
  "lighthouse keeper",
  "jazz trumpeter",
  "sushi chef",
  "motivational speaker",
  "fortune teller",
  "park ranger",
  "opera singer",
  "ice cream vendor",
  "bounty hunter",
  "tango dancer",
  "rodeo clown",
  "samurai",
  "DJ",
  "tax auditor",
  "cryptozoologist",
];

const SETTINGS = [
  "at a craps table",
  "in a thunderstorm",
  "on a rooftop at sunset",
  "at a karaoke bar",
  "in a submarine",
  "at a farmer's market",
  "in a lighthouse",
  "at a haunted motel",
  "in a space diner",
  "on a paddleboard",
  "on the Oregon Trail",
  "in a 24-hour laundromat",
  "at the county fair",
  "in a misty bamboo forest",
  "on a cruise ship buffet",
  "at a roadside taco stand",
  "in an abandoned arcade",
  "on the summit of a volcano",
  "at a silent disco",
  "in a Tokyo vending machine alley",
  "at a drive-in movie",
  "in a snow globe",
  "at a Las Vegas wedding chapel",
  "on a trans-Siberian train",
  "in a Parisian cafe at dawn",
];

const STYLES = [
  "renaissance painting",
  "comic book style",
  "oil painting",
  "claymation",
  "neon cyberpunk",
  "watercolor",
  "pixel art",
  "film noir",
  "ukiyo-e woodblock print",
  "low-poly 3D render",
  "stained glass",
  "chalk pastel",
  "vaporwave",
  "art deco poster",
  "storybook illustration",
  "polaroid photograph",
  "charcoal sketch",
  "risograph print",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const MAX_SURPRISE_PROMPT_LENGTH = 280;

export function getRandomSurprisePrompt(maxLength = MAX_SURPRISE_PROMPT_LENGTH): string {
  // Try a few times in the extremely unlikely event we overshoot maxLength.
  for (let i = 0; i < 5; i++) {
    const adj = pick(ADJECTIVES);
    const subject = pick(SUBJECTS);
    const setting = pick(SETTINGS);
    const style = pick(STYLES);
    const prompt = `${adj} ${subject} ${setting}, ${style}`;
    if (prompt.length <= maxLength) return prompt;
  }
  // Fallback: guaranteed short.
  return `${pick(ADJECTIVES)} ${pick(SUBJECTS)}`;
}
