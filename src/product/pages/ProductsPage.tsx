import ProductForm from "../components/ProductForm";
import { ProductOutputDto } from "../services/productService";
import useProduct from "../hooks/useProduct";
import { InfoLine } from "../../components/InfoLine";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import EntityListPage from "../../components/EntityListPage";
import { useNavigate } from "react-router-dom";

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
        )}
        onItemClick={(product) => navigate(`/products/${product.id}`)}
      />
    </>
  );
}
