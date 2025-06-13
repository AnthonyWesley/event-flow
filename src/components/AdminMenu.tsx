import { Icon } from "@iconify/react";
import Tooltip from "./Tooltip";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminMenu() {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 40, y: 550 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      className="fixed z-50 flex flex-col items-center gap-2"
      onMouseDown={handleMouseDown}
      style={{ left: position.x, top: position.y }}
    >
      <Icon
        icon="fluent:arrow-move-24-regular"
        width="30"
        className="animate-pulse text-cyan-400"
      />
      <Tooltip info="Voltar">
        <div
          className="cursor-pointer rounded-full border border-slate-100/15 bg-cyan-800 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation(); // evita iniciar o drag ao clicar
            navigate("/adm/dashboard");
          }}
        >
          <Icon icon="hugeicons:link-backward" width="20" />
        </div>
      </Tooltip>
    </div>
  );
}
