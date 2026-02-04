import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-card overflow-hidden border border-neutral-100',
        'shadow-card transition-shadow duration-200',
        hover && 'hover:shadow-card-hover hover:border-neutral-200',
        className
      )}
    >
      {children}
    </div>
  )
}
