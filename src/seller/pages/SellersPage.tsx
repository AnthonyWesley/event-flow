import { useNavigate } from "react-router-dom";
import useSeller from "../hooks/useSeller";
import SellerForm from "../components/SellerForm";
import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import { InfoLine } from "../../components/InfoLine";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { SellerOutputDto } from "../services/sellerService";
import EntityListPage from "../../components/EntityListPage";

export default function SellerPage() {
  const navigate = useNavigate();

  return (
    <EntityListPage<SellerOutputDto>
      title="VENDEDORES"
      searchPlaceholder="Buscar... Vendedores"
      useQuery={(search) => {
        const { data, isLoading, error } = useSeller(
          undefined,
          search,
        ).querySellers;
        return {
          data,
          isLoading,
          error: error ?? undefined,
        };
      }}
      FormModal={<SellerForm />}
      CardComponent={(seller) => (
        <Card icon="bxs:user" color="blue">
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
      )}
      onItemClick={(seller) => navigate(`/sellers/${seller.id}`)}
    />
  );
}
