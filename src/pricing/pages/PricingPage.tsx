type PlanKey = "BASIC" | "PREMIUM";

type Plan = {
  name: string;
  color: string;
  features: string[];
};

type Plans = Record<PlanKey, Plan>;

const plans: Plans = {
  BASIC: {
    name: "Básico",
    color: "#00B37E",
    features: [
      "Evento único",
      "Vendedores ilimitados",
      "Produtos Ilimitados",
      "Venda por valor unitário ou valor monetário",
    ],
  },
  PREMIUM: {
    name: "Premium",
    color: "#FBA94C",
    features: [
      "Até 5 eventos simultâneos",
      "Vendedores ilimitados",
      "Produtos Ilimitados",
      "Venda por valor unitário ou valor monetário",
      "Extração de relatórios",
      "Cada vendedor pode acompanhar o evento em seu próprio dispositivo",
      "Controle e gestão de leads",
    ],
  },
};

export default function PricingPage() {
  return (
    <>
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-3xl font-semibold tracking-tight text-balance lg:text-5xl">
          Escolha o plano certo para você!
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 items-center gap-y-6 p-2 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        <div className="rounded-3xl rounded-t-3xl bg-white/90 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-bl-3xl">
          <h3
            id="tier-hobby"
            className="text-base/7 font-semibold text-cyan-600"
          >
            Básico
          </h3>
          <p className="mt-4 flex items-baseline gap-x-2">
            <span className="text-5xl font-semibold tracking-tight text-gray-900">
              R$00,00
            </span>
            <span className="text-base text-gray-500">/mês</span>
          </p>

          <ul role="list" className="mt-6 space-y-3 text-sm/6 text-gray-600">
            {plans["BASIC"].features.map((feature, index) => (
              <li key={index} className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-cyan-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clip-rule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <a
            href="#"
            aria-describedby="tier-hobby"
            className="mt-6 block rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-cyan-600 ring-1 ring-cyan-200 ring-inset hover:ring-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
          >
            Compre agora!
          </a>
        </div>
        <div className="relative rounded-3xl bg-slate-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
          <h3
            id="tier-enterprise"
            className="text-base/7 font-semibold text-cyan-400"
          >
            Premium
          </h3>
          <p className="mt-4 flex items-baseline gap-x-2">
            <span className="text-5xl font-semibold tracking-tight text-white">
              R$00,00
            </span>
            <span className="text-base text-gray-400">/mês</span>
          </p>

          <ul role="list" className="mt-6 space-y-3 text-sm/6 text-gray-300">
            {plans["PREMIUM"].features.map((feature, index) => (
              <li key={index} className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-cyan-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clip-rule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <a
            href="#"
            aria-describedby="tier-enterprise"
            className="mt-6 block rounded-md bg-cyan-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
          >
            Compre agora!
          </a>
        </div>
      </div>
    </>
  );
}
