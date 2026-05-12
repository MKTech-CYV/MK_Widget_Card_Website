import { useTranslations } from "next-intl";
import { SectionHeading } from "./ui/SectionHeading";
import { GalleryItem, GalleryItemData } from "./ui/GalleryItem";

export function GallerySection() {
  const t = useTranslations();
  
  const galleryImages = [
    "/gallery/setup.png",
    "/gallery/qr.png",
    "/gallery/widget.png",
    "/gallery/scan.png",
  ];

  const galleryItems: GalleryItemData[] = [0, 1, 2, 3].map((index) => ({
    title: t(`gallery.${index}.title`),
    label: t(`gallery.${index}.label`),
    description: t(`gallery.${index}.description`),
    image: galleryImages[index],
  }));

  return (
    <section className="border-y border-white/10 bg-[#050505] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={t("gallerySection.eyebrow")}
          title={t("gallerySection.title")}
          description={t("gallerySection.description")}
        />

        <div className="mt-24 space-y-24 sm:space-y-32 lg:space-y-48">
          {galleryItems.map((item, index) => (
            <GalleryItem key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
