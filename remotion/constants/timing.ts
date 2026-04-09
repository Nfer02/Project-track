// remotion/constants/timing.ts
// Todos los tiempos en frames a 30fps
export const FPS = 30
export const DURATION_FRAMES = 2250 // 75 segundos

// Inicio de cada escena (frame absoluto)
export const SCENES = {
  hook:      { start: 0,    end: 210  }, // 0–7s
  problem:   { start: 210,  end: 600  }, // 7–20s
  twist:     { start: 600,  end: 750  }, // 20–25s
  ocr:       { start: 750,  end: 1140 }, // 25–38s
  dashboard: { start: 1140, end: 1560 }, // 38–52s
  export:    { start: 1560, end: 1800 }, // 52–60s
  pricing:   { start: 1800, end: 1950 }, // 60–65s
  cta:       { start: 1950, end: 2250 }, // 65–75s
} as const

export const TRANSITION_FRAMES = 15 // 0.5s overlap entre escenas
