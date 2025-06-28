import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState, useRef } from "react";

interface AccordionProps {
  title?: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  startOpen?: boolean;
  className?: string;
}

export default function Accordion({
  title,
  content,
  icon,
  disabled = false,
  // startOpen = true,
  className,
}: AccordionProps) {
  const mobile =
    typeof window !== "undefined" && window.innerWidth < 768 ? false : true;

  const [isOpen, setIsOpen] = useState(mobile);
  const [height, setHeight] = useState<number | "auto">(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      setIsOpen(true);
      setHeight("auto");
    }
  }, [disabled]);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen, content]);

  return (
    <div
      className={`w-full overflow-hidden rounded-lg border border-gray-500/15 p-2`}
    >
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between text-white focus:outline-none ${className}`}
      >
        {title ?? ""}

        {!icon && (
          <Icon
            icon="line-md:chevron-small-left"
            className={`"cursor-pointer rounded-sm transition-transform duration-500 ${isOpen ? "animate-pulse text-cyan-400" : ""}`}
            style={{ transform: isOpen ? "rotate(270deg)" : "rotate(0deg)" }}
            width={30}
          />
        )}
        {icon && (
          <div
            className="flex cursor-pointer items-center"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {icon}
          </div>
        )}
      </div>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: height }}
      >
        <div className="" ref={contentRef}>
          {content}
        </div>
      </div>
    </div>
  );
}
