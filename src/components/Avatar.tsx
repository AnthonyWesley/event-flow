import { Icon } from "@iconify/react/dist/iconify.js";

type AvatarProps = {
  name?: string;
  icon?: string;
  image?: string;
  className?: string;
};
export default function Avatar({ image, icon, name, className }: AvatarProps) {
  return (
    <div className="not-italic">
      {image && (
        <img
          alt=""
          src={image}
          className="size-14 flex-none rounded-full bg-gray-50"
        />
      )}

      {icon && (
        <h1
          className={`flex size-14 items-center justify-center rounded-full bg-slate-950 text-base md:size-15 md:text-xl lg:size-16 lg:text-2xl ${className}`}
        >
          {icon && <Icon icon={icon} width="40" />}
        </h1>
      )}

      {!image && name && (
        <h1
          className={`flex size-14 items-center justify-center rounded-full bg-slate-950 text-base md:size-15 md:text-xl lg:size-16 lg:text-2xl ${className}`}
        >
          {(name[0] + name[1]).toUpperCase()}
        </h1>
      )}
    </div>
  );
}
