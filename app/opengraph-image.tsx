import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 400,
            background: "radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Logo + name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 32 }}>
          {/* Isometric P logo */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 20,
              background: "linear-gradient(145deg, #1e3a8a 0%, #0f172a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(59,130,246,0.4)",
            }}
          >
            <svg width="64" height="64" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="10,38 32,25 32,88 10,100" fill="#1e40af" />
              <polygon points="32,25 48,33 48,96 32,88" fill="#2563eb" />
              <polygon points="10,38 32,25 48,33 26,46" fill="#60a5fa" />
              <polygon points="32,25 70,8 82,14 48,33" fill="#93c5fd" />
              <polygon points="82,14 82,44 48,58 48,33" fill="#2563eb" />
              <polygon points="70,8 82,14 82,44 70,38" fill="#3b82f6" />
              <polygon points="32,50 70,35 82,44 48,58" fill="#7dd3fc" opacity="0.8" />
              <polygon points="48,33 48,58 32,50 32,25" fill="#0c1629" opacity="0.55" />
              <line x1="68" y1="26" x2="65" y2="16" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <polyline points="60,21 65,13 71,19" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <span style={{ fontSize: 64, fontWeight: 700, color: "#ffffff", letterSpacing: "-2px" }}>
            ProjectTrack
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: "#93c5fd",
            margin: 0,
            letterSpacing: "-0.5px",
            textAlign: "center",
          }}
        >
          Gestiona proyectos, ingresos y gastos en un solo lugar
        </p>

        {/* URL */}
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.35)", marginTop: 24 }}>
          projecttrack.app
        </p>
      </div>
    ),
    { ...size }
  )
}
