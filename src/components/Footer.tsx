import Link from "next/link";
import type { Category } from "@/types";
import { categoryUrl } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, XIcon, YouTubeIcon } from "./Icons";

export default function Footer({ categories }: { categories: Category[] }) {
  const half = Math.ceil(categories.length / 2);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-name">Simana <span style={{ color: "var(--accent)" }}>Sandesh</span></div>
            <p>Independent reporting from the border to the capital. Trusted news, clear analysis and the stories that matter to you.</p>
            <div className="socials">
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="X (Twitter)"><XIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon size={16} /></a>
              <a href="#" aria-label="YouTube"><YouTubeIcon /></a>
              <a href="#" aria-label="WhatsApp channel"><WhatsAppIcon /></a>
            </div>
          </div>
          <div>
            <h4>Sections</h4>
            <ul>{categories.slice(0, half).map((c) => <li key={c.id}><Link href={categoryUrl(c.slug)}>{c.name}</Link></li>)}</ul>
          </div>
          <div>
            <h4>More</h4>
            <ul>{categories.slice(half).map((c) => <li key={c.id}><Link href={categoryUrl(c.slug)}>{c.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Simana Sandesh. All rights reserved.</span>
          <span>Registered with the Registrar of Newspapers for Nepal</span>
        </div>
      </div>
    </footer>
  );
}
