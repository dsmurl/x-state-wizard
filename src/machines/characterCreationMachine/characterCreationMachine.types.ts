// Character types
export const characters = ["warrior", "wizard", "archer", "nerd"] as const;
export type CharacterClass = (typeof characters)[number];

// Item types
export const items = ["ring", "potion", "crown", "calc"] as const;
export type Item = (typeof items)[number];
