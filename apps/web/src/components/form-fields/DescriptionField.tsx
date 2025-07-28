import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"

export function DescriptionField() {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary font-semibold">Descripción Detallada</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Ingresa la descripción detallada..."
              className="min-h-[100px] focus:ring-2 focus:ring-core border-gray-300 rounded-lg text-primary"
            />
          </FormControl>
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  )
}