'use client'

import { useMemo, useState } from 'react'
import { format, startOfDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronDownIcon } from 'lucide-react'
import { ru as ruDayPicker } from 'react-day-picker/locale'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

function parsePickerValue(value: string): { date?: Date; time: string } {
  if (!value) return { time: '12:00' }

  const localMatch = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(value)
  if (localMatch) {
    const [, datePart, timePart] = localMatch
    const date = new Date(`${datePart}T${timePart}:00`)
    if (!Number.isNaN(date.getTime())) {
      return { date, time: timePart }
    }
  }

  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    const pad = (n: number) => String(n).padStart(2, '0')
    return {
      date: parsed,
      time: `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`,
    }
  }

  return { time: '12:00' }
}

function toPickerValue(date: Date | undefined, time: string): string {
  if (!date || !time) return ''
  const [hours, minutes] = time.split(':').map(Number)
  const next = new Date(date)
  next.setHours(hours, minutes, 0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${format(next, 'yyyy-MM-dd')}T${pad(next.getHours())}:${pad(next.getMinutes())}`
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
  const [dateOpen, setDateOpen] = useState(false)
  const { date, time } = useMemo(() => parsePickerValue(value), [value])
  const today = startOfDay(new Date())

  const setDate = (nextDate: Date | undefined) => {
    if (!nextDate) return
    onChange(toPickerValue(nextDate, time))
    setDateOpen(false)
  }

  const setTime = (nextTime: string) => {
    const baseDate = date ?? today
    onChange(toPickerValue(baseDate, nextTime))
  }

  return (
    <div className="space-y-2">
      <FieldGroup className="flex-row gap-3">
        <Field className="min-w-0 flex-1">
          <FieldLabel htmlFor={id ? `${id}-date` : undefined}>Дата</FieldLabel>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                id={id ? `${id}-date` : undefined}
                type="button"
                variant="outline"
                data-empty={!date}
                className={cn(
                  'w-full justify-between font-normal data-[empty=true]:text-muted-foreground',
                )}
              >
                <span className="truncate">
                  {date ? format(date, 'd MMM yyyy', { locale: ru }) : 'Выберите дату'}
                </span>
                <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                locale={ruDayPicker}
                selected={date}
                defaultMonth={date ?? today}
                captionLayout="dropdown"
                onSelect={setDate}
                disabled={allowPastDates ? undefined : (day) => day < today}
              />
            </PopoverContent>
          </Popover>
        </Field>
        <Field className="w-[7.25rem] shrink-0">
          <FieldLabel htmlFor={id ? `${id}-time` : undefined}>Время</FieldLabel>
          <Input
            id={id ? `${id}-time` : undefined}
            type="time"
            step={1800}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
      </FieldGroup>
      {showHint && (
        <p className="text-xs text-muted-foreground">Доставка с 9:00 до 21:00</p>
      )}
    </div>
  )
}
