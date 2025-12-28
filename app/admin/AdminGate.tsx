"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Props = {
  children: React.ReactNode;
};

export default function AdminGate({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (pathname === "/admin/login") {
        setReady(true);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      setReady(true);
    };

    check();
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12 text-sm text-ink/60">
        Memeriksa sesi admin...
      </div>
    );
  }

  return <>{children}</>;
}
