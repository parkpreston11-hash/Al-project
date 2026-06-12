import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useGetListings, useGetSoldListings } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Bed, Bath, Square, ArrowRight, ShieldCheck,
  CheckCircle2, TrendingUp, Star, Home as HomeIcon,
  Calculator, FileText, Key, DollarSign, ClipboardList
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

export default function Home() {
  const { data: listings } = useGetListings();
  const { data: soldListings } = useGetSoldListings();

  const featuredListings = listings?.slice(0, 3) || [];
  const recentSold = soldListings?.slice(0, 3) || [];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[640px] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Luxury home"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="inline-block px-3 py-1 mb-6 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
              <span className="text-white text-xs font-semibold tracking-widest uppercase">Premium Real Estate & Lending</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6 text-balance">
              Buy, Sell, and Finance Your Home With <span className="text-accent italic">Confidence</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              Work with one trusted professional for real estate guidance and home financing support. Streamlined, personal, and built around you.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link href="/listings">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold border-0" data-testid="button-view-homes">
                  View Homes
                </Button>
              </Link>
              <Link href="/home-buying-plan">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/40 hover:bg-white hover:text-primary backdrop-blur-sm" data-testid="button-buying-plan-hero">
                  Start My Home Buying Plan
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="ghost" className="text-white hover:bg-transparent hover:text-accent border-0 p-0 ml-1 group" data-testid="button-contact-hero">
                  Contact Me <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-accent/10 border-y border-accent/20 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "150+", label: "Homes Sold" },
              { value: "$85M+", label: "Volume Closed" },
              { value: "12+", label: "Years Experience" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <div key={i} data-testid={`stat-${i}`}>
                <p className="text-3xl font-serif font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <motion.p variants={fadeInUp} className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Available Properties</motion.p>
              <motion.h2 variants={fadeInUp} className="text-4xl font-serif font-bold text-primary">Featured Listings</motion.h2>
            </div>
            <motion.div variants={fadeInUp}>
              <Link href="/listings">
                <Button variant="outline" className="group" data-testid="button-view-all-listings">
                  View All Properties <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {featuredListings.length === 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-secondary animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {featuredListings.map((listing) => (
                <motion.div key={listing.id} variants={fadeInUp}>
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border" data-testid={`card-listing-${listing.id}`}>
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={listing.imageUrl}
                        alt={listing.address}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-accent text-primary font-semibold">{formatPrice(listing.price)}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-primary text-lg mb-1 leading-snug">{listing.address}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{listing.city}, {listing.state} {listing.zip}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
                        <span className="flex items-center gap-1"><Bed size={14} /> {listing.beds} bd</span>
                        <span className="flex items-center gap-1"><Bath size={14} /> {listing.baths} ba</span>
                        <span className="flex items-center gap-1"><Square size={14} /> {listing.sqft.toLocaleString()} sf</span>
                      </div>
                      <Link href={`/listings/${listing.id}`}>
                        <Button className="w-full mt-4" variant="outline" data-testid={`button-view-listing-${listing.id}`}>View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Recently Sold */}
      {recentSold.length > 0 && (
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Proven Results</p>
                <h2 className="text-4xl font-serif font-bold text-primary">Recently Sold</h2>
              </div>
              <Link href="/sold">
                <Button variant="outline" className="group" data-testid="button-view-all-sold">
                  View All Sales <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {recentSold.map((listing) => (
                <motion.div key={listing.id} variants={fadeInUp}>
                  <Card className="overflow-hidden border border-border" data-testid={`card-sold-${listing.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img src={listing.imageUrl} alt={listing.address} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-primary/40" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-white font-semibold">SOLD</Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-semibold text-sm">{listing.address}</p>
                        <p className="text-accent font-bold">{formatPrice(listing.price)}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Loan Programs */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Financing Solutions</p>
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Loan Programs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From first-time buyer programs to jumbo financing, I help match you with options that fit your goals.</p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { name: "FHA Loans", desc: "Low down payment options for first-time buyers." },
              { name: "Conventional", desc: "Flexible terms for qualified borrowers." },
              { name: "VA Loans", desc: "Exclusive benefits for veterans and service members." },
              { name: "Jumbo Loans", desc: "Financing for luxury and high-value properties." },
              { name: "Refinance", desc: "Lower your rate or access home equity." },
              { name: "Investment", desc: "Financing strategies for rental properties." },
            ].map((program, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="p-6 h-full border border-border hover:border-accent/50 hover:shadow-md transition-all" data-testid={`card-loan-${i}`}>
                  <div className="w-10 h-10 bg-accent/10 rounded-md flex items-center justify-center mb-4">
                    <DollarSign size={20} className="text-accent" />
                  </div>
                  <h3 className="font-bold text-primary text-lg mb-2">{program.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{program.desc}</p>
                  <Link href="/loans">
                    <Button variant="outline" size="sm" className="w-full">Learn More</Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">The Advantage</p>
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Why Work With Me</h2>
            <p className="text-white/70 max-w-xl mx-auto">Most buyers juggle a realtor and a lender. I do both—streamlining communication, reducing delays, and advocating for your best interests at every step.</p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: <ShieldCheck className="w-7 h-7 text-accent" />, title: "One Point of Contact", desc: "From first showing to final closing, I manage it all. No dropped balls, no miscommunication between teams." },
              { icon: <TrendingUp className="w-7 h-7 text-accent" />, title: "Expert Negotiation", desc: "Strategic representation that protects your interests whether you're buying at the right price or selling for top dollar." },
              { icon: <CheckCircle2 className="w-7 h-7 text-accent" />, title: "Integrated Financing", desc: "Access to diverse loan programs with personalized guidance on which options may best fit your situation." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/5 rounded-lg p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Home Buying Roadmap */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Your Home Buying Roadmap</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A clear, guided path from first conversation to the keys in your hand.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            {[
              { step: "01", title: "Initial Consultation", desc: "We discuss your goals, timeline, budget, and what makes your ideal home. No pressure — just an honest conversation." },
              { step: "02", title: "Financing Review", desc: "We review your financial situation and identify loan programs that may fit your needs before you start shopping." },
              { step: "03", title: "Home Search", desc: "With your criteria in hand, we search the market strategically — including off-market and coming-soon properties." },
              { step: "04", title: "Offer & Negotiation", desc: "When you find the one, I craft a competitive offer and negotiate firmly on your behalf." },
              { step: "05", title: "Closing", desc: "I coordinate inspections, appraisals, and financing milestones to ensure a smooth path to closing day." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-6 mb-8 group"
                data-testid={`roadmap-step-${i}`}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-colors">
                  <span className="text-accent group-hover:text-white font-serif font-bold text-lg transition-colors">{item.step}</span>
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-primary text-lg mb-1">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Client Stories</p>
            <h2 className="text-4xl font-serif font-bold text-primary">What Clients Say</h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                quote: "Al, was the person who sold me my current home and 8 years later Al was there to help me do a cash out refinance! Al is very good at what he does and will work his behind off to get the job done. He is the real deal! Thanks Al.",
                name: "Verified Client",
                location: "Home Purchase & Cash-Out Refinance",
              },
              {
                quote: "Thank you Al for all your hard work, thanks to you and Blanca Quinones we were able to buy our first house. You didn't give up even when I was giving up. I remember your exact words \"we will make it happen\" and it happened. God put you guys in our paths — less than 1½ months we bought our first house. I will recommend you guys 100%. May God bless you.",
                name: "First-Time Homebuyer",
                location: "Bought Their First Home",
              },
              {
                quote: "Knowing Al for over 30 years has been an incredible privilege. When the time came to navigate inheriting our late parents' home and trust, Al was an unwavering source of support. His compassion, expertise, and exceptional communication made the entire process seamless. No question went unanswered, no concern was ever overlooked. Beyond his remarkable service, Al has fostered a lasting friendship we deeply cherish. We wholeheartedly recommend Al for all your real estate needs.",
                name: "Family Estate Client",
                location: "Estate & Trust Transaction",
              },
            ].map((testimonial, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="p-8 h-full border border-border bg-white" data-testid={`testimonial-${i}`}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} className="text-accent fill-accent" />)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-accent/10 border-t border-accent/20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Ready to Begin?</p>
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Let's Find Your Path Forward</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10">Whether you're buying, selling, or exploring your financing options — the first step is a simple conversation.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/home-buying-plan">
                <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-start-plan-cta">Start My Home Buying Plan</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" data-testid="button-contact-cta">Contact Me</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
