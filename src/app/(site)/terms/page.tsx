import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Use">
      <p>By using this website you agree to these terms.</p>
      <h2>Content</h2>
      <p>All articles, photographs and graphics on this site belong to Simana Sandesh or its partners. You may share links to our articles, but you may not republish our content without written permission.</p>
      <h2>Accuracy</h2>
      <p>We work hard to be accurate. If you find an error, please contact us so we can correct it.</p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continued use of the site means you accept the updated terms.</p>
    </StaticPage>
  );
}
