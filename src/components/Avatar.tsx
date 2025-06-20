import { Icon } from "@iconify/react/dist/iconify.js";

type AvatarProps = {
  name?: string;
  icon?: string;
  image?: string;
  className?: string;
  size?: string;
};

export default function Avatar({
  image,
  icon,
  name,
  className,
  size = "size-20",
}: AvatarProps) {
  const baseStyle =
    "flex items-center justify-center rounded-full text-base md:text-xl lg:text-2xl";

  return (
    <div
      className={`relative aspect-square rounded-full object-cover ring-2 ${className}`}
    >
      {image && (
        <img
          alt={name ?? ""}
          src={image}
          className={`aspect-square rounded-full object-cover ${size}`}
        />
      )}

      {!image && icon && (
        <div className={`${baseStyle} bg-slate-950 ${size}`}>
          <Icon icon={icon} width="40" />
        </div>
      )}

      {!image && !icon && name && (
        <div className={`${baseStyle} bg-slate-950 text-white ${size}`}>
          {(name[0] + name[1]).toUpperCase()}
        </div>
      )}
    </div>
  );
}
