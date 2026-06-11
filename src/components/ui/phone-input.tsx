'use client'

import * as React from 'react'
import { formatPhoneInput, PHONE_FORMAT_HINT } from '@/lib/phone-mask'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

type PhoneInputProps = Omit<React.ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> & {
  value: string
  onChange: (value: string) => void
  showHint?: boolean
}

export function PhoneInput({
  value,
  onChange,
  showHint = true,
  className,
  onFocus,
  ...props
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(formatPhoneInput(e.target.value))
  }

  return (
    <div className="space-y-1.5">
      <Input
        {...props}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={value}
        onChange={handleChange}
        onFocus={(e) => {
          if (!value) onChange(formatPhoneInput('+7'))
          onFocus?.(e)
        }}
        placeholder="+7 (900) 000-00-00"
        className={cn(className)}
      />
      {showHint && (
        <p className="text-xs text-muted-foreground">{PHONE_FORMAT_HINT}</p>
      )}
    </div>
  )
}
