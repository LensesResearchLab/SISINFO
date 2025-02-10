import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "components/ui/tabs"
  import { Card, CardContent, CardHeader } from "components/ui/card"
import { Skeleton } from "components/ui/skeleton"
import { Loader } from "lucide-react"

/**
 * TabStatusSkeleton Component
 * 
 * Main skeleton component that renders a loading state for the TabStatus component.
 * Shows a tabbed interface with general information and status tabs in a loading state.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Optional child elements
 * @returns {JSX.Element} A skeleton loading state for the tabbed interface
 */
export default function TabStatusSkeleton({children}: {children?: React.ReactNode}) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-2 bg-sky-800 text-white">
          <TabsTrigger value="general" className="data-[state=active]:bg-sky-900 data-[state=active]:font-semibold data-[state=active]:text-white">Información general</TabsTrigger>
          <TabsTrigger value="status" className="data-[state=active]:bg-sky-900 data-[state=active]:font-semibold data-[state=active]:text-white">Estado inscripción</TabsTrigger>
        </TabsList>
        <TabsContent value="general" >
          <TabGeneralCardSkeleton children={children}/>
        </TabsContent>
        <TabsContent value="status">
          <TabStatusCardSkeleton/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * TabGeneralCardSkeleton Component
 * 
 * Renders a loading skeleton for the general information card.
 * Displays placeholder elements while the actual content is loading.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Optional child elements
 * @returns {JSX.Element} A skeleton card with loading placeholders
 */
function TabGeneralCardSkeleton({children}: {children?: React.ReactNode}) {
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <Skeleton className="h-5 w-full"/>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {Array.from({length: 4}).map((_, index) => (<InformationSectionSkeleton key={index} />))}
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * InformationSectionSkeleton Component
 * 
 * Renders a loading skeleton for an individual information section.
 * Shows a loader icon and placeholder lines for content.
 * 
 * @returns {JSX.Element} A skeleton loading state for an information section
 */
function InformationSectionSkeleton() {
  return (
      <div className="flex gap-3">
      <Loader/>
      <div className="w-full">
        <Skeleton className="h-3"/>
        <Skeleton className="h-3"/>
        <hr className="bg-gray-300 h-[1px] w-full my-2 border-0" />
      </div>
    </div>
  )
}

/**
 * TabStatusCardSkeleton Component
 * 
 * Renders a loading skeleton for the status card.
 * Displays a progress tracker with placeholder steps and loading content.
 * 
 * @returns {JSX.Element} A skeleton loading state for the status card
 */
export function TabStatusCardSkeleton() {

  const stepsStatus = Array.from({length: 5}).map((_, index) => {
    return {name: `Step ${index + 1}`, completed: true}
  })

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-8 p-6">
        <h2 className="text-2xl font-medium text-sky-800 text-center"><Skeleton /></h2>
        <div className="relative">
          <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200" />
          <div className="relative flex justify-between">
            {stepsStatus.map((step) => (
              <StepSphereSkeleton key={step.name} {...step} />
            ))}
          </div>
        </div>
          <div className="space-y-4 text-center">
            <h3 className="text-sky-800 font-medium">¿Que significa tu estado actual?</h3>
            <Skeleton className="h-3"/>
            <Skeleton className="h-3"/>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * StepSphereSkeleton Component
 * 
 * Renders a loading skeleton for an individual step in the progress tracker.
 * Shows a circle indicator and step name in a loading state.
 * 
 * @param {Object} props
 * @param {string} props.name - Name of the step
 * @param {boolean} props.completed - Whether the step is completed
 * @returns {JSX.Element} A skeleton loading state for a progress step
 */
function StepSphereSkeleton({name, completed}: {name: string, completed: boolean}) {
  return (
    <div className="flex flex-col items-center">
    <div className={`w-10 h-10 rounded-full border-4 ${completed ? "bg-sky-800 border-sky-800" : "bg-gray-300 border-gray-300"} z-10`} />
    <span className="mt-2 text-sm font-medium text-gray-600 text-center">{name}</span>
    </div>
  )
}