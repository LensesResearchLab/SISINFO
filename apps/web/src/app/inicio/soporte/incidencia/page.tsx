"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { TriangleAlert } from "lucide-react"
import { createIncidence } from "@/app/services/incidences.service"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"

export default function IncidentReportForm() {
  const [incidentType, setIncidentType] = useState("")
  const [incidentDescription, setIncidentDescription] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const handleConfirm = async () => {
    try {
      await createIncidence({
        type: incidentType,
        description: incidentDescription,
      })
      setIncidentDescription("")
      setIncidentType("")
    } catch (error) {
      console.error("Error submitting incidence:", error)
    }
    setModalOpen(false)
  }

  const options = ["Error en el sistema", "Falla técnica", "Otro"]

  return (
    <div className="flex justify-center items-center min-h-full min-w-full">
      <Card className="p-8 text-lg">
        <CardHeader className="flex items-center">
          <h2 className="text-2xl font-bold text-core-highlight flex items-center">
            <TriangleAlert className="text-core" /> Reporte de incidentes
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-primary mt-4">
            Escriba el incidente que presentó, su usuario será visible para los administradores del sistema
          </p>
          <div className="mt-6">
            <Select value={incidentType} onValueChange={setIncidentType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6">
            <Textarea
              className="h-32 resize-none"
              placeholder="Describa el problema que presentó..."
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              wrap="soft"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="px-6 py-3 rounded-md text-lg"
            onClick={() => setModalOpen(true)}
            disabled={!incidentType || !incidentDescription.trim()}
          >
            Publicar
          </Button>
        </CardFooter>
      </Card>
      <ConfirmationModal 
        dialogText={{
          buttonText: 'Confirmar',
          title: "Confirmación de envío",
          description: "¿Desea enviar la incidencia?",
          successTitle: "¡Éxito!",
          successText: "La incidencia se ha enviado exitosamente.",
        }}
        onConfirm={handleConfirm}
        open={modalOpen}
        setIsOpen={setModalOpen}
      />
    </div>
  )
}