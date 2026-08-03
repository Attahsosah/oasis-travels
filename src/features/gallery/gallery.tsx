import { Section, SectionHeading } from "@/components/layout/section";
import { ParallaxImage } from "@/components/layout/parallax-image";
import { Reveal } from "@/components/motion";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

/** Image gallery — a mosaic drawn from destination + experience imagery. */
export async function Gallery({ locale }: { locale: Locale }) {
  const repo = getContentRepository();
  const [destinations, experiences, dict] = await Promise.all([
    repo.getDestinations(),
    repo.getExperiences(),
    getDictionary(locale),
  ]);

  const images = [
    ...destinations.map((d) => ({ src: d.image, alt: d.name })),
    ...experiences.map((e) => ({ src: e.image, alt: pick(e.title, locale) })),
  ].slice(0, 8);

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow={resolveText(dict, "sections.gallery.eyebrow")}
        title={resolveText(dict, "sections.gallery.title")}
        description={resolveText(dict, "sections.gallery.description")}
      />
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((im, i) => (
          <Reveal key={i} delay={0.03 * i}>
            <ParallaxImage
              src={im.src}
              alt={im.alt}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="aspect-square rounded-xl"
              strength={48}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
