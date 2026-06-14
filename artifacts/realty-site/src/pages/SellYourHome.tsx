import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { useSubmitSellerLead } from "@workspace/api-client-react";
import { CheckCircle, Camera, TrendingUp, Handshake, FileCheck, MapPin } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  propertyAddress: z.string().min(5, "Property address is required"),
  timeline: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

export default function SellYourHome() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitLead = useSubmitSellerLead();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", phone: "", email: "", propertyAddress: "", timeline: "", message: "" }
  });

  function onSubmit(values: FormValues) {
    setSubmitError(null);
    submitLead.mutate({ data: values }, {
      onSuccess: () => setSubmitted(true),
      onError: () => setSubmitError("Something went wrong. Please try again or call (626) 391-1342 directly."),
    });
  }

  return (
    <Layout>
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Seller Services</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Thinking About Selling Your Home?</h1>
          <p className="text-white/70 max-w-xl">Expert representation, strategic marketing, and unwavering advocacy — so you sell confidently and for the best possible price.</p>
        </div>
      </section>

      {/* Why Sell With Me */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-serif font-bold text-primary">What You Get When You List With Me</h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: <MapPin className="w-6 h-6 text-accent" />, title: "Local Market Knowledge", desc: "Deep insight into neighborhood pricing, buyer demand, and timing to position your home for maximum value." },
              { icon: <Camera className="w-6 h-6 text-accent" />, title: "Professional Marketing", desc: "Stunning photography, compelling listing descriptions, and targeted digital advertising to reach qualified buyers." },
              { icon: <Handshake className="w-6 h-6 text-accent" />, title: "Negotiation Support", desc: "Firm, strategic negotiation on your behalf — protecting your bottom line at every stage." },
              { icon: <FileCheck className="w-6 h-6 text-accent" />, title: "Smooth Closing", desc: "Meticulous coordination of inspections, appraisals, and paperwork to keep your closing on track." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="p-6 h-full border border-border hover:shadow-md hover:border-accent/40 transition-all" data-testid={`card-why-${i}`}>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Free Consultation</p>
            <h2 className="text-3xl font-serif font-bold text-primary">Request My Home Value</h2>
            <p className="text-muted-foreground mt-3">Fill out the form below and I'll be in touch to discuss your home's value and your selling goals.</p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-10 text-center border border-border shadow-sm"
              data-testid="success-message"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Request Received</h3>
              <p className="text-muted-foreground">Thank you. We will be in touch to discuss your home value and next steps.</p>
            </motion.div>
          ) : (
            <Card className="p-8 border border-border shadow-sm bg-white">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="form-seller">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl><Input placeholder="Jane Smith" data-testid="input-fullName" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl><Input placeholder="(555) 123-4567" data-testid="input-phone" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl><Input type="email" placeholder="jane@example.com" data-testid="input-email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="propertyAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Address *</FormLabel>
                      <FormControl><Input placeholder="1234 Main Street, Austin, TX 78701" data-testid="input-propertyAddress" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="timeline" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline to Sell</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-timeline">
                            <SelectValue placeholder="Select a timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="asap">As soon as possible</SelectItem>
                          <SelectItem value="1-3months">1-3 months</SelectItem>
                          <SelectItem value="3-6months">3-6 months</SelectItem>
                          <SelectItem value="6-12months">6-12 months</SelectItem>
                          <SelectItem value="exploring">Just exploring</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (optional)</FormLabel>
                      <FormControl><Textarea placeholder="Tell us anything else about your property or situation..." rows={4} data-testid="textarea-message" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {submitError && (
                    <p className="text-red-500 text-sm text-center" data-testid="sell-error">{submitError}</p>
                  )}
                  <Button type="submit" size="lg" className="w-full" disabled={submitLead.isPending} data-testid="button-submit-seller">
                    {submitLead.isPending ? "Sending..." : "Request My Home Value"}
                  </Button>
                </form>
              </Form>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
}
