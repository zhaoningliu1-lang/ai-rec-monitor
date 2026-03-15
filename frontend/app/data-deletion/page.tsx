import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion",
  description: "Avanti Growth Labs LLC — Data Deletion Request",
};

export default function DataDeletionPage() {
  return (
    <article className="prose prose-invert max-w-3xl mx-auto py-12" style={{ color: "#d4d4d8" }}>
      <h1 style={{ color: "#f0f0f8" }}>Data Deletion</h1>
      <p className="text-sm" style={{ color: "#a1a1aa" }}>Last updated: March 15, 2026</p>

      <p>
        At Avanti Growth Labs LLC, we respect your right to control your personal data. You may
        request the deletion of your account and all associated data at any time.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>What Data We Delete</h2>
      <p>Upon receiving a valid deletion request, we will permanently remove:</p>
      <ul>
        <li>Your account information (email, profile details)</li>
        <li>All AI visibility scan results and reports associated with your account</li>
        <li>Brand and product configurations you have created</li>
        <li>Usage history and analytics data</li>
        <li>Any cached or temporary data linked to your account</li>
      </ul>

      <h2 style={{ color: "#f0f0f8" }}>What We May Retain</h2>
      <p>
        We may retain certain data as required by law or for legitimate business purposes:
      </p>
      <ul>
        <li>Transaction and billing records (required for tax and accounting compliance)</li>
        <li>Anonymized, aggregated analytics that cannot be linked back to you</li>
        <li>Data necessary to comply with legal obligations or resolve disputes</li>
      </ul>

      <h2 style={{ color: "#f0f0f8" }}>How to Request Data Deletion</h2>

      <div className="rounded-xl p-6 my-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="mt-0" style={{ color: "#f0f0f8" }}>Option 1: Email Request</h3>
        <p className="mb-0">
          Send an email to{" "}
          <a href="mailto:hello@avantia2a.com?subject=Data%20Deletion%20Request" style={{ color: "#60a5fa" }}>
            hello@avantia2a.com
          </a>{" "}
          with the subject line <strong>&quot;Data Deletion Request&quot;</strong>. Include the
          email address associated with your Avanti account.
        </p>
      </div>

      <div className="rounded-xl p-6 my-6" style={{ background: "#0f0f17", border: "1px solid #25253f" }}>
        <h3 className="mt-0" style={{ color: "#f0f0f8" }}>Option 2: Account Settings</h3>
        <p className="mb-0">
          Log in to your account, go to{" "}
          <a href="/account" style={{ color: "#60a5fa" }}>Account Settings</a>, and select
          &quot;Delete Account.&quot; Follow the confirmation steps to proceed.
        </p>
      </div>

      <h2 style={{ color: "#f0f0f8" }}>Processing Timeline</h2>
      <p>
        We will acknowledge your request within <strong>2 business days</strong> and complete the
        deletion within <strong>30 days</strong>. You will receive a confirmation email once your
        data has been permanently deleted.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>Third-Party Data</h2>
      <p>
        If you connected third-party accounts (e.g., TikTok Shop, Google) through our Service,
        deleting your Avanti account will revoke our access to those platforms. However, you may
        also want to revoke access directly from each platform&apos;s settings.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>Contact</h2>
      <p>
        For any questions about data deletion, please contact us at{" "}
        <a href="mailto:hello@avantia2a.com" style={{ color: "#60a5fa" }}>hello@avantia2a.com</a>.
      </p>
    </article>
  );
}
