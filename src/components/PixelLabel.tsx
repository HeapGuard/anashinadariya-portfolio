import type { HTMLAttributes, PropsWithChildren } from 'react'

type PixelLabelProps = PropsWithChildren<HTMLAttributes<HTMLSpanElement>>

export function PixelLabel({ className = '', children, ...props }: PixelLabelProps) {
  return <span className={`pixel-label ${className}`.trim()} {...props}>{children}</span>
}
