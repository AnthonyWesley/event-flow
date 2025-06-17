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
import { usePartnerMutations } from "../../partner/hooks/usePartnerMutations";

export default function AdmPage() {
  const navigate = useNavigate();

  const {
    queryPartners: { isPending, error, data },
  } = useAdm();
  // const navigate = useNavigate();
  const { accessPartner } = useAdmMutate();
  const { update } = usePartnerMutations();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  const handleAccessPartner = (partner: PartnerOutputDto) => {
    accessPartner.mutate(partner.id);
  };

  const handleStatusPartner = (partner: PartnerOutputDto) => {
    if (partner.id)
      update.mutate({
        id: partner?.id,
        data: {
          name: partner.name,
          email: partner.email,
          phone: partner.phone,
          plan: partner.plan,
          status: partner.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
        },
      });
  };

  const logout = () => {
    localStorage.removeItem("admAccessToken");
    localStorage.removeItem("accessToken");
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
            <span>.</span>
          </NavAction>
        </header>

        <table className="w-full table-fixed text-sm">
          <thead className="rounded-sm bg-slate-900">
            <tr className="border-l-8">
              <th className="w-35 p-2 text-left">Nome</th>
              <th className="w-45 p-2 text-left">Email</th>
              <th className="w-35 p-2 text-left">Telefone</th>
              <th className="w-35 p-2 text-left">Plano</th>
              <th className="w-35 p-2 text-left">Criado em</th>
              <th className="w-35 p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="rounded-lg border-b border-gray-500/15">
            {data.map((user: PartnerOutputDto) => (
              <tr
                key={user.id}
                className={`rounded-sm border-l-8 hover:bg-slate-700 ${user.plan === "FREE" ? "border-amber-600" : user.plan === "BASIC" ? "border-slate-300" : "border-amber-300"}`}
              >
                <td className="w-35 p-2">{user.name}</td>
                <td className="w-45 p-2">{user.email}</td>
                <td className="w-35 p-2">{user.phone}</td>
                <td
                  className={`w-35 rounded-lg p-2 ${user.plan === "FREE" ? "bg-bronze" : user.plan === "BASIC" ? "bg-silver" : "bg-gold"}`}
                >
                  {user.plan}
                </td>
                <td className="w-35 p-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="flex gap-2 p-2">
                  <Modal
                    id="AdminToggleForm"
                    info={
                      user?.status === "SUSPENDED"
                        ? "Ativar parceiro"
                        : "Suspender parceiro"
                    }
                    icon={
                      <Icon
                        icon="lets-icons:on-button"
                        width="20"
                        className={
                          user?.status === "SUSPENDED"
                            ? "text-slate-400"
                            : "text-green-500"
                        }
                      />
                    }
                  >
                    <Dialog
                      message={
                        user?.status === "SUSPENDED"
                          ? "Reativar parceiro?"
                          : "Suspender parceiro?"
                      }
                      onClick={() => handleStatusPartner(user)}
                      color="bg-green"
                      disabled={update.isPending}
                      admin
                    />
                  </Modal>
                  <Modal id="AdmPageForm" icon="carbon:edit" info="Editar">
                    <PartnerForm partner={user} isAdmin />
                  </Modal>

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
