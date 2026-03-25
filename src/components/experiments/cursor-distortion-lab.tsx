import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react'

import { CodeBlock } from '@/components/lab/code-block'
import { ExperimentPanel } from '@/components/lab/experiment-panel'
import { LabSlider } from '@/components/lab/lab-slider'
import { useCodeRangeFlash } from '@/hooks/use-code-range-flash'
import { useSitePreferences } from '@/hooks/use-site-preferences'
import type { CodeHighlightRange } from '@/lib/code-block-range-highlight'
import { ACCENT_HUE_DEFAULTS } from '@/lib/site-preferences'
import { cn } from '@/lib/utils'

function cdFmt3(v: [number, number, number]) {
  return v.map((x) => x.toFixed(4)).join(', ')
}

function cdStrengthLine(value: string) {
  return `const strength = ${value}   // slider / 100`
}

function cdStrengthUniformLine(value: string) {
  return `gl.uniform1f(u_strength, ${value})`
}

function cdRadiusLine(value: string) {
  return `const radius = ${value}     // slider / 100, exp(-dist²/r²)`
}

function cdRadiusUniformLine(value: string) {
  return `gl.uniform1f(u_radius, ${value})`
}

function cdWaveLine(value: string) {
  return `const wave = ${value}`
}

function cdWaveUniformLine(value: string) {
  return `gl.uniform1f(u_wave, ${value})`
}

function cdVelMixLine(value: string) {
  return `const velMix = ${value}`
}

function cdVelMixUniformLine(value: string) {
  return `gl.uniform1f(u_velMix, ${value})`
}

function cdColorALine(value: string) {
  return `//   colorA = hslToRgb(hue, 0.22, 0.11)  → vec3(${value})`
}

function cdColorBLine(value: string) {
  return `//   colorB = hslToRgb(hue + 18, 0.32, 0.2) → vec3(${value})`
}

function cdAccentLine(value: string) {
  return `//   accent = hslToRgb(hue - 8, 0.55, 0.52) → vec3(${value})`
}

function cdColorAUniformLine(value: string) {
  return `gl.uniform3f(u_colorA, ${value})`
}

function cdColorBUniformLine(value: string) {
  return `gl.uniform3f(u_colorB, ${value})`
}

function cdAccentUniformLine(value: string) {
  return `gl.uniform3f(u_accent, ${value})`
}

function getPaletteFromHue(hue: number) {
  const a = hslToRgb(hue, 0.22, 0.11)
  const b = hslToRgb(hue + 18, 0.32, 0.2)
  const c = hslToRgb(hue - 8, 0.55, 0.52)
  return { a, b, c }
}

function cdStrengthRanges(strength: number): CodeHighlightRange[] {
  const s = (strength / 100).toFixed(2)
  const l11 = cdStrengthLine(s)
  const l21 = cdStrengthUniformLine(s)
  const i11 = l11.indexOf(s)
  const i21 = l21.indexOf(s)
  return [
    { line: 11, start: i11, end: i11 + s.length },
    { line: 21, start: i21, end: i21 + s.length },
  ]
}

function cdRadiusRanges(radius: number): CodeHighlightRange[] {
  const r = (radius / 100).toFixed(2)
  const l12 = cdRadiusLine(r)
  const l22 = cdRadiusUniformLine(r)
  const i12 = l12.indexOf(r)
  const i22 = l22.indexOf(r)
  return [
    { line: 12, start: i12, end: i12 + r.length },
    { line: 22, start: i22, end: i22 + r.length },
  ]
}

function cdWaveRanges(wave: number): CodeHighlightRange[] {
  const w = wave.toFixed(1)
  const l13 = cdWaveLine(w)
  const l23 = cdWaveUniformLine(w)
  const i13 = l13.indexOf(w)
  const i23 = l23.indexOf(w)
  return [
    { line: 13, start: i13, end: i13 + w.length },
    { line: 23, start: i23, end: i23 + w.length },
  ]
}

function cdVelMixRanges(velMix: number): CodeHighlightRange[] {
  const vm = (velMix / 100).toFixed(2)
  const l14 = cdVelMixLine(vm)
  const l24 = cdVelMixUniformLine(vm)
  const i14 = l14.indexOf(vm)
  const i24 = l24.indexOf(vm)
  return [
    { line: 14, start: i14, end: i14 + vm.length },
    { line: 24, start: i24, end: i24 + vm.length },
  ]
}

function cdHueRanges(hue: number): CodeHighlightRange[] {
  const { a, b, c } = getPaletteFromHue(hue)
  const fa = cdFmt3(a)
  const fb = cdFmt3(b)
  const fc = cdFmt3(c)
  const num5 = hue.toFixed(0)
  const l5 = `const hue = ${num5}`
  const i5 = l5.indexOf(num5)
  const out: CodeHighlightRange[] = []
  if (i5 >= 0) out.push({ line: 5, start: i5, end: i5 + num5.length })

  const blocks: [number, string, string][] = [
    [7, cdColorALine(fa), fa],
    [8, cdColorBLine(fb), fb],
    [9, cdAccentLine(fc), fc],
    [25, cdColorAUniformLine(fa), fa],
    [26, cdColorBUniformLine(fb), fb],
    [27, cdAccentUniformLine(fc), fc],
  ]
  for (const [line, lineStr, vec] of blocks) {
    const i = lineStr.indexOf(vec)
    if (i >= 0) out.push({ line, start: i, end: i + vec.length })
  }
  return out
}

const VERT = `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_velocity;
uniform float u_time;
uniform float u_strength;
uniform float u_radius;
uniform float u_wave;
uniform float u_velMix;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_accent;
in vec2 v_uv;
out vec4 outColor;

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
  vec2 d = p - m;
  float dist = length(d);
  vec2 dir = dist > 1e-5 ? d / dist : vec2(0.0);

  float r = max(u_radius, 0.01);
  float falloff = exp(-(dist * dist) / (r * r));
  float rip = sin(dist * u_wave - u_time * 2.8) * falloff * 0.35;
  vec2 vel = u_velocity * u_velMix;
  // u_strength scales all displacement (was too subtle at 0.12/0.04; velocity ignored strength)
  float s = u_strength;
  vec2 disp =
    dir * (s * falloff * 0.38 + rip * s * 0.14) +
    vel * falloff * 0.35 * s;

  vec2 uv2 = uv + disp / vec2(aspect, 1.0);
  vec2 p2 = (uv2 - 0.5) * vec2(aspect, 1.0);
  float g = length(p2) * 0.85 + sin(u_time * 0.35 + uv2.x * 3.0) * 0.03;
  vec3 col = mix(u_colorA, u_colorB, smoothstep(0.15, 0.95, g));
  col = mix(col, u_accent, falloff * 0.35 + abs(rip) * 0.15);
  outColor = vec4(col, 1.0);
}`

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, source)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const hp = ((h % 360) + 360) % 360
  const x = c * (1 - Math.abs(((hp / 60) % 2) - 1))
  let r = 0
  let g = 0
  let b = 0
  if (hp < 60) {
    r = c
    g = x
  } else if (hp < 120) {
    r = x
    g = c
  } else if (hp < 180) {
    g = c
    b = x
  } else if (hp < 240) {
    g = x
    b = c
  } else if (hp < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }
  const m = l - c / 2
  return [r + m, g + m, b + m]
}

export function CursorDistortionLab() {
  const { preferences } = useSitePreferences()
  const { highlightRanges, flashRanges } = useCodeRangeFlash()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const glRef = useRef<WebGL2RenderingContext | null>(null)
  const progRef = useRef<WebGLProgram | null>(null)
  const locRef = useRef<Record<string, WebGLUniformLocation | null>>({})
  const timeRef = useRef(0)
  const lastTsRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const prevRef = useRef({ x: 0.5, y: 0.5 })
  const velRef = useRef({ x: 0, y: 0 })

  const [strength, setStrength] = useState(55)
  const [radius, setRadius] = useState(38)
  const [wave, setWave] = useState(42)
  const [velMix, setVelMix] = useState(65)
  const [hue, setHue] = useState(
    () => ACCENT_HUE_DEFAULTS[preferences.accent].spotlight,
  )
  const [webglError, setWebglError] = useState<string | null>(null)

  useEffect(() => {
    const h = ACCENT_HUE_DEFAULTS[preferences.accent].spotlight
    const id = requestAnimationFrame(() => setHue(h))
    return () => cancelAnimationFrame(id)
  }, [preferences.accent])

  const paramsRef = useRef({ strength, radius, wave, velMix })
  paramsRef.current = { strength, radius, wave, velMix }

  const colors = useMemo(() => getPaletteFromHue(hue), [hue])

  const colorsRef = useRef(colors)
  colorsRef.current = colors

  const code = useMemo(() => {
    const fmt3 = (v: [number, number, number]) =>
      v.map((x) => x.toFixed(4)).join(', ')
    const s = strength / 100
    const r = radius / 100
    const vm = velMix / 100
    return [
      '// WebGL2 — fullscreen triangle + fragment displacement (no Three.js)',
      '// Pointer → mouseRef / velRef; uniforms set each frame (no setState on move).',
      '',
      '// --- Values matching the sliders above ---',
      `const hue = ${hue.toFixed(0)}`,
      '// Palette from hslToRgb (same as the lab):',
      cdColorALine(fmt3(colors.a)),
      cdColorBLine(fmt3(colors.b)),
      cdAccentLine(fmt3(colors.c)),
      '',
      cdStrengthLine(s.toFixed(2)),
      cdRadiusLine(r.toFixed(2)),
      cdWaveLine(wave.toFixed(1)),
      cdVelMixLine(vm.toFixed(2)),
      '',
      '// --- Each frame (after useProgram + viewport resize) ---',
      '// Locators: getUniformLocation(program, "u_*")',
      'gl.uniform1f(u_time, elapsedSeconds)',
      'gl.uniform2f(u_mouse, mouseX, mouseY)   // 0–1, Y up',
      'gl.uniform2f(u_velocity, velX, velY)',
      cdStrengthUniformLine(s.toFixed(2)),
      cdRadiusUniformLine(r.toFixed(2)),
      cdWaveUniformLine(wave.toFixed(1)),
      cdVelMixUniformLine(vm.toFixed(2)),
      cdColorAUniformLine(fmt3(colors.a)),
      cdColorBUniformLine(fmt3(colors.b)),
      cdAccentUniformLine(fmt3(colors.c)),
      'gl.drawArrays(gl.TRIANGLES, 0, 3)   // single oversized triangle',
      '',
      '// Fragment: displacement + procedural gradient (see FRAG in cursor-distortion-lab.tsx).',
      '//   falloff = exp(-dist²/r²); rip = sin(dist * u_wave - time*2.8) * falloff * 0.35',
      '//   disp = dir * (s*falloff*0.38 + rip*s*0.14) + velocity*u_velMix*falloff*0.35*s',
    ].join('\n')
  }, [strength, radius, wave, velMix, hue, colors])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    if (!gl) {
      setWebglError('WebGL2 is not available in this browser.')
      return
    }
    glRef.current = gl

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      setWebglError('Shader compile failed.')
      return
    }
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog))
      setWebglError('Program link failed.')
      return
    }
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    progRef.current = prog
    gl.useProgram(prog)

    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    locRef.current = {
      u_resolution: gl.getUniformLocation(prog, 'u_resolution'),
      u_mouse: gl.getUniformLocation(prog, 'u_mouse'),
      u_velocity: gl.getUniformLocation(prog, 'u_velocity'),
      u_time: gl.getUniformLocation(prog, 'u_time'),
      u_strength: gl.getUniformLocation(prog, 'u_strength'),
      u_radius: gl.getUniformLocation(prog, 'u_radius'),
      u_wave: gl.getUniformLocation(prog, 'u_wave'),
      u_velMix: gl.getUniformLocation(prog, 'u_velMix'),
      u_colorA: gl.getUniformLocation(prog, 'u_colorA'),
      u_colorB: gl.getUniformLocation(prog, 'u_colorB'),
      u_accent: gl.getUniformLocation(prog, 'u_accent'),
    }

    function resizeCanvas() {
      const wrap = wrapRef.current
      const glc = glRef.current
      const cv = canvasRef.current
      if (!wrap || !glc || !cv) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      const bw = Math.max(1, Math.floor(w * dpr))
      const bh = Math.max(1, Math.floor(h * dpr))
      if (cv.width !== bw || cv.height !== bh) {
        cv.width = bw
        cv.height = bh
        glc.viewport(0, 0, bw, bh)
      }
      const loc = locRef.current.u_resolution
      if (loc) glc.uniform2f(loc, bw, bh)
    }

    function frame(ts: number) {
      rafRef.current = requestAnimationFrame(frame)
      const glc = glRef.current
      const program = progRef.current
      if (!glc || !program) return

      if (lastTsRef.current === 0) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) * 0.001, 0.05)
      lastTsRef.current = ts
      timeRef.current += dt

      glc.useProgram(program)
      resizeCanvas()

      const p = paramsRef.current
      const col = colorsRef.current
      const L = locRef.current

      if (L.u_time) glc.uniform1f(L.u_time, timeRef.current)
      if (L.u_mouse) glc.uniform2f(L.u_mouse, mouseRef.current.x, mouseRef.current.y)
      if (L.u_velocity) glc.uniform2f(L.u_velocity, velRef.current.x, velRef.current.y)
      if (L.u_strength) glc.uniform1f(L.u_strength, p.strength / 100)
      if (L.u_radius) glc.uniform1f(L.u_radius, p.radius / 100)
      if (L.u_wave) glc.uniform1f(L.u_wave, p.wave)
      if (L.u_velMix) glc.uniform1f(L.u_velMix, p.velMix / 100)
      if (L.u_colorA) glc.uniform3f(L.u_colorA, ...col.a)
      if (L.u_colorB) glc.uniform3f(L.u_colorB, ...col.b)
      if (L.u_accent) glc.uniform3f(L.u_accent, ...col.c)

      glc.drawArrays(glc.TRIANGLES, 0, 3)
    }

    const ro = new ResizeObserver(() => resizeCanvas())
    if (wrapRef.current) ro.observe(wrapRef.current)

    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      gl.deleteProgram(prog)
      progRef.current = null
      glRef.current = null
    }
  }, [])

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = 1 - (e.clientY - rect.top) / rect.height
    const px = prevRef.current.x
    const py = prevRef.current.y
    const vx = (x - px) * 18
    const vy = (y - py) * 18
    prevRef.current = { x, y }
    mouseRef.current = { x, y }
    velRef.current = {
      x: velRef.current.x * 0.82 + vx * 0.18,
      y: velRef.current.y * 0.82 + vy * 0.18,
    }
  }

  function handlePointerLeave() {
    prevRef.current = { x: 0.5, y: 0.5 }
    mouseRef.current = { x: 0.5, y: 0.5 }
    velRef.current = { x: 0, y: 0 }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <div
          ref={wrapRef}
          className={cn(
            'relative isolate flex min-h-[min(55vh,480px)] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card',
            '[contain:paint]',
          )}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 size-full touch-none"
            aria-label="Interactive WebGL distortion field following the pointer"
          />
          {webglError ? (
            <p className="relative z-10 m-auto max-w-sm px-4 text-center text-sm text-muted-foreground">
              {webglError}
            </p>
          ) : null}
        </div>

        <ExperimentPanel
          title="Controls"
          description="Strength scales all UV displacement (radial bulge, animated ripple, and motion smear). If it felt subtle before, try again — velocity used to ignore strength."
        >
          <LabSlider
            id="cd-strength"
            label="Distortion strength"
            value={strength}
            min={5}
            max={100}
            onChange={(v) => {
              setStrength(v)
              flashRanges(cdStrengthRanges(v))
            }}
          />
          <LabSlider
            id="cd-radius"
            label="Influence radius"
            value={radius}
            min={12}
            max={70}
            onChange={(v) => {
              setRadius(v)
              flashRanges(cdRadiusRanges(v))
            }}
          />
          <LabSlider
            id="cd-wave"
            label="Wave frequency"
            value={wave}
            min={12}
            max={90}
            onChange={(v) => {
              setWave(v)
              flashRanges(cdWaveRanges(v))
            }}
          />
          <LabSlider
            id="cd-vel"
            label="Velocity mix"
            value={velMix}
            min={0}
            max={100}
            onChange={(v) => {
              setVelMix(v)
              flashRanges(cdVelMixRanges(v))
            }}
          />
          <LabSlider
            id="cd-hue"
            label="Hue (palette)"
            value={hue}
            min={0}
            max={360}
            onChange={(v) => {
              setHue(v)
              flashRanges(cdHueRanges(v))
            }}
          />
        </ExperimentPanel>
      </div>

      <CodeBlock
        title="Snippet (matches uniforms)"
        code={code}
        language="ts"
        highlightRanges={highlightRanges}
      />
    </div>
  )
}
