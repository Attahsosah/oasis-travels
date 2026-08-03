import type { Localized } from "@/lib/data/types";

const portrait = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export interface Designer {
  id: string;
  name: string;
  role: Localized<string>;
  languages: string;
  image: string;
  bio: Localized<string>;
}

export const designers: Designer[] = [
  {
    id: "d-amara",
    name: "Amara Okafor",
    role: { en: "Africa & safari specialist", fr: "Spécialiste Afrique & safari" },
    languages: "English, French, Swahili",
    image: portrait("1580489944761-15a19d654956"),
    bio: {
      en: "Fifteen seasons across East and Southern Africa. Amara plans around the light, the migration, and the camps that treat you like family.",
      fr: "Quinze saisons à travers l'Afrique de l'Est et australe. Amara compose avec la lumière, la migration et les camps qui vous accueillent comme un proche.",
    },
  },
  {
    id: "d-luca",
    name: "Luca Ferrari",
    role: { en: "Italy & Mediterranean", fr: "Italie & Méditerranée" },
    languages: "Italian, English",
    image: portrait("1507003211169-0a1dd7228f2d"),
    bio: {
      en: "Raised between Rome and the Amalfi Coast, Luca opens doors others can't — the family trattoria, the private cellar, the quiet cove.",
      fr: "Élevé entre Rome et la côte amalfitaine, Luca ouvre des portes fermées aux autres — la trattoria familiale, la cave privée, la crique tranquille.",
    },
  },
  {
    id: "d-mei",
    name: "Mei Tanaka",
    role: { en: "Japan & East Asia", fr: "Japon & Asie de l'Est" },
    languages: "Japanese, English",
    image: portrait("1544005313-94ddf0286df2"),
    bio: {
      en: "Mei choreographs journeys through Japan with a curator's eye — dawn temples, ryokan rituals, and the seasons that change everything.",
      fr: "Mei orchestre des voyages au Japon avec un œil de conservatrice — temples à l'aube, rituels en ryokan et des saisons qui changent tout.",
    },
  },
  {
    id: "d-sofia",
    name: "Sofia Reyes",
    role: { en: "Latin America & islands", fr: "Amérique latine & îles" },
    languages: "Spanish, English, Portuguese",
    image: portrait("1487412720507-e7ab37603c6f"),
    bio: {
      en: "From Patagonia to the Caribbean, Sofia builds journeys with rhythm — big landscapes balanced with slow, sun-warmed days by the water.",
      fr: "De la Patagonie aux Caraïbes, Sofia construit des voyages avec du rythme — grands paysages et journées douces au bord de l'eau.",
    },
  },
];
