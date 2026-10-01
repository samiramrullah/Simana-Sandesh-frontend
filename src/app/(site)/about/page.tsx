import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <StaticPage title="About Simana Sandesh" intro="Voice of the border, news for the nation.">
      <p>Simana Sandesh is an independent newspaper committed to accurate, fair and fearless reporting. We cover the stories that shape the lives of our readers, from the smallest village along the frontier to the halls of power in the capital.</p>
      <h2>Our promise</h2>
      <ul>
        <li>We check facts before we publish.</li>
        <li>We separate news from opinion.</li>
        <li>We correct our mistakes openly.</li>
        <li>We give every side a fair hearing.</li>
      </ul>
      <h2>Our newsroom</h2>
      <p>Our reporters and editors work across the region to bring you national, state and city news, along with business, sports, technology, entertainment and opinion.</p>
    </StaticPage>
  );
}
