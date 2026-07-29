import { HTMLAttributes, forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'muted'
}

const variantClasses = {
  default: 'bg-white shadow-sm border border-[var(--color-border)]',
  bordered: 'bg-white border-2 border-[var(--color-border)]',
  muted: 'bg-[var(--color-muted)] border border-[var(--color-border)]',
}

type CardComponent = ForwardRefExoticComponent<CardProps & RefAttributes<HTMLDivElement>> & {
  Header: typeof CardHeader
  Title: typeof CardTitle
  Body: typeof CardBody
  Footer: typeof CardFooter
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl p-4 sm:p-6 ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
) as unknown as CardComponent

Card.displayName = 'Card'

function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`font-semibold text-[var(--color-foreground)] ${className}`} {...props}>
      {children}
    </h3>
  )
}

function CardBody({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

function CardFooter({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 pt-4 border-t border-[var(--color-border)] ${className}`} {...props}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Body = CardBody
Card.Footer = CardFooter

export { Card, type CardProps }
