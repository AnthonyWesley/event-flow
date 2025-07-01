import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

type SliderBarProps = {
  children: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
  verticalPosition?: string | number;
  zIndex?: "z-0" | "z-10" | "z-20" | "z-30" | "z-40" | "z-50" | "z-80";
  sliderSide?: "left" | "right";
  className?: string;
  title?: string;
  pushButtonOnSlide?: boolean;
  buttonStyle?: string;
  links?: { href: string }[];
};

export default function SlideBar({
  children,
  icon,
  verticalPosition = "0",
  zIndex = "z-80",
  sliderSide = "left",
  className = "",
  title,
  pushButtonOnSlide = true,
  buttonStyle = "",
  links = [],
}: SliderBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const startInteraction = () => {
    setIsInteracting(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const endInteraction = () => {
    setIsInteracting(false);
    closeIfInactive();
  };

  const closeIfInactive = () => {
    const isOnActiveRoute = links.some(
      (link) => location.pathname === link.href,
    );
    if (!isInteracting && isOnActiveRoute) {
      setTimeout(() => setIsOpen(false), 400);
    }
  };

  useEffect(() => {
    if (isOpen && !isInteracting) {
      timerRef.current = setTimeout(() => setIsOpen(false), 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, isInteracting]);

  useEffect(() => {
    if (!isInteracting) {
      closeIfInactive();
    }
  }, [location.pathname, isInteracting]);

  const directionClass = sliderSide === "left" ? "left-0" : "right-0";
  const offsetX = sliderSide === "left" ? "-100%" : "100%";
  const justifyClass = sliderSide === "left" ? "justify-start" : "justify-end";
  const toggleButtonPosition = sliderSide === "left" ? "-right-14" : "-left-14";

  return (
    <>
      {/* External toggle button (not pushed with slide) */}
      {!pushButtonOnSlide && (
        <div
          className={`hover:bg-appPrimaryColor cursor-pointer rounded-sm p-2 transition duration-300 ${buttonStyle}`}
          onClick={toggleMenu}
        >
          {!isOpen ? (
            icon
          ) : (
            <Icon
              icon="line-md:menu-to-close-alt-transition"
              color="#ee2269"
              width={30}
            />
          )}
        </div>
      )}

      {/* SlideBar navigation */}
      <nav title={title} className={`${zIndex} fixed top-0 w-full`}>
        <div className={`flex ${justifyClass}`}>
          <motion.div
            initial={{ x: offsetX }}
            animate={{ x: isOpen ? 0 : offsetX }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onMouseEnter={startInteraction}
            onMouseLeave={endInteraction}
            onTouchStart={startInteraction}
            onTouchEnd={endInteraction}
            onTouchCancel={endInteraction}
            className={`fixed top-0 flex h-dvh flex-col items-start justify-start ${directionClass} ${className}`}
          >
            {/* SlideBar content */}
            <motion.div
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="w-full p-2"
            >
              {children}
            </motion.div>

            {/* Internal toggle button (pushed with slide) */}
            {pushButtonOnSlide && (
              <div
                className={`absolute ${toggleButtonPosition} hover:bg-appPrimaryColor cursor-pointer rounded-sm p-2 transition duration-300`}
                style={{ top: verticalPosition }}
                onClick={toggleMenu}
              >
                {!isOpen ? (
                  icon
                ) : (
                  <Icon
                    icon="line-md:menu-to-close-alt-transition"
                    color="#ee2269"
                    width={30}
                  />
                )}
              </div>
            )}
          </motion.div>
        </div>
      </nav>
    </>
  );
}
