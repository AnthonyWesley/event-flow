import { FormValidator } from "../../helpers/FormValidator";
import AuthForm from "../../auth/components/authForm";
import UseAdmMutate from "../hooks/useAdmMutate";

export default function AuthPage() {
  // const [isLogin, setIsLogin] = useState(true);
  const { login } = UseAdmMutate();

  const handleSubmit = (data: any) => {
    const isValid = FormValidator.validateAll({
      email: data.email,
    });
    if (!isValid) return;
    login.mutate({ email: data.email, password: data.password });

    // register.mutate(data, {
    //   onSuccess: () => {
    //     login.mutate({ email: data.email, password: data.password });
    //   },
    // });
  };

  return (
    <section className="flex items-start justify-center p-1">
      <div className="w-full max-w-sm rounded-md border border-gray-500 p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Login</h2>

        <AuthForm
          isLogin={true}
          isLoading={login.isPending}
          onSubmit={handleSubmit}
        />

        {/* <p className="mt-4 text-center text-sm">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-400 hover:underline"
          >
            {isLogin ? "Criar conta" : "Fazer login"}
          </button>
        </p> */}
      </div>

      <img
        src="./images/bg-3.jpg"
        alt=""
        className="hidden w-[500px] border mix-blend-multiply lg:flex"
      />
    </section>
  );
}
