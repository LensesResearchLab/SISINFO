import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

export function StudentsField() {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="students"
      render={({ field }) => (
        <FormItem className='text-primary'>
          <FormLabel className="font-semibold">Número de Estudiantes</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              min="1"
              onChange={(e) => field.onChange(parseInt(e.target.value))}
              className="w-24 focus:ring-2 focus:ring-core border-gray-300 rounded-lg text-primary"
            />
          </FormControl>
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  )
}
