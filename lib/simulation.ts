import { InstallmentScheduleItem, SimulationInput, SimulationRow } from "./types";

export const calculateSimulation = (input: SimulationInput): SimulationRow => {
  const principal = Math.max(input.price - input.dpAmount, 0);
  const margin = principal * input.marginAnnual * (input.tenor / 12);
  const adminFeeAmount = principal * input.adminFeeRate * (input.tenor / 12);
  const total = principal + margin;
  const monthly = total / input.tenor;

  return {
    tenor: input.tenor,
    monthlyInstallment: monthly,
    totalPay: total,
    adminFee: adminFeeAmount,
    stampDuty: input.stampDuty
  };
};

export const generateSchedule = (
  input: SimulationInput,
  startDate: Date
): InstallmentScheduleItem[] => {
  const principal = Math.max(input.price - input.dpAmount, 0);
  const marginTotal = principal * input.marginAnnual * (input.tenor / 12);
  const adminFeeAmount = principal * input.adminFeeRate * (input.tenor / 12);
  const total = principal + marginTotal;
  const monthly = total / input.tenor;
  const principalPart = principal / input.tenor;
  const marginPart = marginTotal / input.tenor;

  const schedule: InstallmentScheduleItem[] = [];

  for (let i = 0; i < input.tenor; i += 1) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);

    schedule.push({
      monthIndex: i + 1,
      dueDate: dueDate.toISOString(),
      installment: monthly,
      principal: principalPart,
      margin: marginPart,
      status: "Belum Dibayar",
      lateDays: 0,
      penalty: 0,
      totalDue: monthly
    });
  }

  return schedule;
};

export const applyLatePenalty = (
  item: InstallmentScheduleItem,
  lateFeeDaily: number,
  asOf: Date
): InstallmentScheduleItem => {
  const due = new Date(item.dueDate);
  const diffTime = asOf.getTime() - due.getTime();
  const lateDays = Math.max(Math.floor(diffTime / (1000 * 60 * 60 * 24)), 0);
  const penalty = lateDays * lateFeeDaily * item.installment;

  return {
    ...item,
    lateDays,
    penalty,
    totalDue: item.installment + penalty,
    status: lateDays > 0 ? "Terlambat" : item.status
  };
};
