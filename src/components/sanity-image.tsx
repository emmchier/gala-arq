import Image from "next/image";
import { imageSrc } from "@/sanity/image";

/** Lo que `SanityImage` necesita, que es lo que trae el fragmento IMAGEN. */
export type SanityImageSource = {
  alt?: string | null;
  asset?: {
    _id?: string;
    url?: string | null;
    metadata?: {
      lqip?: string | null;
      dimensions?: {
        width?: number | null;
        height?: number | null;
      } | null;
    } | null;
  } | null;
} | null;

/**
 * Imagen de Sanity servida por su CDN.
 *
 * `sizes` es obligatorio a proposito: sin el, `next/image` sirve la imagen
 * mas grande del srcset y se pierde todo el beneficio (spec §18.2).
 */
export function SanityImage({
  image,
  sizes,
  aspect,
  priority = false,
  className,
}: {
  image: SanityImageSource;
  sizes: string;
  /** ancho/alto. 1 = cuadrado. Si se omite, usa la proporcion original. */
  aspect?: number;
  priority?: boolean;
  className?: string;
}) {
  if (!image?.asset?.url) return null;

  const lqip = image.asset.metadata?.lqip;

  return (
    <Image
      src={imageSrc(image as never, aspect)}
      alt={image.alt ?? ""}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      {...(lqip ? { placeholder: "blur" as const, blurDataURL: lqip } : {})}
    />
  );
}
