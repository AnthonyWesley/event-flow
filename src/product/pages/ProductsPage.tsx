import Modal from "../../components/Modal";
import ProductForm from "../components/ProductForm";
import { ProductOutputDto } from "../services/productService";
import useProduct from "../hooks/useProduct";
import { InfoLine } from "../../components/InfoLine";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import NavAction from "../../components/NavAction";
import InputSearch from "../../components/InputSearch";
import { useState, useRef, useEffect } from "react";

export default function ProductPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const {
    queryProducts: { data: products, error, isLoading },
  } = useProduct(undefined, debouncedSearch);

  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(6);
  const hasMore = visibleCount < products?.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  if (error)
    return <p className="text-red-500">Ocorreu um erro: {error.message}</p>;

  return (
    <>
      <section className="flex flex-col gap-2 px-4 font-bold sm:flex-row sm:items-center sm:justify-between">
        <header className="mt-1 flex w-full">
          <NavAction>
            <InputSearch
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar... Vendedres"
              onOpenChange={setIsSearchOpen}
            />
            <div
              className={`flex items-center gap-4 transition-all duration-900 ${
                isSearchOpen
                  ? "pointer-events-none hidden -translate-x-10"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <h1 className="text-xl font-semibold text-white">PRODUTOS</h1>
            </div>
            <Modal
              id="ProductPageProductForm"
              className="bg-slate-900"
              icon={<Icon icon="ic:baseline-plus" width="25" />}
            >
              <ProductForm />
            </Modal>
          </NavAction>
          <span className="ml-4 flex w-full items-center justify-between p-1"></span>
        </header>
      </section>

      <section className="grid min-h-[200px] w-full place-items-center gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : products && products.length > 0 ? (
          products?.slice(0, visibleCount).map((product: ProductOutputDto) => (
            <div
              key={product.id}
              className="w-full"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <Card key={product.id} icon={"iconoir:box-iso"} color={"green"}>
                <FlexSection className="items-start">
                  <InfoLine value={product.name} size="base" />
                  <InfoLine
                    label="Preço:"
                    value={currencyFormatter.ToBRL(product.price)}
                    size="base"
                  />
                </FlexSection>
              </Card>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            Nenhum produto encontrado para a busca.
          </p>
        )}
        {hasMore && (
          <div className="col-span-full mt-4 flex justify-center">
            <button
              onClick={handleShowMore}
              className="rounded-lg bg-cyan-800 px-4 py-2 text-white hover:bg-cyan-700"
            >
              Ver mais
            </button>
          </div>
        )}
      </section>
    </>
  );
}
