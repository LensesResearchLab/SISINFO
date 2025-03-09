"use client";
import {Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Users, FileText, Briefcase, CheckCircle2, User, Upload, X } from "lucide-react"
import { Button } from '@/components/ui/button'
import { use, useEffect, useState } from 'react';
import { getGraduatedAssistanceById } from "@/app/home/graduated-assistance/services/assistance.service";
import { Assistance } from "@/app/home/graduated-assistance/types/assistance.type";
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';



/**
 * AssistanceDetails Component
 * 
 * Main component for displaying and managing graduate assistance position details and application process.
 * 
 * States:
 * - assistance: Object containing all details about the assistance position
 * - isApplying: Boolean to toggle between details view and application form
 * 
 * Features:
 * - Fetches and displays assistance details
 * - Handles navigation and 404 errors
 * - Toggles between information display and application form
 * 
 * @returns {JSX.Element} A div containing either assistance details or application form
 */
export default function AssistanceDetails({ params } :{ params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [assistance, setAssistance] = useState({ 
    id: 0, 
    name: "",
    clasification: "", 
    publication_date: new Date(),
    end_date: new Date(),
    start_semester: "",
    description: "", 
    requisites: [""], 
    professor: "",
    email: ""});
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return router.push("/404");
      try { 
        const data = await getGraduatedAssistanceById(id);
        setAssistance(data);
      } catch {
        router.push("/404");
      }
    };
  
    fetchData();
  }, [id]);

  
  return (
    <div className="min-h-full min-w-full mx-auto p-4 space-y-8">
      {!isApplying && <AssistanceInscription assistance={assistance} setIsApplying={setIsApplying} />}
      {isApplying && <AssistanceApplying assistance={assistance} setIsApplying={setIsApplying} />}
    </div>
  )
}





/**
 * AssistanceInscription Component
 * 
 * Displays detailed information about the assistance position including main info,
 * requirements, and contact details.
 * 
 * Props:
 * - assistance: Assistance object containing position details
 * - setIsApplying: Function to toggle application state
 * 
 * Layout:
 * - Card container with header and content sections
 * - Organized sections for different types of information
 * - Apply button at the bottom
 * 
 * @param {Object} props Component props
 * @returns {JSX.Element} Card containing assistance position details
 */
function AssistanceInscription({assistance, setIsApplying}: {assistance: Assistance, setIsApplying: (value: boolean) => void}) {
  return (
    <Card className="max-w-3xl  mx-auto shadow-lg">
      <CardHeader className=" rounded-t-lg">
        <CardTitle className="text-3xl font-bold text-sky-800">Información de la asistencia</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 space-y-6">
        <div className="space-y-11">
          <MainInformation assistance={assistance} />
          <Requisites requisites={assistance.requisites} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactInfo assistance={assistance} />
          </div>
        </div>
        <Button className="bg-black hover:bg-black/90 w-40 mx-auto block" onClick={() => setIsApplying(true)}>Aplicar</Button>
      </CardContent>
    </Card>
  )
}





/**
 * MainInformation Component
 * 
 * Displays the primary information about the assistance position including
 * name, classification, and description.
 * 
 * Props:
 * - assistance: Assistance object containing position details
 * 
 * Features:
 * - Icons for each information type
 * - Consistent styling and spacing
 * - Responsive layout
 * 
 * @param {Object} props Component props
 * @returns {JSX.Element} Section containing main position information
 */
function MainInformation({assistance}: {assistance: Assistance}) {
  return  (
    <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Briefcase className="w-6 h-6 text-sky-800 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-xl text-sky-800">Nombre:</h2>
              <p className="text-xl">{assistance.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-sky-800 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-xl text-sky-800">Clasificación:</h2>
              <p className="text-xl">{assistance.clasification}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-sky-800 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-xl text-sky-800">Descripción:</h2>
              <p className="text-xl">{assistance.description}</p>
            </div>
          </div>
        </div>
      </div>
  )
}





/**
 * Requisites Component
 * 
 * Displays a list of requirements for the assistance position.
 * 
 * Props:
 * - requisites: Array of strings containing requirement descriptions
 * 
 * Features:
 * - Checkmark icons for each requirement
 * - Consistent spacing and alignment
 * - Maps through requirements array
 * 
 * @param {Object} props Component props
 * @returns {JSX.Element} List of position requirements
 */
function Requisites({requisites}: {requisites: string[]}) {
  return (
    <div className='mb-4'>
    <h3 className="font-semibold text-2xl text-sky-800 mb-3">Requisitos:</h3>
    <ul className="space-y-1">
      {requisites.map((requisites) => (
        <li className="flex items-center gap-3" key = {requisites}>
        <CheckCircle2 className="w-6 h-6 text-sky-800 flex-shrink-0" />
        <span className="text-xl">{requisites}</span>
      </li>
      ))}
    </ul>
    </div>
  )
}




/**
 * ContactInfo Component
 * 
 * Displays contact information for the assistance position including
 * professor name and email.
 * 
 * Props:
 * - assistance: Assistance object containing contact details
 * 
 * Features:
 * - Icons for each contact method
 * - Clickable email link
 * - Consistent styling
 * 
 * @param {Object} props Component props
 * @returns {JSX.Element} Section containing contact information
 */
function ContactInfo({assistance}: {assistance: Assistance}) {
  return (
    <div>
          <h2 className="text-2xl font-bold text-sky-800 mb-3">Contacto:</h2>
          <div className="space-y-3 ">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-sky-800 flex-shrink-0" />
              <span className="text-xl">{assistance.professor}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-sky-800" />
              <a href={`mailto:${assistance.email}`} className="text-xl text-sky-800 hover:underline">
                {assistance.email}
              </a>
            </div>
          </div>
        </div>
  )
}



/**
 * AssistanceApplying Component
 *
 * Handles the application process for the assistance position.
 *
 * Props:
 * - assistance: Assistance object containing position details
 * - setIsApplying: Function to toggle application state
 *
 * Features:
 * - File upload for CV
 * - Confirmation modal
 * - Form submission handling
 * - Navigation back to details
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} Application form card
 */
function AssistanceApplying({assistance, setIsApplying}: {assistance: Assistance, setIsApplying: (value: boolean) => void}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Aplicación enviada con exito");
  }

  const modalProps = {
    "title": "¿Estás seguro de aplicar a esta asistencia graduada?",
    "description": "Recuerda que una vez aplicas no podrás cambiar tu decisión", 
    "buttonText": "Aplicar",
    "successTitle": "¡Aplicación enviada!",
    "successText": "Tu aplicación ha sido enviada con éxito",
    "url": "/home/graduated-assistance/assistance-applied-list"
  }

  return (
    <Card className="max-w-3xl  mx-auto shadow-lg">
      <CardHeader className=" flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <CardTitle className="text-2xl font-bold text-center text-sky-800">{assistance.name}</CardTitle>
        <ButtonBack setIsApplying={setIsApplying} />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <UploadCV assistance={assistance} />
          <div className="flex justify-center pt-3.5">
            <ConfirmationModal dialogText={modalProps} onConfirm={handleSubmit}/>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}





/**
 * ButtonBack Component
 *
 * Renders a button to return to the details view from the application form.
 *
 * Props:
 * - setIsApplying: Function to toggle application state
 *
 * Features:
 * - Consistent styling with main theme
 * - Icon integration
 * - Hover states
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} Back button
 */
function ButtonBack({setIsApplying}: {setIsApplying: (value: boolean) => void}) {
  return  (
    <Button variant="outline"
      size="sm"
      className="text-sky-800 hover:text-sky-900 border-sky-800 hover:border-sky-900 hover:bg-sky-50"
      onClick={() => setIsApplying(false)}
    >
      <FileText className="h-4 w-4 mr-2" />
      Ver detalles
    </Button>
  )
} 






/**
 * UploadCV Component
 *
 * Handles CV file upload functionality for the application process.
 *
 * Props:
 * - assistance: Assistance object containing position details
 *
 * States:
 * - uploadedFile: Object containing file name and URL
 *
 * Features:
 * - PDF file upload
 * - File preview
 * - Remove file capability
 * - Drag and drop area
 *
 * @param {Object} props Component props
 * @returns {JSX.Element} File upload section
 */
function UploadCV({assistance}: {assistance: Assistance}) {
  interface UploadedFile {
    name: string
    url: string
  }
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file)
      setUploadedFile({ name: file.name, url })
    }
  }

  const handleRemoveFile = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url)
    }
    setUploadedFile(null)
  }

  // Not working right-now as logic is needed to submit 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      uploadedFile
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <Requisites requisites={assistance.requisites} />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-sky-800">Archivo cargado</h2>

          {uploadedFile ? (
            <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-medium">{uploadedFile.name}</span>
              </div>
              <button type="button" onClick={handleRemoveFile} className="p-1 hover:bg-gray-200 rounded-full">
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          ) : null}

          <div className={`border-2 border-dashed rounded-lg p-6 ${uploadedFile ? "hidden" : ""}`}>
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-600" />
              <Label htmlFor="file-upload" className="cursor-pointer text-center">
                <span className="text-lg">Adjuntar documentos</span>
                <Input id="file-upload" type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


