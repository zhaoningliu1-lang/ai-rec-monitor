import AuditClient from "@/app/audit/AuditClient";
import { Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
}

export default function AuditView({ lang }: Props) {
  return <AuditClient lang={lang} />;
}
