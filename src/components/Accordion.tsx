import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState, useRef } from "react";

interface AccordionProps {
  title?: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function Accordion({
  title,
  content,
  icon,
  disabled,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  const height =
    isOpen && contentRef.current ? contentRef.current.scrollHeight : 0;

  return (
    <div
      className={` ${disabled ? "pointer-events-none" : "pointer-events-auto"} w-full overflow-hidden rounded-sm bg-transparent`}
    >
      <div className="mb-1 flex w-full items-center justify-between gap-1 rounded-md pl-1 text-white focus:outline-none">
        {title ? title : ""}

        {!icon && (
          <Icon
            icon="line-md:chevron-small-left"
            className="cursor-pointer rounded-sm transition-transform duration-500"
            style={{ transform: isOpen ? "rotate(270deg)" : "rotate(0deg)" }}
            width={30}
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
        {icon && (
          <div
            className="flex cursor-pointer items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {icon}
          </div>
        )}
      </div>
      <div
        className={`overflow-hidden transition-all duration-500`}
        style={{ maxHeight: height }}
      >
        <div className="px-2" ref={contentRef}>
          {content}
        </div>
      </div>
    </div>
  );
}
