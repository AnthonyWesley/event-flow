type GameDisplayProps = {
  children: React.ReactNode | React.ReactNode[];
  infoHeader?: React.ReactNode | React.ReactNode[];
  infoFooter?: React.ReactNode | React.ReactNode[];
  className?: string;
};
export default function GameDisplay({
  children,
  infoHeader,
  infoFooter,
  className,
}: GameDisplayProps) {
  return (
    <section
      className={`flex flex-col items-start justify-between overflow-hidden rounded-lg border border-gray-500/15 lg:h-[80vh] ${className}`}
    >
      {infoHeader && (
        <header className="flex w-full gap-1 bg-slate-950 p-2 not-italic">
          {infoHeader}
        </header>
      )}

      {children}

      {infoFooter && (
        <footer className="flex w-full gap-1 bg-slate-950 p-2 not-italic">
          {infoFooter}
        </footer>
      )}
    </section>
  );
}
