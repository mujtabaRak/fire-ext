export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <circle cx="20" cy="20" r="19" fill="#fff" stroke="#dc2626" strokeWidth="1.5" />
      <path
        d="M20 8c-1.5 3-5 5.5-5 10a5 5 0 0 0 10 0c0-1.3-.5-2.2-1-3.1c-.2 1.6-1 2.5-1.8 3.1c.3-2.6-1-4.2-2.2-6.5c.3 1.7-.2 2.8-1.3 4c-1.1 1.2-1.7 2.3-1.7 3.5"
        fill="#dc2626"
      />
    </svg>
  );
}

export function LogoLockup({
  size = 32,
  textClassName = "text-neutral-900",
  className,
}: {
  size?: number;
  textClassName?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark size={size} />
      <span className={`font-extrabold tracking-tight ${textClassName}`}>
        Diners Fire Engineers
      </span>
    </div>
  );
}
