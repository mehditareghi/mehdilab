import { FlaskConical } from 'lucide-react'

import { CodeBlock } from '@/components/lab/code-block'
import { ExperimentPanel } from '@/components/lab/experiment-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const WEBGL_STUB = `// Future: displacement pass (Three.js / R3F sketch)
import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function DistortionPlane() {
  const { viewport } = useThree()
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ pointer }) => {
    if (!ref.current) return
    ref.current.rotation.x = pointer.y * 0.1
    ref.current.rotation.y = pointer.x * 0.1
  })
  return (
    <mesh ref={ref} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial /* wire customShader + pointer uniform */ />
    </mesh>
  )
}

export function CursorDistortion() {
  return (
    <Canvas orthographic camera={{ position: [0, 0, 1] }}>
      <DistortionPlane />
    </Canvas>
  )
}`

export function ExperimentPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FlaskConical className="size-5 text-[var(--primary)]" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
          <p>
            This route is reserved for a shader or canvas-based distortion tied to pointer
            velocity. When you add it, give it the same pattern as other lab entries: live
            uniforms/controls plus copyable setup code.
          </p>
        </CardContent>
      </Card>

      <ExperimentPanel
        title="Controls"
        description="Nothing to tweak yet — add sliders that map to shader uniforms when you implement this experiment."
      >
        <p className="text-xs text-muted-foreground">
          Example: displacement strength, noise scale, pointer influence, render scale.
        </p>
      </ExperimentPanel>

      <CodeBlock title="Starter direction (not wired)" code={WEBGL_STUB} language="tsx" />
    </div>
  )
}
