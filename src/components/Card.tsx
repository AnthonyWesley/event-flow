type CardProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  hover?: string;
};

export default function Card({
  children,
  header,
  className = "",
  hover,
}: CardProps) {
  return (
    <section className={`rounded-lg shadow-2xl ${className}`}>
      {header && (
        <header className="flex items-center justify-center">{header}</header>
      )}

      <div className={`rounded-lg bg-slate-900 p-2 shadow-2xl ${hover}`}>
        {children}
      </div>
    </section>
  );
}
