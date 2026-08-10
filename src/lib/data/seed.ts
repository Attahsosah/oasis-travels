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
    id: "d-dubai",
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    summary: {
      en: "Connecting flights from Bujumbura to the Gulf's business and shopping capital — visa assistance and hotels arranged end to end.",
      fr: "Vols en correspondance depuis Bujumbura vers la capitale des affaires et du shopping du Golfe — assistance visa et hôtels organisés de bout en bout.",
    },
    image: img("1512453979798-5ea266f8880c"),
    tags: ["shopping", "business", "family"],
    priceFrom: 780,
    currency: "USD",
    featured: true,
  },
  {
    id: "d-nairobi",
    slug: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    region: "East Africa",
    summary: {
      en: "The regional hub next door — frequent, affordable flights for business, safari, and onward connections worldwide.",
      fr: "Le hub régional voisin — des vols fréquents et abordables pour les affaires, le safari et les correspondances vers le monde entier.",
    },
    image: img("1611348586804-61bf6c080437"),
    tags: ["safari", "business", "connections"],
    priceFrom: 260,
    currency: "USD",
    featured: true,
  },
  {
    id: "d-kigali",
    slug: "kigali",
    name: "Kigali",
    country: "Rwanda",
    region: "East Africa",
    summary: {
      en: "A quick hop across the border — ideal for business trips, conferences, and easy weekend getaways.",
      fr: "Un saut de puce de l'autre côté de la frontière — idéal pour les voyages d'affaires, les conférences et les week-ends.",
    },
    image: img("1580060839134-75a5edca2e99"),
    tags: ["short-haul", "business", "weekend"],
    priceFrom: 180,
    currency: "USD",
    featured: true,
  },
  {
    id: "d-istanbul",
    slug: "istanbul",
    name: "Istanbul",
    country: "Türkiye",
    region: "Europe & Asia",
    summary: {
      en: "Where two continents meet — a favourite gateway for shopping, culture, and connections onward into Europe.",
      fr: "Là où deux continents se rencontrent — une porte d'entrée prisée pour le shopping, la culture et les correspondances vers l'Europe.",
    },
    image: img("1524231757912-21f4fe3a7200"),
    tags: ["culture", "shopping", "connections"],
    priceFrom: 720,
    currency: "USD",
    featured: true,
  },
  {
    id: "d-guangzhou",
    slug: "guangzhou",
    name: "Guangzhou",
    country: "China",
    region: "East Asia",
    summary: {
      en: "China's trade gateway — the route of choice for importers and wholesalers, with visas handled end to end.",
      fr: "La porte du commerce chinois — l'itinéraire de choix pour les importateurs et grossistes, avec le visa géré de bout en bout.",
    },
    image: img("1535139262971-c51845709a48"),
    tags: ["trade", "business", "wholesale"],
    priceFrom: 920,
    currency: "USD",
    featured: false,
  },
  {
    id: "d-mumbai",
    slug: "mumbai",
    name: "Mumbai",
    country: "India",
    region: "South Asia",
    summary: {
      en: "A leading destination for medical travel and trade, with trusted partners on the ground and full visa support.",
      fr: "Une destination de référence pour le tourisme médical et le commerce, avec des partenaires de confiance sur place et un accompagnement visa complet.",
    },
    image: img("1529253355930-ddbe423a2ac7"),
    tags: ["medical", "business", "culture"],
    priceFrom: 690,
    currency: "USD",
    featured: false,
  },
];

export const packages: Package[] = [
  {
    id: "p-dubai-city-break",
    slug: "dubai-city-break",
    destinationSlug: "dubai",
    title: {
      en: "Dubai City Break",
      fr: "Escapade à Dubaï",
    },
    tier: "premium",
    nights: 4,
    priceFrom: 1150,
    currency: "USD",
    inclusions: {
      en: ["Return flights from Bujumbura", "4 nights hotel with breakfast", "Desert safari & Burj Khalifa visit", "Airport transfers & UAE visa"],
      fr: ["Vols aller-retour depuis Bujumbura", "4 nuits d'hôtel avec petit-déjeuner", "Safari dans le désert et visite du Burj Khalifa", "Transferts aéroport et visa EAU"],
    },
    image: img("1512453979798-5ea266f8880c"),
  },
  {
    id: "p-nairobi-safari",
    slug: "nairobi-masai-mara-safari",
    destinationSlug: "nairobi",
    title: {
      en: "Masai Mara Safari",
      fr: "Safari au Masai Mara",
    },
    tier: "premium",
    nights: 5,
    priceFrom: 1650,
    currency: "USD",
    inclusions: {
      en: ["Return flights & transfers", "4 nights safari lodge, full board", "Game drives in the Masai Mara", "Park fees & driver-guide"],
      fr: ["Vols aller-retour et transferts", "4 nuits en lodge, pension complète", "Safaris dans le Masai Mara", "Frais de parc et chauffeur-guide"],
    },
    image: img("1516426122078-c23e76319801"),
  },
  {
    id: "p-istanbul-discovery",
    slug: "istanbul-discovery",
    destinationSlug: "istanbul",
    title: {
      en: "Istanbul Discovery",
      fr: "Istanbul en Découverte",
    },
    tier: "comfort",
    nights: 4,
    priceFrom: 980,
    currency: "USD",
    inclusions: {
      en: ["Return flights from Bujumbura", "4 nights central hotel", "Old City & Bosphorus tour", "Airport transfers"],
      fr: ["Vols aller-retour depuis Bujumbura", "4 nuits en hôtel central", "Visite de la vieille ville et du Bosphore", "Transferts aéroport"],
    },
    image: img("1524231757912-21f4fe3a7200"),
  },
  {
    id: "p-kigali-weekend",
    slug: "kigali-weekend",
    destinationSlug: "kigali",
    title: {
      en: "Kigali Weekend",
      fr: "Week-end à Kigali",
    },
    tier: "comfort",
    nights: 2,
    priceFrom: 420,
    currency: "USD",
    inclusions: {
      en: ["Return flights & transfers", "2 nights city hotel", "Kigali city & memorial tour"],
      fr: ["Vols aller-retour et transferts", "2 nuits en hôtel", "Visite de Kigali et du mémorial"],
    },
    image: img("1580060839134-75a5edca2e99"),
  },
  {
    id: "p-mumbai-health-travel",
    slug: "mumbai-health-travel",
    destinationSlug: "mumbai",
    title: {
      en: "Mumbai Health Travel",
      fr: "Voyage Santé à Mumbai",
    },
    tier: "comfort",
    nights: 7,
    priceFrom: 1450,
    currency: "USD",
    inclusions: {
      en: ["Return flights & airport transfers", "Hospital appointment coordination", "7 nights nearby accommodation", "On-the-ground support"],
      fr: ["Vols aller-retour et transferts aéroport", "Coordination des rendez-vous médicaux", "7 nuits d'hébergement à proximité", "Assistance sur place"],
    },
    image: img("1529253355930-ddbe423a2ac7"),
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
  { id: "pa-1", name: "Kenya Airways", category: "Airline" },
  { id: "pa-2", name: "RwandAir", category: "Airline" },
  { id: "pa-3", name: "flydubai", category: "Airline" },
  { id: "pa-4", name: "Ethiopian Airlines", category: "Airline" },
  { id: "pa-5", name: "Qatar Airways", category: "Airline" },
  { id: "pa-6", name: "Turkish Airlines", category: "Airline" },
  { id: "pa-7", name: "Brussels Airlines", category: "Airline" },
  { id: "pa-8", name: "Emirates", category: "Airline" },
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
