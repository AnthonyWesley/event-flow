import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";

export type SelectList = {
  id: string;
  name: string;
  photo: string;
};

export type SelectProps = {
  selectList: SelectList[];
  label?: string;
  onChange?: (value: SelectList) => void;
  selected?: SelectList;
  className?: string;
  placeholder?: string;
  imageOn?: boolean;
};

export function SelectCombobox({
  selectList,
  label,
  onChange,
  selected: externalSelected,
  className,
  imageOn,
  placeholder = "Selecione uma opção",
}: SelectProps) {
  const [selected, setSelected] = useState<SelectList>(
    externalSelected || selectList?.[0],
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (externalSelected) {
      setSelected(externalSelected);
    }
  }, [externalSelected]);

  const handleChange = (value: SelectList) => {
    setSelected(value);
    onChange?.(value);
  };

  const filteredList =
    query === ""
      ? selectList
      : selectList?.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <div className="relative w-full">
      {label && (
        <label className="mb-1 block text-sm text-white">{label}</label>
      )}

      <Combobox value={selected} onChange={handleChange}>
        <div className="relative w-full cursor-default overflow-hidden rounded-sm border border-cyan-800 bg-white/5 text-left shadow-md focus:outline-none sm:text-sm">
          {/* Input com imagem + nome */}
          <div className="flex items-center gap-2 p-2">
            {selected?.photo && imageOn && (
              <img
                src={selected?.photo}
                className="size-6 rounded-full"
                alt=""
              />
            )}
            <Combobox.Input
              className={clsx(
                "w-full border-none bg-transparent text-sm text-gray-200 placeholder-gray-400 outline-none focus:ring-0",
                className,
              )}
              displayValue={(item: SelectList) => item?.name || ""}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
            />

            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon icon="mdi:chevron-down" className="h-5 w-5 text-gray-400" />
            </Combobox.Button>
          </div>
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="z-10 mt-1 max-h-42 w-full overflow-y-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredList?.length === 0 && query !== "" ? (
              <div className="relative cursor-default px-4 py-2 text-gray-400 select-none">
                Nenhum resultado encontrado.
              </div>
            ) : (
              filteredList?.map((item) => (
                <Combobox.Option
                  key={item.id}
                  value={item}
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
                          "flex items-center gap-2 truncate",
                          selected ? "font-semibold" : "font-normal",
                        )}
                      >
                        {imageOn && (
                          <img
                            src={item.photo}
                            className="size-6 rounded-full"
                            alt=""
                          />
                        )}

                        {item.name}
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
