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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Layout } from "@/components/layout/Layout";
import { useSubmitBuyerPlanLead } from "@workspace/api-client-react";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  purpose: z.enum(["buying", "refinancing"]),
  priceRange: z.string().optional(),
  downPaymentRange: z.string().optional(),
  creditScoreRange: z.string().optional(),
  timeline: z.string().optional(),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function HomeBuyingPlan() {
  const [submitted, setSubmitted] = useState(false);
  const submitLead = useSubmitBuyerPlanLead();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "", phone: "", email: "", purpose: "buying",
      priceRange: "", downPaymentRange: "", creditScoreRange: "", timeline: "", comments: ""
    }
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
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Get Started</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Start My Home Buying Plan</h1>
          <p className="text-white/70 max-w-xl">Tell me about your goals and I'll be in touch to map out a personalized path to homeownership — or refinancing.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-12 text-center border border-border shadow-sm"
              data-testid="success-message"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-3">Your Plan Has Been Received</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Thank you. Your information has been received. A professional will contact you soon to discuss your goals and next steps.
              </p>
              <Card className="p-4 border border-border text-left">
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  This is not a loan application or approval. Information submitted is used so a licensed professional can contact you to discuss possible options.
                </p>
              </Card>
            </motion.div>
          ) : (
            <Card className="p-8 border border-border shadow-sm bg-white">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-buyer-plan">
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

                  <FormField control={form.control} name="purpose" render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am interested in *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6 mt-1" data-testid="radio-purpose">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="buying" id="buying" data-testid="radio-buying" />
                            <label htmlFor="buying" className="text-sm font-medium cursor-pointer">Buying a Home</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="refinancing" id="refinancing" data-testid="radio-refinancing" />
                            <label htmlFor="refinancing" className="text-sm font-medium cursor-pointer">Refinancing</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField control={form.control} name="priceRange" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Price Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-priceRange">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under300">Under $300K</SelectItem>
                            <SelectItem value="300-500">$300K – $500K</SelectItem>
                            <SelectItem value="500-750">$500K – $750K</SelectItem>
                            <SelectItem value="750-1m">$750K – $1M</SelectItem>
                            <SelectItem value="over1m">Over $1M</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="downPaymentRange" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Down Payment</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-downPayment">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="less5">Less than 5%</SelectItem>
                            <SelectItem value="5-10">5% – 10%</SelectItem>
                            <SelectItem value="10-20">10% – 20%</SelectItem>
                            <SelectItem value="20plus">20% or more</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField control={form.control} name="creditScoreRange" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Credit Score</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-creditScore">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="below580">Below 580</SelectItem>
                            <SelectItem value="580-619">580 – 619</SelectItem>
                            <SelectItem value="620-679">620 – 679</SelectItem>
                            <SelectItem value="680-719">680 – 719</SelectItem>
                            <SelectItem value="720-759">720 – 759</SelectItem>
                            <SelectItem value="760plus">760 or above</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="timeline" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Purchase Timeline</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-timeline">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="asap">As soon as possible</SelectItem>
                            <SelectItem value="1-3months">1 – 3 months</SelectItem>
                            <SelectItem value="3-6months">3 – 6 months</SelectItem>
                            <SelectItem value="6-12months">6 – 12 months</SelectItem>
                            <SelectItem value="exploring">Just exploring</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="comments" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Comments</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Anything else you'd like us to know about your situation or goals..." rows={4} data-testid="textarea-comments" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="pt-2">
                    <Button type="submit" size="lg" className="w-full" disabled={submitLead.isPending} data-testid="button-submit-plan">
                      {submitLead.isPending ? "Sending..." : "Start My Home Buying Plan"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
                      This is not a loan application or approval. Information submitted is used so a licensed professional can contact you to discuss possible options.
                    </p>
                  </div>
                </form>
              </Form>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
}
