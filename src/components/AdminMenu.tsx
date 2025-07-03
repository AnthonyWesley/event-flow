import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CircularMenu from "./CircularMenu";

export default function AdminMenu() {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 20, y: 500 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDragging = (x: number, y: number) => {
    setDragging(true);
    setOffset({ x: x - position.x, y: y - position.y });
  };

  const updatePosition = (x: number, y: number) => {
    if (!dragging) return;
    setPosition({ x: x - offset.x, y: y - offset.y });
  };

  const stopDragging = () => setDragging(false);

  // Mouse
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    startDragging(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  };

  // Touch
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    startDragging(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", stopDragging);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", stopDragging);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", stopDragging);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", stopDragging);
    };
  }, [dragging]);

  return (
    <div
      className="fixed z-50 flex touch-none flex-col items-center gap-2"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ left: position.x, top: position.y }}
    >
      {/* <Icon
        icon="fluent:arrow-move-24-regular"
        width="30"
        className="animate-pulse text-cyan-400"
      /> */}
      <div className="relative h-30 w-30">
        {/* Setas ao redor */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 80 80">
          <path d="M40 10 L36 14 H44 Z" fill="gray" opacity="0.2" />{" "}
          {/* Cima */}
          <path d="M40 70 L36 66 H44 Z" fill="gray" opacity="0.2" />{" "}
          {/* Baixo */}
          <path d="M10 40 L14 36 V44 Z" fill="gray" opacity="0.2" />{" "}
          {/* Esquerda */}
          <path d="M70 40 L66 36 V44 Z" fill="gray" opacity="0.2" />{" "}
          {/* Direita */}
        </svg>

        {/* Botão central redondo */}
        <div className="absolute inset-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-md hover:bg-cyan-600">
          <CircularMenu
            buttons={[
              {
                icon: <Icon icon="hugeicons:link-backward" width={20} />,
                onClick: (e) => {
                  e.stopPropagation(); // previne arrasto ao clicar
                  navigate("/adm/dashboard");
                },
              },
              {
                icon: <Icon icon="hugeicons:link-backward" width={20} />,
                onClick: (e) => {
                  e.stopPropagation(); // previne arrasto ao clicar
                  navigate("/adm/dashboard");
                },
              },
              {
                icon: <Icon icon="hugeicons:link-backward" width={20} />,
                onClick: (e) => {
                  e.stopPropagation(); // previne arrasto ao clicar
                  navigate("/adm/dashboard");
                },
              },
              {
                icon: <Icon icon="hugeicons:link-backward" width={20} />,
                onClick: (e) => {
                  e.stopPropagation(); // previne arrasto ao clicar
                  navigate("/adm/dashboard");
                },
              },
              {
                icon: <Icon icon="hugeicons:link-backward" width={20} />,
                onClick: (e) => {
                  e.stopPropagation(); // previne arrasto ao clicar
                  navigate("/adm/dashboard");
                },
              },
            ]}
          />
        </div>
      </div>

      {/* <Tooltip info="Voltar">
        <div
          className="cursor-pointer rounded-full border border-slate-100/15 bg-cyan-800 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation(); // previne arrasto ao clicar
            navigate("/adm/dashboard");
          }}
        >
          <Icon icon="hugeicons:link-backward" width="20" />
        </div>
      </Tooltip> */}
    </div>
  );
}
