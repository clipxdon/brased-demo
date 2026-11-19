import { Suspense, useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import Chair from './Chair'
import { scene, isMobile, reducedMotion } from '../store'

// Soft animated gradient behind the chair (grafite -> cuoio glow), cheap fragment shader.
function Backdrop() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uExplode: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.999, 1.0); }`,
        fragmentShader: `
          varying vec2 vUv; uniform float uTime; uniform float uExplode;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
          float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
          void main(){
            vec2 uv = vUv;
            float t = uTime * 0.05;
            float n = noise(uv * 2.5 + t) * 0.6 + noise(uv * 5.0 - t) * 0.4;
            vec3 graf = vec3(0.086, 0.09, 0.102);
            vec3 cuoio = vec3(0.71, 0.337, 0.184);
            float glow = smoothstep(0.85, 0.0, distance(uv, vec2(0.68 - uExplode*0.18, 0.55)));
            vec3 col = mix(graf, cuoio * 0.55, glow * (0.55 + n * 0.45));
            col += (hash(uv * 800.0 + uTime) - 0.5) * 0.025; // film grain
            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    []
  )
  useFrame((s) => {
    mat.uniforms.uTime.value = reducedMotion ? 0 : s.clock.elapsedTime
    mat.uniforms.uExplode.value = scene.explode
  })
  return (
    <mesh material={mat} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

function Rig() {
  const { camera } = useThree()
  useFrame((_, dt) => {
    camera.position.z = THREE.MathUtils.damp(camera.position.z, scene.camZ, 4, dt)
    camera.lookAt(0, 0.2, 0)
  })
  return null
}

function Pointer() {
  useEffect(() => {
    if (reducedMotion) return
    const on = (e) => {
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      scene.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [])
  return null
}

export default function Scene() {
  return (
    <div className="canvas-wrap" aria-hidden="true">
      <Canvas
        shadows={!isMobile}
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 1.1, 6.2], fov: 32 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <AdaptiveDpr pixelated />
        <Backdrop />
        <Rig />
        <Pointer />
        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 5, 3]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#ffb48a" />
        <Suspense fallback={null}>
          <Chair />
          <Environment resolution={128}>
            <Lightformer intensity={2} position={[0, 4, 3]} scale={[6, 2, 1]} />
            <Lightformer intensity={1.2} color="#ffcfae" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} />
            <Lightformer intensity={0.8} position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  )
}
