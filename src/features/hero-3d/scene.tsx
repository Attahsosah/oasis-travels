"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clone, Sky, useDetectGPU, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

/* ----------------------------------------------------------------- *
 * Plane model slot
 * -----------------------------------------------------------------
 * Drop a `.glb` into `public/models/` and set this to e.g.
 * "/models/plane.glb" to use a real model. While null (or if the file
 * fails to load) the procedural plane is used, so the hero always works.
 */
const PLANE_MODEL_URL: string | null = "/models/plane.glb";

// Island trees. Set to null to fall back to the procedural palms. TREE_SCALE
// and the Y positions in TREE_PLACEMENTS may need tuning to fit your GLB.
const TREE_MODEL_URL: string | null = null;
const TREE_SCALE = 0.02;
/* ----------------------------------------------------------------- *
 * Helpers
 * ----------------------------------------------------------------- */
function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function useSoftTexture(draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Texture();
    draw(ctx, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Shared pointer / device-tilt input, normalized to roughly [-1, 1]. */
type InputRef = { current: { x: number; y: number } };

function useHeroInput(): InputRef {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    function onMove(e: PointerEvent) {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    function onOrient(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return;
      ref.current.x = clamp(e.gamma / 45, -1, 1);
      ref.current.y = clamp((e.beta - 45) / 45, -1, 1);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);
  return ref;
}

/* ----------------------------------------------------------------- *
 * Camera parallax rig — leans toward the pointer, with a gentle idle sway
 * ----------------------------------------------------------------- */
function CameraRig({ input }: { input: InputRef }) {
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const targetX = input.current.x * 4 + Math.sin(t * 0.2) * 0.5;
    const targetY = 6 - input.current.y * 2 + Math.cos(t * 0.16) * 0.25;
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      targetX,
      3,
      delta,
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      targetY,
      3,
      delta,
    );
    state.camera.lookAt(0, 1, 0);
  });
  return null;
}

/* ----------------------------------------------------------------- *
 * Ocean — shader displacement
 * ----------------------------------------------------------------- */
const oceanVertex = /* glsl */ `
  uniform float uTime;
  varying float vElevation;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float e = 0.0;
    e += sin(p.x * 0.08 + uTime * 0.7) * 1.2;
    e += sin(p.y * 0.12 + uTime * 0.9) * 0.8;
    e += sin((p.x + p.y) * 0.06 + uTime * 1.1) * 0.6;
    p.z += e;
    vElevation = e;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const oceanFragment = /* glsl */ `
  uniform vec3 uColorDeep;
  uniform vec3 uColorShallow;
  uniform vec3 uColorHorizon;
  varying float vElevation;
  varying vec2 vUv;
  void main() {
    float m = smoothstep(-1.5, 1.8, vElevation);
    vec3 col = mix(uColorDeep, uColorShallow, m);
    float horizon = smoothstep(0.5, 0.95, vUv.y);
    col = mix(col, uColorHorizon, horizon * 0.8);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function Ocean() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorDeep: { value: new THREE.Color("#0a3d62") },
      uColorShallow: { value: new THREE.Color("#2e8ba6") },
      uColorHorizon: { value: new THREE.Color("#bfe1e6") },
    }),
    [],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-1.2}>
      <planeGeometry args={[420, 420, 180, 180]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={oceanVertex}
        fragmentShader={oceanFragment}
      />
    </mesh>
  );
}

/* ----------------------------------------------------------------- *
 * Island + palms
 * ----------------------------------------------------------------- */
function PalmTree({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: number;
}) {
  return (
    <group position={position} rotation-y={rotation} scale={1.4}>
      <mesh position-y={0.9}>
        <cylinderGeometry args={[0.08, 0.14, 1.8, 8]} />
        <meshStandardMaterial color="#7a5a3a" roughness={1} />
      </mesh>
      <mesh position-y={1.95}>
        <sphereGeometry args={[0.62, 10, 8]} />
        <meshStandardMaterial color="#3f8a4f" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Island() {
  return (
    <group position-y={-1.1}>
      {/* Irregular sandy base — flattened, elongated, faceted landmass. */}
      <mesh position={[0, 0.2, 0]} rotation-y={0.4} scale={[8.5, 1.3, 5.5]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#e6cfa6" roughness={1} flatShading />
      </mesh>
      {/* Secondary sandbar / islet off to one side. */}
      <mesh position={[7, 0.1, 2.4]} rotation-y={-0.5} scale={[2.6, 0.7, 1.8]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#e6cfa6" roughness={1} flatShading />
      </mesh>
      {/* Green highland cover (asymmetric). */}
      <mesh position={[-0.6, 1.1, -0.4]} rotation-y={0.4} scale={[5, 1.8, 3.6]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#3f7d4f" roughness={0.95} flatShading />
      </mesh>
      {/* Asymmetric ridge of faceted peaks. */}
      <mesh position={[-2, 3.2, -0.6]}>
        <coneGeometry args={[2.2, 4.5, 6]} />
        <meshStandardMaterial color="#3a744a" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[1.4, 3.8, -1]}>
        <coneGeometry args={[1.7, 5.4, 6]} />
        <meshStandardMaterial color="#2f5f3d" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[-4, 2.4, 0.8]}>
        <coneGeometry args={[1.4, 3.2, 6]} />
        <meshStandardMaterial color="#356b45" roughness={0.95} flatShading />
      </mesh>
      <IslandVegetation />
    </group>
  );
}

/* ----------------------------------------------------------------- *
 * Clouds
 * ----------------------------------------------------------------- */
interface CloudCfg {
  x: number;
  y: number;
  z: number;
  s: number;
  speed: number;
  opacity: number;
}

function Cloudlet({ texture, cfg }: { texture: THREE.Texture; cfg: CloudCfg }) {
  const ref = useRef<THREE.Sprite>(null);
  useFrame((_, delta) => {
    const sprite = ref.current;
    if (!sprite) return;
    sprite.position.x += delta * cfg.speed;
    if (sprite.position.x > 80) sprite.position.x = -80;
  });
  return (
    <sprite ref={ref} position={[cfg.x, cfg.y, cfg.z]} scale={[cfg.s, cfg.s * 0.6, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={cfg.opacity}
        depthWrite={false}
      />
    </sprite>
  );
}

function Clouds({ count }: { count: number }) {
  const texture = useSoftTexture((ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.6, "rgba(255,255,255,0.5)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });

  const clouds = useMemo<CloudCfg[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: rand(-70, 70),
        y: rand(14, 26),
        z: rand(-46, -10),
        s: rand(7, 15),
        speed: rand(0.25, 0.7),
        opacity: rand(0.55, 0.85),
      })),
    [count],
  );

  return (
    <group>
      {clouds.map((cfg, i) => (
        <Cloudlet key={i} texture={texture} cfg={cfg} />
      ))}
    </group>
  );
}

/* ----------------------------------------------------------------- *
 * Birds
 * ----------------------------------------------------------------- */
interface BirdCfg {
  x: number;
  y: number;
  z: number;
  s: number;
  speed: number;
  phase: number;
}

function Birdlet({ texture, cfg }: { texture: THREE.Texture; cfg: BirdCfg }) {
  const ref = useRef<THREE.Sprite>(null);
  useFrame((state, delta) => {
    const sprite = ref.current;
    if (!sprite) return;
    sprite.position.x += delta * cfg.speed;
    if (sprite.position.x > 60) sprite.position.x = -60;
    sprite.position.y =
      cfg.y + Math.sin(state.clock.elapsedTime * 1.5 + cfg.phase) * 0.4;
  });
  return (
    <sprite ref={ref} position={[cfg.x, cfg.y, cfg.z]} scale={[cfg.s, cfg.s * 0.5, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function Birds({ count }: { count: number }) {
  const texture = useSoftTexture((ctx, s) => {
    ctx.strokeStyle = "rgba(40,54,66,0.85)";
    ctx.lineWidth = s * 0.06;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(s * 0.2, s * 0.6);
    ctx.lineTo(s * 0.5, s * 0.42);
    ctx.lineTo(s * 0.8, s * 0.6);
    ctx.stroke();
  });

  const birds = useMemo<BirdCfg[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: rand(-50, 50),
        y: rand(16, 27),
        z: rand(-30, -6),
        s: rand(1.4, 2.4),
        speed: rand(0.8, 1.6),
        phase: rand(0, Math.PI * 2),
      })),
    [count],
  );

  return (
    <group>
      {birds.map((cfg, i) => (
        <Birdlet key={i} texture={texture} cfg={cfg} />
      ))}
    </group>
  );
}

/* ----------------------------------------------------------------- *
 * Plane — GLB model with procedural fallback, on a slow flight path that
 * banks toward the pointer.
 * ----------------------------------------------------------------- */
function ProceduralPlane() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.7, 0.32, 0.32]} />
        <meshStandardMaterial color="#f4f4f5" roughness={0.5} />
      </mesh>
      <mesh position-x={-0.1}>
        <boxGeometry args={[0.34, 0.08, 2.1]} />
        <meshStandardMaterial color="#d8dde3" roughness={0.6} />
      </mesh>
      <mesh position-x={-0.75}>
        <boxGeometry args={[0.3, 0.5, 0.08]} />
        <meshStandardMaterial color="#d8dde3" roughness={0.6} />
      </mesh>
    </group>
  );
}

function PlaneModel({ url }: { url: string }) {
  const gltf = useGLTF(url, true);
  // Scale/orientation depend on the source model — tune here when you add one.
  return <primitive object={gltf.scene} scale={1} />;
}

class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  override render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function PlaneVisual() {
  if (!PLANE_MODEL_URL) return <ProceduralPlane />;
  return (
    <Suspense fallback={<ProceduralPlane />}>
      <ModelErrorBoundary fallback={<ProceduralPlane />}>
        <PlaneModel url={PLANE_MODEL_URL} />
      </ModelErrorBoundary>
    </Suspense>
  );
}

/* ---- Island trees: GLB clones with a procedural-palm fallback ---- */
const TREE_PLACEMENTS: {
  position: [number, number, number];
  rotation: number;
  scale: number;
}[] = [
  { position: [4.5, 1.4, 2.6], rotation: 0.3, scale: 1.1 },
  { position: [-3.6, 1.5, 3.0], rotation: -0.6, scale: 1.25 },
  { position: [1.6, 1.5, 4.4], rotation: 1.1, scale: 1 },
  { position: [-1.2, 1.7, -1.4], rotation: 2.0, scale: 1.15 },
  { position: [6.8, 1.1, 2.2], rotation: -1.2, scale: 0.9 },
  { position: [-4.6, 1.6, 0.6], rotation: 0.8, scale: 1.05 },
];

function PalmFallback() {
  return (
    <>
      {TREE_PLACEMENTS.map((t, i) => (
        <PalmTree key={i} position={t.position} rotation={t.rotation} />
      ))}
    </>
  );
}

function TreeClones() {
  const { scene } = useGLTF(TREE_MODEL_URL as string, true);
  return (
    <>
      {TREE_PLACEMENTS.map((t, i) => (
        <Clone
          key={i}
          object={scene}
          position={t.position}
          rotation-y={t.rotation}
          scale={TREE_SCALE * t.scale}
        />
      ))}
    </>
  );
}

function IslandVegetation() {
  if (!TREE_MODEL_URL) return <PalmFallback />;
  return (
    <Suspense fallback={<PalmFallback />}>
      <ModelErrorBoundary fallback={<PalmFallback />}>
        <TreeClones />
      </ModelErrorBoundary>
    </Suspense>
  );
}

function PlaneRig({ input }: { input: InputRef }) {
  const ref = useRef<THREE.Group>(null);
  const offset = useRef({ x: 0, y: 0 });
  const roll = useRef(0);

  // Flight path: ONE direction only (x decreases monotonically → the nose never
  // has to swing around, so it never spins). In from top-right, descend to skim
  // low over the water in front of the island, then bank gently away and climb
  // out off-screen to the left. Endpoints are off-screen so entry/exit and the
  // pause are hidden.
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(30, 10, -6),
          new THREE.Vector3(14, 5.5, 2),
          new THREE.Vector3(0, 1.8, 11),
          new THREE.Vector3(-14, 1.8, 10),
          new THREE.Vector3(-26, 4, 3),
          new THREE.Vector3(-36, 7, -8),
        ],
        false,
        "catmullrom",
        0.5,
      ),
    [],
  );
  const tmp = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      tan: new THREE.Vector3(),
      tan2: new THREE.Vector3(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.order = "YXZ";

    // Fly for `flyDur`, then wait off-screen for the rest of the cycle.
    const cycle = 18;
    const flyDur = 12;
    const tt = state.clock.elapsedTime % cycle;
    const u = tt < flyDur ? tt / flyDur : 1;

    curve.getPointAt(u, tmp.pos);
    curve.getTangentAt(u, tmp.tan);
    curve.getTangentAt(Math.min(u + 0.02, 1), tmp.tan2);

    // Eased cursor nudge, layered on top of the path position.
    offset.current.x = THREE.MathUtils.damp(
      offset.current.x,
      input.current.x * 4,
      5,
      delta,
    );
    offset.current.y = THREE.MathUtils.damp(
      offset.current.y,
      input.current.y * -2,
      5,
      delta,
    );
    g.position.set(
      tmp.pos.x + offset.current.x,
      tmp.pos.y + offset.current.y,
      tmp.pos.z,
    );

    // Heading follows the tangent (nose is +X).
    g.rotation.y = Math.atan2(-tmp.tan.z, tmp.tan.x);
    // Gentle, damped bank into turns (prevents the roll from flipping).
    const turn = tmp.tan.x * tmp.tan2.z - tmp.tan.z * tmp.tan2.x;
    roll.current = THREE.MathUtils.damp(
      roll.current,
      clamp(-turn * 3, -0.3, 0.3),
      3,
      delta,
    );
    g.rotation.z = roll.current + input.current.x * 0.25;
    g.rotation.x = -input.current.y * 0.12;
  });
  return (
    <group ref={ref} scale={2.6}>
      <PlaneVisual />
    </group>
  );
}

/* ----------------------------------------------------------------- *
 * Particles
 * ----------------------------------------------------------------- */
function Particles({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = rand(-60, 60);
      arr[i * 3 + 1] = rand(2, 30);
      arr[i * 3 + 2] = rand(-50, 12);
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ----------------------------------------------------------------- *
 * Scene contents (quality-tiered)
 * ----------------------------------------------------------------- */
function Contents() {
  const gpu = useDetectGPU();
  const input = useHeroInput();
  const tier = Math.min(3, Math.max(1, gpu.tier || 2));

  const cloudCount = tier >= 3 ? 9 : tier === 2 ? 6 : 4;
  const birdCount = tier >= 3 ? 7 : tier === 2 ? 5 : 3;
  const particleCount = tier >= 3 ? 500 : tier === 2 ? 280 : 140;
  const withBloom = tier >= 2;

  return (
    <>
      {/* Low sun for a warm dawn / golden-hour sky to match the poster. */}
      <Sky
        distance={4000}
        sunPosition={[12, 1.4, 8]}
        turbidity={9}
        rayleigh={2.6}
        mieCoefficient={0.03}
        mieDirectionalG={0.96}
      />
      <fog attach="fog" args={["#e9cfa6", 40, 150]} />

      <hemisphereLight args={["#ffd9ad", "#2b4f68", 0.75]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[12, 5, 8]} intensity={1.5} color="#ffd6a0" />

      <CameraRig input={input} />
      <Ocean />
      <Island />
      <Clouds count={cloudCount} />
      <Birds count={birdCount} />
      <PlaneRig input={input} />
      <Particles count={particleCount} />

      {withBloom && (
        <EffectComposer>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.2}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

/* ----------------------------------------------------------------- *
 * Canvas wrapper
 * ----------------------------------------------------------------- */
export function Scene({
  onReady,
  active = true,
}: {
  onReady?: () => void;
  active?: boolean;
}) {
  return (
    <Canvas
      className="size-full"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 6, 26], fov: 45, near: 0.1, far: 400 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
    >
      <Suspense fallback={null}>
        <Contents />
      </Suspense>
    </Canvas>
  );
}
