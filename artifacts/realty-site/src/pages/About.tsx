import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { MapPin, Award, Home, DollarSign, CheckCircle } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

export default function About() {
  return (
    <Layout>
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">The Person Behind the Work</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">About Me</h1>
          <p className="text-white/70 max-w-xl">A licensed Realtor and Loan Officer with decades of experience helping families across Southern California and the Inland Empire buy, sell, and finance their homes.</p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
                  <img
                    src="/al-williams.jpeg"
                    alt="Al Williams — Realtor & Loan Officer"
                    className="w-full h-full object-cover object-center"
                    data-testid="about-headshot"
                  />
                </div>
                <div className="absolute -bottom-5 -right-5 bg-accent text-primary p-5 rounded-lg shadow-lg">
                  <p className="text-3xl font-serif font-bold leading-none">30+</p>
                  <p className="text-sm font-semibold mt-1">Years of Experience</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Al Williams</p>
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">Realtor & Loan Officer</h2>
              <p className="text-muted-foreground text-sm mb-6">DRE #01461081 &nbsp;|&nbsp; Homes Better DRE #01527840 &nbsp;|&nbsp; NMLS #271420</p>

              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  I began my career in real estate with a simple belief: that people deserve one trusted advisor who can guide them through every part of the transaction — not a patchwork of professionals who don't talk to each other.
                </p>
                <p>
                  Today, I serve buyers, sellers, and homeowners throughout Southern California and the Inland Empire as both a licensed Realtor and a licensed Loan Officer. That dual expertise allows me to give clients a level of transparency and coordination that's genuinely rare in this industry.
                </p>
                <p>
                  I've sold over 55 properties throughout California. But the number I'm most proud of is the number of repeat clients and referrals — people who come back, and people who send their friends and family, because they trusted the experience.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-bold text-primary mb-4">Mission Statement</h3>
                <blockquote className="border-l-4 border-accent pl-5 italic text-muted-foreground leading-relaxed">
                  "To provide every client with honest guidance, exceptional service, and the kind of attention to detail that makes one of life's biggest decisions feel manageable — even exciting."
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Expertise</p>
            <h2 className="text-3xl font-serif font-bold text-primary">Two Disciplines, One Advisor</h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            <motion.div variants={fadeUp}>
              <Card className="p-8 border border-border h-full">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-5">
                  <Home size={22} className="text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Real Estate Experience</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {[
                    "Licensed Realtor since 2009",
                    "55+ properties sold throughout California",
                    "Buyer & seller representation",
                    "Relocation specialist",
                    "Luxury property marketing",
                    "Negotiation & contract expertise",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-accent flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="p-8 border border-border h-full">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-5">
                  <DollarSign size={22} className="text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Loan Officer Experience</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {[
                    "Licensed Loan Officer since 1995",
                    "FHA, VA, Conventional, Jumbo",
                    "First-time buyer programs",
                    "Refinance guidance",
                    "Investment property financing",
                    "Pre-qualification consulting",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-accent flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Areas Served */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Coverage</p>
          <h2 className="text-3xl font-serif font-bold text-primary mb-8">Areas Served</h2>
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {["Anaheim", "Buena Park", "Chino", "Chino Hills", "Corona", "Eastvale", "Fontana", "Fullerton", "Garden Grove", "Jurupa Valley", "La Habra", "La Palma", "Los Angeles", "Orange", "Rancho Cucamonga", "Riverside", "Santa Ana", "Tustin"].map((area, i) => (
              <span key={i} className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-border text-sm font-medium text-foreground" data-testid={`area-${i}`}>
                <MapPin size={13} className="text-accent" /> {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Let's Work Together</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">Whether you're buying, selling, or simply want to explore what's possible — I'd love to hear from you.</p>
          <Link href="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary" data-testid="button-contact-about">Get In Touch</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
