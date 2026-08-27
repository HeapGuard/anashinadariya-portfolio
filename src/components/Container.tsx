import type { HTMLAttributes, PropsWithChildren } from 'react'

type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function Container({ className = '', children, ...props }: ContainerProps) {
  return <div className={`container ${className}`.trim()} {...props}>{children}</div>
}
