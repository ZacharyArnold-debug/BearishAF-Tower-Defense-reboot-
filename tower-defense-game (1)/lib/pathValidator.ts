import type { PathPoint } from "../components/game/GridTile"

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

export function validatePath(path: PathPoint[], cols = 12, rows = 10): ValidationResult {
  const errors: string[] = []

  if (!Array.isArray(path)) {
    errors.push("Path must be an array")
    return { valid: false, errors }
  }

  if (path.length < 2) {
    errors.push("Path must contain at least 2 points")
  }

  path.forEach((p, i) => {
    if (typeof p.x !== "number" || typeof p.y !== "number") {
      errors.push(`Point ${i} must have numeric x and y`)
      return
    }
    if (p.x < 0 || p.x >= cols || p.y < 0 || p.y >= rows) {
      errors.push(`Point ${i} out of bounds: (${p.x},${p.y})`) 
    }
  })

  // Simple adjacency check (optional but helpful)
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]
    const b = path[i]
    const dx = Math.abs(a.x - b.x)
    const dy = Math.abs(a.y - b.y)
    if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
      errors.push(`Non-adjacent points at index ${i - 1} -> ${i}: (${a.x},${a.y}) -> (${b.x},${b.y})`)
      break
    }
  }

  return { valid: errors.length === 0, errors }
}

export function snapshotPath(path: PathPoint[]): PathPoint[] {
  return JSON.parse(JSON.stringify(path || []))
}
