// Shared, mutable scene state. GSAP/ScrollTrigger writes, the R3F loop reads (no React re-renders).
export const scene = {
  explode: 0,      // 0 = assembled, 1 = fully exploded
  rotY: 0.6,       // chair yaw driven by scroll
  x: 0.9,          // chair horizontal offset (world units)
  y: 0,
  scale: 1,
  camZ: 6.2,
  step: -1,        // highlighted part in "Fatto a Bra" (-1 none)
  pointer: { x: 0, y: 0 },
}

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isMobile =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches

// Rivestimenti reali del catalogo Brased, con 3 colori indicativi ciascuno.
export const FABRICS = [
  { id: 'stoffa', name: 'Stoffa', note: 'Tessuto non ignifugo', rough: 0.95, sheen: 0.6, colors: ['#2f3a4a', '#7a2e2a', '#5d6166'] },
  { id: 'ignifuga', name: 'Stoffa ignifuga', note: 'Classe 1 per comunità e attesa', rough: 0.92, sheen: 0.5, colors: ['#1f4d5a', '#3b3f45', '#8a6a3c'] },
  { id: 'renna', name: 'Renna', note: 'Effetto scamosciato', rough: 0.85, sheen: 0.9, colors: ['#6b4a35', '#2b2b2e', '#9c8a73'] },
  { id: 'puma', name: 'Puma', note: 'Ecopelle resistente', rough: 0.55, sheen: 0.2, colors: ['#1c1c1f', '#4a2f26', '#d9d2c5'] },
  { id: 'microfibra', name: 'Microfibra', note: 'Morbida e traspirante', rough: 0.8, sheen: 0.7, colors: ['#3d4a3a', '#26324a', '#a39b8f'] },
  { id: 'pelle', name: 'Pelle', note: 'Pieno fiore, per i direzionali', rough: 0.38, sheen: 0.15, colors: ['#b5562f', '#16171a', '#efe6d6'] },
]

export const material = { fabric: FABRICS[5], color: FABRICS[5].colors[0], listeners: new Set() }
export function setMaterial(fabric, color) {
  material.fabric = fabric
  material.color = color
  material.listeners.forEach((fn) => fn())
}
