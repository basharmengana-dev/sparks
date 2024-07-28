export const c = (...color: number[]): number[] => {
  // Color is an array of 4 numbers: [r, g, b, a]
  // multply rgb with alpha (the 4th index of color)
  return color.map((c, i) => (i < 3 ? c * color[3] : c))
}
