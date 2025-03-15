/**
 * CoreFeatures Component
 * 
 * This component displays the main features of the SISINFO system in a responsive grid layout.
 * It shows three key features with their respective icons:
 * - Thesis and graduation project management
 * - Graduate assistantships consultation
 * - Important dates consultation
 * 
 * The grid adjusts from 1 column on mobile to 2 columns on medium screens and 3 columns on large screens.
 * Each feature is displayed with an icon from Lucide React and descriptive text below.
 * 
 * @returns {JSX.Element} A grid of core features with icons and descriptions
 */
import { BookOpen, GraduationCap, Calendar } from 'lucide-react'

export default function CoreFeatures(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[800px]">
      <div className="flex flex-col items-center p-4 text-center">
        <BookOpen className="h-10 w-10 text-core mb-2" />
        <span className="font-medium">Gestiona tus proyectos de grado y tesis</span>
      </div>
      <div className="flex flex-col items-center p-4 text-center">
        <GraduationCap className="h-10 w-10 text-core mb-2" />
        <span className="font-medium">Consulta asistencias graduadas</span>
      </div>
      <div className="flex flex-col items-center p-4 text-center">
        <Calendar className="h-10 w-10 text-core mb-2" />
        <span className="font-medium">Consulta fechas importantes</span>
      </div>
    </div>
  )
}
