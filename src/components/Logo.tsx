export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0dca6" />
          <stop offset="60%" stopColor="#c9a14a" />
          <stop offset="100%" stopColor="#a88236" />
        </linearGradient>
      </defs>
      {/* crown */}
      <path
        d="M22 10 L26 15 L32 8 L38 15 L42 10 L42 17 L22 17 Z"
        fill="url(#gold)"
      />
      <rect x="21" y="18" width="22" height="2" fill="url(#gold)" />
      {/* shield */}
      <path
        d="M16 22 L48 22 L48 42 C48 50 40 55 32 57 C24 55 16 50 16 42 Z"
        stroke="url(#gold)"
        strokeWidth="2"
        fill="none"
      />
      {/* network nodes */}
      <circle cx="32" cy="38" r="3" fill="url(#gold)" />
      <circle cx="25" cy="32" r="2" fill="url(#gold)" />
      <circle cx="39" cy="32" r="2" fill="url(#gold)" />
      <circle cx="25" cy="44" r="2" fill="url(#gold)" />
      <circle cx="39" cy="44" r="2" fill="url(#gold)" />
      <circle cx="32" cy="28" r="2" fill="url(#gold)" />
      <circle cx="32" cy="48" r="2" fill="url(#gold)" />
      <path
        d="M32 38 L25 32 M32 38 L39 32 M32 38 L25 44 M32 38 L39 44 M32 38 L32 28 M32 38 L32 48"
        stroke="url(#gold)"
        strokeWidth="1.2"
      />
    </svg>
  );
}
