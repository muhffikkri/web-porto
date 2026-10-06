function Svg({ children, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function MoonIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20.5 14.3A8.8 8.8 0 0 1 9.7 3.5a8.8 8.8 0 1 0 10.8 10.8Z" />
    </Svg>
  )
}

export function SunIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </Svg>
  )
}

export function ArrowUpIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 20V5.5" />
      <path d="M6 11.5 12 5.5l6 6" />
    </Svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5.5 9 12 15.5 18.5 9" />
    </Svg>
  )
}
