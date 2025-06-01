import { Icon } from "@iconify/react/dist/iconify.js";

type InfoListProps = {
  tittle: string;
  icon: string;
  length: number;
  className?: string;
};
export default function InfoList({
  tittle,
  icon,
  length,
  className,
}: InfoListProps) {
  return (
    <div
      className={`flex justify-between border-b border-gray-500/15 bg-slate-900 p-2 not-italic ${className}`}
    >
      <Icon icon={icon} width="20" className="basis-[20%] text-left" />
      <h1 className="basis-[60%] text-center">{tittle}</h1>
      <span className="basis-[20%] text-right">({length})</span>
    </div>
  );
}
