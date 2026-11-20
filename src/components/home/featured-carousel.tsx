"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SanityImage, type SanityImageSource } from "@/components/sanity-image";

/** Paleta de las barras: el color sale de la posicion (spec §4.4). */
const FILL = [
  "bg-dot-1-on",
  "bg-dot-2-on",
  "bg-dot-3-on",
  "bg-dot-4-on",
  "bg-dot-5-on",
] as const;

/** Debe coincidir con --duration-slide del CSS. */
const SLIDE_MS = 5000;

/** Pixeles de arrastre a partir de los cuales cuenta como swipe y no como tap. */
const SWIPE_PX = 40;

type Destacado = {
  _id: string;
  titulo: string | null;
  slug: string | null;
  portada: SanityImageSource;
};

/**
 * Carrusel automatico de la Home (spec §5.2).
 *
 * Es el **unico componente con estado de cliente de todo el sitio**, y por eso
 * se construye ultimo.
 *
 * Estado local, no Zustand: el indice no lo lee nadie mas que este componente.
 * Ver la nota en la spec §7.3.
 */
export function FeaturedCarousel({ trabajos }: { trabajos: Destacado[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const total = trabajos.length;

  const ir = useCallback(
    (n: number) => setIndex(((n % total) + total) % total),
    [total],
  );

  // Con `prefers-reduced-motion` el carrusel NO avanza solo (spec §4.6).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Avance automatico. Se detiene al pausar y con reduced motion.
  useEffect(() => {
    if (paused || reduced || total < 2) return;
    const t = setTimeout(() => ir(index + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, reduced, total, ir]);

  // Teclado: flechas izquierda y derecha.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") ir(index + 1);
    if (e.key === "ArrowLeft") ir(index - 1);
  };

  // Tap o swipe sobre la imagen.
  const inicio = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    inicio.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (inicio.current === null) return;
    const dx = e.clientX - inicio.current;
    inicio.current = null;
    if (Math.abs(dx) >= SWIPE_PX) ir(index + (dx < 0 ? 1 : -1));
    else ir(index + 1); // tap
  };

  if (total === 0) return null;
  const actual = trabajos[index];

  return (
    <section
      aria-label="Trabajos destacados"
      aria-roledescription="carrusel"
      className="flex min-h-0 flex-1 flex-col gap-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Barras de progreso: riel gris, el color carga encima (spec §4.4) */}
      <div className="flex shrink-0 items-center gap-2">
        {trabajos.map((t, i) => (
          <button
            key={t._id}
            type="button"
            onClick={() => ir(i)}
            aria-label={`Ir a ${t.titulo ?? `trabajo ${i + 1}`}`}
            aria-current={i === index ? "true" : undefined}
            className="h-[3px] w-14 overflow-hidden rounded-full bg-rail"
          >
            <span
              // la `key` remonta el elemento y reinicia la animacion
              key={i === index ? `${index}-on` : "off"}
              className={`block h-full rounded-full ${FILL[i % FILL.length]}`}
              style={
                i < index || (i === index && reduced)
                  ? { width: "100%" }
                  : i === index
                    ? {
                        animation: `carousel-progress var(--duration-slide) linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                      }
                    : { width: "0%" }
              }
            />
          </button>
        ))}
      </div>

      {/* Imagenes: crossfade, no desplazamiento (spec §4.6) */}
      <div
        className="relative min-h-0 w-full flex-1 touch-pan-y overflow-hidden bg-[color:var(--color-secondary)]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        role="group"
        aria-roledescription="diapositiva"
        aria-label={`${index + 1} de ${total}: ${actual.titulo ?? ""}`}
        tabIndex={0}
      >
        {trabajos.map((t, i) => (
          <div
            key={t._id}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-slow ease-site ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <SanityImage
              image={t.portada}
              priority={i === 0}
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* Boton siguiente: circular de 42px, sobre el borde derecho */}
        {total > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              ir(index + 1);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            aria-label="Siguiente trabajo"
            className="absolute right-0 top-1/2 flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-ink/70 text-paper transition-colors duration-fast ease-site hover:bg-ink"
          >
            <svg
              aria-hidden
              viewBox="0 0 18 14"
              className="h-[13px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M11 1l6 6-6 6M17 7H0" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Epigrafe del trabajo actual */}
      {actual.slug ? (
        <Link
          href={`/trabajos/${actual.slug}`}
          className="shrink-0 text-body text-ink transition-colors duration-fast ease-site hover:text-quiet"
        >
          {actual.titulo}
        </Link>
      ) : null}
    </section>
  );
}
