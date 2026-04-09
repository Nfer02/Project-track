import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "linear-gradient(145deg, #1e3a8a 0%, #0f172a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Isometric P simplified for small sizes */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left face - column */}
          <polygon points="10,38 32,25 32,88 10,100" fill="#1e40af" />
          {/* Right face - column */}
          <polygon points="32,25 48,33 48,96 32,88" fill="#2563eb" />
          {/* Top of column */}
          <polygon points="10,38 32,25 48,33 26,46" fill="#60a5fa" />
          {/* Bowl top face */}
          <polygon points="32,25 70,8 82,14 48,33" fill="#93c5fd" />
          {/* Bowl right drop */}
          <polygon points="82,14 82,44 48,58 48,33" fill="#2563eb" />
          {/* Bowl front */}
          <polygon points="70,8 82,14 82,44 70,38" fill="#3b82f6" />
          {/* Bowl return */}
          <polygon points="32,50 70,35 82,44 48,58" fill="#7dd3fc" opacity="0.8" />
          {/* Inner shadow */}
          <polygon points="48,33 48,58 32,50 32,25" fill="#0c1629" opacity="0.55" />
          {/* Green arrow */}
          <line x1="68" y1="26" x2="65" y2="16" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
          <polyline points="60,21 65,13 71,19" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
