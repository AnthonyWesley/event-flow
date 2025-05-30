import { useState } from "react";
import useAuth from "../hooks/useAuth";
import AuthForm from "../components/authForm";
import { toast } from "react-toastify";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();

  const handleSubmit = (data: any) => {
    if (isLogin) {
      login.mutate({ email: data.email, password: data.password });
    } else {
      if (data.password !== data.confirmPassword) {
        toast.warning("As senhas não coincidem");
        return;
      }

      register.mutate(data, {
        onSuccess: () => {
          login.mutate({ email: data.email, password: data.password });
        },
      });
    }
  };

  return (
    <section className="flex items-start justify-center p-1">
      <div className="w-full max-w-sm rounded-md border border-gray-500 p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">
          {isLogin ? "Login" : "Criar Conta"}
        </h2>

        <AuthForm
          isLogin={isLogin}
          isLoading={login.isPending || register.isPending}
          onSubmit={handleSubmit}
        />

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-400 hover:underline"
          >
            {isLogin ? "Criar conta" : "Fazer login"}
          </button>
        </p>
      </div>

      <img
        src="./images/bg-3.jpg"
        alt=""
        className="hidden w-[500px] border mix-blend-multiply lg:flex"
      />
    </section>
  );
}
