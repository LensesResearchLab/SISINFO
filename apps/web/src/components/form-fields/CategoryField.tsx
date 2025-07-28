import { useFormContext } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

export function CategoryField() {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <FormItem className='text-primary'>
          <FormLabel className="font-semibold">Categoría</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="desarrollo">Proyecto aplicado a empresas</SelectItem>
              <SelectItem value="investigacion">Investigación</SelectItem>
              <SelectItem value="analisis">Otro</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  )
}
