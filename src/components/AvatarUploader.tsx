import { useState } from "react";
import { Icon } from "@iconify/react";

type AvatarUploaderProps = {
  name?: string;
  icon?: string;
  image?: string;
  size?: string;
  className?: string;
  onUpload: (file: File) => Promise<any>;
  onSuccess?: (data: any) => void;
};

export default function AvatarUploader({
  name,
  icon,
  image,
  size = "w-20 h-20 text-xl",
  className = "",
  onUpload,
  onSuccess,
}: AvatarUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(image ?? null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const result = await onUpload(file);

      const uploadedUrl = result?.data?.photo ?? URL.createObjectURL(file);
      setPreviewUrl(uploadedUrl);
      setMessage("Upload feito com sucesso!");

      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao enviar imagem.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () =>
    name ? (name[0] + (name[1] ?? "")).toUpperCase() : "?";

  return (
    <div className={`group relative inline-block ${className}`}>
      <div
        className={`overflow-hidden rounded-full ring-2 ring-gray-300 ${size} flex items-center justify-center bg-slate-950 text-white`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={name ?? ""}
            className="h-full w-full object-cover"
          />
        ) : icon ? (
          <Icon icon={icon} width={32} />
        ) : (
          <span className="font-bold">{getInitials()}</span>
        )}
      </div>

      {/* Overlay de Ações */}
      <label
        htmlFor="avatar-upload"
        className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
      >
        {loading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <span className="rounded bg-black/70 px-2 py-1 text-sm text-white">
            Alterar
          </span>
        )}
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {message && (
        <p className="mt-2 text-center text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}
