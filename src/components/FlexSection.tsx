type FlexSectionProps = {
  children: React.ReactNode;
  className?: string;
};
export default function FlexSection({ children, className }: FlexSectionProps) {
  return (
    <section
      className={`flex ${className} flex-col items-center justify-between p-2 ${className}`}
    >
      {children}
    </section>
  );
}
