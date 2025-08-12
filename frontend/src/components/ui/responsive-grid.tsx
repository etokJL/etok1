'use client'

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  gap?: string
}

/**
 * ResponsiveGrid renders a CSS grid that auto-fits cards with a minimum width.
 * It uses Tailwind arbitrary properties + CSS var to keep the API simple.
  * Breakpoints (reduced cards per row on large screens):
  * base 200px, sm 220px, md 240px, lg 260px, xl 280px.
 */
export function ResponsiveGrid({ className, children, gap = 'gap-3', ...props }: ResponsiveGridProps) {
  return (
    <div
      className={cn(
        'grid',
        gap,
        '[--grid-min:200px]',
        '[grid-template-columns:repeat(auto-fit,minmax(var(--grid-min),1fr))]',
        'sm:[--grid-min:220px] md:[--grid-min:240px] lg:[--grid-min:260px] xl:[--grid-min:280px]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}


