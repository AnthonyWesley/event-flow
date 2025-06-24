import { useState } from "react";
import useAuth from "../hooks/useAuth";
import AuthForm from "../components/authForm";
import { toast } from "react-toastify";
import { FormValidator } from "../../helpers/FormValidator";
import AnimatedTabs from "../../components/AnimatedTabs";

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
      const isValid = FormValidator.validateAll({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
      if (!isValid) return;

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
        <AnimatedTabs
          tabs={[
            {
              value: "login",
              label: (
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-center text-xl font-bold"
                >
                  Fazer login
                </button>
              ),
              content: (
                <AuthForm
                  isLogin={isLogin}
                  isLoading={login.isPending || register.isPending}
                  onSubmit={handleSubmit}
                />
              ),
            },
            {
              value: "register",
              label: (
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-center text-xl font-bold"
                >
                  Criar conta
                </button>
              ),
              content: (
                <AuthForm
                  isLogin={false}
                  isLoading={login.isPending || register.isPending}
                  onSubmit={handleSubmit}
                />
              ),
            },
          ]}
        />
      </div>

      <img
        src="./images/bg-3.jpg"
        alt=""
        className="hidden w-[500px] border mix-blend-multiply lg:flex"
      />
    </section>
  );
}
