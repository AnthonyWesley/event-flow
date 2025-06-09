import ProductForm from "../components/ProductForm";
import Spin from "../../components/Spin";
import useProduct from "../hooks/useProduct";
import { InfoLine } from "../../components/InfoLine";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { useProductMutations } from "../hooks/useProductMutations";
import Dialog from "../../components/Dialog";
import Card from "../../components/Card";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import Tooltip from "../../components/Tooltip";

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
      <div className="w-full">
        <Card
          key={product.id}
          icon={"iconoir:box-iso"}
          color={"green"}
          isSelected
          footer={
            <>
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
            </>
          }
        >
          <div className="flex w-full flex-col items-start p-2">
            <div className="flex w-full items-center justify-between gap-2">
              <InfoLine label="Nome:" value={product.name} size="base" />
              <InfoLine
                label="Preço:"
                value={currencyFormatter.ToBRL(product.price)}
                size="base"
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
