import { Link } from "react-router-dom";
import { Ticket, Shield, HelpCircle, Mail, Music, Heart, ArrowRight } from "lucide-react";
import SCLogo from "../SCLogo";

const PLATFORM_LINKS = [
  { to: "/concerts",   label: "Browse Concerts" },
  { to: "/my-tickets", label: "My Digital Tickets" },
  { to: "/favorites",  label: "Saved Favorites" },
  { to: "/profile",    label: "Account Dashboard" },
];

const SUPPORT_LINKS = [
  { label: "Help Center & FAQ", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy",   href: "#" },
  { label: "Official Support", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border mt-20 pt-16 pb-12">
      <div className="container-premium">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand Identity & Mission — 5 cols */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <SCLogo size={36} />
              <div className="flex flex-col">
                <span className="font-display font-bold text-text-primary text-lg tracking-wide">
                  StageCase
                </span>
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
                  Premium Concert Platform
                </span>
              </div>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm font-sans">
              StageCase is the official concert ticketing platform showcasing Indonesian and international indie artists. Experience seamless seat selection, digital QR passes, and verified tour dates.
            </p>
          </div>

          {/* Platform Navigation — 3 cols */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
              Platform Navigation
            </h4>
            <ul className="space-y-2">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-xs text-text-secondary hover:text-accent transition-colors font-sans flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 text-muted" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Security — 4 cols */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
              Support & Guarantee
            </h4>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-xs text-text-secondary hover:text-accent transition-colors font-sans flex items-center gap-2"
                  >
                    <Shield className="w-3 h-3 text-muted" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} StageCase Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Ticket className="w-3.5 h-3.5 text-primary" /> Verified E-Tickets
            </span>
            <span>•</span>
            <span className="text-accent font-medium">Crayon Case • Reality Club • The Milo • Wave to Earth</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
