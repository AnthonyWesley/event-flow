type CardProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  childrenStyle?: string;
};

export default function Card({
  children,
  header,
  className = "",
  childrenStyle,
}: CardProps) {
  return (
    <section className={`rounded-lg shadow-xl ${className}`}>
      {header && (
        <header className="flex items-center justify-center">{header}</header>
      )}

      <div className={`rounded-lg bg-slate-950 p-2 shadow-xl ${childrenStyle}`}>
        {children}
      </div>
    </section>
  );
}
