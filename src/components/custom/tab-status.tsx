import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "components/ui/tabs"
import { Card, CardContent, CardHeader } from "components/ui/card"

interface GeneralProps {
  title: string
  sections: SectionProps[]
}

interface SectionProps {
  title: string
  description: string
  icon: React.ReactNode
}

interface StatusProps {
  title: string
  currentStatus: string
  statusMessage: string
  steps: string[]
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
export default function TabStatus({general, status, children}: {general: GeneralProps, status: StatusProps, children?: React.ReactNode}) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2 bg-sky-800 text-white">
          <TabsTrigger value="general" className="data-[state=active]:bg-sky-900 data-[state=active]:font-semibold data-[state=active]:text-white">Información general</TabsTrigger>
          <TabsTrigger value="status" className="data-[state=active]:bg-sky-900 data-[state=active]:font-semibold data-[state=active]:text-white">Estado inscripción</TabsTrigger>
        </TabsList>
        <TabsContent value="general" >
          <TabGeneralCard title={general.title} sections={general.sections} children={children} />
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
function TabGeneralCard({title, sections, children}: {title:string, sections: SectionProps[], children?: React.ReactNode}) {
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <h2 className="text-2xl font-medium text-sky-800">{title}</h2>
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
function InformationSection({title, description, icon}: {title: string, description: string, icon: React.ReactNode}) {
  return (
    <div className="flex gap-3">
      {icon}
      <div className="w-full">
        <h3 className="font-medium text-sky-800">{title}</h3>
        <p className="text-gray-700">{description}</p>
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
export function TabStatusCard({status}: {status: StatusProps}) {
  let found = false;
  const stepsStatus = status.steps.map((step) => {
    if (step === status.currentStatus) {
      found = true;
      return {name: step, completed: true}
    }
    return {name: step, completed: !found}
  })

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-8 p-6">
          <h2 className="text-2xl font-medium text-sky-800 text-center">{status.title}</h2>
          <div className="relative">
            <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200" />
            <div className="relative flex justify-between">
              {stepsStatus.map((step) => (
                <StepSphere key={step.name} {...step} />
              ))}
            </div>
          </div>
          <div className="space-y-4 text-center">
            <h3 className="text-sky-800 font-medium">¿Que significa tu estado actual?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">{status.statusMessage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * StepSphere Component
 * 
 * Renders an individual step indicator as a colored sphere with label.
 * 
 * @param {Object} props
 * @param {string} props.name - Name of the step
 * @param {boolean} props.completed - Whether the step is completed
 * @returns {JSX.Element} A sphere indicator with step name
 */
function StepSphere({name, completed}: {name: string, completed: boolean}) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full border-4 ${completed ? "bg-sky-800 border-sky-800" : "bg-gray-300 border-gray-300"} z-10`} />
      <span className="mt-2 text-sm font-medium text-gray-600 text-center">{name}</span>
    </div>
  )
}