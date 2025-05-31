import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState, useRef } from "react";

interface AccordionProps {
  title?: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  startOpen?: boolean; // nova prop
  className?: string;
}

export default function Accordion({
  title,
  content,
  icon,
  disabled,
  startOpen = false,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(startOpen);
  const [height, setHeight] = useState<number | "auto">(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      setHeight(0);
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
      className={`${
        disabled ? "pointer-events-none" : "pointer-events-auto"
      } w-full overflow-hidden rounded-sm`}
    >
      <div
        className={`flex w-full items-center justify-between rounded-sm text-white focus:outline-none ${className}`}
      >
        {title ?? ""}

        {!icon && (
          <Icon
            icon="line-md:chevron-small-left"
            className="cursor-pointer rounded-sm transition-transform duration-500"
            style={{ transform: isOpen ? "rotate(270deg)" : "rotate(0deg)" }}
            width={30}
            onClick={() => setIsOpen((prev) => !prev)}
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
        <div className="p-1" ref={contentRef}>
          {content}
        </div>
      </div>
    </div>
  );
}
