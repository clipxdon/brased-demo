import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Line, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { scene, material, isMobile } from '../store'

const lerp = THREE.MathUtils.lerp
const damp = THREE.MathUtils.damp

// Exploded offsets for each part: [x, y, z]
const EXPLODE = {
  base: [0, -1.05, 0],
  gas: [0, -0.45, 0],
  mech: [0, 0.05, 0.15],
  seat: [0, 0.55, 0.15],
  back: [0, 0.95, -0.75],
  head: [0, 1.55, -0.95],
  armL: [-0.85, 0.35, 0],
  armR: [0.85, 0.35, 0],
}

function Part({ name, children, stepIndex }) {
  const ref = useRef()
  useFrame((_, dt) => {
    const e = scene.explode
    const [x, y, z] = EXPLODE[name]
    const g = ref.current
    g.position.x = damp(g.position.x, x * e, 6, dt)
    g.position.y = damp(g.position.y, y * e, 6, dt)
    g.position.z = damp(g.position.z, z * e, 6, dt)
    // gentle "breathing" of the highlighted part during the craft chapter
    const on = stepIndex !== undefined && stepIndex.includes(scene.step)
    const s = on ? 1 + Math.sin(performance.now() / 260) * 0.015 + 0.02 : 1
    g.scale.setScalar(damp(g.scale.x, s, 8, dt))
  })
  return <group ref={ref}>{children}</group>
}

function useFabric() {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: material.color,
        roughness: material.fabric.rough,
        sheen: material.fabric.sheen,
        sheenRoughness: 0.6,
        sheenColor: new THREE.Color('#ffffff'),
      }),
    []
  )
  const target = useRef(new THREE.Color(material.color))
  useEffect(() => {
    const fn = () => {
      target.current.set(material.color)
      mat.roughness = material.fabric.rough
      mat.sheen = material.fabric.sheen
    }
    material.listeners.add(fn)
    return () => material.listeners.delete(fn)
  }, [mat])
  useFrame((_, dt) => mat.color.lerp(target.current, Math.min(1, dt * 6)))
  return mat
}

export default function Chair() {
  const root = useRef()
  const fabric = useFabric()
  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d9dade', metalness: 1, roughness: 0.18 }), [])
  const black = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1b1c1f', metalness: 0.3, roughness: 0.55 }), [])
  const accent = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b5562f', metalness: 0.2, roughness: 0.4 }), [])

  // stitching path around the seat top, drawn as a dashed line
  const stitch = useMemo(() => {
    const pts = []
    const w = 0.5, d = 0.47, r = 0.12
    const shape = new THREE.Shape()
    shape.moveTo(-w + r, -d)
    shape.lineTo(w - r, -d); shape.quadraticCurveTo(w, -d, w, -d + r)
    shape.lineTo(w, d - r); shape.quadraticCurveTo(w, d, w - r, d)
    shape.lineTo(-w + r, d); shape.quadraticCurveTo(-w, d, -w, d - r)
    shape.lineTo(-w, -d + r); shape.quadraticCurveTo(-w, -d, -w + r, -d)
    shape.getPoints(16).forEach((p) => pts.push(new THREE.Vector3(p.x, 0, p.y)))
    return pts
  }, [])

  useFrame((state, dt) => {
    const g = root.current
    g.rotation.y = damp(g.rotation.y, scene.rotY + scene.pointer.x * 0.25, 4, dt)
    g.rotation.x = damp(g.rotation.x, scene.pointer.y * 0.08, 4, dt)
    g.position.x = damp(g.position.x, scene.x, 4, dt)
    g.position.y = damp(g.position.y, scene.y + Math.sin(state.clock.elapsedTime * 0.8) * 0.04, 4, dt)
    g.scale.setScalar(damp(g.scale.x, scene.scale, 4, dt))
  })

  const spokes = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2)

  return (
    <group ref={root}>
      {!isMobile && <ContactShadows position={[0, -0.9, 0]} opacity={0.6} scale={4} blur={2.4} far={2} resolution={256} />}
      <group position={[0, -0.9, 0]}>
        {/* BASE: 5 razze + ruote */}
        <Part name="base" stepIndex={[3]}>
          <mesh material={chrome} position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.11, 0.12, 24]} />
          </mesh>
          {spokes.map((a, i) => (
            <group key={i} rotation={[0, a, 0]}>
              <mesh material={chrome} position={[0.36, 0.17, 0]} rotation={[0, 0, 0.08]} castShadow>
                <boxGeometry args={[0.62, 0.06, 0.09]} />
              </mesh>
              <mesh material={black} position={[0.66, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.07, 18]} />
              </mesh>
            </group>
          ))}
        </Part>

        {/* PISTONE A GAS */}
        <Part name="gas" stepIndex={[3]}>
          <mesh material={black} position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.5, 20]} />
          </mesh>
          <mesh material={chrome} position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.2, 16]} />
          </mesh>
        </Part>

        {/* MECCANISMO SINCRON */}
        <Part name="mech" stepIndex={[3]}>
          <mesh material={black} position={[0, 0.95, 0]} castShadow>
            <boxGeometry args={[0.42, 0.08, 0.5]} />
          </mesh>
          <mesh material={accent} position={[0.26, 0.93, 0.12]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.18, 10]} />
          </mesh>
        </Part>

        {/* SEDILE */}
        <Part name="seat" stepIndex={[1, 2]}>
          <RoundedBox args={[1.08, 0.2, 1.0]} radius={0.09} smoothness={4} position={[0, 1.1, 0.04]} material={fabric} castShadow />
          <Line points={stitch} color="#efe6d6" lineWidth={1.2} dashed dashSize={0.03} gapSize={0.025} position={[0, 1.205, 0.04]} />
        </Part>

        {/* SCHIENALE */}
        <Part name="back" stepIndex={[0, 2]}>
          <group position={[0, 1.78, -0.5]} rotation={[-0.12, 0, 0]}>
            <RoundedBox args={[1.0, 1.05, 0.17]} radius={0.08} smoothness={4} material={fabric} castShadow />
            <mesh material={black} position={[0, -0.62, -0.02]}>
              <boxGeometry args={[0.12, 0.35, 0.06]} />
            </mesh>
          </group>
        </Part>

        {/* POGGIATESTA */}
        <Part name="head" stepIndex={[0]}>
          <RoundedBox args={[0.6, 0.24, 0.14]} radius={0.07} smoothness={4} position={[0, 2.5, -0.62]} rotation={[-0.15, 0, 0]} material={fabric} castShadow />
        </Part>

        {/* BRACCIOLI */}
        {['armL', 'armR'].map((n, i) => {
          const sx = i === 0 ? -1 : 1
          return (
            <Part key={n} name={n} stepIndex={[3]}>
              <mesh material={chrome} position={[sx * 0.58, 1.3, -0.02]} castShadow>
                <boxGeometry args={[0.05, 0.42, 0.06]} />
              </mesh>
              <RoundedBox args={[0.12, 0.06, 0.48]} radius={0.025} smoothness={3} position={[sx * 0.58, 1.53, 0.04]} material={black} castShadow />
            </Part>
          )
        })}
      </group>
    </group>
  )
}
