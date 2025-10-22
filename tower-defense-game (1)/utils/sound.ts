import soundManager, { type SoundEffectType } from "@/utils/SoundManager"

type PlayOptions = {
  volume?: number
  loop?: boolean
  playbackRate?: number
  pan?: number
}

export const playSound = (sound: SoundEffectType, options?: PlayOptions) => {
  if (typeof window === "undefined") return null
  return soundManager.playSound(sound, options)
}

export const preloadSounds = (sounds: SoundEffectType[]) => {
  if (typeof window === "undefined") return
  soundManager.preloadSounds(sounds)
}

export const stopSound = (id: string) => {
  if (typeof window === "undefined") return
  soundManager.stopSound(id)
}

export const stopAllSounds = () => {
  if (typeof window === "undefined") return
  soundManager.stopAllSounds()
}

export const setMuted = (muted: boolean) => {
  if (typeof window === "undefined") return
  soundManager.setMuted(muted)
}

export const setVolume = (volume: number) => {
  if (typeof window === "undefined") return
  soundManager.setVolume(volume)
}

export const resumeAudio = () => {
  if (typeof window === "undefined") return
  soundManager.resumeAudioContext()
}

export type { SoundEffectType }
