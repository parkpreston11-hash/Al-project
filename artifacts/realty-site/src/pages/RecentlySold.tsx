import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { useGetSoldListings } from "@workspace/api-client-react";
import { Bed, Bath, Square, MapPin } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function RecentlySold() {
  const { data: listings, isLoading } = useGetSoldListings();

  return (
    <Layout>
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Proven Track Record</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Recently Sold Homes</h1>
          <p className="text-white/70 max-w-xl">A selection of recently closed transactions — each one representing a family's next chapter and our commitment to results.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-80 bg-secondary animate-pulse rounded-lg" />)}
            </div>
          ) : listings && listings.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {listings.map((listing) => (
                <motion.div key={listing.id} variants={fadeUp}>
                  <Card className="overflow-hidden border border-border hover:shadow-lg transition-shadow" data-testid={`card-sold-${listing.id}`}>
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={listing.imageUrl}
                        alt={listing.address}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-white font-bold uppercase tracking-wide">Sold</Badge>
                      </div>
                      {listing.soldDate && (
                        <div className="absolute top-3 right-3">
                          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">{new Date(listing.soldDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <p className="text-accent font-bold text-xl mb-1">{formatPrice(listing.price)}</p>
                      <h3 className="font-semibold text-primary text-lg mb-1">{listing.address}</h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
                        <MapPin size={12} /> {listing.city}, {listing.state}
                      </p>
                      <div className="flex gap-4 text-sm text-muted-foreground border-t border-border pt-3 mb-3">
                        <span className="flex items-center gap-1"><Bed size={13} /> {listing.beds} bd</span>
                        <span className="flex items-center gap-1"><Bath size={13} /> {listing.baths} ba</span>
                        <span className="flex items-center gap-1"><Square size={13} /> {listing.sqft.toLocaleString()} sf</span>
                      </div>
                      {listing.soldDescription && (
                        <p className="text-sm text-muted-foreground italic leading-relaxed">{listing.soldDescription}</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <p className="text-muted-foreground">No sold listings to display yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary/30 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">Ready to Add Your Home to This List?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Let's discuss your home's value and what a strategic marketing approach could mean for your sale.</p>
          <Link href="/sell">
            <Button size="lg" data-testid="button-sell-cta">Request My Home Value</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
