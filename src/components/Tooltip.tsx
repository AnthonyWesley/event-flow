import ReactDOM from "react-dom";
import React, { useRef, useState, useEffect } from "react";

type Placement = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  children: React.ReactNode;
  info?: string;
  alert?: number;
  className?: string;
  placement?: Placement;
};

export default function Tooltip({
  children,
  info,
  alert,
  className,
  placement = "top",
}: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calcular posição somente se não for mobile
  useEffect(() => {
    if (!isMobile && hovered && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const gap = 8;

      let top = 0;
      let left = 0;

      switch (placement) {
        case "top":
          top = rect.top - 40;
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + gap;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - gap;
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + gap;
          break;
      }

      setCoords({ top, left });
    }
  }, [hovered, placement, isMobile]);

  // Tooltip para desktop
  const tooltip =
    !isMobile &&
    ReactDOM.createPortal(
      <div
        className={`fixed z-80 transform transition-opacity duration-300 ease-out ${
          hovered
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{
          top: coords.top,
          left: coords.left,
          transform:
            placement === "top" || placement === "bottom"
              ? "translateX(-50%)"
              : "translateY(-50%)",
        }}
      >
        {info && (
          <div className="relative rounded-lg bg-gray-900 p-2 text-xs font-medium text-white shadow-lg">
            {info}
            <div
              className={`absolute h-2 w-2 rotate-45 transform bg-gray-900 ${placement === "top" ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" : ""} ${placement === "bottom" ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" : ""} ${placement === "left" ? "top-1/2 right-0 translate-x-1/2 -translate-y-1/2" : ""} ${placement === "right" ? "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" : ""} `}
            />
          </div>
        )}
      </div>,
      document.getElementById("portal-root")!,
    );

  return (
    <div className="relative flex flex-col items-center justify-center gap-1">
      {/* Alerta */}
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

      {/* Botão */}
      <button
        className={className}
        ref={buttonRef}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
      >
        {children}
      </button>

      {/* Info fixa abaixo (mobile) */}
      {isMobile && info && (
        <div className="w-[60px] text-center text-[8px] break-words whitespace-normal text-gray-500">
          {info}
        </div>
      )}

      {/* Tooltip flutuante (desktop) */}
      {tooltip}
    </div>
  );
}
