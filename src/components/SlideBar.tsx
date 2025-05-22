import { Icon } from "@iconify/react/dist/iconify.js";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { eventsLinks } from "../ranking/pages/RankingPage";

// import { links } from "./FooterNavi";

type SliderBarProps = {
  children: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
  verticalPosition?: string | number;
  zIndex?: "z-0" | "z-10" | "z-20" | "z-30" | "z-40" | "z-50";
  sliderSide?: "left" | "right";
  className?: string;
  title?: string;
};

export default function SlideBar({
  children,
  icon,
  verticalPosition = "0",
  sliderSide = "left",
  className,
  zIndex = "z-40",
  title,
}: SliderBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const location = useLocation();

  let timer: any = null;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter: React.MouseEventHandler<HTMLElement> = () => {
    setIsOn(true);
    if (timer) {
      clearTimeout(timer);
    }
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLElement> = () => {
    setIsOn(false);
  };

  const closeMenu = () => {
    eventsLinks.map((link: any) =>
      location.pathname == link.href
        ? setTimeout(() => {
            setIsOpen(false);
          }, 400)
        : "",
    );
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen && !isOn) {
      timer = setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, isOn]);

  const position =
    sliderSide === "left"
      ? ["translate-x-0 left-0", "-translate-x-full left-0"]
      : ["-translate-x-0 right-0", "translate-x-full right-0"];

  return (
    <nav
      title={title}
      className={`${zIndex} fixed top-0 flex w-full items-center justify-between lg:text-2xl`}
    >
      <div className={`flex justify-end lg:justify-center`}>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`${
            isOpen ? position[0] : position[1]
          } fixed top-0 flex h-dvh flex-col items-start justify-start ${className} transition-transform duration-300 ease-in-out`}
        >
          {children}
          <div
            className={`fixed ${
              sliderSide === "left" ? "-right-14" : "-left-14"
            } hover:bg-appPrimaryColor cursor-pointer rounded-sm p-2 transition duration-300`}
            style={{ bottom: verticalPosition }}
            onClick={toggleMenu}
          >
            {!isOpen && <>{icon}</>}
            {isOpen && (
              <Icon
                icon="line-md:menu-to-close-alt-transition"
                color="#ee2269"
                width={30}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
