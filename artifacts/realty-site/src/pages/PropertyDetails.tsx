import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { agentSchema, buildListingSchema } from "@/lib/schemas";
import { useGetListingById, getGetListingByIdQueryKey } from "@workspace/api-client-react";
import { Bed, Bath, Square, MapPin, CheckCircle, Phone, ChevronLeft, ChevronRight, X } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

function calcMonthly(price: number, downPct = 0.2, rate = 6.5, termYears = 30) {
  const principal = price * (1 - downPct);
  const r = rate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function PropertyDetails() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0", 10);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { data: listing, isLoading } = useGetListingById(id, {
    query: { enabled: !!id, queryKey: getGetListingByIdQueryKey(id) }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-16 container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-secondary rounded-lg" />
            <div className="h-8 bg-secondary rounded w-1/2" />
            <div className="h-4 bg-secondary rounded w-1/3" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="pt-40 pb-16 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Listing Not Found</h1>
          <Link href="/listings"><Button>Back to Listings</Button></Link>
        </div>
      </Layout>
    );
  }

  const images = listing.images.length > 0 ? listing.images : [listing.imageUrl];
  const monthly = calcMonthly(listing.price);

  return (
    <Layout>
      <SEO
        title={`${listing.address}, ${listing.city} ${listing.state} | Go Big Al Williams`}
        description={`${listing.status === "active" ? "For Sale" : "Recently Sold"}: ${listing.address}, ${listing.city}, ${listing.state} ${listing.zip} — ${listing.beds} bed, ${listing.baths} bath, ${listing.sqft.toLocaleString()} sq ft. Listed at $${listing.price.toLocaleString()}. Contact Al Williams at (626) 391-1342.`}
        canonical={`/listings/${listing.id}`}
        ogImage={listing.imageUrl}
        ogType="article"
        structuredData={[agentSchema, buildListingSchema({
          id: listing.id,
          address: listing.address,
          city: listing.city,
          state: listing.state,
          zip: listing.zip,
          price: listing.price,
          beds: listing.beds,
          baths: listing.baths,
          sqft: listing.sqft,
          description: listing.description || `${listing.beds} bed, ${listing.baths} bath home in ${listing.city}, ${listing.state}`,
          imageUrl: listing.imageUrl,
          status: listing.status,
        })]}
      />
      <div className="pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/listings" className="hover:text-primary transition-colors">Listings</Link>
            <span>/</span>
            <span className="text-foreground">{listing.address}</span>
          </div>

          {/* Image Gallery */}
          <div className="mb-10">
            <div
              className="relative h-[480px] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => setLightboxOpen(true)}
              data-testid="listing-main-image"
            >
              <img
                src={images[activeImage]}
                alt={listing.address}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImage(i => Math.max(0, i - 1)); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImage(i => Math.min(images.length - 1, i + 1)); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                        className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? "border-accent" : "border-transparent"}`}
                    data-testid={`thumbnail-${i}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-accent font-bold text-3xl mb-1" data-testid="listing-price">{formatPrice(listing.price)}</p>
                  <h1 className="text-3xl font-serif font-bold text-primary">{listing.address}</h1>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {listing.city}, {listing.state} {listing.zip}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 py-5 border-y border-border mb-8">
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-9 h-9 bg-accent/10 rounded-md flex items-center justify-center"><Bed size={18} className="text-accent" /></div>
                  <div><p className="font-bold text-lg">{listing.beds}</p><p className="text-xs text-muted-foreground uppercase tracking-wide">Bedrooms</p></div>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-9 h-9 bg-accent/10 rounded-md flex items-center justify-center"><Bath size={18} className="text-accent" /></div>
                  <div><p className="font-bold text-lg">{listing.baths}</p><p className="text-xs text-muted-foreground uppercase tracking-wide">Bathrooms</p></div>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <div className="w-9 h-9 bg-accent/10 rounded-md flex items-center justify-center"><Square size={18} className="text-accent" /></div>
                  <div><p className="font-bold text-lg">{listing.sqft.toLocaleString()}</p><p className="text-xs text-muted-foreground uppercase tracking-wide">Sq. Feet</p></div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-serif font-bold text-primary mb-3">Property Description</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="listing-description">{listing.description}</p>
              </div>

              {listing.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-serif font-bold text-primary mb-4">Features & Amenities</h2>
                  <ul className="grid sm:grid-cols-2 gap-2" data-testid="listing-features">
                    {listing.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                        <CheckCircle size={15} className="text-accent flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Contact Card */}
              <Card className="p-6 border border-border">
                <h3 className="font-bold text-primary text-lg mb-4">Schedule a Showing</h3>
                <p className="text-muted-foreground text-sm mb-5">Interested in this property? Reach out to schedule a private tour at your convenience.</p>
                <Link href="/contact">
                  <Button className="w-full" data-testid="button-schedule-showing">Contact / Schedule Showing</Button>
                </Link>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground justify-center">
                  <Phone size={14} /> (555) 123-4567
                </div>
              </Card>

              {/* Estimated Payment */}
              <Card className="p-6 border border-accent/30 bg-accent/5">
                <h3 className="font-bold text-primary text-lg mb-3">Estimated Monthly Payment</h3>
                <p className="text-3xl font-serif font-bold text-accent mb-1" data-testid="estimated-payment">
                  {formatPrice(monthly)}<span className="text-base font-sans font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-xs text-muted-foreground mb-4">Based on 20% down, 6.5% rate, 30-year fixed</p>
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Purchase price</span><span className="font-medium text-foreground">{formatPrice(listing.price)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Down payment (20%)</span><span className="font-medium text-foreground">{formatPrice(listing.price * 0.2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Loan amount</span><span className="font-medium text-foreground">{formatPrice(listing.price * 0.8)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed italic border-t border-border pt-4">
                  Estimated payment is for educational purposes only and does not represent final loan terms or approval.
                </p>
                <Link href="/calculator">
                  <Button variant="outline" size="sm" className="w-full mt-3">Run Your Own Calculation</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
          data-testid="lightbox"
        >
          <button className="absolute top-4 right-4 text-white hover:text-accent" onClick={() => setLightboxOpen(false)}>
            <X size={28} />
          </button>
          <img
            src={images[activeImage]}
            alt=""
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Layout>
  );
}
