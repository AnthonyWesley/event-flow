type TooltipProps = {
  children: React.ReactNode;
  info: string;
  alert?: number;
  className?: string;
};
export default function Tooltip({
  children,
  info,
  alert,
  className,
}: TooltipProps) {
  return (
    <div className="group relative flex">
      {alert && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="flex h-6 w-6 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {alert}
            </span>
          </div>
        </div>
      )}

      <button className={`${className}`}>{children}</button>
      {info && (
        <div className="absolute -top-14 left-1/2 z-20 min-w-35 -translate-x-1/2 scale-0 transform rounded-lg bg-gray-900 p-2 text-xs font-medium text-white shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-100">
          <div className="flex justify-center rounded p-1 text-sm text-white shadow-lg">
            {info}
          </div>
          <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 transform bg-slate-900" />
        </div>
      )}
    </div>
  );
}
