import ProductForm from "../components/ProductForm";
import Spin from "../../components/Spin";
import useProduct from "../hooks/useProduct";
import { InfoLine } from "../../components/InfoLine";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { useProductMutations } from "../hooks/useProductMutations";
import Dialog from "../../components/Dialog";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import Tooltip from "../../components/Tooltip";
import partnerApi from "../../api/axios";
import Card from "../../components/Card";
import FlexSection from "../../components/FlexSection";
import NavAction from "../../components/NavAction";
import AvatarUploader from "../../components/AvatarUploader";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const {
    queryProduct: { isPending, error, data: product },
  } = useProduct(productId);

  const { deleteProduct } = useProductMutations();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Card className="bg-green my-2 pl-1">
        <section className="p-4">
          <header className="flex gap-2">
            <AvatarUploader
              icon="iconoir:box-iso"
              image={product?.photo}
              onUpload={(file) => {
                const formData = new FormData();
                formData.append("photo", file);
                return partnerApi.patch(
                  `/product/${product?.id}/photo`,
                  formData,
                  {
                    headers: { "Content-Type": "multipart/form-data" },
                  },
                );
              }}
              onSuccess={(res) => console.log("Upload concluído:", res)}
            />
            <FlexSection className="items-start">
              <InfoLine label="Nome:" value={product.name} size="base" />
              <InfoLine
                label="Preço:"
                value={currencyFormatter.ToBRL(product.price)}
                size="base"
              />
            </FlexSection>
          </header>
        </section>
      </Card>
      <div className="w-full">
        <NavAction>
          <Tooltip info="Voltar">
            <div
              className="cursor-pointer self-end rounded-full border border-slate-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
              onClick={() => navigate(-1)}
            >
              <Icon icon="hugeicons:link-backward" width="20" />
            </div>
          </Tooltip>
          <Modal id="ProductDetailPageProductForm" icon="carbon:edit">
            <ProductForm product={product} />,
          </Modal>
          <Modal id="ProductDetailPageDeleteForm" icon="carbon:trash-can">
            <Dialog
              message="Deseja excluir o produto?"
              onClick={() => {
                deleteProduct.mutate(product.id);
                navigate(-1);
              }}
            />
          </Modal>
        </NavAction>
      </div>
    </>
  );
}
