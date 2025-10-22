/**
 * Sound Manager for the Tower Defense game
 * Handles loading, playing, and managing all game sound effects
 */

// Define sound categories and their respective files
export const SOUND_EFFECTS = {
  // Tower sounds
  TOWER_PLACE: "/sounds/tower-place.mp3",
  TOWER_UPGRADE: "/sounds/tower-upgrade.mp3",

  // Projectile sounds
  BASIC_SHOT: "/sounds/basic-shot.mp3",
  FIRE_SHOT: "/sounds/fire-shot.mp3",
  ICE_SHOT: "/sounds/ice-shot.mp3",
  LIGHTNING_SHOT: "/sounds/lightning-shot.mp3",

  // Enemy sounds
  ENEMY_HIT: "/sounds/enemy-hit.mp3",
  ENEMY_DEATH: "/sounds/enemy-death.mp3",
  BOSS_DEATH: "/sounds/boss-death.mp3",

  // Game state sounds
  WAVE_START: "/sounds/wave-start.mp3",
  WAVE_COMPLETE: "/sounds/wave-complete.mp3",
  GAME_OVER: "/sounds/game-over.mp3",
  VICTORY: "/sounds/victory.mp3",

  // UI sounds
  BUTTON_CLICK: "/sounds/button-click.mp3",
  COIN_COLLECT: "/sounds/coin-collect.mp3",
} as const

export type SoundEffectType = keyof typeof SOUND_EFFECTS

type PlayingSound = {
  source: AudioBufferSourceNode
  gain: GainNode
  baseVolume: number
}

class SoundManager {
  private audioContext: AudioContext | null = null
  private soundBuffers: Map<SoundEffectType, AudioBuffer> = new Map()
  private loadedSounds: Set<SoundEffectType> = new Set()
  private loadPromises: Map<SoundEffectType, Promise<AudioBuffer>> = new Map()
  private isMuted = false
  private volume = 0.5 // Default volume (0-1)
  private currentlyPlaying: Map<string, PlayingSound> = new Map()
  private isClient: boolean
  private interactionListenersAttached = false

  constructor() {
    // Check if we're in a browser environment
    this.isClient = typeof window !== "undefined"

    // Only initialize if we're in a browser
    if (this.isClient) {
      // Initialize audio context on first user interaction
      this.attachInteractionListeners()
    }
  }

  private attachInteractionListeners() {
    if (!this.isClient || this.interactionListenersAttached) return

    this.interactionListenersAttached = true

    const initAudio = () => {
      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          console.log("Audio context initialized")

          // Preload common sounds
          this.preloadSounds(["TOWER_PLACE", "ENEMY_HIT", "WAVE_START", "BUTTON_CLICK"] as SoundEffectType[])

          // Remove event listeners after initialization
          document.removeEventListener("click", initAudio)
          document.removeEventListener("touchstart", initAudio)
          document.removeEventListener("keydown", initAudio)
          this.interactionListenersAttached = false
        } catch (error) {
          console.error("Failed to initialize audio context:", error)
        }
      }
    }

    // Add event listeners for user interaction
    document.addEventListener("click", initAudio)
    document.addEventListener("touchstart", initAudio)
    document.addEventListener("keydown", initAudio)
  }

  private async getOrCreateContext(): Promise<AudioContext | null> {
    if (!this.isClient) return null

    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.error("Unable to create audio context", error)
        this.attachInteractionListeners()
        return null
      }
    }

    if (this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume()
      } catch (error) {
        console.warn("Failed to resume audio context", error)
        this.attachInteractionListeners()
      }
    }

    return this.audioContext
  }

  /**
   * Preload multiple sound effects
   */
  public preloadSounds(soundTypes: SoundEffectType[]): void {
    if (!this.isClient) return
    soundTypes.forEach((type) => {
      void this.loadSound(type)
    })
  }

  /**
   * Load a sound effect
   */
  private async loadSound(soundType: SoundEffectType): Promise<AudioBuffer> {
    if (!this.isClient) {
      return Promise.reject(new Error("Cannot load sounds on server"))
    }

    const audioContext = await this.getOrCreateContext()
    if (!audioContext) {
      return Promise.reject(new Error("Audio context unavailable"))
    }

    // Return cached buffer if already loaded
    if (this.loadedSounds.has(soundType)) {
      return this.soundBuffers.get(soundType)!
    }

    // Return existing promise if already loading
    if (this.loadPromises.has(soundType)) {
      return this.loadPromises.get(soundType)!
    }

    const soundPath = SOUND_EFFECTS[soundType]

    // Create and store the loading promise
    const loadPromise = fetch(soundPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load sound: ${soundPath}`)
        }
        return response.arrayBuffer()
      })
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        this.soundBuffers.set(soundType, audioBuffer)
        this.loadedSounds.add(soundType)
        this.loadPromises.delete(soundType)
        return audioBuffer
      })
      .catch((error) => {
        console.error(`Error loading sound ${soundType}:`, error)
        this.loadPromises.delete(soundType)
        throw error
      })

    this.loadPromises.set(soundType, loadPromise)
    return loadPromise
  }

  /**
   * Play a sound effect
   * @param soundType The type of sound to play
   * @param options Optional parameters for playback
   * @returns A unique ID for the sound instance (can be used to stop it)
   */
  public async playSound(
    soundType: SoundEffectType,
    options: {
      volume?: number
      loop?: boolean
      playbackRate?: number
      pan?: number // -1 (left) to 1 (right)
    } = {},
  ): Promise<string | null> {
    if (!this.isClient || this.isMuted) {
      return null
    }

    try {
      const audioContext = await this.getOrCreateContext()
      if (!audioContext) {
        return null
      }

      const audioBuffer = await this.loadSound(soundType)

      // Create audio source
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.loop = options.loop || false
      source.playbackRate.value = options.playbackRate || 1

      // Create gain node for volume control
      const gainNode = audioContext.createGain()
      const baseVolume = options.volume !== undefined ? options.volume : 1
      gainNode.gain.value = baseVolume * this.volume

      // Create stereo panner if pan is specified
      if (options.pan !== undefined) {
        const pannerNode = this.audioContext.createStereoPanner()
        pannerNode.pan.value = Math.max(-1, Math.min(1, options.pan))
        source.connect(pannerNode)
        pannerNode.connect(gainNode)
      } else {
        source.connect(gainNode)
      }

      // Connect to destination and play
      gainNode.connect(audioContext.destination)
      source.start()

      // Generate unique ID for this sound instance
      const id = `${soundType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      this.currentlyPlaying.set(id, {
        source,
        gain: gainNode,
        baseVolume,
      })

      // Remove from playing list when done
      source.onended = () => {
        this.currentlyPlaying.delete(id)
      }

      return id
    } catch (error) {
      console.error(`Error playing sound ${soundType}:`, error)
      return null
    }
  }

  /**
   * Stop a specific sound instance
   */
  public stopSound(id: string): void {
    if (!this.isClient) return

    const playing = this.currentlyPlaying.get(id)
    if (playing && this.audioContext) {
      const { gain, source } = playing
      // Fade out to avoid clicks
      const now = this.audioContext.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(0, now + 0.1)
      try {
        source.stop(now + 0.11)
      } catch (error) {
        console.warn("Error stopping sound", error)
      }
      setTimeout(() => {
        this.currentlyPlaying.delete(id)
      }, 150)
    }
  }

  /**
   * Stop all currently playing sounds
   */
  public stopAllSounds(): void {
    if (!this.isClient) return

    this.currentlyPlaying.forEach((_, id) => {
      this.stopSound(id)
    })
  }

  /**
   * Set the master volume for all sounds
   */
  public setVolume(volume: number): void {
    if (!this.isClient) return

    this.volume = Math.max(0, Math.min(1, volume))

    // Update volume of currently playing sounds
    this.currentlyPlaying.forEach(({ gain, baseVolume }) => {
      gain.gain.value = baseVolume * this.volume
    })
  }

  /**
   * Mute or unmute all sounds
   */
  public setMuted(muted: boolean): void {
    if (!this.isClient) return

    this.isMuted = muted

    if (muted) {
      this.stopAllSounds()
    }
  }

  /**
   * Resume audio context if it was suspended
   * (browsers often suspend audio context until user interaction)
   */
  public resumeAudioContext(): void {
    if (!this.isClient) return

    void this.getOrCreateContext()
  }
}

// Create singleton instance
const soundManager = new SoundManager()
export default soundManager
