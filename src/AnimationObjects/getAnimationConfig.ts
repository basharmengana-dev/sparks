export type AnimationConfig = {
  tangentExtension: number
  strokeWidth: number
  falloffBack: number
  falloffFront: number
  searchThreshold: number
  tangentStartAdjustment: number
}

export type StrokeWidthToken =
  | 'stroke/1'
  | 'stroke/2'
  | 'stroke/3'
  | 'stroke/4'
  | 'stroke/5'
  | 'stroke/6'
  | 'stroke/7'
  | 'stroke/8'
  | 'stroke/9'
  | 'stroke/10'

export const getAnimationConfig = (
  strokeWidth: StrokeWidthToken,
): AnimationConfig => {
  switch (strokeWidth) {
    case 'stroke/1':
      return {
        tangentExtension: 5,
        strokeWidth: 1,
        falloffBack: 0.5,
        falloffFront: 0.9,
        searchThreshold: 0.5,
        tangentStartAdjustment: 5,
      }
    case 'stroke/2':
      return {
        tangentExtension: 5,
        strokeWidth: 2,
        falloffBack: 0.5,
        falloffFront: 0.9,
        searchThreshold: 0.5,
        tangentStartAdjustment: 5,
      }
    case 'stroke/3':
      return {
        tangentExtension: 6.5,
        strokeWidth: 3,
        falloffBack: 0.5,
        falloffFront: 0.9,
        searchThreshold: 0.5,
        tangentStartAdjustment: 5,
      }
    case 'stroke/4':
      return {
        tangentExtension: 20,
        strokeWidth: 4,
        falloffBack: 0.5,
        falloffFront: 0.9,
        searchThreshold: 0.5,
        tangentStartAdjustment: 5,
      }
    case 'stroke/5':
      return {
        tangentExtension: 22,
        strokeWidth: 5,
        falloffBack: 0.5,
        falloffFront: 1,
        searchThreshold: 0.5,
        tangentStartAdjustment: 5,
      }
    case 'stroke/6':
      return {
        tangentExtension: 22,
        strokeWidth: 6,
        falloffBack: 0.5,
        falloffFront: 1,
        searchThreshold: 0.5,
        tangentStartAdjustment: 5,
      }
    case 'stroke/7':
      return {
        tangentExtension: 22.5,
        strokeWidth: 7,
        falloffBack: 0.5,
        falloffFront: 1,
        searchThreshold: 0.5,
        tangentStartAdjustment: 5,
      }
    case 'stroke/8':
      return {
        tangentExtension: 22.5,
        strokeWidth: 8,
        falloffBack: 0.5,
        falloffFront: 1,
        searchThreshold: 0.5,
        tangentStartAdjustment: 5,
      }
    case 'stroke/9':
      return {
        tangentExtension: 23.7,
        strokeWidth: 9,
        falloffBack: 0.5,
        falloffFront: 0.9,
        searchThreshold: 0.5,
        tangentStartAdjustment: 10,
      }
    case 'stroke/10':
      return {
        tangentExtension: 26.4,
        strokeWidth: 10,
        falloffBack: 0.5,
        falloffFront: 0.9,
        searchThreshold: 0.5,
        tangentStartAdjustment: 5,
      }
    default:
      throw new Error(`Invalid stroke width token${strokeWidth}`)
  }
}
