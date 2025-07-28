import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LastPeriodFieldProps {
  periods: string[]
}

export function LastPeriodField({ periods }: Readonly<LastPeriodFieldProps>) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="lastPeriod"
      render={({ field }) => (
        <FormItem className='text-primary'>
          <FormLabel className="font-semibold">Último Periodo</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg">
                <SelectValue placeholder="Selecciona un periodo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {periods.map(period => (
                <SelectItem value={period} key={period}>{period}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  )
}
