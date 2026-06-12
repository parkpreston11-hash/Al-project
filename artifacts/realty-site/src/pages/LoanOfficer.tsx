import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Shield, Home, Star, TrendingUp, RefreshCw, Building2 } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

const loanPrograms = [
  {
    icon: <Home className="w-7 h-7 text-accent" />,
    name: "FHA Loans",
    description: "Government-backed loans designed to make homeownership accessible.",
    goodFor: "First-time homebuyers, those with lower down payments, or buyers building credit history.",
    highlight: "As low as 3.5% down",
  },
  {
    icon: <Shield className="w-7 h-7 text-accent" />,
    name: "Conventional Loans",
    description: "Standard mortgage products with flexible terms for qualified buyers.",
    goodFor: "Buyers with strong credit and stable income looking for competitive rates.",
    highlight: "No mortgage insurance with 20% down",
  },
  {
    icon: <Star className="w-7 h-7 text-accent" />,
    name: "VA Loans",
    description: "Exclusive mortgage benefits for veterans, active duty, and surviving spouses.",
    goodFor: "Veterans and service members seeking no down payment options.",
    highlight: "No down payment required",
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-accent" />,
    name: "Jumbo Loans",
    description: "Financing solutions for properties that exceed conforming loan limits.",
    goodFor: "Buyers of luxury or higher-priced properties who need larger loan amounts.",
    highlight: "Tailored for premium properties",
  },
  {
    icon: <RefreshCw className="w-7 h-7 text-accent" />,
    name: "Refinance Options",
    description: "Explore whether refinancing could lower your rate, reduce your term, or tap equity.",
    goodFor: "Existing homeowners looking to optimize their mortgage or access cash.",
    highlight: "Rate & term or cash-out options",
  },
  {
    icon: <Building2 className="w-7 h-7 text-accent" />,
    name: "Investment Property Loans",
    description: "Financing strategies for rental homes, multi-family, and investment real estate.",
    goodFor: "Investors expanding their portfolio or purchasing income-generating properties.",
    highlight: "Tailored investment strategies",
  },
];

export default function LoanOfficer() {
  return (
    <Layout>
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Financing Guidance</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Home Financing Made Simple</h1>
          <p className="text-white/70 max-w-xl">Navigating loan options doesn't have to be complicated. I'll help you understand what's available, what may fit your situation, and what to expect throughout the process.</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              As a licensed Loan Officer, I can walk you through the range of loan programs that may be available to you, provide estimated monthly payment scenarios, and guide you through the home buying process from a financing perspective.
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm font-medium text-primary">
              {["No rate promises", "Educational guidance only", "Licensed professional", "No pressure approach"].map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-secondary rounded-full border border-border">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Loan Programs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Available Programs</p>
            <h2 className="text-3xl font-serif font-bold text-primary">Loan Program Overview</h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loanPrograms.map((program, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-7 h-full flex flex-col border border-border hover:shadow-lg hover:border-accent/40 transition-all" data-testid={`card-loan-${i}`}>
                  <div className="w-13 h-13 bg-accent/10 rounded-lg flex items-center justify-center mb-5 p-3 w-fit">
                    {program.icon}
                  </div>
                  <h3 className="font-bold text-primary text-xl mb-2">{program.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{program.description}</p>
                  <div className="bg-secondary/50 rounded-md p-3 mb-4 text-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">May Be Good For</p>
                    <p className="text-foreground text-sm">{program.goodFor}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                    <span className="text-sm font-semibold text-accent">{program.highlight}</span>
                  </div>
                  <Link href="/contact">
                    <Button variant="outline" size="sm" className="w-full" data-testid={`button-contact-loan-${i}`}>Contact to Learn More</Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Card className="p-6 border border-border bg-white">
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              <strong className="text-foreground not-italic">Disclaimer:</strong> The information provided on this page is for educational and informational purposes only. Nothing on this page constitutes a commitment to lend, a guarantee of rates, or a promise of loan approval. Loan programs, eligibility requirements, and terms are subject to change. Contact us to discuss your specific situation with a licensed professional.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Explore Your Options?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">Start with a conversation. No commitment, no pressure — just clear guidance tailored to your situation.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/home-buying-plan">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary" data-testid="button-start-plan">Start My Home Buying Plan</Button>
            </Link>
            <Link href="/calculator">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" data-testid="button-calculator">Try the Calculator</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
