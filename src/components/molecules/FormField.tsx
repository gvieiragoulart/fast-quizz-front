import type { InputHTMLAttributes } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
}

export default function FormField({ id, label, error, className, ...props }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className={cn(error && 'border-destructive', className)}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
