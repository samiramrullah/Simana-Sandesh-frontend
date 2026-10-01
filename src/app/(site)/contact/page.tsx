import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <StaticPage title="Contact Us" intro="We would like to hear from you: news tips, feedback, corrections and advertising enquiries.">
      <h2>Newsroom</h2>
      <p>Email: <a href="mailto:news@simanasandesh.com">news@simanasandesh.com</a></p>
      <h2>Corrections</h2>
      <p>If you spot an error in our reporting, write to <a href="mailto:corrections@simanasandesh.com">corrections@simanasandesh.com</a> with the article link.</p>
      <h2>Advertising</h2>
      <p>Email: <a href="mailto:ads@simanasandesh.com">ads@simanasandesh.com</a></p>
      <h2>Office</h2>
      <p>Birgunj, Adarshnagar — 44300, Nepal</p>
    </StaticPage>
  );
}
