import AccessExpiredWrapper from "./AccessExpiredWrapper";

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
    <div className="flex h-full w-full flex-col justify-evenly gap-8 rounded-sm bg-slate-950 p-2">
      <div className="text-center text-xl italic">{message}</div>
      <AccessExpiredWrapper admin={admin}>
        <button
          className={`${color} bg-gray hover:bg-opacity-90 w-full rounded p-2 text-white`}
          onClick={handleClick}
          disabled={disabled}
        >
          CONFIRMAR
        </button>
      </AccessExpiredWrapper>
    </div>
  );
}
