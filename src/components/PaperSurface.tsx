import type { HTMLAttributes, PropsWithChildren } from 'react'

type PaperTone = 'blue' | 'yellow' | 'paper' | 'black'
type PaperSurfaceProps = PropsWithChildren<HTMLAttributes<HTMLElement>> & {
  tone?: PaperTone
  as?: 'section' | 'div' | 'article'
}

export function PaperSurface({ tone = 'paper', as: Tag = 'div', className = '', children, ...props }: PaperSurfaceProps) {
  return <Tag className={`paper-surface paper-surface--${tone} ${className}`.trim()} {...props}>{children}</Tag>
}
