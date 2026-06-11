'use client'

import { useMemo, useState } from 'react'
import { format, startOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const TIME_SLOTS = (() => {
  const slots: string[] = []
  for (let hour = 9; hour <= 21; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 21 && minute === 30) break
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
    }
  }
  return slots
})()

function parseValue(value: string): { date?: Date; time: string } {
  if (!value) return { time: '12:00' }
  const [datePart, timePart] = value.split('T')
  const date = datePart ? new Date(`${datePart}T12:00:00`) : undefined
  const time = timePart?.slice(0, 5) || '12:00'
  return { date: date && !Number.isNaN(date.getTime()) ? date : undefined, time }
}

function toValue(date: Date | undefined, time: string): string {
  if (!date) return ''
  return `${format(date, 'yyyy-MM-dd')}T${time}`
}

type DeliveryDateTimePickerProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  allowPastDates?: boolean
  showHint?: boolean
}

export function DeliveryDateTimePicker({
  id,
  value,
  onChange,
  allowPastDates = false,
  showHint = true,
}: DeliveryDateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const { date, time } = useMemo(() => parseValue(value), [value])
  const today = startOfDay(new Date())

  const displayLabel =
    date && value
      ? `${format(date, 'd MMMM yyyy', { locale: ru })}, ${time}`
      : 'Выберите дату и время'

  const update = (nextDate: Date | undefined, nextTime: string) => {
    if (!nextDate) return
    onChange(toValue(nextDate, nextTime))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              'h-9 w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{displayLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(next) => update(next, time)}
            disabled={allowPastDates ? undefined : (day) => day < today}
            initialFocus
          />
          <div className="border-t border-border p-3">
            <Label className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Время доставки
            </Label>
            <Select
              value={time}
              onValueChange={(nextTime) => {
                const baseDate = date ?? today
                update(baseDate, nextTime)
                setOpen(false)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Время" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
      {showHint && (
        <p className="text-xs text-muted-foreground">Интервалы с 9:00 до 21:00</p>
      )}
    </div>
  )
}
