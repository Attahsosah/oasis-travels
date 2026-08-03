-- Azure Horizons — seed content. Mirrors src/lib/data/seed.ts (single source of
-- truth). Localized prose lives in `i18n` jsonb ({ en, fr }); dollar-quoting is
-- used for the jsonb blobs so French apostrophes need no escaping.
-- Image URLs are Unsplash CDN links.

-- Destinations -------------------------------------------------------------
insert into public.destinations (id, slug, name, country, region, hero_image, tags, price_from, currency, featured, i18n) values
('d-santorini', 'santorini', 'Santorini', 'Greece', 'Cyclades',
 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=70',
 '{island,romance,sunset}', 3200, 'EUR', true,
 $${"en":{"summary":"Whitewashed caldera villages, volcanic beaches, and the Aegean's most storied sunsets."},"fr":{"summary":"Villages blanchis à la chaux sur la caldeira, plages volcaniques et les couchers de soleil les plus légendaires de la mer Égée."}}$$::jsonb),
('d-maldives', 'maldives', 'Maldives', 'Maldives', 'Indian Ocean',
 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=70',
 '{island,diving,overwater}', 5400, 'EUR', true,
 $${"en":{"summary":"Overwater villas above impossibly clear lagoons, house reefs, and private sandbanks."},"fr":{"summary":"Villas sur pilotis au-dessus de lagons d'une clarté irréelle, récifs privés et bancs de sable isolés."}}$$::jsonb),
('d-kyoto', 'kyoto', 'Kyoto', 'Japan', 'Kansai',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=70',
 '{culture,city,gardens}', 4100, 'EUR', true,
 $${"en":{"summary":"Temple gardens, ryokan hospitality, and centuries of craft beneath the maples."},"fr":{"summary":"Jardins de temples, hospitalité en ryokan et des siècles d'artisanat sous les érables."}}$$::jsonb),
('d-amalfi', 'amalfi-coast', 'Amalfi Coast', 'Italy', 'Campania',
 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1600&q=70',
 '{coast,romance,cuisine}', 3800, 'EUR', true,
 $${"en":{"summary":"Cliffside villages, lemon groves, and long lunches above a cobalt sea."},"fr":{"summary":"Villages perchés, citronneraies et longs déjeuners au-dessus d'une mer cobalt."}}$$::jsonb),
('d-bali', 'bali', 'Bali', 'Indonesia', 'Lesser Sunda Islands',
 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=70',
 '{island,wellness,jungle}', 2900, 'EUR', false,
 $${"en":{"summary":"Rice terraces, temple ceremonies, and jungle retreats framed by the Indian Ocean."},"fr":{"summary":"Rizières en terrasses, cérémonies au temple et retraites dans la jungle bordées par l'océan Indien."}}$$::jsonb),
('d-swiss-alps', 'swiss-alps', 'Swiss Alps', 'Switzerland', 'Bernese Oberland',
 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=70',
 '{mountains,ski,wellness}', 4600, 'EUR', false,
 $${"en":{"summary":"Glacier peaks, grand mountain hotels, and first tracks above the clouds."},"fr":{"summary":"Sommets glaciaires, grands hôtels de montagne et premières traces au-dessus des nuages."}}$$::jsonb)
on conflict (id) do nothing;

-- Packages -----------------------------------------------------------------
insert into public.packages (id, slug, destination_slug, tier, nights, price_from, currency, hero_image, i18n) values
('p-santorini-escape', 'santorini-caldera-escape', 'santorini', 'premium', 5, 3200, 'EUR',
 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=70',
 $${"en":{"title":"Caldera Escape","inclusions":["Cave-suite with private plunge pool","Private catamaran sunset sail","Sommelier-led Assyrtiko tasting"]},"fr":{"title":"Escapade sur la Caldeira","inclusions":["Suite troglodyte avec bassin privé","Croisière privée en catamaran au coucher du soleil","Dégustation d'Assyrtiko avec sommelier"]}}$$::jsonb),
('p-maldives-overwater', 'maldives-overwater-retreat', 'maldives', 'ultra', 7, 5400, 'EUR',
 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=70',
 $${"en":{"title":"Overwater Retreat","inclusions":["Two-storey overwater villa","Seaplane transfers","Private reef dive with marine biologist"]},"fr":{"title":"Retraite sur Pilotis","inclusions":["Villa sur pilotis à deux étages","Transferts en hydravion","Plongée sur récif privé avec un biologiste marin"]}}$$::jsonb),
('p-kyoto-machiya', 'kyoto-machiya-immersion', 'kyoto', 'premium', 6, 4100, 'EUR',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=70',
 $${"en":{"title":"Machiya Immersion","inclusions":["Restored townhouse with garden","Private tea ceremony","Dawn temple visit before the crowds"]},"fr":{"title":"Immersion en Machiya","inclusions":["Maison de ville restaurée avec jardin","Cérémonie du thé privée","Visite d'un temple à l'aube avant la foule"]}}$$::jsonb),
('p-amalfi-coast', 'amalfi-cliffside-summer', 'amalfi-coast', 'comfort', 5, 3800, 'EUR',
 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1600&q=70',
 $${"en":{"title":"Cliffside Summer","inclusions":["Sea-view suite in Positano","Private gozzo boat day","Chef's table in the lemon grove"]},"fr":{"title":"Été sur les Falaises","inclusions":["Suite vue mer à Positano","Journée en bateau gozzo privé","Table du chef dans la citronneraie"]}}$$::jsonb),
('p-swiss-first-tracks', 'swiss-first-tracks', 'swiss-alps', 'premium', 4, 4600, 'EUR',
 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=70',
 $${"en":{"title":"First Tracks","inclusions":["Slope-side grand hotel","Private ski guide","Alpine spa and glacier lunch"]},"fr":{"title":"Premières Traces","inclusions":["Grand hôtel au pied des pistes","Guide de ski privé","Spa alpin et déjeuner sur le glacier"]}}$$::jsonb)
on conflict (id) do nothing;

-- Experiences --------------------------------------------------------------
insert into public.experiences (id, category, image, i18n) values
('e-sunset-sail', 'water', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=70', $${"en":{"title":"Private Sunset Sail"},"fr":{"title":"Croisière Privée au Coucher du Soleil"}}$$::jsonb),
('e-tea-ceremony', 'culture', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1600&q=70', $${"en":{"title":"Tea Ceremony"},"fr":{"title":"Cérémonie du Thé"}}$$::jsonb),
('e-reef-dive', 'water', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=70', $${"en":{"title":"Guided Reef Dive"},"fr":{"title":"Plongée Guidée sur Récif"}}$$::jsonb),
('e-alpine-heli', 'mountains', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=70', $${"en":{"title":"Alpine Heli-Picnic"},"fr":{"title":"Héli-Pique-Nique Alpin"}}$$::jsonb),
('e-chef-table', 'cuisine', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=70', $${"en":{"title":"Chef's Table"},"fr":{"title":"Table du Chef"}}$$::jsonb),
('e-spa-ritual', 'wellness', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=70', $${"en":{"title":"Signature Spa Ritual"},"fr":{"title":"Rituel Spa Signature"}}$$::jsonb)
on conflict (id) do nothing;

-- Categories ---------------------------------------------------------------
insert into public.categories (id, slug, image, i18n) values
('c-islands', 'islands', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=70', $${"en":{"label":"Islands","description":"Barefoot luxury on private shores."},"fr":{"label":"Îles","description":"Luxe pieds nus sur des rivages privés."}}$$::jsonb),
('c-mountains', 'mountains', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=70', $${"en":{"label":"Mountains","description":"Peaks, glaciers, and grand alpine hotels."},"fr":{"label":"Montagnes","description":"Sommets, glaciers et grands hôtels alpins."}}$$::jsonb),
('c-culture', 'culture', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=70', $${"en":{"label":"Culture","description":"Cities, temples, and living craft."},"fr":{"label":"Culture","description":"Villes, temples et artisanat vivant."}}$$::jsonb),
('c-wellness', 'wellness', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=70', $${"en":{"label":"Wellness","description":"Retreats to slow down and restore."},"fr":{"label":"Bien-être","description":"Des retraites pour ralentir et se ressourcer."}}$$::jsonb),
('c-cuisine', 'cuisine', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=70', $${"en":{"label":"Cuisine","description":"Chef's tables and terroir journeys."},"fr":{"label":"Gastronomie","description":"Tables de chefs et voyages de terroir."}}$$::jsonb),
('c-coast', 'coast', 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1600&q=70', $${"en":{"label":"Coast","description":"Cliffside villages and cobalt seas."},"fr":{"label":"Littoral","description":"Villages perchés et mers cobalt."}}$$::jsonb)
on conflict (id) do nothing;

-- Testimonials -------------------------------------------------------------
insert into public.testimonials (id, author, location, rating, i18n) values
('t-1', 'Élise Marchand', 'Paris, France', 5, $${"en":{"quote":"Every detail was anticipated before we thought to ask. The most seamless trip we've ever taken."},"fr":{"quote":"Chaque détail était anticipé avant même que nous y pensions. Le voyage le plus fluide que nous ayons jamais fait."}}$$::jsonb),
('t-2', 'James Okoro', 'London, UK', 5, $${"en":{"quote":"The private reef dive in the Maldives was the experience of a lifetime — flawlessly arranged."},"fr":{"quote":"La plongée privée sur récif aux Maldives a été l'expérience d'une vie — organisée à la perfection."}}$$::jsonb),
('t-3', 'Sofia Ricci', 'Milan, Italy', 5, $${"en":{"quote":"Kyoto at dawn, with no crowds and a guide who opened every door. Simply magical."},"fr":{"quote":"Kyoto à l'aube, sans foule et avec un guide qui ouvrait toutes les portes. Tout simplement magique."}}$$::jsonb),
('t-4', 'Daniel Fischer', 'Zürich, Switzerland', 5, $${"en":{"quote":"First tracks on an empty glacier, then a spa at altitude. They think of everything."},"fr":{"quote":"Premières traces sur un glacier désert, puis un spa en altitude. Ils pensent à tout."}}$$::jsonb)
on conflict (id) do nothing;

-- Partners -----------------------------------------------------------------
insert into public.partners (id, name, category) values
('pa-1', 'Aurelia Hotels', 'Hotels'),
('pa-2', 'Meridian Air', 'Aviation'),
('pa-3', 'Blue Horizon Yachts', 'Charter'),
('pa-4', 'Terra Spa Collective', 'Wellness'),
('pa-5', 'Atlas Private Guides', 'Guiding'),
('pa-6', 'Solace Residences', 'Villas'),
('pa-7', 'Vela Cruises', 'Sailing'),
('pa-8', 'Lumen Concierge', 'Concierge')
on conflict (id) do nothing;

-- FAQs ---------------------------------------------------------------------
insert into public.faqs (id, i18n) values
('f-1', $${"en":{"question":"How does booking work?","answer":"Start with our booking wizard to share your destination, dates, and preferences. A travel designer then tailors and confirms every detail with you."},"fr":{"question":"Comment se déroule la réservation ?","answer":"Commencez par notre assistant de réservation pour indiquer votre destination, vos dates et vos préférences. Un concepteur de voyage personnalise ensuite chaque détail avec vous."}}$$::jsonb),
('f-2', $${"en":{"question":"Can trips be fully customized?","answer":"Always. Packages are starting points — every itinerary is shaped around you, from suites to experiences to pacing."},"fr":{"question":"Les voyages sont-ils entièrement personnalisables ?","answer":"Toujours. Les forfaits sont des points de départ — chaque itinéraire est conçu pour vous, des suites aux expériences au rythme."}}$$::jsonb),
('f-3', $${"en":{"question":"What is included in the price?","answer":"Accommodation, signature experiences, and private transfers as listed. Flights and personal spending are quoted separately and transparently."},"fr":{"question":"Qu'est-ce qui est inclus dans le prix ?","answer":"L'hébergement, les expériences signature et les transferts privés indiqués. Les vols et dépenses personnelles sont chiffrés séparément et en toute transparence."}}$$::jsonb),
('f-4', $${"en":{"question":"Do you support special requests?","answer":"Dietary needs, accessibility, celebrations, and beyond — share it and we'll arrange it."},"fr":{"question":"Gérez-vous les demandes spéciales ?","answer":"Régimes alimentaires, accessibilité, célébrations et plus encore — partagez-le et nous l'organiserons."}}$$::jsonb),
('f-5', $${"en":{"question":"What is your cancellation policy?","answer":"Terms vary by partner and season; your travel designer confirms them in writing before anything is booked."},"fr":{"question":"Quelle est votre politique d'annulation ?","answer":"Les conditions varient selon le partenaire et la saison ; votre concepteur de voyage les confirme par écrit avant toute réservation."}}$$::jsonb),
('f-6', $${"en":{"question":"Which regions do you cover?","answer":"Our featured collection spans the Mediterranean, Asia, and the Indian Ocean, with bespoke journeys available worldwide."},"fr":{"question":"Quelles régions couvrez-vous ?","answer":"Notre collection s'étend de la Méditerranée à l'Asie et à l'océan Indien, avec des voyages sur mesure disponibles dans le monde entier."}}$$::jsonb)
on conflict (id) do nothing;
