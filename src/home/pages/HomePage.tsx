import { Icon } from "@iconify/react";

const features = [
  {
    icon: "mdi:trophy-outline",
    title: "Ranking ao vivo",
    desc: "Classificação atualizada em tempo real dos vendedores.",
  },
  {
    icon: "mdi:account-group-outline",
    title: "Vendedores ilimitados",
    desc: "Adicione quantos vendedores quiser, sem limite de usuários.",
  },
  {
    icon: "mdi:file-chart-outline",
    title: "Relatórios detalhados",
    desc: "Visualize e exporte os dados de performance e metas atingidas.",
  },
  {
    icon: "mdi:cellphone",
    title: "Acesso individual",
    desc: "Cada vendedor acompanha seus resultados direto do celular.",
  },
];

const steps = [
  {
    title: "Cadastre seu evento",
    desc: "Defina os produtos, metas e equipe de vendas.",
  },
  {
    title: "Compartilhe com os vendedores",
    desc: "Cada vendedor acessa o evento pelo celular ou tablet.",
  },
  {
    title: "Acompanhe o desempenho",
    desc: "Veja o progresso em tempo real com rankings e gráficos.",
  },
  {
    title: "Gere relatórios",
    desc: "Exporte relatórios completos com metas, vendas e leads.",
  },
];

export default function AppPresentationPage() {
  return (
    <div className="">
      <header className="bg-dark relative h-screen">
        <img
          src="./images/first-presentation.png"
          alt=""
          className="h-full w-full object-contain object-top"
        />
        <section className="absolute bottom-0 mb-20 flex w-full flex-col items-center gap-8 bg-slate-950/75 px-6 py-10 text-center lg:mb-0 lg:flex-row">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Transforme sua equipe em campeões de vendas
            </h1>

            <p className="mb-8 text-lg md:text-xl">
              Com o EventShow, acompanhe resultados em tempo real, engaje sua
              equipe e potencialize seus eventos com rankings, metas e
              gamificação.
            </p>
            <a
              href="/pricing"
              className="inline-block rounded-full bg-white px-6 py-3 font-semibold text-cyan-400 transition hover:bg-gray-100"
            >
              Ver planos
            </a>
          </div>
        </section>
      </header>

      {/* FUNCIONALIDADES */}
      <section className="bg-slate-900 px-6 py-20 text-center">
        <h2 className="mb-10 text-3xl font-bold">Funcionalidades poderosas</h2>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-950 p-6 shadow transition-all hover:shadow-lg"
            >
              <Icon
                icon={f.icon}
                className="mx-auto mb-4 text-cyan-400"
                width={36}
                height={36}
              />
              <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="px-6 py-20 text-center">
        <h2 className="mb-10 text-3xl font-bold">Como funciona?</h2>
        <div className="mx-auto max-w-4xl space-y-8 text-left">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="text-2xl font-bold text-cyan-400">{i + 1}</div>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-slate-950 px-6 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          Pronto para impulsionar suas vendas?
        </h2>
        <p className="mb-8 text-lg">
          Comece agora mesmo e leve sua equipe para o próximo nível.
        </p>
        <a
          href="/auth"
          className="inline-block rounded-full bg-white px-6 py-3 font-semibold text-cyan-400 transition hover:bg-gray-100"
        >
          Criar conta grátis
        </a>
      </section>
    </div>
  );
}
