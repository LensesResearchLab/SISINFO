"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

/**
 * IncidentReportForm Component
 *
 * Provides a form for users to report incidents. The form includes:
 * - A dropdown to select the type of incident (Error in the system, Technical failure, Other).
 * - A text area for users to describe the incident in detail.
 * - A submit button to send the report.
 *
 * The form sends the incident type and description to the console on submission.
 *
 * @returns {JSX.Element} A form allowing users to submit incident reports.
 */
export default function IncidentReportForm() {
  const [incidentType, setIncidentType] = useState("")
  const [incidentDescription, setIncidentDescription] = useState("")

  const handleSubmit = () => {
    alert("Incident report submitted successfully")
    setIncidentDescription("")
    setIncidentType("")
  }

  return (
    <div className="flex justify-center items-center min-h-full min-w-full">
      <Card className="p-8 text-lg">
        <CardHeader className="flex items-center">
          <h2 className="text-2xl font-bold text-blue-800 flex items-center">⚠️ Reporte de incidentes</h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-600 mt-4">
            Escriba el incidente que presentó, su usuario será visible para los administradores del sistema
          </p>
          <div className="mt-6">
            <Select value={incidentType} onValueChange={setIncidentType}>
              <SelectTrigger className="w-full text-lg p-3">
                <SelectValue placeholder="Razón de la solicitud" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="error" className="text-lg">
                  Error en el sistema
                </SelectItem>
                <SelectItem value="bug" className="text-lg">
                  Falla técnica
                </SelectItem>
                <SelectItem value="otro" className="text-lg">
                  Otro
                </SelectItem>
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
          <Button className="bg-black text-white px-6 py-3 rounded-md text-lg" onClick={handleSubmit}>
            Publicar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}