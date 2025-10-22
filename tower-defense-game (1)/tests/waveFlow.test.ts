import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WaveController } from '../components/game/WaveController'

describe('WaveController basic flow', () => {
  let spawned: any[] = []
  let waveCompleted = false
  let allEnemiesDead = false

  beforeEach(() => {
    spawned = []
    waveCompleted = false
    allEnemiesDead = false
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('spawns enemies and completes wave', () => {
    const path = [{ x: 0, y: 0 }, { x: 1, y: 0 }]
    const wc = new WaveController(path, (e) => spawned.push(e), (c) => (waveCompleted = true), () => (allEnemiesDead = true))

    wc.startLevel(1)

    // fast-forward spawn timers
    vi.advanceTimersByTime(5000)

    // After timers, we expect at least one spawn
    expect(spawned.length).toBeGreaterThan(0)

    // Simulate all enemies reaching end
    spawned.forEach((e) => wc.enemyReachedEnd(e.id))

    // Process any pending timers
    vi.advanceTimersByTime(2000)

    expect(waveCompleted).toBe(true)
  })
})
