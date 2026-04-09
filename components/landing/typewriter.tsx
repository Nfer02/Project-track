"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"

interface TypewriterProps {
  words: string[]
  className?: string
  cursorColor?: string
}

type Phase = "typing" | "pausing" | "erasing"

export function Typewriter({ words, className, cursorColor }: TypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("typing")

  const currentWord = words[wordIndex] ?? ""

  // Palabra más larga para reservar espacio y evitar saltos
  const longestWord = useMemo(
    () => words.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [words]
  )

  useEffect(() => {
    let delay: number

    switch (phase) {
      case "typing":
        if (charIndex < currentWord.length) {
          delay = 80
        } else {
          setPhase("pausing")
          return
        }
        break
      case "pausing":
        delay = 2000
        break
      case "erasing":
        if (charIndex > 0) {
          delay = 50
        } else {
          setWordIndex((prev) => (prev + 1) % words.length)
          setPhase("typing")
          return
        }
        break
    }

    const timer = setTimeout(() => {
      switch (phase) {
        case "typing":
          setCharIndex((prev) => prev + 1)
          break
        case "pausing":
          setPhase("erasing")
          break
        case "erasing":
          setCharIndex((prev) => prev - 1)
          break
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [charIndex, phase, currentWord.length, words.length])

  const displayText = currentWord.slice(0, charIndex)

  return (
    <span className={cn("inline-grid", className)}>
      {/* Invisible text to reserve space for the longest word */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {longestWord}
      </span>
      {/* Visible animated text */}
      <span className="col-start-1 row-start-1 inline-flex items-baseline">
        <span>{displayText}</span>
        <span
          className="ml-0.5 inline-block w-[2px] h-[0.8em] animate-pulse"
          style={{ backgroundColor: cursorColor ?? "currentColor" }}
        />
      </span>
    </span>
  )
}
