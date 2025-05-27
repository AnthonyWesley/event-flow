import { Icon } from "@iconify/react/dist/iconify.js";
import { useRef } from "react";
import { useModalStore } from "../store/useModalStore";
import Tooltip from "./Tooltip";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  icon?: string | React.ReactNode;
  info?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function Modal({
  id,
  icon,
  info,
  children,
  className,
}: ModalProps) {
  const overlay = useRef(null);
  const { closeModal, isModalOpen, openModal } = useModalStore();
  // const [isOpen, setIsOpen] = useState(false);

  const clickCloseRef: React.MouseEventHandler<HTMLElement> = (event) => {
    if (event.target === overlay.current) closeModal(id);
  };

  return (
    <>
      {icon && (
        <div
          className="flex justify-center rounded font-semibold transition duration-300 ease-in-out"
          onClick={() => {
            openModal(id);
          }}
        >
          <Tooltip
            info={info ?? ""}
            className={`cursor-pointer self-end rounded-full border border-gray-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none ${className}`}
          >
            {(typeof icon === "string" && <Icon icon={icon} width="20" />) ||
              icon}
          </Tooltip>
        </div>
      )}
      <section
        ref={overlay}
        onClick={clickCloseRef}
        className={`fixed inset-0 z-80 border-none text-sm backdrop-blur-sm ${
          isModalOpen(id) ? "flex" : "hidden"
        } items-center justify-center`}
      >
        <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col items-center justify-center overflow-auto rounded-lg border-white/90 p-2 text-white">
          <Icon
            onClick={() => closeModal(id)}
            className="absolute top-3 right-2 z-80 cursor-pointer self-end transition-all hover:text-red-600"
            icon="line-md:close-small"
            width={25}
          />
          {children}
        </div>
      </section>
    </>
  );
}
