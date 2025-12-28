"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  applicationId: string;
};

export default function PaymentClient({ applicationId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleConfirm = async () => {
    setStatus("loading");
    setMessage("");
    const response = await fetch(`/api/applications/${applicationId}/pay`, {
      method: "POST"
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "Gagal konfirmasi pembayaran.");
      return;
    }
    setStatus("done");
    setMessage("Pembayaran diterima. Status pengajuan Anda telah disetujui.");
    setTimeout(() => {
      router.replace(`/ajukan/pembayaran/${applicationId}`);
    }, 1200);
  };

  return (
    <div className="mt-6 space-y-4">
      {message && (
        <p
          className={`text-sm font-semibold ${
            status === "done" ? "text-emerald" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={status === "loading" || status === "done"}
        className="w-full rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-white"
      >
        {status === "loading" ? "Memproses..." : "Saya Sudah Transfer"}
      </button>
    </div>
  );
}
