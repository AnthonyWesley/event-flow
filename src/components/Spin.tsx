export default function Spin() {
  return (
    <div className="none fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/70">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-300"></div>
        <div className="absolute top-0 left-0 h-24 w-24 animate-spin rounded-full border-t-8 border-b-8 border-cyan-800"></div>
      </div>
    </div>
  );
}
