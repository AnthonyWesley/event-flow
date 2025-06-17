import { useState } from "react";

type CopyToClipboardProps = {
  text: string;
  label?: string;
};

export default function CopyToClipboard({
  text,
  label = "Copiar",
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-base text-blue-600 hover:underline"
    >
      {copied ? "Copiado!" : label}
    </button>
  );
}
