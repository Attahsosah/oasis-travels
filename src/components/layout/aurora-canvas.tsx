"use client";

import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uScroll;
  uniform float uAspect;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;

    float t = uTime * 0.025;
    // Flowing domain warp for the aurora ribbons.
    vec2 q = vec2(fbm(uv * 1.4 + t), fbm(uv * 1.4 - t + 4.7));
    float n = fbm(uv * 2.0 + q * 1.6 + vec2(0.0, t * 2.2));
    float ribbon = fbm(uv * 3.0 + q * 2.0 - vec2(t, 0.0));

    // Scroll journey: dawn -> day -> golden -> dusk (kept light for readability).
    vec3 dawn = vec3(0.66, 0.80, 0.95);
    vec3 day = vec3(0.74, 0.88, 0.98);
    vec3 golden = vec3(0.99, 0.85, 0.60);
    vec3 dusk = vec3(0.80, 0.71, 0.95);

    float s = clamp(uScroll, 0.0, 1.0);
    vec3 base;
    if (s < 0.34) base = mix(dawn, day, s / 0.34);
    else if (s < 0.67) base = mix(day, golden, (s - 0.34) / 0.33);
    else base = mix(golden, dusk, (s - 0.67) / 0.33);

    // Coloured aurora accents (teal / peach / lavender) driven by noise.
    vec3 teal = vec3(0.36, 0.82, 0.80);
    vec3 peach = vec3(0.99, 0.72, 0.52);
    vec3 lav = vec3(0.68, 0.60, 0.96);
    vec3 accent = mix(teal, peach, n);
    accent = mix(accent, lav, s * 0.6);

    vec3 col = mix(base, accent, smoothstep(0.25, 0.85, n) * 0.7);
    col += smoothstep(0.5, 0.95, ribbon) * 0.18; // glow ribbons
    col += (1.0 - vUv.y) * 0.03; // brighter toward the top

    // Lift back toward white a touch so content stays readable.
    col = mix(col, vec3(1.0), 0.12);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function AuroraPlane() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAspect: { value: 1 },
    }),
    [],
  );

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uAspect.value = state.size.width / state.size.height;
    const max =
      document.documentElement.scrollHeight - window.innerHeight;
    uniforms.uScroll.value = max > 0 ? window.scrollY / max : 0;
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </ScreenQuad>
  );
}

export function AuroraCanvas() {
  return (
    <Canvas
      className="size-full"
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
    >
      <AuroraPlane />
    </Canvas>
  );
}
