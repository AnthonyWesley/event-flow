import { Icon } from "@iconify/react/dist/iconify.js";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../store/useModalStore";
import Tooltip from "./Tooltip";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  icon?: string | React.ReactNode;
  info?: string;
  className?: string;
  children?: React.ReactNode;
  color?: string;
}

export default function Modal({
  id,
  icon,
  info,
  children,
  className,
  color,
}: ModalProps) {
  const overlay = useRef(null);
  const { closeModal, isModalOpen, openModal } = useModalStore();

  const clickCloseRef: React.MouseEventHandler<HTMLElement> = (event) => {
    if (event.target === overlay.current) closeModal(id);
  };

  return (
    <>
      {icon && (
        <div
          className={`flex justify-center rounded font-semibold transition duration-300 ease-in-out ${color}`}
          onClick={() => openModal(id)}
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

      <AnimatePresence>
        {isModalOpen(id) && (
          <motion.section
            ref={overlay}
            onClick={clickCloseRef}
            className="fixed inset-0 z-80 flex items-center justify-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg border-white/90 text-white shadow-xl"
            >
              <Icon
                onClick={() => closeModal(id)}
                className="absolute top-2 right-2 z-80 cursor-pointer self-end transition-all hover:text-red-600"
                icon="line-md:close-small"
                width={25}
              />
              {children}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
