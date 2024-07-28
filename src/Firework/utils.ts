export type RGBA = [number, number, number, number]
export type RGB = [number, number, number]

// Applies alpha channel to RGB channels and replaces alpha channel
export const c = (...color: RGBA): RGBA => {
  return color.map((c, i) => (i < 3 ? c * color[3] : c)) as RGBA
}

// Applies an alpha to a RGB channels and adds an alpha channel
export const ac = (alpha: number, color: RGB): RGBA => {
  return [...color.map(c => c * alpha), alpha] as RGBA
}
