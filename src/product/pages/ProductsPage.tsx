import Modal from "../../components/Modal";
import ProductForm from "../components/ProductForm";
import { ProductOutputDto } from "../services/productService";
import Spin from "../../components/Spin";
import useProduct from "../hooks/useProduct";
import { InfoLine } from "../../components/InfoLine";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function ProductPage() {
  const navigate = useNavigate();

  const {
    queryProducts: { isPending, error, data: products },
  } = useProduct();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <header className="flex items-center justify-between text-xl font-bold">
        <span className="ml-4 flex w-full items-center justify-between p-1">
          <h1>PRODUTOS</h1>
          <Modal
            id="ProductPageProductForm"
            className="bg-slate-900"
            icon={<Icon icon="ic:baseline-plus" width="25" />}
          >
            <ProductForm />
          </Modal>
        </span>
      </header>

      <div className="grid w-full place-items-center gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product: ProductOutputDto) => (
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
        ))}
      </div>
    </>
  );
}
