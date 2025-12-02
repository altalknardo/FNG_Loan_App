export default function ThreeDotsLoader() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-gray-950 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-gray-950 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
        <div className="w-4 h-4 bg-gray-950 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  );
}