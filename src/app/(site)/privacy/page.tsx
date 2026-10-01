import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy">
      <p>This policy explains what information Simana Sandesh collects and how it is used.</p>
      <h2>Information we collect</h2>
      <ul>
        <li>Your email address, if you subscribe to our newsletter.</li>
        <li>Anonymous page view counts, used to show our most-read stories.</li>
      </ul>
      <h2>How we use it</h2>
      <p>We use your email only to send the newsletter you asked for. We do not sell your information.</p>
      <h2>Your choices</h2>
      <p>To unsubscribe or have your email removed, write to <a href="mailto:privacy@simanasandesh.com">privacy@simanasandesh.com</a>.</p>
    </StaticPage>
  );
}
