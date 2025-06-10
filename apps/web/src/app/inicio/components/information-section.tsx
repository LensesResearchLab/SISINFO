import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for each individual InformationCard
 *
 * @property {LucideIcon} Icon - Icon component from Lucide to represent the feature
 * @property {string} title - Title of the feature
 * @property {string} description - Short description of the feature
 * @property {string} url - Path or external URL to navigate to when the card is clicked
 * @property {boolean} [opensWindow] - If true, opens the link in a new browser tab
 */
interface InformationCardProps {
  readonly Icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly opensWindow?: boolean;
}

/**
 * Props for the InformationSection component
 *
 * @property {string} title - Title of the entire section
 * @property {InformationCardProps[]} features - Array of feature cards to render
 * @property {string} [background] - Optional background color class for the section title
 * @property {string} [className] - Optional additional class for the section container
 */
export interface InformationSectionProps {
  readonly title: string;
  readonly features: InformationCardProps[];
  readonly background?: string;
  readonly className?: string;
}

/**
 * InformationSection Component
 *
 * Renders a titled section that displays a set of related feature cards (InformationCard).
 * Useful for grouping related functionality or options in a user dashboard or portal.
 *
 * Features:
 * - Customizable section title and background color
 * - Responsive grid layout for feature cards
 *
 * @param {InformationSectionProps} props - Props for configuring the section
 * @returns {JSX.Element} Rendered section with multiple clickable feature cards
 */
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
  );
}

/**
 * InformationCard Component
 *
 * A reusable card component that displays an icon, title, and description.
 * When clicked, it navigates either to a local route or an external URL based on the `opensWindow` flag.
 *
 * Features:
 * - Smooth hover animation
 * - Accessibility support with ARIA labels and appropriate `rel` for external links
 * - Visual consistency using icons and unified layout
 *
 * @param {InformationCardProps} props - Props to configure the content and behavior of the card
 * @returns {JSX.Element} A clickable information card
 */
export function InformationCard({
  Icon,
  title,
  description,
  url,
  opensWindow = false,
}: InformationCardProps) {
  return (
    <Link
      href={opensWindow ? url : `/inicio/${url}`}
      className="block group focus:outline-none"
      aria-label={`Ir a ${title}`}
      target={opensWindow ? "_blank" : "_self"}
      rel={opensWindow ? "noopener noreferrer" : undefined}
    >
      <Card className="transition-all duration-300 ease-in-out hover:shadow-lg group-hover:-translate-y-1 w-full">
        <CardContent className="px-6 py-2 h-full">
          <div className="flex items-start gap-4 h-full">
            {/* Icon container */}
            <div className="p-2 rounded-full bg-core-soft">
              <Icon className="w-6 h-6 text-black" aria-hidden="true" />
            </div>
            {/* Title and description */}
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
  );
}
