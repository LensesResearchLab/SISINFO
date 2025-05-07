/**
 * RenderFields Component
 *
 * A reusable field to display student profile information in a read-only format.
 *
 * @param {Object} props
 * @param {string} props.label - The label for the field.
 * @param {string} [props.value] - The value to be displayed in the field.
 *
 * @returns {JSX.Element} A styled input field with a label.
 */
export function RenderFields({
  label,
  value,
  className,
}: {
  readonly label: string;
  readonly value?: string;
  readonly className?: string;
}) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <div className="w-full">
        <h3 className="font-medium text-core-highlight">
          {label}
        </h3>
        <p>{value}</p>
        <hr className="bg-gray-300 h-[1px] w-full my-2 border-0" />
      </div>
    </div>
  );
}