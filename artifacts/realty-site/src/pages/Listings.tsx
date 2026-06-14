import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useGetListings } from "@workspace/api-client-react";
import { MapPin, Bed, Bath, Square } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Listings() {
  const { data: listings, isLoading } = useGetListings();

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Available Today</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Current Listings</h1>
          <p className="text-white/70 max-w-lg">Browse our hand-selected properties currently available for purchase. Contact us to schedule a private showing.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-secondary animate-pulse rounded-lg" />
              ))}
            </div>
          ) : Array.isArray(listings) && listings.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {listings.map((listing) => (
                <motion.div key={listing.id} variants={fadeUp}>
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border" data-testid={`card-listing-${listing.id}`}>
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={listing.imageUrl}
                        alt={listing.address}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-accent text-primary font-bold text-sm px-3 py-1">{formatPrice(listing.price)}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-primary text-xl mb-1">{listing.address}</h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-1 mb-4">
                        <MapPin size={13} /> {listing.city}, {listing.state} {listing.zip}
                      </p>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{listing.shortDescription}</p>
                      <div className="flex items-center gap-5 text-sm text-muted-foreground border-t border-border pt-4 mb-4">
                        <span className="flex items-center gap-1.5"><Bed size={15} className="text-accent" /> <strong className="text-foreground">{listing.beds}</strong> Beds</span>
                        <span className="flex items-center gap-1.5"><Bath size={15} className="text-accent" /> <strong className="text-foreground">{listing.baths}</strong> Baths</span>
                        <span className="flex items-center gap-1.5"><Square size={15} className="text-accent" /> <strong className="text-foreground">{listing.sqft.toLocaleString()}</strong> Sq Ft</span>
                      </div>
                      <Link href={`/listings/${listing.id}`}>
                        <Button className="w-full" data-testid={`button-view-listing-${listing.id}`}>View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">No active listings at this time. Please check back soon or contact us directly.</p>
              <Link href="/contact">
                <Button className="mt-6">Contact Us</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
