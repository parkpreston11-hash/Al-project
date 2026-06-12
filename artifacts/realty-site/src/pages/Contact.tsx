import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

export default function Contact() {
  return (
    <Layout>
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Reach Out</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Let's Connect</h1>
          <p className="text-white/70 max-w-xl">Ready to take the next step? Reach out directly and I'll be in touch within one business day.</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Phone */}
            <motion.div variants={fadeUp}>
              <Card className="p-8 border border-border h-full hover:shadow-md hover:border-accent/40 transition-all" data-testid="contact-phone">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-5">
                  <Phone size={22} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">Phone</h3>
                <p className="text-muted-foreground text-sm mb-4">Call or text — I'm here to help.</p>
                <a
                  href="tel:6263911325"
                  className="text-2xl font-serif font-bold text-primary hover:text-accent transition-colors"
                  data-testid="contact-phone-number"
                >
                  (626) 391-1325
                </a>
              </Card>
            </motion.div>

            {/* Office */}
            <motion.div variants={fadeUp}>
              <Card className="p-8 border border-border h-full hover:shadow-md hover:border-accent/40 transition-all" data-testid="contact-office">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-5">
                  <MapPin size={22} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">Office</h3>
                <p className="text-muted-foreground text-sm mb-4">Serving the greater Los Angeles & Inland Empire area.</p>
                <address className="not-italic text-primary font-semibold leading-relaxed">
                  129½ W Badillo St<br />
                  Covina, CA 91723
                </address>
              </Card>
            </motion.div>

            {/* Hours */}
            <motion.div variants={fadeUp} className="md:col-span-2">
              <Card className="p-8 border border-border h-full hover:shadow-md hover:border-accent/40 transition-all" data-testid="contact-hours">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-5">
                  <Clock size={22} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">Business Hours</h3>
                <p className="text-muted-foreground text-sm mb-4">Available most days — evenings by appointment.</p>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between sm:flex-col gap-1">
                    <span className="text-muted-foreground">Monday – Friday</span>
                    <span className="font-semibold text-primary">9am – 6pm</span>
                  </div>
                  <div className="flex justify-between sm:flex-col gap-1">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-semibold text-primary">10am – 4pm</span>
                  </div>
                  <div className="flex justify-between sm:flex-col gap-1">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-semibold text-primary">By appointment</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Licenses */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card className="p-6 border border-border bg-secondary/30">
              <div className="flex flex-wrap items-center gap-6 justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">License Numbers</p>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">DRE</span>
                      <span className="font-bold text-primary ml-2">#01461081</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Homes Better DRE</span>
                      <span className="font-bold text-primary ml-2">#01527840</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">NMLS</span>
                      <span className="font-bold text-primary ml-2">#271420</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Equal Housing Opportunity</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href="#" className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center hover:bg-accent/20 transition-colors" aria-label="Facebook">
                    <Facebook size={16} className="text-primary" />
                  </a>
                  <a href="#" className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center hover:bg-accent/20 transition-colors" aria-label="Instagram">
                    <Instagram size={16} className="text-primary" />
                  </a>
                  <a href="#" className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center hover:bg-accent/20 transition-colors" aria-label="LinkedIn">
                    <Linkedin size={16} className="text-primary" />
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">Tell me about your goals and I'll map out your next steps.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/home-buying-plan">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary" data-testid="button-start-plan">Start My Home Buying Plan</Button>
            </Link>
            <Link href="/sell">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" data-testid="button-sell">Request a Home Value</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
