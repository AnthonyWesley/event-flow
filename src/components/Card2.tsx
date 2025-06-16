type CardProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  edge?: "top" | "bottom" | "left" | "right";
  edgeSpacing?: string; // exemplo: '2', '4', '8'
};

export default function Card2({
  children,
  header,
  className = "",
  edge = "top",
  edgeSpacing = "1",
}: CardProps) {
  const edgeClassMap: Record<string, string> = {
    top: `mt-${edgeSpacing}`,
    bottom: `mb-${edgeSpacing}`,
    left: `ml-${edgeSpacing}`,
    right: `mr-${edgeSpacing}`,
  };

  const edgeClass = edge ? edgeClassMap[edge] : "";

  return (
    <section className={`rounded-lg bg-slate-950 shadow-2xl ${className}`}>
      {header && (
        <header className="flex items-center justify-center">{header}</header>
      )}

      <div className={`rounded-lg bg-slate-900 shadow-2xl ${edgeClass}`}>
        {children}
      </div>
    </section>
  );
}
