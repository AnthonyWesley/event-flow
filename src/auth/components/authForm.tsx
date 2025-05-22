import { useState } from "react";

interface Props {
  isLogin: boolean;
  onSubmit: (formData: {
    name?: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword?: string;
  }) => void;
  isLoading: boolean;
}

export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);
  const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
  if (!match) return "";
  return `${match[1] ? `(${match[1]}` : ""}${match[1]?.length === 2 ? ") " : ""}${match[2] || ""}${match[3] ? `-${match[3]}` : ""}`;
}

export default function AuthForm({ isLogin, onSubmit, isLoading }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, password, confirmPassword });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {!isLogin && (
        <input
          type="text"
          placeholder="Nome"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-sm border border-gray-500 p-2"
        />
      )}
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-sm border border-gray-500 p-2"
      />
      {!isLogin && (
        <input
          type="tel"
          placeholder="Telefone"
          required
          value={phone}
          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
          className="w-full rounded-sm border border-gray-500 p-2"
        />
      )}
      <input
        type="password"
        placeholder="Senha"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-sm border border-gray-500 p-2"
      />
      {!isLogin && (
        <input
          type="password"
          placeholder="Confirmar senha"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-sm border border-gray-500 p-2"
        />
      )}
      <button
        type="submit"
        className="w-full rounded bg-cyan-400 py-2 text-white transition hover:bg-cyan-500"
        disabled={isLoading}
      >
        {isLoading ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
      </button>
    </form>
  );
}
