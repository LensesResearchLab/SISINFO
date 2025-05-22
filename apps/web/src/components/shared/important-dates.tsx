import { findByAcademicProcessAndPeriod } from "@/app/services/dates.service";
import { ImportantDate } from "@/app/types/entities/Important-date";
import SpinnerPage from "@/components/shared/spinner-page";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";


/**
 * ThesisDates Component
 *
 * A component that displays a list of important dates and deadlines related to undergraduate thesis.
 * Fetches date information from the thesis service and organizes it into categorized tables.
 *
 * Features:
 * - Fetches dates data using React Query
 * - Groups dates by categories
 * - Displays loading state while fetching
 * - Handles error states
 * - Responsive layout with consistent styling
 *
 * @returns {JSX.Element} A container with multiple date tables grouped by category
 */
export default function ImportantDates({name, academicProcess} : {name: string, academicProcess: string}) {
  const {
    data: sections,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["student-dates", academicProcess],
    queryFn: () => findByAcademicProcessAndPeriod(academicProcess),
  });

  if (isFetching) return <SpinnerPage />;
  if (error || !sections) return <div>No se pudieron encontrar las fechas </div>;
  return (
    <div className="min-h-full mx-auto p-4 container max-w-3xl">
      <div className="w-full bg-card shadow-lg rounded-xl p-5 h-full space-y-4">
        <h1 className="text-xl font-semibold text-core">Fechas de {name}</h1>
        {
          !sections.length && <p className="text-foreground">No se han definido fechas para el periodo actual</p>
        }
        {sections.length > 0 && sections.map((section) => (
          <DateTable
            key={section.name}
            title={section.name}
            dates={section.importantDates}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * DateTable Component
 *
 * A reusable component that renders a table of dates for a specific thesis-related category.
 * Displays dates in a structured format with consistent styling and responsive layout.
 *
 * Features:
 * - Category title with distinct styling
 * - Two-column table layout (Description and Date)
 * - Themed header with contrasting colors
 * - Responsive table design
 *
 * @param {Object} props The component props
 * @param {string} props.title The category title for this group of dates
 * @param {ThesisDatesInterface[]} props.dates Array of date objects containing title and date information
 * @returns {JSX.Element} A formatted table showing dates for a specific category
 */
function DateTable({
  title,
  dates,
}: {
  readonly title: string;
  readonly dates: ImportantDate[];
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-core">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-core-highlight text-white text-center">
              Descripción
            </TableHead>
            <TableHead className="bg-core-highlight text-white text-center">
              Fecha
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dates.map((date) => (
            <TableRow key={date.name}>
              <TableCell className="text-primary">{date.name}</TableCell>
              <TableCell className="text-primary">{date.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
