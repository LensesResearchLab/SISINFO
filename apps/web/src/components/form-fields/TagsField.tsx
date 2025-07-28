import { useFormContext } from "react-hook-form"
import { Badge } from "../ui/badge"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TagsField() {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="tags"
      render={({ field }) => {
        const addTag = (value: string) => {
          if (value && !field.value.includes(value)) {
            field.onChange([...field.value, value])
          }
        }

        const removeTag = (tagToRemove: string) => {
          field.onChange(field.value.filter((t: string) => t !== tagToRemove))
        }

        const renderTag = (tag: string) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-core-soft text-core hover:text-white hover:bg-core px-3 py-1 rounded-full transition-colors"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-core-highlight"
            >
              <X size={14} className="inline-block" />
            </button>
          </Badge>
        )

        return (
          <FormItem className="text-primary">
            <FormLabel className="font-semibold">Etiquetas</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Select value="" onValueChange={addTag}>
                  <SelectTrigger className="focus:ring-2 focus:ring-core border-gray-300 rounded-lg">
                    <SelectValue placeholder="Agregar etiqueta..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inteligencia artificial">Inteligencia artificial</SelectItem>
                    <SelectItem value="Bases de datos">Bases de datos</SelectItem>
                    <SelectItem value="Desarrollo web">Desarrollo web</SelectItem>
                    <SelectItem value="Ciberseguridad">Ciberseguridad</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-3">
                  {field.value.map(renderTag)}
                </div>
              </div>
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )
      }}
    />
  )
}
