// import { useNavigate } from "react-router-dom";
import Spin from "../../components/Spin";
import usePartner from "../../partner/hooks/usePartner";
import { PartnerOutputDto } from "../../partner/services/partnerService";

export default function AdmPage() {
  const {
    queryPartners: { isPending, error, data },
  } = usePartner();
  // const navigate = useNavigate();

  if (isPending) return <Spin />;
  if (error) return "An error has occurred: " + error.message;

  const accessPartner = (partner: PartnerOutputDto) => {
    // login.mutate({ email: partner.email, password: partner.password });
    console.log(partner);

    return;
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
              <th className="p-2 text-left">Nome</th>
              <th className="hidden p-2 text-left sm:table-cell">Email</th>
              <th className="hidden p-2 text-left md:table-cell">Telefone</th>
              <th className="p-2 text-left">Plano</th>
              <th className="hidden p-2 text-left sm:table-cell">Criado em</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((user: PartnerOutputDto) => (
              <tr
                key={user.id}
                className="rounded-sm hover:bg-slate-900"
                onClick={() => accessPartner(user)}
              >
                <td className="p-2">{user.name}</td>
                <td className="hidden p-2 sm:table-cell">{user.email}</td>
                <td className="hidden p-2 md:table-cell">{user.phone}</td>
                <td className="p-2">{user.plan}</td>
                <td className="hidden p-2 sm:table-cell">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="flex gap-2 p-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
