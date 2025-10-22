import { describe, it, expect } from 'vitest'
import { validatePath, snapshotPath } from '../lib/pathValidator'

describe('pathValidator', () => {
  it('rejects empty paths', () => {
    const res = validatePath([])
    expect(res.valid).toBe(false)
    expect(res.errors.length).toBeGreaterThan(0)
  })

  it('accepts simple adjacent path', () => {
    const path = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]
    const res = validatePath(path, 12, 10)
    expect(res.valid).toBe(true)
  })

  it('snapshotPath returns deep clone', () => {
    const path = [{ x: 0, y: 0 }, { x: 1, y: 0 }]
    const snap = snapshotPath(path)
    path[0].x = 5
    expect(snap[0].x).toBe(0)
  })
})
