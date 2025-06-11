import { v4 as uuidv4 } from 'uuid';
import { AccordionItem, AccordionTrigger } from '../ui/accordion';
import { User } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

/**
 * SkeletonAccordion Component
 *
 * Renders loading placeholder UI for accordion items.
 * Displays 8 skeleton items with animated loading effects.
 *
 * @returns {JSX.Element} Loading skeleton UI component
 */

export default function SkeletonAccordion() {
  const skeletonIds = Array.from({ length: 8 }).map(() => uuidv4());
  return (
    <>
      {skeletonIds.map((id) => (
        <AccordionItem key={id} value="loading">
          <AccordionTrigger>
            <div className="flex items-center w-full">
              <User className="mr-2 h-5 w-5 text-core-highlight" />
              <Skeleton className="w-40 h-4" />
            </div>
          </AccordionTrigger>
        </AccordionItem>
      ))}
    </>
  );
}