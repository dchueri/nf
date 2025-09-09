import { Skeleton } from '../Skeleton'

export const SkeletonTableLine = ({
  columns,
  className
}: {
  columns: number
  className?: string
}) => {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
          <Skeleton className="h-4 w-16" />
        </td>
      ))}
    </tr>
  )
}
