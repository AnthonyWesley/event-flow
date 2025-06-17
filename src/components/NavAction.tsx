import React from "react";

type NavActionProps = {
  children: React.ReactNode;
  position?: "vertical" | "horizontal";
  className?: string;
};

export default function NavAction({
  children,
  position = "horizontal",
  className = "",
}: NavActionProps) {
  const baseClasses =
    "fixed z-50 bg-slate-950 shadow-lg shadow-black/15 transition-all duration-300 ease-in-out";

  const mobileTabletStyles =
    "bottom-0 left-0 flex w-full items-center justify-between rounded-t-lg p-2";

  const desktopPositionStyles = {
    horizontal:
      "lg:static lg:flex lg:h-full lg:w-full lg:flex-row lg:rounded-lg",
    vertical: "lg:static lg:flex  lg:w-20 lg:flex-col lg:rounded-lg",
  };

  return (
    <nav
      className={` ${baseClasses} ${mobileTabletStyles} ${desktopPositionStyles[position]} ${className} `}
    >
      {children}
    </nav>
  );
}
