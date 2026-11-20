import { create } from "zustand";

/**
 * Estado del carrusel de la Home (spec §5.2, §7.3).
 *
 * `tick` existe para una sola cosa: **reiniciar la animacion de la barra de
 * progreso**. Se usa como `key` del elemento que se anima, asi que cada vez
 * que sube, React lo remonta y la animacion arranca de cero. Sin eso, pasar
 * con PREV/NEXT dejaba la barra del item nuevo congelada.
 */
type CarouselState = {
  index: number;
  tick: number;
  paused: boolean;
  total: number;

  setTotal: (total: number) => void;
  /** Avance automatico: NO reinicia el tick ni despausa. */
  avanzarAuto: () => void;
  /** Navegacion manual (botones, barras, teclado, tap, swipe). */
  irA: (index: number) => void;
  mover: (delta: number) => void;
  setPaused: (paused: boolean) => void;
  reset: () => void;
};

const envolver = (i: number, total: number) =>
  total > 0 ? ((i % total) + total) % total : 0;

export const useCarousel = create<CarouselState>((set, get) => ({
  index: 0,
  tick: 0,
  paused: false,
  total: 0,

  setTotal: (total) => set({ total }),

  avanzarAuto: () =>
    set((s) => ({ index: envolver(s.index + 1, s.total), tick: s.tick + 1 })),

  // La navegacion manual ademas DESPAUSA: si no, al tocar el boton el puntero
  // queda sobre la imagen, el hover mantiene la pausa y el progreso del item
  // nuevo no arranca nunca.
  irA: (index) =>
    set((s) => ({
      index: envolver(index, s.total),
      tick: s.tick + 1,
      paused: false,
    })),

  mover: (delta) => get().irA(get().index + delta),

  setPaused: (paused) => set({ paused }),

  reset: () => set({ index: 0, tick: 0, paused: false }),
}));
