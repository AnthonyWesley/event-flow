import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

type MenuButton = {
  icon: React.ReactNode;
  onClick?: (e: any) => void;
};

type CircularMenuProps = {
  buttons: MenuButton[];
};

const PREDEFINED_POSITIONS = [
  { x: 0, y: -80, delay: 0.1 },
  { x: 55, y: -55, delay: 0.2 },
  { x: 80, y: 0, delay: 0.3 },
  { x: 55, y: 55, delay: 0.4 },
  { x: 0, y: 80, delay: 0.5 },
];

export default function CircularMenu({ buttons }: CircularMenuProps) {
  const [open, setOpen] = useState(false);

  const limitedButtons = buttons.slice(0, PREDEFINED_POSITIONS.length);

  return (
    <div
      className="relative h-[60px] w-[60px]"
      onClick={() => setOpen((prev) => !prev)}
    >
      {/* Botão principal */}
      <motion.button
        initial={false}
        animate={{
          rotate: open ? 135 : 0,
          backgroundColor: open ? "#334155" : "#0f172a", // slate-700 : slate-900
        }}
        className="z-30 flex h-[60px] w-[60px] items-center justify-center rounded-full transition-colors"
      >
        <Icon icon="eos-icons:rotating-gear" width={20} />
      </motion.button>

      {/* Botões dinâmicos */}
      <AnimatePresence>
        {open &&
          limitedButtons.map((btn, i) => {
            const { x, y, delay } = PREDEFINED_POSITIONS[i];
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x,
                  y,
                  opacity: 1,
                  scale: 1,
                  transition: { delay, type: "spring", stiffness: 300 },
                }}
                exit={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                  transition: { duration: 0.2 },
                }}
                onClick={(e) => {
                  e.stopPropagation(); // impede que o clique feche o menu
                  btn.onClick?.(e);
                }}
                className="absolute top-0 left-0 z-20 flex h-[55px] w-[55px] items-center justify-center rounded-full border-gray-100/15 bg-slate-900 opacity-80 shadow-[3px_3px_10px_rgba(16,16,16,0.5)] hover:bg-[#142a49]"
              >
                {btn.icon}
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}
