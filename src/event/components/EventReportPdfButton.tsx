import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EventOutputDto } from "../services/eventService";
import { ProductOutputDto } from "../../product/services/productService";
import { formatDate } from "../../helpers/formatDate";
import { currencyFormatter } from "../../helpers/currencyFormatter";
import { goalUtils } from "../../helpers/goalUtils";
import { Icon } from "@iconify/react/dist/iconify.js";

type EventReportPdfProps = {
  event: EventOutputDto;
  products: ProductOutputDto[];
};

export default function EventReportPdfButton({
  event,
  products,
}: EventReportPdfProps) {
  const handleDownload = () => {
    const totalValue = goalUtils.getTotalForGoal(
      event.allSellers,
      event.goalType,
    );

    const totalQuantity =
      event.sales?.reduce((acc, sale) => acc + (sale?.quantity ?? 0), 0) ?? 0;

    const goalAchieved =
      event.goal != null &&
      (event.goalType === "VALUE"
        ? totalValue >= event.goal
        : totalQuantity >= event.goal);

    const goalEvent =
      event.goalType == "VALUE"
        ? currencyFormatter.ToBRL(event.goal)
        : event.goal + " unidades";

    const doc = new jsPDF();

    // Cabeçalho personalizado
    doc.setFillColor(50, 50, 50);
    doc.rect(0, 0, 210, 15, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(`Relatório do Evento: ${event.name}`, 105, 10, {
      align: "center",
    });

    // Informações principais
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Período: ${formatDate(event.startDate)} a ${formatDate(event.endDate)}`,
      14,
      25,
    );
    doc.text(`Meta Geral: ${goalEvent}`, 14, 32);
    doc.text(`Total de Unidades Vendidas: ${totalQuantity}`, 14, 39);
    doc.text(
      `Valor Total Vendido: ${currencyFormatter.ToBRL(totalValue)}`,
      14,
      46,
    );

    doc.setTextColor(goalAchieved ? 0 : 255, goalAchieved ? 128 : 0, 0);
    doc.text(`Meta Atingida: ${goalAchieved ? "Sim" : "Não"}`, 14, 53);
    doc.setTextColor(0, 0, 0); // Reset cor

    // Tabela de vendedores
    autoTable(doc, {
      startY: 65,
      head: [
        ["Nome", "Email", "Telefone", "Unid.", "Valor", "Meta", "Atingiu"],
      ],
      body: event.allSellers.map((s) => {
        const sellerGoal = goalUtils.calculateSellerGoal(
          event.allSellers,
          event.goal,
        );
        const achieved =
          event.goalType === "VALUE"
            ? s.totalSalesValue >= sellerGoal
            : s.totalSalesCount >= sellerGoal;

        return [
          s.name,
          s.email,
          s.phone,
          s.totalSalesCount.toString(),
          currencyFormatter.ToBRL(s.totalSalesValue),
          event.goalType === "VALUE"
            ? currencyFormatter.ToBRL(sellerGoal)
            : sellerGoal.toString(),
          achieved ? "Sim" : "Não",
        ];
      }),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 6) {
          const cellText = data.cell.text?.[0];
          if (cellText === "Sim") {
            data.cell.styles.textColor = [0, 128, 0]; // verde
          } else if (cellText === "Não") {
            data.cell.styles.textColor = [255, 0, 0]; // vermelho
          }
        }
      },
    });

    // Tabela de vendas detalhadas
    const salesWithDetails = event.sales.map((sale) => {
      const product = products.find((p) => p.id === sale.productId);
      const seller = event.allSellers.find((s) => s.id === sale.sellerId);
      const unitPrice = product?.price ?? 0;

      return {
        date: new Date(sale.createdAt).toLocaleDateString(),
        sellerName: seller?.name ?? "Desconhecido",
        productName: product?.name ?? "Desconhecido",
        quantity: sale.quantity,
        unitPrice,
        total: sale.quantity * unitPrice,
      };
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Data", "Vendedor", "Produto", "Qtd", "Valor Unit.", "Total"]],
      body: salesWithDetails.map((sale) => [
        sale.date,
        sale.sellerName,
        sale.productName,
        sale.quantity.toString(),
        `R$ ${sale.unitPrice.toFixed(2)}`,
        `R$ ${sale.total.toFixed(2)}`,
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    doc.save(`relatorio_${event.name.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div
      onClick={handleDownload}
      className="cursor-pointer rounded-full border border-slate-100/15 p-3 text-yellow-400 opacity-80 hover:bg-[#142a49] hover:opacity-100 focus:outline-none"
    >
      <Icon icon="line-md:file-download" width="25" />
    </div>
  );
}
