import ClipLoader from "react-spinners/ClipLoader";

/**
 * SpinnerPage Component
 * 
 * Renders a spinner with a loading message and a please wait notice.
 * 
 * @returns {JSX.Element} A spinner page component
 */
export default function SpinnerPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full">
      <ClipLoader color={"#1d4ed8"} loading={true} size={150} />
      <p className="text-center text-xl mt-4 font-semibold text-primary">Cargando...</p>
      <p className="text-center text-lg mt-4 text-primary">Por favor espera un momento</p>
    </div>
  );
}