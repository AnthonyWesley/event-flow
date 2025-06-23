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
  const { accessPartner, activePartner, suspendPartner } = useAdmMutate();
  const { update } = usePartnerMutations();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  const handleAccessPartner = (partner: PartnerOutputDto) => {
    localStorage.removeItem("accessToken");
    accessPartner.mutate(partner.id);
  };

  const handleStatusPartner = (partner: PartnerOutputDto) => {
    console.log(partner.name, partner.id);

    if (partner.status === "SUSPENDED") {
      activePartner.mutate(partner.id);
    } else {
      suspendPartner.mutate(partner.id);
    }
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

        <table className="w-full text-sm">
          <thead className="rounded-sm bg-slate-900">
            <tr className="w-full border-l-8">
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Telefone</th>
              <th className="p-2 text-left">Plano</th>
              <th className="p-2 text-left">Expirado em</th>
              <th className="p-2 text-left">Criado em</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="rounded-lg border-b border-gray-500/15">
            {data.map((user: PartnerOutputDto) => (
              <tr
                key={user.id}
                className={`${user.status === "SUSPENDED" ? "opacity-50" : ""} rounded-sm border-l-8 hover:bg-slate-700 ${user.plan === "FREE" ? "border-amber-600" : user.plan === "BASIC" ? "border-slate-300" : "border-amber-300"}`}
              >
                <td className="max-w-[200px] truncate p-2">{user.name}</td>
                <td className="max-w-[200px] truncate p-2">{user.email}</td>
                <td className="p-2">{user.phone}</td>
                <td
                  className={`p-2 text-xl font-extrabold ${user.plan === "FREE" ? "text-amber-600" : user.plan === "BASIC" ? "text-slate-300" : "text-amber-300"}`}
                >
                  {user.plan}
                </td>
                <td className="p-2">
                  {new Date(user.accessExpiresAt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="flex gap-2 p-2">
                  <Modal
                    id={`AdminToggleForm-${user.id}`}
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
                          ? `Reativar ${user?.name}?`
                          : `Suspender ${user?.name}?`
                      }
                      onClick={() => handleStatusPartner(user)}
                      color="bg-green"
                      disabled={update.isPending}
                      admin
                    />
                  </Modal>
                  <Modal
                    id={`AdmPageForm-${user.id}`}
                    icon="carbon:edit"
                    info="Editar"
                  >
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
