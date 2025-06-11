import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import clsx from "clsx";

type MultiSelectComboboxProps = {
  selectedItem: any[];
  setSelectedItem: (item: any[]) => void;
  uniqueItem: any[];
};

export default function MultiSelectCombobox({
  selectedItem,
  setSelectedItem,
  uniqueItem,
}: MultiSelectComboboxProps) {
  const [query, setQuery] = useState("");
  const removePerson = (item: any) => {
    setSelectedItem(selectedItem.filter((p) => p.id !== item.id));
  };

  const filteredPeople =
    query === ""
      ? uniqueItem
      : uniqueItem?.filter((item: any) =>
          item.name.toLowerCase().includes(query.toLowerCase()),
        );

  return (
    <div className="relative max-h-50 w-full">
      <Combobox value={selectedItem} onChange={setSelectedItem} multiple>
        <div className="relative w-full cursor-default overflow-hidden rounded-sm border border-cyan-800 bg-white/5 text-left shadow-md focus:outline-none sm:text-sm">
          <div className="flex flex-wrap gap-1 p-1">
            {selectedItem &&
              selectedItem.map((person) => (
                <span
                  key={person.id}
                  className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-sm text-blue-800"
                >
                  {person.name}
                  <button
                    type="button"
                    onClick={() => removePerson(person)}
                    className="hover:text-rose-600"
                  >
                    <Icon icon="mdi:close" className="h-4 w-4" />
                  </button>
                </span>
              ))}
            <Combobox.Input
              className="flex-1 border-none p-1 text-sm text-gray-700 placeholder-gray-400 outline-0 focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Vendedores..."
            />
          </div>
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
          <Combobox.Options className="absolute z-10 mt-1 max-h-33 w-full overflow-y-scroll rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredPeople?.length === 0 && query !== "" ? (
              <div className="relative cursor-default px-4 py-2 text-gray-400 select-none">
                Sem vendedor para selecionar.
              </div>
            ) : (
              filteredPeople?.map((person: any) => (
                <Combobox.Option
                  key={person.id}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-default py-2 pr-4 pl-10 select-none",
                      active ? "bg-gray-600 text-white" : "text-gray-300",
                    )
                  }
                  value={person}
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
