import ProductForm from "../components/ProductForm";
import { ProductOutputDto } from "../services/productService";
import useProduct from "../hooks/useProduct";
import { InfoLine } from "../../components/InfoLine";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import FlexSection from "../../components/FlexSection";
import EntityListPage from "../../components/EntityListPage";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import Avatar from "../../components/Avatar";

export default function ProductPage() {
  const navigate = useNavigate();

  return (
    <>
      <EntityListPage<ProductOutputDto>
        title="PRODUTOS"
        searchPlaceholder="Buscar... Produtos"
        useQuery={(search) => {
          const { data, isLoading, error } = useProduct(
            undefined,
            search,
          ).queryProducts;
          return {
            data,
            isLoading,
            error: error ?? undefined,
          };
        }}
        FormModal={<ProductForm />}
        CardComponent={(product) => (
          <Card
            className="bg-green pt-[1px]"
            childrenStyle="hover:shadow-[0_0_10px_#01ffff]"
          >
            <FlexSection className="w-full p-2">
              <Avatar
                icon="iconoir:box-iso"
                image={product.photo}
                className="my-1"
              />
              <div className="flex w-full flex-col items-start">
                <InfoLine value={product.name} size="base" />
                <InfoLine
                  label="Preço:"
                  value={currencyFormatter.ToBRL(product.price)}
                  size="base"
                />
              </div>
            </FlexSection>
          </Card>
        )}
        onItemClick={(product) => navigate(`/products/${product.id}`)}
      />
    </>
  );
}
