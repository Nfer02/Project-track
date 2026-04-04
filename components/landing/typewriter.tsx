"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TypewriterProps {
  words: string[]
  className?: string
}

type Phase = "typing" | "pausing" | "erasing"

export function Typewriter({ words, className }: TypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("typing")

  const currentWord = words[wordIndex] ?? ""

  useEffect(() => {
    let delay: number

    switch (phase) {
      case "typing":
        if (charIndex < currentWord.length) {
          delay = 80
        } else {
          // Word fully typed, switch to pausing
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
          // Done erasing, move to next word
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
    <span className={cn("inline-flex items-baseline", className)}>
      <span>{displayText}</span>
      <span className="ml-0.5 inline-block w-[2px] h-[1em] bg-current animate-pulse" />
    </span>
  )
}
