import { useState } from "react";
import usePartner from "../partner/hooks/usePartner";

const suspendedPartner = (status: "ACTIVE" | "SUSPENDED") => {
  if (status === "SUSPENDED") return true;
  if (status === "ACTIVE") return false;
  return status;
};

type AccessExpiredWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AccessExpiredWrapper({
  children,
  className,
}: AccessExpiredWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    queryPartner: { data: partner },
  } = usePartner();

  // const handleClick = () => {
  //   if (expiredDate(partner?.accessExpiresAt)) {
  //     setIsOpen(true);
  //   }
  // };
  const handleClick = () => {
    if (suspendedPartner(partner?.status)) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <section onClick={handleClick} className="w-full">
        <div
          className={`w-full transition-opacity ${
            !suspendedPartner(partner?.status)
              ? "cursor-pointer opacity-100 select-auto"
              : "pointer-events-none cursor-not-allowed opacity-90 select-none"
          } ${className}`}
        >
          {children}
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Acesso expirado
            </h2>
            <p className="mb-6 text-gray-600">
              Seus dias de acesso terminaram. Para continuar utilizando a
              plataforma, realize o pagamento.
            </p>
            <div
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              Fechar
            </div>
          </div>
        </div>
      )}
    </>
  );
}
