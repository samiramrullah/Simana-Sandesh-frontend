type P = { size?: number; className?: string };
const base = (size = 20) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const SearchIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const MenuIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
export const CloseIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const ChevronRight = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}><path d="m9 18 6-6-6-6" /></svg>
);
export const ArrowUp = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="m18 15-6-6-6 6" /></svg>
);
export const ClockIcon = ({ size = 14, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const EyeIcon = ({ size = 14, className }: P) => (
  <svg {...base(size)} className={className}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const LinkIcon = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" /></svg>
);
export const ShareIcon = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>
);
export const PrintIcon = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>
);
export const BookmarkIcon = ({ size = 16, className, filled }: P & { filled?: boolean }) => (
  <svg {...base(size)} className={className} fill={filled ? "currentColor" : "none"}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
);

const solid = (size = 16) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true });
export const WhatsAppIcon = ({ size }: P) => (
  <svg {...solid(size)}><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3a.4.4 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" /></svg>
);
export const XIcon = ({ size }: P) => (
  <svg {...solid(size)}><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" /></svg>
);
export const FacebookIcon = ({ size }: P) => (
  <svg {...solid(size)}><path d="M14 8V6.2c0-.8.5-1.2 1.2-1.2H17V2h-2.6C11.7 2 11 4 11 5.7V8H9v3h2v11h3V11h2.5l.4-3H14Z" /></svg>
);
export const YouTubeIcon = ({ size }: P) => (
  <svg {...solid(size)}><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15V9l5.8 3-5.8 3Z" /></svg>
);
export const InstagramIcon = ({ size }: P) => (
  <svg {...base(size)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
);
