import { useState } from "react";
import useAuth from "../hooks/useAuth";
import AuthForm from "../components/authForm";
import { toast } from "react-toastify";
import { FormValidator } from "../../helpers/FormValidator";
import AnimatedTabs from "../../components/AnimatedTabs";
import SplitText from "../../components/SplitText";
import { useTourStore } from "../../store/useTourStore";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const { setNextTour } = useTourStore();

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
          setNextTour("ranking");
        },
      });
    }
  };

  return (
    <section className="flex items-start justify-center gap-2 p-1">
      <div className="flex flex-col">
        <SplitText
          className="border-b border-gray-500 text-center text-3xl font-black"
          message="Bem-vindo!"
        />
        <div className="w-full max-w-sm rounded-md border-gray-500 pb-6 shadow-lg">
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
      </div>
      <img
        // src="./images/bg-3.jpg"
        src="./images/logo.png"
        alt=""
        className="hidden max-w-[300px] md:flex lg:flex"
        // className="hidden w-[500px] border mix-blend-multiply lg:flex"
      />
    </section>
  );
}
