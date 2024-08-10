import { frag } from '../Path/ShaderLib'

export const shaderSource = frag`
// smooth_linear_gradient.glsl
uniform float2 start;             // Start point of the gradient
uniform float2 end;               // End point of the gradient
uniform half4 colors[10];         // Fixed-size array of colors
uniform float positions[10];      // Fixed-size array of positions
uniform int numStops;             // Number of active gradient stops
uniform float progress;           // Progress value for animation (0 to 1)

half4 main(float2 p) {
    if(progress == 0.0) {
        return vec4(0.0, 0.0, 0.0, 0.0);
      }
    
    // Calculate the total length of the petal along the gradient axis
    float totalLength = distance(start, end);

    // Calculate the position of the current pixel along this axis
    float pixelPosition = distance(start, p);

    // Calculate the relative position of this pixel along the petal's length
    float t = pixelPosition / totalLength;

    // Dynamically adjust the fade range based on progress
    float fadeRange = 0.9 * (1.0 - progress);  // Increase the fade range for more transparency
    float alpha = 1.0;  // Start with a lower alpha for overall increased transparency

    // Apply transparency within the tightened fade range, reset to full opacity after progress
    if (t > progress) {
        return half4(0.0, 0.0, 0.0, 0.0); // Fully transparent at and beyond progress
    } else if (t > progress - fadeRange) {
        // Tightened fade steps with increased transparency
        float fadeStep = fadeRange / 4.0; // Divide the fade range into 4 steps

        if (t > progress - fadeStep) {
            alpha = 0.0; // Fully transparent very close to progress
        } else if (t > progress - 2.0 * fadeStep) {
            alpha = 0.15;  // Reduced alpha for more transparency
        } else if (t > progress - 3.0 * fadeStep) {
            alpha = 0.3;  // Reduced alpha for more transparency
        } else if (t > progress - fadeRange) {
            alpha = 0.5;  // Reduced alpha for more transparency
        }
    }

    // Smooth the t value to reduce sharp transitions
    t = smoothstep(0.0, 1.0, t);

    // Initialize the color to the first stop
    half4 color = colors[0];
    
    // Iterate through the fixed-size array up to 9 stops (fixed iteration count)
    for (int i = 0; i < 9; i++) { // Loop up to 9 stops
        if (i >= numStops - 1) break;
        
        if (t >= positions[i] && t <= positions[i + 1]) {
            // Smooth the interpolation between the current and next color stops
            float localT = smoothstep(0.0, 1.0, (t - positions[i]) / (positions[i + 1] - positions[i]));
            color = mix(colors[i], colors[i + 1], localT);
            break;
        }
    }

    // Apply the calculated alpha to the final color
    color.a *= alpha;

    return color;
}
`
