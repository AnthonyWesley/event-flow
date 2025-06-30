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
  links?: any;
};

export default function SlideBar({
  children,
  icon,
  verticalPosition = "0",
  sliderSide = "left",
  className,
  zIndex = "z-80",
  title,
  pushButtonOnSlide = true,
  buttonStyle,
  links,
}: SliderBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const location = useLocation();
  const timerRef = useRef<any | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter: React.MouseEventHandler<HTMLElement> = () => {
    setIsOn(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLElement> = () => {
    setIsOn(false);
    closeMenu();
  };

  const closeMenu = () => {
    if (!isOn) {
      links?.forEach((link: any) => {
        if (location.pathname === link.href) {
          setTimeout(() => setIsOpen(false), 400);
        }
      });
    }
  };

  useEffect(() => {
    if (isOpen && !isOn) {
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, isOn]);

  useEffect(() => {
    if (!isOn) closeMenu();
  }, [location.pathname, isOn]);

  const direction = sliderSide === "left" ? "left-0" : "right-0";
  const offsetX = sliderSide === "left" ? "-100%" : "100%";

  return (
    <>
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

      <nav title={title} className={`${zIndex} fixed top-0 w-full`}>
        <div
          className={`flex justify-${sliderSide === "left" ? "start" : "end"}`}
        >
          <motion.div
            initial={{ x: offsetX }}
            animate={{ x: isOpen ? 0 : offsetX }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`fixed top-0 flex h-dvh flex-col items-start justify-start ${direction} ${className}`}
          >
            {children}

            {pushButtonOnSlide && (
              <div
                className={`absolute ${
                  sliderSide === "left" ? "-right-14" : "-left-14"
                } hover:bg-appPrimaryColor cursor-pointer rounded-sm p-2 transition duration-300`}
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
