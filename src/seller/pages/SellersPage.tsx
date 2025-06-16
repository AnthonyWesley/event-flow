import { useNavigate } from "react-router-dom";
import useSeller from "../hooks/useSeller";
import SellerForm from "../components/SellerForm";
import FlexSection from "../../components/FlexSection";
import { InfoLine } from "../../components/InfoLine";
import { fieldFormatter } from "../../helpers/fieldFormatter";
import { SellerOutputDto } from "../services/sellerService";
import EntityListPage from "../../components/EntityListPage";
import Card2 from "../../components/Card2";
import Avatar from "../../components/Avatar";

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
        <Card2 className="bg-blue pt-[1px]">
          <FlexSection className="w-full p-2">
            <Avatar icon="bxs:user" className="my-1" />
            <div className="flex w-full flex-col items-start">
              <InfoLine value={seller.name} size="base" />
              <InfoLine label="E-mail:" value={seller.email} size="sm" />
              <InfoLine
                label="Telefone:"
                value={fieldFormatter.phone(seller.phone ?? "")}
                size="sm"
              />
            </div>
          </FlexSection>
        </Card2>
      )}
      onItemClick={(seller) => navigate(`/sellers/${seller.id}`)}
    />
  );
}
