type StatusLevel = 'danger' | 'warning' | 'success' | 'info' | 'muted'

interface StatusBadgeProps {
  status: StatusLevel
  label: string
  size?: 'sm' | 'md'
}

const statusConfig: Record<StatusLevel, { dot: string; bg: string; text: string }> = {
  danger: { dot: 'bg-[var(--color-destructive)]', bg: 'bg-[var(--color-destructive-light)]', text: 'text-[var(--color-destructive)]' },
  warning: { dot: 'bg-[var(--color-warning)]', bg: 'bg-[var(--color-warning-light)]', text: 'text-[var(--color-warning)]' },
  success: { dot: 'bg-[var(--color-success)]', bg: 'bg-[var(--color-success-light)]', text: 'text-[var(--color-success)]' },
  info: { dot: 'bg-[var(--color-primary)]', bg: 'bg-[var(--color-primary-light)]', text: 'text-[var(--color-primary)]' },
  muted: { dot: 'bg-[var(--color-muted-foreground)]', bg: 'bg-[var(--color-muted)]', text: 'text-[var(--color-muted-foreground)]' },
}

function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.text} ${textSize}`}
    >
      <span className={`status-dot ${config.dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}

export { StatusBadge, type StatusBadgeProps, type StatusLevel }
