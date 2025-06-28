import { useState, useRef, useEffect } from "react";
import InputSearch from "./InputSearch";
import Modal from "./Modal";
import NavAction from "./NavAction";
import Accordion from "./Accordion";
import { Icon } from "@iconify/react";
import AnimatedSection from "./AnimatedSection";

type SectionConfig<T> = {
  title: string;
  key: string;
  color?: string;
  filter: (item: T) => boolean;
};

type MultiSectionEntityListPageProps<T> = {
  title: string;
  searchPlaceholder: string;
  useQuery: (search: string) => {
    data?: T[];
    isLoading: boolean;
    error?: Error;
  };
  CardComponent: (item: T) => React.ReactNode;
  FormModal?: React.ReactNode;
  onItemClick: (item: T) => void;
  sections: SectionConfig<T>[];
};

export default function MultiSectionEntityListPage<T>({
  title,
  searchPlaceholder,
  useQuery,
  CardComponent,
  FormModal,
  onItemClick,
  sections,
}: MultiSectionEntityListPageProps<T>) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: entities, isLoading, error } = useQuery(debouncedSearch);

  if (error) return <p className="text-red-500">Erro: {error.message}</p>;

  const sectionedData = sections.map((section) => ({
    ...section,
    items: (entities || [])
      .filter(section.filter)
      .sort(
        (a: any, b: any) =>
          new Date(b?.endDate!).getTime() - new Date(a?.endDate!).getTime(),
      ),
  }));

  return (
    <>
      <section className="flex flex-col gap-2 px-4 font-bold sm:flex-row sm:items-center sm:justify-between">
        <header className="mt-1 mb-2 flex w-full justify-between">
          <InputSearch
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            onOpenChange={setIsSearchOpen}
          />
          <div
            className={`flex items-center gap-4 transition-all duration-900 ${
              isSearchOpen
                ? "pointer-events-none hidden -translate-x-10"
                : "translate-x-0 opacity-100"
            }`}
          >
            <h1 className="mr-10 text-xl font-semibold text-white">{title}</h1>
          </div>
          {FormModal && (
            <>
              <Modal
                id={`${title}Form`}
                className="hidden bg-slate-900 lg:flex"
                icon={<Icon icon="ic:baseline-plus" width="20" />}
              >
                {FormModal}
              </Modal>
              <NavAction className="justify-center lg:hidden">
                <Modal
                  id={`${title}Form`}
                  className="bg-slate-900"
                  icon={<Icon icon="ic:baseline-plus" width="20" />}
                >
                  {FormModal}
                </Modal>
              </NavAction>
            </>
          )}
        </header>
      </section>

      <section className="px-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          sectionedData.map(({ title, key, items }) => (
            <Accordion
              key={key}
              title={
                <h2 className="py-2 text-lg font-semibold text-slate-300">
                  {title} ({items.length})
                </h2>
              }
              startOpen={items.length > 0}
              content={
                <section className="grid gap-4 py-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                  {items.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Nenhum item encontrado.
                    </p>
                  ) : (
                    items.map((item, idx) => (
                      <AnimatedSection
                        key={idx}
                        className="w-full cursor-pointer"
                        onClick={() => onItemClick(item)}
                      >
                        {CardComponent(item)}
                      </AnimatedSection>
                    ))
                  )}
                </section>
              }
            />
          ))
        )}
      </section>
    </>
  );
}
