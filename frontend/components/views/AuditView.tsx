import { Suspense } from "react";
import AuditClient from "@/app/audit/AuditClient";
import { Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
}

// Suspense is required because AuditClient reads useSearchParams()
// (the landing hero passes ?brand= for form prefill).
export default function AuditView({ lang }: Props) {
  return (
    <Suspense fallback={null}>
      <AuditClient lang={lang} />
    </Suspense>
  );
}
