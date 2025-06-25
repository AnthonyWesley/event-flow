import { useEffect, useState } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { useLocation } from "react-router-dom";
import { useEvent } from "../event/hooks/useEvent";

const tourSteps = {
  ranking: [
    {
      selector: ".RankingCreateEvent",
      content: "Bem-vindo ao EventShow! Vamos criar seu primeiro evento?",
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

function waitForElement(selector: string, timeout = 3000): Promise<boolean> {
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

function AutoStartTour({
  currentStepGroup,
}: {
  currentStepGroup: keyof typeof tourSteps;
}) {
  const { setIsOpen, setSteps, setCurrentStep } = useTour();

  useEffect(() => {
    async function startTour() {
      const steps = tourSteps[currentStepGroup];
      if (!steps || steps.length === 0) return;

      const localKey = `hasSeenTour_${currentStepGroup}`;
      const hasSeenTour = localStorage.getItem(localKey);

      const firstStep = steps[0];
      const ready = await waitForElement(firstStep.selector);

      if (ready && !hasSeenTour) {
        setSteps!(steps);
        setCurrentStep(0);
        setIsOpen(true);
        localStorage.setItem(localKey, "true");
      } else if (!ready) {
        console.warn(
          `Elemento ${firstStep.selector} não encontrado para iniciar o tour "${currentStepGroup}".`,
        );
      }
    }

    startTour();
  }, [currentStepGroup]);

  return null;
}

export default function AppTour({ children }: AppTourProps) {
  const pathname = useLocation();
  const [stepGroup, setStepGroup] = useState<keyof typeof tourSteps>("ranking");
  const {
    queryEvents: { data: events },
  } = useEvent();

  useEffect(() => {
    const tryStartFirstEventTour = async () => {
      const ready = await waitForElement(
        tourSteps.activeEvent[0].selector,
        4000,
      );
      if (ready && !localStorage.getItem("hasSeenTour_activeEvent")) {
        setStepGroup("activeEvent");
      }
    };

    const timeout = setTimeout(() => {
      tryStartFirstEventTour();
    }, 400);

    return () => clearTimeout(timeout);
  }, [pathname.pathname, events]);

  useEffect(() => {
    const runFirstEventTour = async () => {
      const firstEvent = events?.[0];
      const isOnHomePage = pathname.pathname === `/`;

      if (!firstEvent || !isOnHomePage) return;

      const alreadySeen = localStorage.getItem("hasSeenTour_firstEvent");
      if (firstEvent.isActive && !alreadySeen) {
        const ready = await waitForElement(tourSteps.firstEvent[0].selector);
        if (ready) {
          setStepGroup("firstEvent");
        }
      }
    };

    const timeout = setTimeout(() => {
      runFirstEventTour();
    }, 400);

    return () => clearTimeout(timeout);
  }, [pathname.pathname, events]);

  return (
    <TourProvider
      steps={tourSteps[stepGroup]}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: "#1e293b", // slate-800
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
          backgroundColor: "#0ea5e9", // cyan-500
          color: "#fff",
        }),
      }}
    >
      <AutoStartTour currentStepGroup={stepGroup} />
      {children}
      {/* <button
        onClick={() => {
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("hasSeenTour_")) {
              localStorage.removeItem(key);
            }
          });
        }}
      >
        remover
      </button> */}
    </TourProvider>
  );
}
