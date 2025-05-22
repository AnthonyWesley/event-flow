type EventIconProps = {
  icon: IconType;
};
export type IconType = "STAR" | "PLUS" | "PEN";
export default function EventIcon({ icon }: EventIconProps) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 32 32"
      >
        <path
          fill="currentColor"
          d="M28 6a2 2 0 0 0-2-2h-4V2h-2v2h-8V2h-2v2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h4v-2H6V6h4v2h2V6h8v2h2V6h4v6h2Z"
        />

        {icon === "STAR" && (
          <path
            fill="currentColor"
            d="m21 15l2.549 4.938l5.451.791l-4 3.844L26 30l-5-2.562L16 30l1-5.427l-4-3.844l5.6-.791z"
          />
        )}

        {icon === "PEN" && (
          <path
            fill="currentColor"
            d="m31.707 19.293l-3-3a1 1 0 0 0-1.414 0L18 25.586V30h4.414l9.293-9.293a1 1 0 0 0 0-1.414M21.586 28H20v-1.586l5-5L26.586 23zM28 21.586L26.414 20L28 18.414L29.586 20z"
          />
        )}

        {icon === "PLUS" && (
          <path fill="currentColor" d="M30 22h-6v-6h-2v6h-6v2h6v6h2v-6h6z" />
        )}

        {/* <path fill="currentColor" d="M12 10h2v12h-2zm6 0h2v12h-2z" /> */}
      </svg>
    </div>
  );
}
