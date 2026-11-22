"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"
import Footer from "@/components/shared/footer"
import LinkifiedText from "@/components/shared/linkified-text"
import { getCurrentGraduatedAssistance } from "@/app/services/assistance.service"
import { GraduatedAssistance } from "@/app/types/entities/graduated-assistance.type"

export default function GraduatedAssistancesPage() {
  const [assistances, setAssistances] = useState<GraduatedAssistance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentGraduatedAssistance()
      .then((data) => setAssistances(Array.isArray(data) ? data : []))
      .catch(() => setAssistances([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="border-b bg-white px-6 py-5">
        <Link href="/" className="text-core hover:underline">Inicio</Link>
      </header>
      <main className="container flex-1 px-4 py-10 md:px-6">
        <div className="mb-8 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-core" />
          <div>
            <h1 className="text-3xl font-bold text-core">Asistencias graduadas</h1>
            <p className="text-muted-foreground">Ofertas publicadas en el periodo académico actual.</p>
          </div>
        </div>
        {loading && <p className="text-muted-foreground">Cargando ofertas...</p>}
        {!loading && assistances.length === 0 && (
          <Card><CardContent className="py-10 text-center text-muted-foreground">No hay asistencias publicadas para el periodo actual.</CardContent></Card>
        )}
        {!loading && assistances.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assistances.map((assistance) => (
              <Card key={assistance.id} className="h-full">
                <CardHeader>
                  <CardTitle>{assistance.title}</CardTitle>
                  <CardDescription>{assistance.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div><LinkifiedText text={assistance.description} /></div>
                  <p className="text-muted-foreground">
                    {new Date(assistance.startDate).toLocaleDateString()} – {new Date(assistance.endDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
