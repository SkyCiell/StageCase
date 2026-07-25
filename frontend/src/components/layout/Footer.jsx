import { Link } from "react-router-dom";
import SCLogo from "../SCLogo";

const PLATFORM_LINKS = [
  { to: "/concerts",   label: "Browse Concerts" },
  { to: "/my-tickets", label: "My Tickets"      },
  { to: "/favorites",  label: "Favorites"       },
  { to: "/profile",    label: "Profile"         },
];

const SUPPORT_LINKS = [
  { label: "Help Center",      href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy",   href: "#" },
  { label: "Contact Us",       href: "#" },
];

export default function Footer() {
  return (
    <footer className="mt-20" style={{ background: "#343C4E", borderTop: "1px solid rgba(245,243,245,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand — 5 cols */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <SCLogo size={38} />
              <div className="flex flex-col leading-none">
                <span className="font-display font-black uppercase tracking-widest text-lg" style={{ color: "#F5F3F5" }}>
                  StageCase
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] mt-0.5" style={{ color: "#D3CCD0" }}>
                  Crayon Case Tour Platform
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm font-sans" style={{ color: "#D3CCD0" }}>
              StageCase is the official concert ticketing portal for Crayon Case. Discover upcoming tour dates, select your preferred seating, and receive digital QR e-tickets instantly.
            </p>
          </div>

          {/* Platform links — 3 cols */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: "#F5F3F5" }}>Platform</h4>
            <ul className="space-y-2">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-xs font-mono transition-colors" style={{ color: "#D3CCD0" }}
                    onMouseEnter={e => e.target.style.color = "#F5F3F5"}
                    onMouseLeave={e => e.target.style.color = "#D3CCD0"}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links — 4 cols */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: "#F5F3F5" }}>Support & Legal</h4>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs font-mono transition-colors" style={{ color: "#D3CCD0" }}
                    onMouseEnter={e => e.target.style.color = "#F5F3F5"}
                    onMouseLeave={e => e.target.style.color = "#D3CCD0"}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono"
          style={{ borderTop: "1px solid rgba(245,243,245,0.08)", color: "#D3CCD0" }}>
          <p>© {new Date().getFullYear()} StageCase. All rights reserved.</p>
          <p>
            Official Ticketing Platform for{" "}
            <span className="font-bold" style={{ color: "#8DA7CC" }}>Crayon Case</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
