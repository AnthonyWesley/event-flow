export type DialogProps = {
  message: string;
  onClick: () => void;
  color?: string;
};
export default function Dialog({ message, onClick, color }: DialogProps) {
  const handleClick = () => {
    onClick();
    // closeModal();
  };
  return (
    <div className="flex h-full w-full flex-col justify-evenly gap-8 rounded-sm bg-slate-900 p-2">
      <div className="text-center text-xl italic">{message}</div>
      <button
        className={`${color} bg-gray hover:bg-opacity-90 w-full rounded p-2 text-white`}
        onClick={handleClick}
      >
        CONFIRMAR
      </button>
    </div>
  );
}
