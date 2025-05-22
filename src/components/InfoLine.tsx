import { Icon } from "@iconify/react/dist/iconify.js";

type InfoLineProps = {
  label?: string;
  value?: string | number;
  color?: string;
  icon?: string;
  size?: keyof typeof textSizes;
  line?: "line" | "col";
};

type Value = {
  label: string;
  value: string;
  icon: number;
};

type TextSize = {
  xs: Value;
  sm: Value;
  base: Value;
  lg: Value;
};

const textSizes: TextSize = {
  xs: {
    label: "text-[10px]",
    value: "text-[12px]",
    icon: 10,
  },
  sm: {
    label: "text-[10px]",
    value: "text-sm",
    icon: 15,
  },
  base: {
    label: "text-[12px]",
    value: "text-base",
    icon: 20,
  },
  lg: {
    label: "text-base",
    value: "text-lg",
    icon: 25,
  },
};

export function InfoLine({
  label,
  value,
  color,
  icon,
  size = "base",
  line = "line",
}: InfoLineProps) {
  return (
    <div
      className={`flex items-center justify-center ${line === "line" ? "gap-2" : "flex-col"}`}
    >
      {label && (
        <p
          className={` ${line === "line" ? "mt-1" : "relative top-1"} mr-auto text-gray-400 italic ${textSizes[size].label}`}
        >
          {label}
        </p>
      )}

      <div
        className={`flex items-center gap-1 self-start font-medium ${textSizes[size].value}`}
        style={{ color }}
      >
        {icon && <Icon icon={icon} width={textSizes[size].icon} />} {value}
        {/* {value} {icon && <p>und</p>} */}
      </div>
    </div>
  );
}
