/**
 * Pulls Animate UI registry items from animate-ui.com (no ui.shadcn.com).
 * Usage: node scripts/install-animate-ui-registry.mjs icons-arrow-right
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src')

const BASE = 'https://animate-ui.com/r/'
const visited = new Set()

async function fetchJson(name) {
  const url = `${BASE}${encodeURIComponent(name)}.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} ${res.status}`)
  return res.json()
}

async function install(name) {
  const key = name.replace(/^@animate-ui\//, '')
  if (visited.has(key)) return
  visited.add(key)

  const data = await fetchJson(key)
  const deps = data.registryDependencies ?? []
  for (const d of deps) {
    await install(d.replace('@animate-ui/', ''))
  }

  for (const file of data.files ?? []) {
    const target = file.target ?? file.path.replace(/^registry\//, '')
    const out = join(SRC, target)
    await mkdir(dirname(out), { recursive: true })
    const content = file.content.replace(/\r\n/g, '\n')
    await writeFile(out, content, 'utf8')
    console.log('wrote', out)
  }
}

const names = process.argv.slice(2)
if (names.length === 0) {
  console.error('Usage: node scripts/install-animate-ui-registry.mjs <name>...')
  process.exit(1)
}
for (const n of names) {
  await install(n)
}
