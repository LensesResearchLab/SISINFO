import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, User, BookOpen, GraduationCap } from "lucide-react"
import Footer from "@/components/shared/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main>
        <HeroSection/>
        <FeaturesSection/>
        <AccessSection/>
      </main>
      <Footer/>
    </div>
  )
}

function HeroSection(){
  return (
    <section className="w-full bg-sky-800 py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
          <div className="flex flex-col justify-center space-y-4 text-white">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">SISINFO</h1>
              <p className="max-w-[600px] text-white/90 md:text-xl">
                Sistema de Información para la gestión de tesis y asistencias graduadas del Departamento de
                Ingeniería de Sistemas y Computación
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/auth"
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-[#005883] shadow transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
          <div className="items-center justify-center hidden md:flex">
            <Image
              src="/uniandes_logo.svg"
              alt="Universidad de los Andes logo"
              className="hidden lg:block"
              width={300}
              height={150}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection(){
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center" id="info">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#005883]">
              Servicios Disponibles
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              SISINFO ofrece múltiples servicios para estudiantes y profesores del departamento
            </p>
          </div>
        </div>
        <Tabs defaultValue="undergraduate" className="mt-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="cursor-pointer" value="undergraduate">Proyectos de Grado</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="postgraduate">Tesis de Maestría</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="assistances">Asistencias Graduadas</TabsTrigger>
          </TabsList>
          <UndergraduateThesisTabContent/>
          <PostgraduateThesisTabContent/>
          <GraduateAssistanceTabContent/>
        </Tabs>
      </div>
    </section>
  )
}

function UndergraduateThesisTabContent(){
  return (
    <TabsContent value="undergraduate" className="mt-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <FileText className="h-6 w-6" />
            <div>
              <CardTitle>Consultar Temas</CardTitle>
              <CardDescription>Ver temas disponibles para proyectos de grado</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Accede a la lista completa de temas propuestos por profesores para tu proyecto de grado.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <User className="h-6 w-6" />
            <div>
              <CardTitle>Consultar Profesores</CardTitle>
              <CardDescription>Ver perfiles de profesores asesores</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Conoce los perfiles académicos y áreas de investigación de los profesores disponibles.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Calendar className="h-6 w-6" />
            <div>
              <CardTitle>Consultar Fechas</CardTitle>
              <CardDescription>Calendario de entregas y presentaciones</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mantente al día con las fechas importantes para la entrega y presentación de tu proyecto.
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}

function PostgraduateThesisTabContent(){
  return (
    <TabsContent value="postgraduate" className="mt-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <FileText className="h-6 w-6" />
            <div>
              <CardTitle>Consultar Temas</CardTitle>
              <CardDescription>Ver temas disponibles para tesis de maestría</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Explora las líneas de investigación y temas propuestos para tu tesis de maestría.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <User className="h-6 w-6" />
            <div>
              <CardTitle>Consultar Profesores</CardTitle>
              <CardDescription>Ver perfiles de profesores investigadores</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Conoce los perfiles académicos y áreas de investigación de los profesores disponibles.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Calendar className="h-6 w-6" />
            <div>
              <CardTitle>Consultar Fechas</CardTitle>
              <CardDescription>Calendario de entregas y sustentaciones</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mantente al día con las fechas importantes para la entrega y sustentación de tu tesis.
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}


function GraduateAssistanceTabContent(){
  return (
    <TabsContent value="assistances" className="mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <GraduationCap className="h-6 w-6" />
            <div>
              <CardTitle>Ver Asistencias Disponibles</CardTitle>
              <CardDescription>Consulta las asistencias graduadas disponibles</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Accede a la lista completa de asistencias graduadas disponibles en el departamento.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <FileText className="h-6 w-6" />
            <div>
              <CardTitle>Estado de Aplicación</CardTitle>
              <CardDescription>Consulta el proceso de selección de asistencias</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Verifica el estado de tus aplicaciones a asistencias graduadas y los resultados del proceso.
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}

function AccessSection(){
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 flex flex-col items-center justify-center" id="login">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-2 max-w-[800px]">
            <h2 className="text-3xl font-bold tracking-tighter text-[#005883] sm:text-4xl md:text-5xl">
              Accede a SISINFO
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Inicia sesión con tus credenciales institucionales para acceder a todos los servicios de SISINFO
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[800px]">
            <div className="flex flex-col items-center p-4 text-center">
              <BookOpen className="h-10 w-10 text-[#005883] mb-2" />
              <span className="font-medium">Gestiona tus proyectos de grado y tesis</span>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <GraduationCap className="h-10 w-10 text-[#005883] mb-2" />
              <span className="font-medium">Aplica a asistencias graduadas</span>
            </div>
            <div className="flex flex-col items-center p-4 text-center">
              <Calendar className="h-10 w-10 text-[#005883] mb-2" />
              <span className="font-medium">Consulta fechas importantes</span>
            </div>
          </div>
          <div className="pt-4">
            <Button className="bg-[#005883] hover:bg-[#004670] px-8 py-6 text-base">
              <Link href="/auth">
                Iniciar sesión
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Header(){
  return (
    <header className="border-b">
      <div className="py-4 px-4 md:px-6 flex items-center justify-between">
        <Image
          src="/banner_sistemas.png"
          alt="Universidad de los Andes logo"
          width={300}
          height={150}
          className="hidden md:block"
        />
        <span className="block md:hidden text-sm text-muted-foreground">
          Departamento de Ingeniería de Sistemas y Computación
        </span>
        <Link
          href="/auth"
          className="inline-flex h-12  items-center justify-center rounded-md bg-sky-800 px-5 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#004670] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Iniciar Sesión
        </Link>
      </div>
    </header>
  )
}