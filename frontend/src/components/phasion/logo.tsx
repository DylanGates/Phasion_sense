export function PhasionLogo({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Phasion Sense"
    >
      {/* Outer orange circle */}
      <circle cx="50" cy="50" r="48" fill="#F97316" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" strokeWidth="1.5" />

      {/* Arc text: PHASION SENSE (top) */}
      <path id="topArc" d="M 14,50 A 36,36 0 0,1 86,50" fill="none" />
      <text fontSize="10" fontWeight="700" fill="white" fontFamily="serif" letterSpacing="1.5">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          PHASION SENSE
        </textPath>
      </text>

      {/* Arc text: MIND YOUR WEARS (bottom) */}
      <path id="bottomArc" d="M 18,52 A 32,32 0 0,0 82,52" fill="none" />
      <text fontSize="7.5" fontWeight="600" fill="white" fontFamily="serif" letterSpacing="1">
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          MIND YOUR WEARS
        </textPath>
      </text>

      {/* Center GH silhouette — simplified map shape */}
      <ellipse cx="50" cy="46" rx="12" ry="15" fill="white" opacity="0.15" />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="white"
        fontFamily="serif"
      >
        GH
      </text>
    </svg>
  )
}
