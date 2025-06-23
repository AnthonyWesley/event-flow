import { useState } from "react";
import { fieldFormatter } from "../../helpers/fieldFormatter";

export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);

  if (cleaned.length <= 2) return `(${cleaned}`;
  if (cleaned.length <= 7)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
}

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

function validatePasswordRules(password: string) {
  return {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  };
}

export default function AuthForm({ isLogin, onSubmit, isLoading }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("parceiro1@email.com");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("S&nh@1234");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordValidation = validatePasswordRules(password);

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
          onChange={(e) => setPhone(fieldFormatter.phone(e.target.value ?? ""))}
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
        <div className="space-y-1 text-sm text-gray-700">
          <p
            className={
              passwordValidation.length ? "text-green-600" : "text-red-600"
            }
          >
            {passwordValidation.length ? "✔" : "❌"} Pelo menos 8 caracteres
          </p>
          <p
            className={
              passwordValidation.lowercase ? "text-green-600" : "text-red-600"
            }
          >
            {passwordValidation.lowercase ? "✔" : "❌"} Uma letra minúscula
          </p>
          <p
            className={
              passwordValidation.uppercase ? "text-green-600" : "text-red-600"
            }
          >
            {passwordValidation.uppercase ? "✔" : "❌"} Uma letra maiúscula
          </p>
          <p
            className={
              passwordValidation.number ? "text-green-600" : "text-red-600"
            }
          >
            {passwordValidation.number ? "✔" : "❌"} Um número
          </p>
          <p
            className={
              passwordValidation.specialChar ? "text-green-600" : "text-red-600"
            }
          >
            {passwordValidation.specialChar ? "✔" : "❌"} Um caractere especial
            (@$!%*?&)
          </p>
        </div>
      )}

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
