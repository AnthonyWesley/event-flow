import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";

export default function ModalInterceptor({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg p-4">
        <Icon
          onClick={() => navigate(-1)}
          className="absolute top-6 right-4 transition-all hover:text-red-600"
          icon="line-md:close-small"
          width={35}
        />
        {children}
      </div>
    </div>
  );
}
