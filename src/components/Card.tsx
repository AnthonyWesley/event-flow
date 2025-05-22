import { ReactNode } from "react";
import Avatar from "./Avatar";

export interface CardFooterAction {
  icon: ReactNode | string;
  modalContent?: ReactNode;
  ariaLabel?: string;
  onAction?: (id: string) => void;
}

type CardClassName = {
  header?: string;
  body?: string;
  footer?: string;
};

type CardProps = {
  icon?: string;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  color: string;
  image?: string;
  actions?: CardFooterAction[];
  cardClassName?: CardClassName;
  name?: string;
  isSelected?: boolean;
};
const colorMap: Record<string, string> = {
  blue: "ring-cyan-800 border-cyan-800",
  red: "ring-red-500 border-red-500",
  green: "ring-green-500 border-green-500",
  yellow: "ring-yellow-500 border-yellow-500",
  orange: "ring-orange-500 border-orange-500",
  rose: "ring-rose-500 border-rose-500",
  gray: "ring-gray-900 border-gray-900",
};

export default function Card({
  children,
  color,
  icon,
  image,
  cardClassName = {},
  name,
  header,
  footer,
  isSelected,
}: CardProps) {
  return (
    <section
      className={`flex w-full min-w-60 flex-col items-center self-start rounded-sm border-t-6 bg-transparent transition duration-300 hover:shadow-[0_0_10px_#3b82f6] ${isSelected ? "ring-2" : "hover:ring-2"} ${colorMap[color] || ""} `}
    >
      <header
        className={`flex w-full items-center bg-slate-900 p-2 ${header ? "" : "justify-center"} ${cardClassName?.header}`}
      >
        <div>
          {image && <Avatar icon={image} />}

          {icon && <Avatar icon={icon} />}

          {!image && name && <Avatar name={name} />}
        </div>
        {header && <>{header}</>}
      </header>

      <main
        className={`flex w-full flex-col justify-center bg-slate-900 p-2 ${cardClassName?.body}`}
      >
        {children}
      </main>
      {footer && (
        <footer
          className={`flex w-full items-center justify-evenly border-t border-gray-500/15 bg-slate-900 p-2 ${cardClassName?.footer}`}
        >
          {footer}
        </footer>
      )}
    </section>
  );
}
