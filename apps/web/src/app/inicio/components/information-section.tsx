import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InformationCardProps {
  Icon: LucideIcon
  title: string
  description: string
  url: string
}

export interface InformationSectionProps {
  title: string
  features: InformationCardProps[]
  background?: string
  className?: string
}

export default function InformationSection({
  title,
  features,
  background = "bg-core-highlight",
}: InformationSectionProps) {
  return (
    <section className="space-y-2 w-full">
      <h2 className={cn(
        "text-lg font-bold p-3 text-white rounded-lg",
        "transition-colors duration-300",
        background
      )}>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <InformationCard key={`${feature.title}-${index}`} {...feature} />
        ))}
      </div>
    </section>
  )
}

function InformationCard({ Icon, title, description, url }: InformationCardProps) {
  return (
    <Link
      href={`/inicio/${url}`}
      className="block group focus:outline-none"
      aria-label={`Ir a ${title}`}
    >
      <Card className="transition-all duration-300 ease-in-out  hover:shadow-lg group-hover:-translate-y-1 group-focus:ring-2 group-focus:ring-primary w-full">
        <CardContent className="px-6 py-2 h-full">
          <div className="flex items-start gap-4 h-full">
            <div className="p-2 rounded-full bg-core-soft">
              <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}