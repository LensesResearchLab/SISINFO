import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  import { Card, CardContent, CardHeader } from "@/components/ui/card";
  import { cn } from "@/lib/utils"
import { Check } from "lucide-react";
  
  export interface GeneralProps {
    readonly title: string
    readonly sections: SectionProps[]
  }
  
  export interface SectionProps {
    readonly title: string
    readonly description: string
    readonly icon: React.ReactNode
  }
  
  interface StatusProps {
    readonly title: string
    readonly currentStatus: string
    readonly statusMessage: string
    readonly steps: string[]
  }
  
  /**
   * TabStatus Component
   * 
   * Main component that renders a tabbed interface with general information and status tabs.
   * 
   * @param {Object} props
   * @param {GeneralProps} props.general - Props for the general information tab
   * @param {StatusProps} props.status - Props for the status tab
   * @param {React.ReactNode} props.children - Optional child elements
   * @returns {JSX.Element} A tabbed interface with general and status information
   */
  export default function TabStatus({general, status, children}: {readonly general: GeneralProps, readonly status: StatusProps, readonly children?: React.ReactNode}) {
    return (
      <div className=" mx-auto p-10">
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2 bg-core text-white">
            <TabsTrigger value="general" className="cursor-pointer data-[state=active]:bg-core-highlight data-[state=active]:font-semibold data-[state=active]:text-white">Información general</TabsTrigger>
            <TabsTrigger value="status" className="cursor-pointer data-[state=active]:bg-core-highlight data-[state=active]:font-semibold data-[state=active]:text-white">Estado inscripción</TabsTrigger>
          </TabsList>
          <TabsContent value="general" >
            <TabGeneralCard title={general.title} sections={general.sections}>
              {children}
            </TabGeneralCard>
          </TabsContent>
          <TabsContent value="status">
            <TabStatusCard status={status} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }
  
  /**
   * TabGeneralCard Component
   * 
   * Renders a card containing general information sections.
   * 
   * @param {Object} props
   * @param {string} props.title - Title of the card
   * @param {SectionProps[]} props.sections - Array of section information to display
   * @param {React.ReactNode} props.children - Optional child elements
   * @returns {JSX.Element} A card with title and information sections
   */
  function TabGeneralCard({title, sections, children}: { readonly title:string, readonly sections: SectionProps[], readonly children?: React.ReactNode}) {
    return (
      <Card className="max-w-3xl border-none">
        <CardHeader>
          <h2 className="text-2xl font-medium text-core">{title}</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {sections.map((section) => (
              <InformationSection key={section.title} {...section} />
            ))}
            {children}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  /**
   * InformationSection Component
   * 
   * Renders a single section of information with an icon, title and description.
   * 
   * @param {Object} props
   * @param {string} props.title - Title of the section
   * @param {string} props.description - Description text
   * @param {React.ReactNode} props.icon - Icon element to display
   * @returns {JSX.Element} A section with icon, title and description
   */
  function InformationSection({title, description, icon}: { readonly title: string, readonly description: string, readonly icon: React.ReactNode}) {
    return (
      <div className="flex gap-3">
        {icon}
        <div className="w-full">
          <h3 className="font-medium text-core">{title}</h3>
          <p className="text-foreground-soft">{description}</p>
          <hr className="bg-gray-300 h-[1px] w-full my-2 border-0" />
        </div>
      </div>
    )
  }

/**
 * TabStatusCard Component
 * 
 * Renders a card showing the current status and progress through defined steps.
 * 
 * @param {Object} props
 * @param {StatusProps} props.status - Status information including current step and messages
 * @returns {JSX.Element} A card showing progress steps and status message
 */
export function TabStatusCard({ status }: { readonly status: StatusProps }) {
  if (status.currentStatus === "Rechazado") {
    return (
      <Card className="border-none">
        <CardContent className="p-0">
          <div className="space-y-8 p-3">
            <h2 className="text-2xl font-medium text-core text-center">{status.title}</h2>
            <p className="text-center text-red-500 font-medium">
              Tu postulación fue rechazada. Puedes volver a postularte a otro proyecto.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  let found = false
  const stepsStatus = status.steps.map((step) => {
    if (step === status.currentStatus) {
      found = true
      return { name: step, completed: false, current: true }
    }
    return { name: step, completed: !found, current: false }
    
  })
  return (
    <Card className="border-none ">
      <CardContent className="p-0">
        <div className="space-y-8 p-3">
          <h2 className="text-2xl font-medium text-core text-center">{status.title}</h2>
          <div className="relative">
            <div className="absolute top-5 left-0 w-full h-[2px] bg-core-soft md:block hidden" />
            <div className="absolute top-0 left-5 w-[2px] h-full bg-core-soft md:hidden block" />
            <div className="relative flex md:flex-row flex-col md:justify-between md:items-center gap-8">
              {stepsStatus.map(step => (
                <StepSphere key={step.name} {...step} />
              ))}
            </div>
          </div>
          <div className="space-y-4 text-center">
            <h3 className="text-core font-medium">¿Que significa tu estado actual?</h3>
            <p className="text-foreground-soft max-w-2xl mx-auto">{status.statusMessage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StepSphereProps {
  readonly name: string
  readonly completed: boolean
  readonly current: boolean
}

function StepSphere({ name, completed, current }: StepSphereProps) {
  const getDivStyles = (completed: boolean, current: boolean) => {
    if (completed) return "bg-core text-primary-foreground";
    return current ? "bg-core-soft dark:bg-core text-primary border-2 border-core" : "bg-gray-100 text-gray-400 dark:bg-gray-800"
  }
  const getTextStyles = (completed: boolean, current: boolean) => {
    if (current) return "";
    return completed ? "text-foreground" : "text-muted-foreground"
  }

  return (
    <div className="flex md:flex-col flex-row md:items-center items-start gap-3">
      <div className="relative">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center z-10 relative",
            getDivStyles(completed, current)
          )}
        >
          {completed ? (<Check/>) : (<span>{name.charAt(0)}</span>)}
        </div>
      </div>
      <div className="md:text-center text-left">
        <p
          className={cn(
            "font-medium",
            getTextStyles(completed, current)
          )}
        >
          {name}
        </p>
      </div>
    </div>
  )
}
