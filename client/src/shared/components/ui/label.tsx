import { type LabelHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'

const labelVariants =
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(labelVariants, className)}
        {...props}
      />
    )
  },
)
Label.displayName = 'Label'

export { Label }
