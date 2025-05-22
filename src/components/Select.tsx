import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import clsx from "clsx";
import { useEffect, useState } from "react";

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
  onChange?: (value: SelectList) => void;
  selected?: SelectList; // <-- adicionado
};

export default function Select({
  selectList,
  label,
  onChange,
  selected: externalSelected,
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

  return (
    <div>
      <Listbox value={selected} onChange={handleChange}>
        <Label htmlFor={label}>{label}</Label>
        <ListboxButton
          className={clsx(
            "relative flex w-full justify-between rounded-sm bg-white/5 px-2 py-1.5 text-sm/6 text-white",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
          )}
        >
          {selected?.name}
          <Icon icon="ri:arrow-down-s-fill" width="20" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "z-50 w-[var(--button-width)] rounded-xl border border-white/5 bg-[#101828] p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
          )}
        >
          {selectList.map((person) => (
            <ListboxOption
              key={person.id}
              value={person}
              className="group flex min-w-full cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-[focus]:bg-white/10"
            >
              <Icon icon="ri:arrow-right-s-fill" width="24" height="24" />
              <div className="text-sm/6 text-white">{person.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
