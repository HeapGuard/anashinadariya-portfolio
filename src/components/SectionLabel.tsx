import type { HTMLAttributes } from 'react'

type SectionLabelProps = HTMLAttributes<HTMLParagraphElement> & { index: string; children: string }

export function SectionLabel({ index, children, className = '', ...props }: SectionLabelProps) {
  return <p className={`section-label ${className}`.trim()} {...props}><span>{index}</span>{children}</p>
}
