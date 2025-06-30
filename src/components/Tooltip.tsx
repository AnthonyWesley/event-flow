import ReactDOM from "react-dom";
import React, { useRef, useState, useEffect } from "react";

type TooltipProps = {
  children: React.ReactNode;
  info?: string;
  alert?: number;
  className?: string;
};

export default function Tooltip({
  children,
  info,
  alert,
  className,
}: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (hovered && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 40,
        left: rect.left + rect.width / 2,
      });
    }
  }, [hovered]);

  const tooltip = ReactDOM.createPortal(
    <div
      className={`fixed z-80 -translate-x-1/2 transform transition-opacity duration-300 ease-out ${hovered ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"} `}
      style={{
        top: coords.top,
        left: coords.left,
      }}
    >
      {info && (
        <div className="relative rounded-lg bg-gray-900 p-2 text-xs font-medium text-white shadow-lg">
          {info}
          <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 transform bg-gray-900" />
        </div>
      )}
    </div>,
    document.getElementById("portal-root")!,
  );

  return (
    <div className="relative flex">
      {alert && (
        <div className="absolute -top-1 -right-1 z-80">
          <div className="flex h-6 w-6 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {alert}
            </span>
          </div>
        </div>
      )}
      <button
        className={className}
        ref={buttonRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </button>
      {tooltip}
    </div>
  );
}
