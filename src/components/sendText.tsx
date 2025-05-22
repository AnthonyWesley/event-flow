import { useState } from "react";

export default function SendText() {
  const [status, setStatus] = useState<string | null>(null);

  const sendMessage = async () => {
    try {
      const response = await fetch(
        "https://api.z-api.io/instances/3E040AAFC4E040626FFFA622FD8B21DA/token/AEFF4AF21E6FBAA4689AD08C/send-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Client-Token": "F5f16fc353fcd4095ba61b639f1e26844S",
          },
          body: JSON.stringify({
            phone: "5554992101557",
            message: "Welcome to *Z-API*",
          }),
        },
      );

      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        const errorText = await response.text(); // Tenta capturar detalhes do erro
        throw new Error(
          `Erro na requisição: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      console.log("Resposta do servidor:", data);
      setStatus("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setStatus("Erro ao enviar a mensagem!");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={sendMessage}
        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        Enviar mensagem
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
