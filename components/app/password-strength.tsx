"use client"

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" }

  let score = 0

  // Length
  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  // Cap at 5
  score = Math.min(score, 5)

  if (score <= 1) return { score, label: "Muy débil", color: "bg-red-500" }
  if (score === 2) return { score, label: "Débil", color: "bg-orange-500" }
  if (score === 3) return { score, label: "Regular", color: "bg-amber-500" }
  if (score === 4) return { score, label: "Buena", color: "bg-emerald-400" }
  return { score, label: "Fuerte", color: "bg-emerald-500" }
}

export function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = getStrength(password)

  if (!password) return null

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= score ? color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className={`text-[10px] ${score <= 2 ? "text-red-400" : score <= 3 ? "text-amber-400" : "text-emerald-400"}`}>
        {label}
      </p>
    </div>
  )
}
