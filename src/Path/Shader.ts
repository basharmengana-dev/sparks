import { frag } from './ShaderLib'

export const shaderSource = frag`
  uniform float u_totalLength;
  uniform float u_points[400]; // 400 samples * 2 coordinates (x and y)
  uniform float u_distances[200];
  uniform float u_searchThreshold;
  uniform int u_numBreakpoints;
  uniform float u_breakpoints[100]; // assuming max 10 breakpoints
  uniform float u_colors[300]; // 10 breakpoints * 4 (rgba)
  uniform float u_progress_front; // Add uniform for progress
  uniform float u_progress_back; // Add uniform for progress
  uniform float u_progress_alpha; // Add uniform for progress

  float distanceSquared(vec2 p1, vec2 p2) {
    vec2 diff = p1 - p2;
    return dot(diff, diff);
  }

  float getClosestDistance(vec2 pos) {
    float minDistSq = distanceSquared(pos, vec2(u_points[0], u_points[1]));
    float bestDist = u_distances[0];

    for (int i = 1; i < 200; i++) {
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

  vec4 applyAlphaToColor(vec4 color, float alpha) {
    return vec4(color.r * alpha, color.g * alpha, color.b * alpha, alpha);
  }

  vec4 getColorForDistanceMix(float distanceAlongPath) {
    if (distanceAlongPath > u_progress_front * u_totalLength) {
      return vec4(0.0, 0.0, 0.0, 0.0); // Return transparent color
    }

    if (distanceAlongPath < u_progress_back * u_totalLength) {
      return vec4(0.0, 0.0, 0.0, 0.0); // Return transparent color for back progress
    }

    for (int i = 0; i < 100; i++) {
      if (i >= u_numBreakpoints - 1 || distanceAlongPath < u_breakpoints[i + 1] * u_totalLength) {
        vec4 color1 = vec4(u_colors[4 * i], u_colors[4 * i + 1], u_colors[4 * i + 2], 1);
        vec4 color2 = vec4(u_colors[4 * (i + 1)], u_colors[4 * (i + 1) + 1], u_colors[4 * (i + 1) + 2], 1);

        float segmentStart = u_breakpoints[i] * u_totalLength;
        float segmentEnd = u_breakpoints[i + 1] * u_totalLength;

        float t = (distanceAlongPath - segmentStart) / (segmentEnd - segmentStart);
        vec4 mixedColor = mix(color1, color2, clamp(t, 0.0, 1.0));

        return applyAlphaToColor(mixedColor, u_progress_alpha);
      }
    }
    return vec4(0.0); // Default color if no breakpoints are matched
  }

  vec4 main(vec2 pos) {
    float distanceAlongPath = getClosestDistance(pos);
    return getColorForDistanceMix(distanceAlongPath);
  }
`
