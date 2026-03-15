import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Avanti Growth Labs LLC — Terms of Service",
};

export default function TermsPage() {
  return (
    <article className="prose prose-invert max-w-3xl mx-auto py-12" style={{ color: "#d4d4d8" }}>
      <h1 style={{ color: "#f0f0f8" }}>Terms of Service</h1>
      <p className="text-sm" style={{ color: "#a1a1aa" }}>Last updated: March 15, 2026</p>

      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the services
        provided by Avanti Growth Labs LLC (&quot;Avanti,&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;), including the website at{" "}
        <a href="https://avantia2a.com" style={{ color: "#60a5fa" }}>avantia2a.com</a> and all
        related tools, APIs, and features (collectively, the &quot;Service&quot;). By using the
        Service, you agree to these Terms.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>1. Eligibility</h2>
      <p>
        You must be at least 18 years old and have the legal capacity to enter into a binding
        agreement. If you use the Service on behalf of a company or organization, you represent
        that you have the authority to bind that entity to these Terms.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>2. Account Registration</h2>
      <p>
        To access certain features, you must create an account with accurate and complete
        information. You are responsible for maintaining the confidentiality of your login
        credentials and for all activities that occur under your account.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>3. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
        <li>Attempt to reverse engineer, decompile, or disassemble any part of the Service</li>
        <li>Interfere with or disrupt the integrity or performance of the Service</li>
        <li>Access the Service through automated means (bots, scrapers) without our prior written consent</li>
        <li>Resell, sublicense, or redistribute the Service or any data obtained through it without authorization</li>
      </ul>

      <h2 style={{ color: "#f0f0f8" }}>4. Subscription and Payments</h2>
      <p>
        Certain features of the Service require a paid subscription. By subscribing, you agree to
        pay the applicable fees as described on our pricing page. All fees are non-refundable except
        as required by law. We reserve the right to change our pricing with 30 days&apos; prior notice.
      </p>
      <p>
        Free-tier users receive a limited number of credits per month. Unused credits do not roll
        over to subsequent months.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>5. Intellectual Property</h2>
      <p>
        The Service, including its design, code, content, and features, is owned by Avanti Growth
        Labs LLC and protected by intellectual property laws. You retain ownership of the data you
        submit to the Service. By using the Service, you grant us a limited license to process your
        data solely for the purpose of providing the Service.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>6. AI-Generated Content</h2>
      <p>
        The Service queries third-party AI platforms to generate brand visibility analysis and
        recommendations. AI-generated content may contain inaccuracies. We do not guarantee the
        accuracy, completeness, or reliability of AI-generated outputs. You should independently
        verify any insights before making business decisions based on them.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>7. Third-Party Services</h2>
      <p>
        The Service integrates with third-party platforms including but not limited to OpenAI,
        Anthropic, Google, TikTok, YouTube, and Reddit. Your use of these integrations is subject
        to the respective third-party terms of service. We are not responsible for the availability
        or accuracy of third-party services.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Avanti shall not be liable for any indirect,
        incidental, special, consequential, or punitive damages, including loss of profits, data,
        or business opportunities, arising out of or related to your use of the Service.
      </p>
      <p>
        Our total liability for any claim arising out of these Terms shall not exceed the amount
        you paid us in the 12 months preceding the claim.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>9. Disclaimer of Warranties</h2>
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
        any kind, either express or implied, including but not limited to implied warranties of
        merchantability, fitness for a particular purpose, or non-infringement.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>10. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at any time for violation of these
        Terms or for any other reason with reasonable notice. You may terminate your account at any
        time by contacting us. Upon termination, your right to use the Service ceases immediately.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>11. Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of the State of
        Delaware, United States, without regard to its conflict of law provisions. Any disputes
        shall be resolved in the courts located in Delaware.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>12. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. We will notify you of material changes by
        posting the updated Terms on this page. Your continued use of the Service after changes
        constitutes acceptance of the revised Terms.
      </p>

      <h2 style={{ color: "#f0f0f8" }}>13. Contact Us</h2>
      <p>If you have questions about these Terms, please contact us:</p>
      <ul>
        <li>Email: <a href="mailto:hello@avantia2a.com" style={{ color: "#60a5fa" }}>hello@avantia2a.com</a></li>
        <li>Company: Avanti Growth Labs LLC</li>
        <li>Address: 700 Edgewater Blvd Apt 104, Foster City, CA 94404, United States</li>
      </ul>
    </article>
  );
}
