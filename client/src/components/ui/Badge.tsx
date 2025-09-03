import { cn } from 'utils/cn'

export const Badge = ({
  label,
  icon,
  className
}: {
  label: string
  icon?: string
  className: string
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        className
      )}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </span>
  )
}
