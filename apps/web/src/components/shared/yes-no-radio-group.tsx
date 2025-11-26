import { cn } from "@/lib/utils"

interface YesNoRadioGroupProps {
  readonly name: string
  readonly value?: boolean | null
  readonly onChange: (value: boolean) => void
  readonly disabled?: boolean
  readonly yesLabel?: string
  readonly noLabel?: string
  readonly className?: string
}

const baseOptionClasses =
  "flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer"

export function YesNoRadioGroup({
  name,
  value,
  onChange,
  disabled = false,
  yesLabel = "Sí",
  noLabel = "No",
  className,
}: YesNoRadioGroupProps) {
  const options = [
    { label: yesLabel, value: true, id: `${name}-yes` },
    { label: noLabel, value: false, id: `${name}-no` },
  ] as const

  return (
    <div role="radiogroup" className={cn("flex gap-6", className)}>
      {options.map((option) => (
        <label
          key={option.id}
          htmlFor={option.id}
          className={cn(
            baseOptionClasses,
            disabled ? "opacity-60 cursor-not-allowed" : "",
          )}
        >
          <input
            type="radio"
            id={option.id}
            name={name}
            value={String(option.value)}
            checked={value === option.value}
            onChange={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className="h-4 w-4 border-2 border-core text-core focus:ring-core accent-core"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}
