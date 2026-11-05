export function ChildAvatar({
  avatar,
  color,
  size = 72,
}: {
  avatar: string
  color: string
  size?: number
}) {
  return (
    <div
      className="flex items-center justify-center rounded-full shadow-sm"
      style={{ width: size, height: size, background: color, fontSize: size * 0.52 }}
    >
      <span>{avatar}</span>
    </div>
  )
}

export const AVATAR_OPTIONS = ['🦁', '🐵', '🐸', '🦄', '🐳', '🦊', '🐼', '🐯', '🐰', '🐶', '🐱', '🦋']
