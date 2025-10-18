# 📄 Product Requirements Document (PRD)  
## 🕹️ Grind Tower Defense  
**Version:** v1 (`tower-defense-game.zip`)  
**Last Updated:** 2025-10-18  
**Project Lead:** Gyn W. Arnold  
**Stack:** Next.js + TailwindCSS + v0.dev  
**Primary Use:** AI collaboration, GitHub project visibility, v0 patch instruction base

---

## 🎯 Game Overview

Grind Tower Defense is a pixel-art tower defense game for browser play, built with AI-assisted workflows and blockchain reward mechanics.  
Players build towers to stop waves of enemies along level-specific paths. Coins, levels, and scores are tracked — with future integration of the $GRIND token.

---

## 🧱 Tech Stack Overview

| Layer        | Stack                     |
|--------------|---------------------------|
| Frontend     | Next.js + TailwindCSS     |
| UI Editing   | v0.dev (copy/paste workflow) |
| Audio        | HTML5 Audio via AudioManager.ts |
| Data Configs | JSON-driven (paths, towers, enemies) |
| Assets       | PNG sprites (32×32), BGM/SFX, tile maps |

---

## 📂 Core File Architecture

| Path                        | Purpose                            |
|-----------------------------|-------------------------------------|
| `app/page.tsx`              | Game entrypoint shell + HUD         |
| `components/game/GameBoard.tsx` | Main gameplay grid logic          |
| `components/game/Tower.tsx`     | Tower placement, range, cooldown  |
| `components/game/Projectile.tsx` | Projectile path + collision       |
| `components/game/WaveController.ts` | Enemy spawn + wave logic     |
| `components/game/ShopPanel.tsx`    | Tower selection + upgrades (stub)|
| `lib/AudioManager.ts`       | SFX/BGM with cooldown logic         |
| `configs/paths.json`        | Enemy paths per level               |
| `configs/towers.json`       | Tower stats, cost, attackSpeed      |
| `public/assets/`            | Sprites, backgrounds, sound files   |

---

## 🔄 Current Functional Features

- ✅ Enemies follow defined paths (`paths.json`)
- ✅ Towers can be placed on player-selected slots
- ✅ Towers auto-fire based on cooldown & range
- ✅ Projectiles collide, deal damage, trigger enemy death
- ✅ Coin and score increase on kill
- ✅ Level-based backgrounds (5 variants)
- ✅ Debug mode: grid overlay, tower/path slot editors
- ✅ Level selector (jump between levels for testing)

---

## 🔊 Audio System (WIP)

| Feature        | Status  |
|----------------|---------|
| BGM (bgm.mp3)  | Semi-working (inconsistent init) |
| Tower fire SFX | ❌ Not reliably triggering        |
| Hit/Kill SFX   | ❌ Not consistently playing        |
| Audio toggle   | ✅ UI exists, but causes bugs      |
| AudioManager.ts | ✅ Cooldown + play() system built |

---

## 🧪 Dev Tools (Debug Mode)

| Tool              | Description                      |
|-------------------|----------------------------------|
| Grid Overlay      | Visual 16×10 or 18×12 tile grid  |
| Path Editor       | Click-to-define path + copy JSON |
| Tower Slot Editor | Mark valid tower placement zones |
| Level Selector    | Jump to level 1–50               |

---

## 🐞 Known Issues & Bugs

### 🔧 Gameplay
- ❌ Enemies sometimes revert to default path (not updated `paths.json`)
- ⚠️ Tower targeting logic not consistent in edge cases
- ⚠️ Castle health not always reducing on reach

### 🔊 Audio Bugs
- ❗ `AudioManager.play()` fails due to browser autoplay policy
- ❌ SFX unreliable after multiple waves
- ❌ Muting sometimes breaks game loop state

### 🎨 UI / Debug Tools
- 📏 Dev overlays crowd mobile layout
- 🧩 Tower slot editor needs improved UX
- 🛠 Path editor has no “undo” or step-back

---

## 🧱 Suggested Next Tasks (Sprint-Ready)

1. ✅ Stabilize enemy pathing — always respect dev-defined path
2. ✅ Confirm projectile loop and enemy collision per wave
3. 🛠 Enhance Path Editor with undo/remove
4. 🧪 Polish tower slot editor + export config
5. 🔊 Fix all AudioManager.play() trigger bugs
6. 🛍 Finalize ShopPanel tower purchase logic
7. 🔗 Begin wallet connection logic (for future $GRIND)

---

## 🧠 Collaboration Notes

- Use **v0.dev** to build or patch UI components (copy/pasteable)
- All tasks should be scoped to a **single file at a time**
- Avoid cascading state or audio bugs — **gameplay must remain functional**
- Label PRs/commits by feature area: `[GameLoop]`, `[Audio]`, `[UI]`, `[Debug]`

---

## 📎 Export Info

- ✅ Format: Markdown (`.md`)
- ✅ Optimized for AI (v0.dev, GitHub Copilot, ChatGPT)
- ✅ Ready for GitHub README or Docs inclusion
- ✅ Easy to convert to PDF, Notion, or HTML