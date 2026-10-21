export function Emblem({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="23.5" stroke="currentColor" strokeWidth="0.8" />
      <path
        d="M32 50.2 21.4 17.5 49.1 37.6 14.9 37.6 42.6 17.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
