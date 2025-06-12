import React from "react";

type NavActionProps = {
  children: React.ReactNode;
  position?: "vertical" | "horizontal"; // default: vertical
};

export default function NavAction({
  children,
  position = "horizontal",
}: NavActionProps) {
  const baseClasses =
    "fixed z-50 bg-slate-950 shadow-lg shadow-black/15 transition-all duration-300 ease-in-out";

  const mobileTabletStyles =
    "bottom-0 left-0 flex w-full items-center justify-between rounded-t-lg p-2";

  const desktopPositionStyles = {
    horizontal: "lg:static lg:h-full lg:w-full  lg:rounded-lg",
    // horizontal: "static lg:h-full lg:w-20 lg:flex-col lg:rounded-none lg:rounded-r-2xl",
    vertical: "static lg:h-[75vh] lg:w-20 lg:flex-col  lg:rounded-lg",
  };

  return (
    <nav
      className={`${baseClasses} ${mobileTabletStyles} ${
        desktopPositionStyles[position]
      }`}
    >
      {children}
    </nav>
  );
}
