export default function Spinner() {
  return (
    <div className="flex space-x-2 ml-4 mt-4" role="status">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
    </div>
  );
}
