import { Icon } from "@iconify/react/dist/iconify.js";
import Spin from "../../components/Spin";
import { PartnerOutputDto } from "../../partner/services/partnerService";
import useAdm from "../hooks/useAdm";
import useAdmMutate from "../hooks/useAdmMutate";
import Modal from "../../components/Modal";
import PartnerForm from "../components/AdmForm";
import Tooltip from "../../components/Tooltip";
import NavAction from "../../components/NavAction";
import Dialog from "../../components/Dialog";
import { useNavigate } from "react-router-dom";

export default function AdmPage() {
  const navigate = useNavigate();

  const {
    queryPartners: { isPending, error, data },
  } = useAdm();
  // const navigate = useNavigate();
  const { accessPartner } = useAdmMutate();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  const handleAccessPartner = (partner: PartnerOutputDto) => {
    accessPartner.mutate(partner.id);
  };

  // const logout = () => {
  //   localStorage.removeItem("accessToken");
  //   navigate("/auth");
  // };
  const logout = () => {
    localStorage.removeItem("admAccessToken");
    navigate("/adm");
  };
  return (
    <>
      <div className="w-full overflow-x-auto">
        <header className="my-1 flex w-full">
          <NavAction>
            <Modal
              id="PartnerLogout"
              icon={
                <Icon
                  icon="qlementine-icons:log-in-16"
                  width="20"
                  rotate={90}
                />
              }
              info="Sair do app"
            >
              <Dialog message="Deseja sair do app?" onClick={logout} />
            </Modal>
            <h1 className="test-center text-xl font-semibold text-cyan-400">
              ADMIN
            </h1>
            <span>_</span>
          </NavAction>
        </header>

        <table className="w-full text-sm">
          <thead className="rounded-sm bg-slate-900">
            <tr className="border-l-8">
              <th className="p-4 text-left">Nome</th>
              <th className="hidden p-4 text-left sm:table-cell">Email</th>
              <th className="hidden p-4 text-left md:table-cell">Telefone</th>
              <th className="p-4 text-left">Plano</th>
              <th className="hidden p-4 text-left sm:table-cell">Criado em</th>
              <th className="p-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="rounded-lg border-b border-gray-500/15">
            {data.map((user: PartnerOutputDto) => (
              <tr
                key={user.id}
                className={`rounded-sm border-l-8 hover:bg-slate-700 ${user.plan === "FREE" ? "border-amber-600" : user.plan === "BASIC" ? "border-slate-300" : "border-amber-300"}`}
              >
                <td className="p-2">{user.name}</td>
                <td className="hidden p-2 sm:table-cell">{user.email}</td>
                <td className="hidden p-2 md:table-cell">{user.phone}</td>
                <td
                  className={`rounded-lg p-2 ${user.plan === "FREE" ? "bg-bronze" : user.plan === "BASIC" ? "bg-silver" : "bg-gold"}`}
                >
                  {user.plan}
                </td>
                <td className="hidden p-2 sm:table-cell">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="flex gap-2 p-2">
                  <Modal id="AdmPageForm" icon="carbon:edit" info="Editar">
                    <PartnerForm partner={user} isAdmin />
                  </Modal>
                  <Modal
                    id="AdmPageDeleteForm"
                    icon="carbon:trash-can"
                    info="Deletar"
                  ></Modal>

                  <Tooltip info="Logar">
                    <div
                      className="cursor-pointer self-end rounded-full border border-slate-100/15 p-4 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
                      onClick={() => handleAccessPartner(user)}
                    >
                      <Icon icon="qlementine-icons:log-in-16" width="20" />
                    </div>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
