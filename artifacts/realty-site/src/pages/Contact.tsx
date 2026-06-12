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
import { Layout } from "@/components/layout/Layout";
import { useSubmitContactLead } from "@workspace/api-client-react";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const submitLead = useSubmitContactLead();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", phone: "", email: "", message: "" },
  });

  function onSubmit(values: FormValues) {
    submitLead.mutate({ data: values }, {
      onSuccess: () => setSubmitted(true),
    });
  }

  return (
    <Layout>
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Contact</h1>
          <p className="text-white/70 max-w-xl">Ready to take the next step? Reach out and I'll respond within one business day.</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">Let's Connect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you have a quick question or are ready to start your search, I'm here to help. Reach out by phone, email, or the form — whatever works best for you.
                </p>
              </div>

              {[
                { icon: <Phone size={18} className="text-accent" />, label: "Phone", value: "(555) 123-4567", href: "tel:5551234567" },
                { icon: <Mail size={18} className="text-accent" />, label: "Email", value: "hello@eleanorandco.com", href: "mailto:hello@eleanorandco.com" },
                { icon: <MapPin size={18} className="text-accent" />, label: "Office", value: "123 Luxury Way, Suite 100\nAustin, TX 78701" },
              ].map((item, i) => (
                <Card key={i} className="p-5 border border-border" data-testid={`contact-info-${i}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-primary font-medium hover:text-accent transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-primary font-medium whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="p-5 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">Business Hours</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-8">
                        <span className="text-muted-foreground">Monday – Friday</span>
                        <span className="font-medium text-primary">9am – 6pm</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-muted-foreground">Saturday</span>
                        <span className="font-medium text-primary">10am – 4pm</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-muted-foreground">Sunday</span>
                        <span className="font-medium text-primary">By appointment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Map Placeholder */}
              <div className="h-48 rounded-xl overflow-hidden bg-secondary border border-border flex items-center justify-center" data-testid="map-placeholder">
                <div className="text-center">
                  <MapPin size={28} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">123 Luxury Way, Suite 100</p>
                  <p className="text-xs text-muted-foreground">Austin, TX 78701</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-12 text-center border border-border shadow-sm h-full flex flex-col items-center justify-center"
                  data-testid="success-message"
                >
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Message Received</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. I'll be in touch within one business day.</p>
                </motion.div>
              ) : (
                <Card className="p-8 border border-border shadow-sm bg-white">
                  <h2 className="text-xl font-serif font-bold text-primary mb-6">Send a Message</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="form-contact">
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
                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="How can I help you?" rows={5} data-testid="textarea-message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" size="lg" className="w-full" disabled={submitLead.isPending} data-testid="button-submit-contact">
                        {submitLead.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
