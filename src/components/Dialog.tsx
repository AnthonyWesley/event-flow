import { Icon } from "@iconify/react/dist/iconify.js";
import AccessExpiredWrapper from "./AccessExpiredWrapper";
import Card2 from "./Card2";

export type DialogProps = {
  message: string;
  onClick: () => void;
  color?: string;
  admin?: boolean;
  disabled?: boolean;
};
export default function Dialog({
  message,
  onClick,
  color,
  admin,
  disabled,
}: DialogProps) {
  const handleClick = () => {
    onClick();
    // closeModal();
  };
  return (
    <Card2 className="bg-rose flex h-full w-full flex-col justify-evenly gap-8 rounded-sm px-1">
      <Icon icon="line-md:alert-loop" width="20" className="text-rose-500" />
      <div className="p-8 text-center text-xl italic">{message}</div>
      <AccessExpiredWrapper admin={admin}>
        <button
          className={`${color} bg-gray hover:bg-opacity-90 w-full rounded p-2 text-white`}
          onClick={handleClick}
          disabled={disabled}
        >
          CONFIRMAR
        </button>
      </AccessExpiredWrapper>
    </Card2>
  );
}
