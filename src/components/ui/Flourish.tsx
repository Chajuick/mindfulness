/** 장식 괘선. 책의 각 마디를 부드럽게 끊어준다. */
export function Flourish({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-gilt ${className}`}
      aria-hidden="true"
    >
      <span className="h-px w-10 bg-current opacity-40" />
      <svg viewBox="0 0 24 24" className="size-2.5">
        <path
          d="M12 2.5 15 12l-3 9.5L9 12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-px w-10 bg-current opacity-40" />
    </div>
  );
}
