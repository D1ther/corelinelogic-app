export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" fill="#0F172A" />
      <path
        d="M7 10H15L19 16L15 22H7"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M19 16H25"
        stroke="#38BDF8"
        strokeWidth="2.2"
        strokeLinecap="square"
      />
      <rect x="23" y="13.5" width="5" height="5" rx="1" fill="#38BDF8" />
    </svg>
  )
}
