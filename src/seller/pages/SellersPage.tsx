import { useEffect, useRef, useState } from "react";
import FlexSection from "../../components/FlexSection";
import { InfoLine } from "../../components/InfoLine";
import useSeller from "../hooks/useSeller";
import { SellerOutputDto } from "../services/sellerService";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import SellerForm from "../components/SellerForm";
import { Icon } from "@iconify/react";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import InputSearch from "../../components/InputSearch";
import NavAction from "../../components/NavAction";

export default function SellerPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    querySellers: { data: sellers, isLoading, error },
  } = useSeller(undefined, debouncedSearch);

  const navigate = useNavigate();

  // Debounce para o valor de busca
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (error)
    return <p className="text-red-500">Ocorreu um erro: {error.message}</p>;

  return (
    <>
      <section className="flex flex-col gap-2 px-4 text-xl font-bold sm:flex-row sm:items-center sm:justify-between">
        <header className="flex w-full">
          <h1>VENDEDORES</h1>
        </header>
      </section>

      <section className="grid min-h-[200px] w-full place-items-center gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center">
            {/* Spinner menor apenas para a lista */}
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : sellers && sellers.length > 0 ? (
          sellers.map((seller: SellerOutputDto) => (
            <div
              key={seller.id}
              className="w-full cursor-pointer"
              onClick={() => navigate(`/sellers/${seller.id}`)}
            >
              <Card key={seller.id} icon="bxs:user" color={"blue"}>
                <FlexSection className="items-start border-t border-t-gray-500/15">
                  <InfoLine value={seller.name} size="base" />
                  <InfoLine label="E-mail:" value={seller.email} size="sm" />
                  <InfoLine
                    label="Telefone:"
                    value={fieldFormatter.phone(seller.phone ?? "")}
                    size="sm"
                  />
                </FlexSection>
              </Card>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            Nenhum vendedor encontrado para a busca.
          </p>
        )}
      </section>
      <NavAction>
        <InputSearch
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou email"
        />
        <Modal
          id="SellerPageSellerForm"
          className="bg-slate-900"
          icon={<Icon icon="ic:baseline-plus" width="25" />}
        >
          <SellerForm />
        </Modal>
      </NavAction>
    </>
  );
}
