import { IExpenseInsight, IIncomeInsight } from "services/transactions";

export const getInsightPnL = (
  incomeInsight: IIncomeInsight | undefined,
  expenseInsight: IExpenseInsight | undefined
): {
  pendapatan: number;
  bahanBaku: number;
  marketing: number;
  operational: number;
  pengeluaran: number;
  pnlBersih: number;
  pnlKotor: number;
} => {
  const pendapatan = incomeInsight?.revenue_amount ?? 0;
  const bahanBaku = expenseInsight?.total_amount_material ?? 0;
  const marketing = expenseInsight?.total_amount_marketing ?? 0;
  const operational = expenseInsight?.total_amount_operational ?? 0;
  const pengeluaran = bahanBaku + marketing + operational;
  const pnlKotor = pendapatan - bahanBaku;
  const pnlBersih = pendapatan - pengeluaran;

  return {
    pendapatan,
    bahanBaku,
    marketing,
    pengeluaran,
    operational,
    pnlBersih,
    pnlKotor,
  };
};
