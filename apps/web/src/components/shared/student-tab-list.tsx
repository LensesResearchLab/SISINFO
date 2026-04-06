import { TabsList, TabsTrigger } from "../ui/tabs";

export function StudentTabList() {
  return (
    <TabsList
      className="grid w-full grid-cols-2 bg-core text-white"
    >
      <TabsTrigger
        value="profile"
      >
        Subárea de investigación
      </TabsTrigger>
      <TabsTrigger
        value="detail"
      >
        Detalle plan de estudio
      </TabsTrigger>
    </TabsList>
  )
}
