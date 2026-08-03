import type {
  Destination,
  Experience,
  Faq,
  Package,
  Partner,
  Testimonial,
  TravelCategory,
} from "@/lib/data/types";

/**
 * Single source of truth for seed content. A future Supabase seed (`seed.sql`)
 * mirrors this exactly. Image URLs are Unsplash CDN links; the UI degrades to a
 * branded gradient if any fail to load.
 */
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=70`;

export const destinations: Destination[] = [
  {
    id: "d-santorini",
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    region: "Cyclades",
    summary: {
      en: "Whitewashed caldera villages, volcanic beaches, and the Aegean's most storied sunsets.",
      fr: "Villages blanchis à la chaux sur la caldeira, plages volcaniques et les couchers de soleil les plus légendaires de la mer Égée.",
    },
    image: img("1570077188670-e3a8d69ac5ff"),
    tags: ["island", "romance", "sunset"],
    priceFrom: 3200,
    currency: "USD",
    featured: true,
  },
  {
    id: "d-maldives",
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    region: "Indian Ocean",
    summary: {
      en: "Overwater villas above impossibly clear lagoons, house reefs, and private sandbanks.",
      fr: "Villas sur pilotis au-dessus de lagons d'une clarté irréelle, récifs privés et bancs de sable isolés.",
    },
    image: img("1514282401047-d79a71a590e8"),
    tags: ["island", "diving", "overwater"],
    priceFrom: 5400,
    currency: "USD",
    featured: true,
  },
  {
    id: "d-kyoto",
    slug: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Kansai",
    summary: {
      en: "Temple gardens, ryokan hospitality, and centuries of craft beneath the maples.",
      fr: "Jardins de temples, hospitalité en ryokan et des siècles d'artisanat sous les érables.",
    },
    image: img("1493976040374-85c8e12f0c0e"),
    tags: ["culture", "city", "gardens"],
    priceFrom: 4100,
    currency: "USD",
    featured: true,
  },
  {
    id: "d-amalfi",
    slug: "amalfi-coast",
    name: "Amalfi Coast",
    country: "Italy",
    region: "Campania",
    summary: {
      en: "Cliffside villages, lemon groves, and long lunches above a cobalt sea.",
      fr: "Villages perchés, citronneraies et longs déjeuners au-dessus d'une mer cobalt.",
    },
    image: img("1533104816931-20fa691ff6ca"),
    tags: ["coast", "romance", "cuisine"],
    priceFrom: 3800,
    currency: "USD",
    featured: true,
  },
  {
    id: "d-bali",
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Lesser Sunda Islands",
    summary: {
      en: "Rice terraces, temple ceremonies, and jungle retreats framed by the Indian Ocean.",
      fr: "Rizières en terrasses, cérémonies au temple et retraites dans la jungle bordées par l'océan Indien.",
    },
    image: img("1537996194471-e657df975ab4"),
    tags: ["island", "wellness", "jungle"],
    priceFrom: 2900,
    currency: "USD",
    featured: false,
  },
  {
    id: "d-swiss-alps",
    slug: "swiss-alps",
    name: "Swiss Alps",
    country: "Switzerland",
    region: "Bernese Oberland",
    summary: {
      en: "Glacier peaks, grand mountain hotels, and first tracks above the clouds.",
      fr: "Sommets glaciaires, grands hôtels de montagne et premières traces au-dessus des nuages.",
    },
    image: img("1531366936337-7c912a4589a7"),
    tags: ["mountains", "ski", "wellness"],
    priceFrom: 4600,
    currency: "USD",
    featured: false,
  },
];

export const packages: Package[] = [
  {
    id: "p-santorini-escape",
    slug: "santorini-caldera-escape",
    destinationSlug: "santorini",
    title: {
      en: "Caldera Escape",
      fr: "Escapade sur la Caldeira",
    },
    tier: "premium",
    nights: 5,
    priceFrom: 3200,
    currency: "USD",
    inclusions: {
      en: ["Cave-suite with private plunge pool", "Private catamaran sunset sail", "Sommelier-led Assyrtiko tasting"],
      fr: ["Suite troglodyte avec bassin privé", "Croisière privée en catamaran au coucher du soleil", "Dégustation d'Assyrtiko avec sommelier"],
    },
    image: img("1570077188670-e3a8d69ac5ff"),
  },
  {
    id: "p-maldives-overwater",
    slug: "maldives-overwater-retreat",
    destinationSlug: "maldives",
    title: {
      en: "Overwater Retreat",
      fr: "Retraite sur Pilotis",
    },
    tier: "ultra",
    nights: 7,
    priceFrom: 5400,
    currency: "USD",
    inclusions: {
      en: ["Two-storey overwater villa", "Seaplane transfers", "Private reef dive with marine biologist"],
      fr: ["Villa sur pilotis à deux étages", "Transferts en hydravion", "Plongée sur récif privé avec un biologiste marin"],
    },
    image: img("1514282401047-d79a71a590e8"),
  },
  {
    id: "p-kyoto-machiya",
    slug: "kyoto-machiya-immersion",
    destinationSlug: "kyoto",
    title: {
      en: "Machiya Immersion",
      fr: "Immersion en Machiya",
    },
    tier: "premium",
    nights: 6,
    priceFrom: 4100,
    currency: "USD",
    inclusions: {
      en: ["Restored townhouse with garden", "Private tea ceremony", "Dawn temple visit before the crowds"],
      fr: ["Maison de ville restaurée avec jardin", "Cérémonie du thé privée", "Visite d'un temple à l'aube avant la foule"],
    },
    image: img("1493976040374-85c8e12f0c0e"),
  },
  {
    id: "p-amalfi-coast",
    slug: "amalfi-cliffside-summer",
    destinationSlug: "amalfi-coast",
    title: {
      en: "Cliffside Summer",
      fr: "Été sur les Falaises",
    },
    tier: "comfort",
    nights: 5,
    priceFrom: 3800,
    currency: "USD",
    inclusions: {
      en: ["Sea-view suite in Positano", "Private gozzo boat day", "Chef's table in the lemon grove"],
      fr: ["Suite vue mer à Positano", "Journée en bateau gozzo privé", "Table du chef dans la citronneraie"],
    },
    image: img("1533104816931-20fa691ff6ca"),
  },
  {
    id: "p-swiss-first-tracks",
    slug: "swiss-first-tracks",
    destinationSlug: "swiss-alps",
    title: {
      en: "First Tracks",
      fr: "Premières Traces",
    },
    tier: "premium",
    nights: 4,
    priceFrom: 4600,
    currency: "USD",
    inclusions: {
      en: ["Slope-side grand hotel", "Private ski guide", "Alpine spa and glacier lunch"],
      fr: ["Grand hôtel au pied des pistes", "Guide de ski privé", "Spa alpin et déjeuner sur le glacier"],
    },
    image: img("1531366936337-7c912a4589a7"),
  },
];

export const experiences: Experience[] = [
  {
    id: "e-sunset-sail",
    title: { en: "Private Sunset Sail", fr: "Croisière Privée au Coucher du Soleil" },
    category: "water",
    image: img("1500375592092-40eb2168fd21"),
  },
  {
    id: "e-tea-ceremony",
    title: { en: "Tea Ceremony", fr: "Cérémonie du Thé" },
    category: "culture",
    image: img("1545569341-9eb8b30979d9"),
  },
  {
    id: "e-reef-dive",
    title: { en: "Guided Reef Dive", fr: "Plongée Guidée sur Récif" },
    category: "water",
    image: img("1544551763-46a013bb70d5"),
  },
  {
    id: "e-alpine-heli",
    title: { en: "Alpine Heli-Picnic", fr: "Héli-Pique-Nique Alpin" },
    category: "mountains",
    image: img("1531366936337-7c912a4589a7"),
  },
  {
    id: "e-chef-table",
    title: { en: "Chef's Table", fr: "Table du Chef" },
    category: "cuisine",
    image: img("1414235077428-338989a2e8c0"),
  },
  {
    id: "e-spa-ritual",
    title: { en: "Signature Spa Ritual", fr: "Rituel Spa Signature" },
    category: "wellness",
    image: img("1540555700478-4be289fbecef"),
  },
];

export const categories: TravelCategory[] = [
  {
    id: "c-islands",
    slug: "islands",
    label: { en: "Islands", fr: "Îles" },
    description: { en: "Barefoot luxury on private shores.", fr: "Luxe pieds nus sur des rivages privés." },
    image: img("1514282401047-d79a71a590e8"),
  },
  {
    id: "c-mountains",
    slug: "mountains",
    label: { en: "Mountains", fr: "Montagnes" },
    description: { en: "Peaks, glaciers, and grand alpine hotels.", fr: "Sommets, glaciers et grands hôtels alpins." },
    image: img("1531366936337-7c912a4589a7"),
  },
  {
    id: "c-culture",
    slug: "culture",
    label: { en: "Culture", fr: "Culture" },
    description: { en: "Cities, temples, and living craft.", fr: "Villes, temples et artisanat vivant." },
    image: img("1493976040374-85c8e12f0c0e"),
  },
  {
    id: "c-wellness",
    slug: "wellness",
    label: { en: "Wellness", fr: "Bien-être" },
    description: { en: "Retreats to slow down and restore.", fr: "Des retraites pour ralentir et se ressourcer." },
    image: img("1540555700478-4be289fbecef"),
  },
  {
    id: "c-cuisine",
    slug: "cuisine",
    label: { en: "Cuisine", fr: "Gastronomie" },
    description: { en: "Chef's tables and terroir journeys.", fr: "Tables de chefs et voyages de terroir." },
    image: img("1414235077428-338989a2e8c0"),
  },
  {
    id: "c-coast",
    slug: "coast",
    label: { en: "Coast", fr: "Littoral" },
    description: { en: "Cliffside villages and cobalt seas.", fr: "Villages perchés et mers cobalt." },
    image: img("1533104816931-20fa691ff6ca"),
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    author: "Élise Marchand",
    location: "Paris, France",
    rating: 5,
    quote: {
      en: "Every detail was anticipated before we thought to ask. The most seamless trip we've ever taken.",
      fr: "Chaque détail était anticipé avant même que nous y pensions. Le voyage le plus fluide que nous ayons jamais fait.",
    },
  },
  {
    id: "t-2",
    author: "James Okoro",
    location: "London, UK",
    rating: 5,
    quote: {
      en: "The private reef dive in the Maldives was the experience of a lifetime — flawlessly arranged.",
      fr: "La plongée privée sur récif aux Maldives a été l'expérience d'une vie — organisée à la perfection.",
    },
  },
  {
    id: "t-3",
    author: "Sofia Ricci",
    location: "Milan, Italy",
    rating: 5,
    quote: {
      en: "Kyoto at dawn, with no crowds and a guide who opened every door. Simply magical.",
      fr: "Kyoto à l'aube, sans foule et avec un guide qui ouvrait toutes les portes. Tout simplement magique.",
    },
  },
  {
    id: "t-4",
    author: "Daniel Fischer",
    location: "Zürich, Switzerland",
    rating: 5,
    quote: {
      en: "First tracks on an empty glacier, then a spa at altitude. They think of everything.",
      fr: "Premières traces sur un glacier désert, puis un spa en altitude. Ils pensent à tout.",
    },
  },
];

export const partners: Partner[] = [
  { id: "pa-1", name: "Aurelia Hotels", category: "Hotels" },
  { id: "pa-2", name: "Meridian Air", category: "Aviation" },
  { id: "pa-3", name: "Blue Horizon Yachts", category: "Charter" },
  { id: "pa-4", name: "Terra Spa Collective", category: "Wellness" },
  { id: "pa-5", name: "Atlas Private Guides", category: "Guiding" },
  { id: "pa-6", name: "Solace Residences", category: "Villas" },
  { id: "pa-7", name: "Vela Cruises", category: "Sailing" },
  { id: "pa-8", name: "Lumen Concierge", category: "Concierge" },
];

export const faqs: Faq[] = [
  {
    id: "f-1",
    question: { en: "How does booking work?", fr: "Comment se déroule la réservation ?" },
    answer: {
      en: "Start with our booking wizard to share your destination, dates, and preferences. A travel designer then tailors and confirms every detail with you.",
      fr: "Commencez par notre assistant de réservation pour indiquer votre destination, vos dates et vos préférences. Un concepteur de voyage personnalise ensuite chaque détail avec vous.",
    },
  },
  {
    id: "f-2",
    question: { en: "Can trips be fully customized?", fr: "Les voyages sont-ils entièrement personnalisables ?" },
    answer: {
      en: "Always. Packages are starting points — every itinerary is shaped around you, from suites to experiences to pacing.",
      fr: "Toujours. Les forfaits sont des points de départ — chaque itinéraire est conçu pour vous, des suites aux expériences au rythme.",
    },
  },
  {
    id: "f-3",
    question: { en: "What is included in the price?", fr: "Qu'est-ce qui est inclus dans le prix ?" },
    answer: {
      en: "Accommodation, signature experiences, and private transfers as listed. Flights and personal spending are quoted separately and transparently.",
      fr: "L'hébergement, les expériences signature et les transferts privés indiqués. Les vols et dépenses personnelles sont chiffrés séparément et en toute transparence.",
    },
  },
  {
    id: "f-4",
    question: { en: "Do you support special requests?", fr: "Gérez-vous les demandes spéciales ?" },
    answer: {
      en: "Dietary needs, accessibility, celebrations, and beyond — share it and we'll arrange it.",
      fr: "Régimes alimentaires, accessibilité, célébrations et plus encore — partagez-le et nous l'organiserons.",
    },
  },
  {
    id: "f-5",
    question: { en: "What is your cancellation policy?", fr: "Quelle est votre politique d'annulation ?" },
    answer: {
      en: "Terms vary by partner and season; your travel designer confirms them in writing before anything is booked.",
      fr: "Les conditions varient selon le partenaire et la saison ; votre concepteur de voyage les confirme par écrit avant toute réservation.",
    },
  },
  {
    id: "f-6",
    question: { en: "Which regions do you cover?", fr: "Quelles régions couvrez-vous ?" },
    answer: {
      en: "Our featured collection spans the Mediterranean, Asia, and the Indian Ocean, with bespoke journeys available worldwide.",
      fr: "Notre collection s'étend de la Méditerranée à l'Asie et à l'océan Indien, avec des voyages sur mesure disponibles dans le monde entier.",
    },
  },
];
