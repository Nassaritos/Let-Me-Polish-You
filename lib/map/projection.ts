/**
 * Equirectangular projection tuned for Poland (cos 52° horizontal scaling).
 * Must match the parameters used to generate ./poland-shape.ts.
 */
export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 956;
const P = { minLng: 14.07, maxLat: 54.9, cos: 0.615661, k: 155.2115, pad: 16 };

export function project(lat: number, lng: number): { x: number; y: number } {
  return { x: P.pad + (lng - P.minLng) * P.cos * P.k, y: P.pad + (P.maxLat - lat) * P.k };
}
