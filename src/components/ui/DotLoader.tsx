export function DotLoader({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className ?? ''}`} aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  )
}
