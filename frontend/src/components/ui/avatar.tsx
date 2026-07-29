import { User } from 'lucide-react'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

const iconSizes = { sm: 14, md: 18, lg: 24 }

const avatarColors = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
]

function getColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function Avatar({ src, name, size = 'md' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${getColor(name)} text-white flex items-center justify-center font-medium shadow-sm`}
      title={name}
      aria-label={name}
    >
      {name ? getInitials(name) : <User size={iconSizes[size]} />}
    </div>
  )
}

export { Avatar, type AvatarProps }
