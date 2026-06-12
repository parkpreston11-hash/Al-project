import { Link } from "wouter";
import { Home as HomeIcon, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-white text-primary p-2 rounded-sm">
                <HomeIcon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-none tracking-tight text-white">
                  Eleanor & Co.
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/70">
                  Real Estate & Finance
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              One trusted professional for buying, selling, and financing your home. Providing expert guidance with a commitment to integrity and excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/70 hover:text-accent transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-white/70 hover:text-accent transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-white/70 hover:text-accent transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-lg mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/listings" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Properties for Sale</Link></li>
              <li><Link href="/sold" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Recently Sold</Link></li>
              <li><Link href="/sell" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Sell Your Home</Link></li>
              <li><Link href="/loans" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Loan Programs</Link></li>
              <li><Link href="/calculator" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Mortgage Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-lg mb-6 tracking-wide">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/home-buying-plan" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Home Buying Plan</Link></li>
              <li><Link href="/about" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">About Me</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Contact</Link></li>
              <li><Link href="/admin" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Agent Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold text-lg mb-6 tracking-wide">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <a href="tel:6263911325" className="text-primary-foreground/70 text-sm hover:text-accent transition-colors">(626) 391-1325</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm leading-relaxed">
                  129½ W Badillo St<br />
                  Covina, CA 91723
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p>&copy; {new Date().getFullYear()} Eleanor & Co. All rights reserved.</p>
            <span className="hidden md:inline">•</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>DRE #01461081</span>
            <span>Homes Better DRE #01527840</span>
            <span>NMLS #271420</span>
            <span className="flex items-center gap-1">Equal Housing Opportunity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
