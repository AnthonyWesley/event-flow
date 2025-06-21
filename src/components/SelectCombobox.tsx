import { Fragment, useEffect, useState } from "react";
import { Combobox, Label, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";

export type selectProps = {
  selectList: SelectList[];
  label?: string;
};

export type SelectList = {
  id: string;
  name: string;
};

export type SelectProps = {
  selectList: SelectList[];
  label?: string;
  onChange?: (value: any) => void;
  selected?: SelectList;
  className?: string;
};

export function SelectCombobox({
  selectList,
  label,
  onChange,
  selected: externalSelected,
  className,
}: SelectProps) {
  const [selected, setSelected] = useState<SelectList>(
    externalSelected || selectList?.[0],
  );

  const handleChange = (value: SelectList) => {
    setSelected(value);
    onChange?.(value);
  };

  useEffect(() => {
    if (externalSelected) {
      setSelected(externalSelected);
    }
  }, [externalSelected]);
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? selectList
      : selectList.filter((person) =>
          person.name.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <div className="relative w-full">
      <Combobox value={selected} onChange={handleChange}>
        <Label htmlFor={label}>{label}</Label>
        <div className="relative w-full cursor-default overflow-hidden rounded-sm border border-cyan-800 bg-white/5 text-left shadow-md focus:outline-none sm:text-sm">
          <Combobox.Input
            className={`w-full border-none bg-transparent p-2 text-sm text-gray-200 placeholder-gray-400 outline-none focus:ring-0 ${className}`}
            displayValue={(person: any) => person?.name}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Selecione uma opção"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <Icon icon="mdi:chevron-down" className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="z-10 mt-1 max-h-30 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredPeople.length === 0 && query !== "" ? (
              <div className="relative cursor-default px-4 py-2 text-gray-400 select-none">
                Nenhum resultado encontrado.
              </div>
            ) : (
              filteredPeople.map((person) => (
                <Combobox.Option
                  key={person.id}
                  value={person}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-default py-2 pr-4 pl-10 select-none",
                      active ? "bg-gray-600 text-white" : "text-gray-300",
                    )
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={clsx(
                          "block truncate",
                          selected ? "font-semibold" : "font-normal",
                        )}
                      >
                        {person.name}
                      </span>
                      {selected && (
                        <span
                          className={clsx(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            active ? "text-white" : "text-blue-600",
                          )}
                        >
                          <Icon icon="mdi:check" className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}
