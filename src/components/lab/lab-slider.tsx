import { cn } from '@/lib/utils'

type LabSliderProps = {
  id: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  format?: (value: number) => string
  className?: string
}

export function LabSlider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v) => String(Math.round(v * 10) / 10),
  className,
}: LabSliderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <label htmlFor={id} className="font-medium text-foreground">
          {label}
        </label>
        <span className="tabular-nums text-muted-foreground">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
    </div>
  )
}
