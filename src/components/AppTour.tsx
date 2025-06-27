import { useEffect, useState } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { useTourStore } from "../store/useTourStore";

const tourSteps = {
  ranking: [
    {
      selector: ".Logo",
      content:
        "Bem-vindo ao EventShow! Transforme metas em conquistas e vendas em verdadeiros espetáculos!",
    },
    {
      selector: ".RankingCreateEvent",
      content: "Vamos criar seu primeiro evento?",
    },
  ],
  activeEvent: [
    {
      selector: ".ActiveEvent",
      content: "Clique para ativar o evento",
    },
  ],
  firstEvent: [
    {
      selector: ".rankingPageSelect",
      content: "Aqui você pode alternar entre os eventos ativos.",
    },
    {
      selector: ".rankingPageChangeList",
      content: "Aqui você pode alternar a lista de vendedos ou vendas.",
    },
    {
      selector: ".ListaDeVendas",
      content: "Botão para criar vendas.",
    },
    {
      selector: ".ListaDeVendedores",
      content: "Botão para criar ou adicionar vendedores.",
    },
    {
      selector: ".EditarEvento",
      content: "Botão para editar informações do evento.",
    },
    {
      selector: ".AtivarOuDesativarEvento",
      content: "Botão para finalizar evento.",
    },
  ],
};

type AppTourProps = {
  children: React.ReactNode;
};

function waitForElement(selector: string, timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const interval = 200;
    let elapsed = 0;

    const check = () => {
      if (document.querySelector(selector)) {
        resolve(true);
      } else if (elapsed >= timeout) {
        resolve(false);
      } else {
        elapsed += interval;
        setTimeout(check, interval);
      }
    };

    check();
  });
}

function TourController({ stepGroup }: { stepGroup: keyof typeof tourSteps }) {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();

  useEffect(() => {
    async function start() {
      const steps = tourSteps[stepGroup];
      const localKey = `hasSeenTour_${stepGroup}`;
      const alreadySeen = localStorage.getItem(localKey);
      const firstStep = steps[0];

      const ready = await waitForElement(firstStep.selector);
      if (ready && !alreadySeen) {
        setSteps!(steps);
        setCurrentStep(0);
        setIsOpen(true);
        localStorage.setItem(localKey, "true");
      }
    }

    start();
  }, [stepGroup]);

  return null;
}

export default function AppTour({ children }: AppTourProps) {
  // const pathname = useLocation();
  const { nextTour, setNextTour } = useTourStore();
  const [stepGroup, setStepGroup] = useState<keyof typeof tourSteps | null>(
    null,
  );

  useEffect(() => {
    const runTour = async () => {
      if (!nextTour) return;

      const steps = tourSteps[nextTour];
      const ready = await waitForElement(steps[0].selector, 5000);
      const alreadySeen = localStorage.getItem(`hasSeenTour_${nextTour}`);

      if (ready && !alreadySeen) {
        setStepGroup(nextTour);
      }

      setNextTour(null);
    };

    runTour();
  }, [nextTour]);

  return (
    <TourProvider
      steps={stepGroup ? tourSteps[stepGroup] : []}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: "#1e293b",
          color: "#fff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        }),
        close: (base) => ({
          ...base,
          top: "10px",
          right: "10px",
          color: "#fff",
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: "#0ea5e9",
          color: "#fff",
        }),
      }}
    >
      {stepGroup && <TourController stepGroup={stepGroup} />}
      {children}
      <button
        onClick={() => {
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("hasSeenTour_")) {
              localStorage.removeItem(key);
            }
          });
          window.location.reload();
        }}
      >
        remover
      </button>
    </TourProvider>
  );
}
