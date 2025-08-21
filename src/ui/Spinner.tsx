import "./Spinner.css";

export const Spinner = () => {
  return (
    <div className="flex justify-center my-6">
      <div className="spinner-container relative w-16 h-16">
        <div className="spinner-dot blue-dot absolute w-4 h-4 bg-blue-500 rounded-full" />
        <div className="spinner-dot gray-dot absolute w-4 h-4 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};
