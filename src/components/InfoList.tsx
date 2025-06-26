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
    <div className={`flex w-full justify-between not-italic ${className}`}>
      {(length && <span className="basis-[10%] text-right">({length})</span>) ||
        "(0)"}
      <h1 className="basis-[80%] text-center">{tittle}</h1>
      <Icon icon={icon} width="20" className="basis-[10%] text-left" />
    </div>
  );
}
