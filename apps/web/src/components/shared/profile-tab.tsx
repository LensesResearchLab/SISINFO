import { Student } from "@/app/types/student-profile.type"
import { CircleAlert } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { RenderFields } from "./render-fields";

export function ProfileTab({student}: { readonly student:Student }) {
  return (
    <TabsContent value="profile" className="flex justify-center flex-col items-center p-2">
      <Card className="flex justify-center flex-col items-center border-none w-3xl">
        <CardHeader className="text-core">
          <CardTitle className="text-2xl">
            Detalle de inscripción a perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 w-full">
          <RenderFields label="Estudiante" value={student?.name} />
          <RenderFields label="Correo estudiante" value={student?.email} />
          <RenderFields label="Perfil" value={student?.profile} />
          <RenderFields label="Asesor de tesis" value={student?.thesis2?.professor.user.name} />
          <RenderFields label="Semestre inicio tesis 1" value={student?.thesis1?.title} />
          <RenderFields label="Semestre inicio tesis 2" value={student?.thesis2?.title} />
        </CardContent>
        <CardFooter className="flex justify-center flex-col space-y-3">
          <CircleAlert className="text-core"/>
          <Label className="text-core">Estado: {student?.state}</Label>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}