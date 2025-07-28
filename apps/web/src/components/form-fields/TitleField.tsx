import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


export function TitleField() {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary font-semibold">Título del Proyecto</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="Ej: Desarrollo de un producto de datos para..."
              className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg text-primary"
            />
          </FormControl>
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  )
}
