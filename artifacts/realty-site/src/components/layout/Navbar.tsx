import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X, Home as HomeIcon } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/listings", label: "Properties" },
    { href: "/sold", label: "Recently Sold" },
    { href: "/sell", label: "Sell" },
    { href: "/loans", label: "Loans" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-border shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-2 rounded-sm group-hover:bg-accent transition-colors">
              <HomeIcon size={20} />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif font-bold text-xl leading-none tracking-tight ${isScrolled ? "text-primary" : "text-white"}`}>
                Go Big Al Williams
              </span>
              <span className={`text-[10px] uppercase tracking-widest ${isScrolled ? "text-muted-foreground" : "text-white/80"}`}>
                Real Estate & Finance
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    isScrolled
                      ? location === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Link href="/contact" className={`text-sm font-medium ${isScrolled ? "text-primary hover:text-accent" : "text-white hover:text-accent"}`}>
                Contact
              </Link>
              <Link href="/home-buying-plan">
                <Button className={`${isScrolled ? "" : "bg-white text-primary hover:bg-white/90"}`}>
                  Start My Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 ${isScrolled ? "text-primary" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
             <Link
             key={link.href}
             href={link.href}
             onClick={() => setIsMobileMenuOpen(false)}
             className={`text-lg font-medium p-2 rounded-md ${
               location === link.href ? "bg-secondary text-primary" : "text-muted-foreground"
             }`}
           >
             {link.label}
           </Link>
          ))}
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium p-2 text-muted-foreground">
            Contact
          </Link>
          <Link href="/home-buying-plan" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full mt-2">Start My Plan</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}