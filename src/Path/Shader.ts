import { Skia } from '@shopify/react-native-skia'

export const source = Skia.RuntimeEffect.Make(`
    uniform float u_totalLength;
    uniform float u_points[600]; // 100 samples * 2 coordinates (x and y)
    uniform float u_distances[300];
    uniform float u_searchThreshold;
    uniform float u_colorThreshold; 
    uniform int u_numBreakpoints;
    uniform float u_breakpoints[100]; // assuming max 10 breakpoints
    uniform float u_colors[400]; // 10 breakpoints * 4 (rgba)
  
    float distanceSquared(vec2 p1, vec2 p2) {
      vec2 diff = p1 - p2;
      return dot(diff, diff);
    }
  
    float getClosestDistance(vec2 pos) {
      float minDistSq = distanceSquared(pos, vec2(u_points[0], u_points[1]));
      float bestDist = u_distances[0];
  
      for (int i = 1; i < 300; i++) {
        vec2 point = vec2(u_points[2 * i], u_points[2 * i + 1]);
        float distSq = distanceSquared(pos, point);
  
        if (distSq < minDistSq) {
          minDistSq = distSq;
          bestDist = u_distances[i];
  
          if (distSq < u_searchThreshold * u_searchThreshold) {
            break;
          }
        }
      }
  
      return bestDist;
    }
  
    vec4 getColorForDistance(float distanceAlongPath) {
      vec4 color = vec4(0.0);
      for (int i = 0; i < 100; i++) {
        if (i >= u_numBreakpoints - 1) {
          color = vec4(u_colors[4 * i], u_colors[4 * i + 1], u_colors[4 * i + 2], u_colors[4 * i + 3]);
          break;
        }
        if (distanceAlongPath < u_breakpoints[i + 1] * u_totalLength) {
          color = vec4(u_colors[4 * i], u_colors[4 * i + 1], u_colors[4 * i + 2], u_colors[4 * i + 3]);
          break;
        }
      }
      return color;
    }
  
  vec4 getColorForDistanceMix(float distanceAlongPath) {
    for (int i = 0; i < 100; i++) {
      if (i >= u_numBreakpoints - 1 || distanceAlongPath < u_breakpoints[i + 1] * u_totalLength) {
        vec4 color1 = vec4(u_colors[4 * i], u_colors[4 * i + 1], u_colors[4 * i + 2], u_colors[4 * i + 3]);
        vec4 color2 = vec4(u_colors[4 * (i + 1)], u_colors[4 * (i + 1) + 1], u_colors[4 * (i + 1) + 2], u_colors[4 * (i + 1) + 3]);
  
        float segmentStart = u_breakpoints[i] * u_totalLength;
        float segmentEnd = u_breakpoints[i + 1] * u_totalLength;
  
        float t = (distanceAlongPath - segmentStart) / (segmentEnd - segmentStart);
        return mix(color1, color2, clamp(t, 0.0, 1.0));
      }
    }
    return vec4(0.0); // Default color if no breakpoints are matched
  }
  
    vec4 main(vec2 pos) {
      float distanceAlongPath = getClosestDistance(pos);
      return getColorForDistanceMix(distanceAlongPath);
    }
  `)!
