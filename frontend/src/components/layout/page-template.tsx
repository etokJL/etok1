'use client'

import { type ReactNode } from 'react'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'

interface PageTemplateProps {
  header?: ReactNode
  toolbar?: ReactNode
  children: ReactNode
  className?: string
}

export function PageTemplate({ header, toolbar, children, className }: PageTemplateProps) {
  return (
    <div className={cn('min-h-[calc(100vh-4rem)] bg-background', className)}>
      {header && (
        <div className="border-b border-border bg-card/60 backdrop-blur">
          <Container className="py-6">
            {header}
            {toolbar && <div className="mt-4">{toolbar}</div>}
          </Container>
        </div>
      )}
      <Container className="py-8">
        {children}
      </Container>
    </div>
  )}















