import { AssistanceList } from "@/components/shared/assistance-list";

/**
 * StudentAssistanceList Component
 *
 * Renders the assistance (attendance) list component specifically for students.
 * This component wraps the generic `AssistanceList` and sets the `role` prop to `"estudiante"`,
 * meaning it will behave according to the logic defined for student users.
 *
 * Props:
 * - `professorName`: an empty string since students don’t filter by professor
 * - `role`: set to `"estudiante"` to filter or render based on student logic
 *
 * @returns {JSX.Element} Rendered student-specific assistance list view
 */
export default function StudentAssistanceList() {
  return (
    <AssistanceList professorName="" role="estudiante" />
  );
}
