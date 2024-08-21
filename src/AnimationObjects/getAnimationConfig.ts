export type AnimationConfig = {
  tagentExtension: number
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
    case 'stroke/10':
      return {
        tagentExtension: 15,
        strokeWidth: 10,
        falloffBack: 0.5,
        falloffFront: 0.9,
        searchThreshold: 0.5,
        tangentStartAdjustment: 10,
      }
    default:
      throw new Error('Invalid stroke width token')
  }
}
