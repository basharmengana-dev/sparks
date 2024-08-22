export type RGBA = [number, number, number, number]
export type RGB = [number, number, number]

// Export the c function to be used outside the class
export const c = (...color: RGBA): RGBA => {
  return color.map((c, i) => (i < 3 ? c * color[3] : c)) as RGBA
}

// Export the ac function to be used outside the class
export const ac = (alpha: number, color: RGB): RGBA => {
  return [...color.map(c => c * alpha), alpha] as RGBA
}

class ColorSchemeGenerator {
  static defaultBreakpoints = 5

  static acs(colors: [number, RGB][]): { breakpoint: number; color: RGBA }[] {
    return colors.map(([breakpoint, color]) => ({
      breakpoint,
      color: ac(1, color), // Using the exported ac function
    }))
  }

  static hslToRgb(h: number, s: number, l: number): RGB {
    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return [r, g, b]
  }

  // Color Scheme Methods with default 5 breakpoints
  static createOrangeColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [1.0, i / (n - 1), 0.0],
      ]),
    )
  }

  static createBlueColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [0.0, i / (n - 1), 1.0],
      ]),
    )
  }

  static createPurpleColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [i / (n - 1), 0.0, 1.0],
      ]),
    )
  }

  static createRedColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [1.0, 0.0, i / (n - 1)],
      ]),
    )
  }

  static createGreenColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [0.0, 1.0, i / (n - 1)],
      ]),
    )
  }

  static createYellowColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [1.0, 1.0, i / (n - 1)],
      ]),
    )
  }

  static createRainbowColors(
    n = ColorSchemeGenerator.defaultBreakpoints,
    reverseRainbow = false,
  ) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => {
        const hue = reverseRainbow ? 1 - i / (n - 1) : i / (n - 1)
        return [i / (n - 1), ColorSchemeGenerator.hslToRgb(hue, 1, 0.5)]
      }),
    )
  }

  static createTealColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [0.0, 1.0 - i / (n - 1), i / (n - 1)],
      ]),
    )
  }

  static createPinkColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [1.0, (i / (n - 1)) * 0.5, 1.0],
      ]),
    )
  }

  static createCyanColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [0.0, 1.0, 1.0 - i / (n - 1)],
      ]),
    )
  }

  static createGrayScaleColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [i / (n - 1), i / (n - 1), i / (n - 1)],
      ]),
    )
  }

  static createPastelColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => {
        const hue = i / (n - 1)
        return [i / (n - 1), ColorSchemeGenerator.hslToRgb(hue, 0.5, 0.85)]
      }),
    )
  }

  static createFireColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [1.0, i / (n - 1), 0.0],
      ]),
    )
  }

  static createOceanColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => [
        i / (n - 1),
        [0.0, i / (n - 1), 0.5 + i / (2 * n)],
      ]),
    )
  }

  static createSunsetColors(n = ColorSchemeGenerator.defaultBreakpoints) {
    return ColorSchemeGenerator.acs(
      Array.from({ length: n }, (_, i) => {
        const hue = 0.1 + 0.3 * (1 - i / (n - 1))
        return [i / (n - 1), ColorSchemeGenerator.hslToRgb(hue, 1, 0.5)]
      }),
    )
  }
}

// Export all color schemes for easy access
export const ColorSchemes = {
  createOrangeColors: ColorSchemeGenerator.createOrangeColors,
  createBlueColors: ColorSchemeGenerator.createBlueColors,
  createPurpleColors: ColorSchemeGenerator.createPurpleColors,
  createRedColors: ColorSchemeGenerator.createRedColors,
  createGreenColors: ColorSchemeGenerator.createGreenColors,
  createYellowColors: ColorSchemeGenerator.createYellowColors,
  createRainbowColors: ColorSchemeGenerator.createRainbowColors,
  createTealColors: ColorSchemeGenerator.createTealColors,
  createPinkColors: ColorSchemeGenerator.createPinkColors,
  createCyanColors: ColorSchemeGenerator.createCyanColors,
  createGrayScaleColors: ColorSchemeGenerator.createGrayScaleColors,
  createPastelColors: ColorSchemeGenerator.createPastelColors,
  createFireColors: ColorSchemeGenerator.createFireColors,
  createOceanColors: ColorSchemeGenerator.createOceanColors,
  createSunsetColors: ColorSchemeGenerator.createSunsetColors,
}
