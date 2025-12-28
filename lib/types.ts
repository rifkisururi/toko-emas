export type Brand = "Antam" | "UBS";

export type Product = {
  id: string;
  code: string;
  name: string;
  brand: Brand;
  weight: number;
  price: number;
  imageUrl?: string;
  certificate?: string;
  stock: number;
};

export type CicilanSettings = {
  marginAnnual: number;
  adminFeeRate: number;
  stampDuty: number;
  dpMin: number;
  dpMax: number;
  tenorOptions: number[];
  lateFeeDaily: number;
};

export type SimulationInput = {
  productId: string;
  price: number;
  dpAmount: number;
  tenor: number;
  marginAnnual: number;
  adminFeeRate: number;
  stampDuty: number;
};

export type SimulationRow = {
  tenor: number;
  monthlyInstallment: number;
  totalPay: number;
  adminFee: number;
  stampDuty: number;
};

export type InstallmentScheduleItem = {
  monthIndex: number;
  dueDate: string;
  installment: number;
  principal: number;
  margin: number;
  status: "Belum Dibayar" | "Terlambat" | "Lunas";
  lateDays: number;
  penalty: number;
  totalDue: number;
};
