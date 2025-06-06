import { Icon } from "@iconify/react/dist/iconify.js";
import Spin from "../../components/Spin";
import { PartnerOutputDto } from "../../partner/services/partnerService";
import useAdm from "../hooks/useAdm";
import useAdmMutate from "../hooks/useAdmMutate";

export default function AdmPage() {
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
  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="rounded-sm bg-slate-900">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="hidden p-4 text-left sm:table-cell">Email</th>
              <th className="hidden p-4 text-left md:table-cell">Telefone</th>
              <th className="p-4 text-left">Plano</th>
              <th className="hidden p-4 text-left sm:table-cell">Criado em</th>
              <th className="p-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((user: PartnerOutputDto) => (
              <tr key={user.id} className="rounded-sm hover:bg-slate-900">
                <td className="p-4">{user.name}</td>
                <td className="hidden p-4 sm:table-cell">{user.email}</td>
                <td className="hidden p-4 md:table-cell">{user.phone}</td>
                <td className="p-4">{user.plan}</td>
                <td className="hidden p-4 sm:table-cell">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="flex gap-4 p-4">
                  <button
                    className="text-blue-500 hover:underline"
                    // onClick={() => onEdit(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    // onClick={() => onDelete(user.id)}
                  >
                    Deletar
                  </button>
                  <Icon
                    icon="material-symbols:switch-access-2-rounded"
                    width="24"
                    onClick={() => handleAccessPartner(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
