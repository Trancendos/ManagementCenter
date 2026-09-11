export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
    </svg>
  );
}
