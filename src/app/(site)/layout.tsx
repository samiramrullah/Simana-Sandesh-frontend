import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { getCategories } from "@/lib/api";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return (
    <>
      <Header categories={categories} />
      <main id="main">{children}</main>
      <Footer categories={categories} />
      <BackToTop />
    </>
  );
}
