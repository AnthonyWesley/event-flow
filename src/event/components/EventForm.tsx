import { useEffect, useState } from "react";
import Select, { SelectList } from "../../components/Select";
import { useEventMutations } from "../hooks/useEventMutations";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import Card from "../../components/Card";
import { EventOutputDto } from "../services/eventService";
import { FormValidator } from "../../helpers/FormValidator";

export type EventProps = {
  event?: EventOutputDto;
  onClose?: () => void;
};

export default function EventForm({ event }: EventProps) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<string | number>("R$");
  const [goalType, setGoalType] = useState<SelectList>({
    id: "VALUE",
    name: "Valor R$",
  });
  const { createOrUpdate } = useEventMutations();

  useEffect(() => {
    if (event) {
      setName(event.name);
      setGoalType({
        id: event.goalType,
        name: event.goalType == "VALUE" ? "Valor R$" : "Unidade",
      });

      if (event.goalType === "VALUE") {
        setGoal(currencyFormatter.ToBRL(event.goal));
      } else {
        setGoal(event.goal);
      }
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = FormValidator.validateAll({
      name,
      goal,
    });
    if (!isValid) return;
    createOrUpdate.mutate(
      {
        id: event?.id,
        data: {
          name: fieldFormatter.name(name),
          goal: currencyFormatter.ToNumber(goal),
          goalType: goalType.id,
        },
      },
      {
        // onSuccess: () => navigate("/"),
      },
    );
  };

  const hasChanges =
    name !== event?.name ||
    goalType.id !== event?.goalType ||
    currencyFormatter.ToNumber(goal) !== event?.goal;

  return (
    <Card key={event?.id ?? ""} color="orange">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 rounded-lg p-4"
      >
        <h1 className="rounded text-xl font-bold">
          {event?.id ? "Editar Evento" : "Registro de Evento"}
        </h1>

        <label className="flex flex-col">
          Nome:
          <input
            type="text"
            placeholder="nome do evento"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded bg-white/5 p-2"
            required
          />
        </label>

        <Select
          label="Tipo de meta"
          selectList={[
            { id: "VALUE", name: "Valor R$" },
            { id: "QUANTITY", name: "Unidade" },
          ]}
          selected={goalType}
          onChange={(selected) => {
            setGoalType(selected);
            setGoal(selected.id === "VALUE" ? "R$" : 1);
          }}
        />

        <label className="flex flex-col">
          Meta:
          <input
            type={`${goalType?.id === "VALUE" ? "text" : "number"}`}
            value={goal}
            onChange={(e) =>
              setGoal(
                goalType?.id === "VALUE"
                  ? currencyFormatter.ToBRL(e.target.value)
                  : e.target.value,
              )
            }
            className="rounded bg-white/5 p-2"
            required
          />
        </label>
        <button
          type="submit"
          disabled={!hasChanges || createOrUpdate.isPending}
          className="bg-gray rounded p-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {createOrUpdate.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </Card>
  );
}
