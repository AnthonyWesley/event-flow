type CardProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
};

export default function Card2({ children, header, className = "" }: CardProps) {
  return (
    <section className={`rounded-lg shadow-2xl ${className}`}>
      {header && (
        <header className="flex items-center justify-center">{header}</header>
      )}

      <div className={`rounded-lg bg-slate-900 p-2 shadow-2xl`}>{children}</div>
    </section>
  );
}
