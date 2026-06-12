import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { Calculator, DollarSign } from "lucide-react";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

function calcMonthly(principal: number, annualRate: number, termYears: number) {
  if (principal <= 0 || annualRate <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("500000");
  const [downPayment, setDownPayment] = useState("100000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [calculated, setCalculated] = useState(false);

  const price = parseFloat(homePrice.replace(/,/g, "")) || 0;
  const down = parseFloat(downPayment.replace(/,/g, "")) || 0;
  const rate = parseFloat(interestRate) || 0;
  const term = parseInt(loanTerm) || 30;

  const principal = Math.max(0, price - down);
  const monthly = calcMonthly(principal, rate, term);
  const totalPayment = monthly * term * 12;
  const totalInterest = totalPayment - principal;
  const downPct = price > 0 ? ((down / price) * 100).toFixed(1) : "0";

  function handleCalculate() {
    setCalculated(true);
  }

  return (
    <Layout>
      <section className="bg-primary pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Planning Tool</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Mortgage Calculator</h1>
          <p className="text-white/70 max-w-xl">Estimate your monthly mortgage payment to help plan your home purchase. Adjust the inputs below to explore different scenarios.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Inputs */}
            <Card className="p-8 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Calculator size={20} className="text-accent" />
                </div>
                <h2 className="text-xl font-serif font-bold text-primary">Calculate Your Payment</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="homePrice" className="text-sm font-medium mb-1.5 block">Home Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="homePrice"
                      value={homePrice}
                      onChange={e => setHomePrice(e.target.value)}
                      className="pl-7"
                      placeholder="500,000"
                      data-testid="input-homePrice"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="downPayment" className="text-sm font-medium mb-1.5 block">Down Payment</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="downPayment"
                      value={downPayment}
                      onChange={e => setDownPayment(e.target.value)}
                      className="pl-7"
                      placeholder="100,000"
                      data-testid="input-downPayment"
                    />
                  </div>
                  {price > 0 && down > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">{downPct}% down ({formatCurrency(down)})</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="interestRate" className="text-sm font-medium mb-1.5 block">Interest Rate (%)</Label>
                  <div className="relative">
                    <Input
                      id="interestRate"
                      value={interestRate}
                      onChange={e => setInterestRate(e.target.value)}
                      placeholder="6.5"
                      data-testid="input-interestRate"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="loanTerm" className="text-sm font-medium mb-1.5 block">Loan Term</Label>
                  <Select value={loanTerm} onValueChange={setLoanTerm}>
                    <SelectTrigger id="loanTerm" data-testid="select-loanTerm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Years</SelectItem>
                      <SelectItem value="20">20 Years</SelectItem>
                      <SelectItem value="15">15 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" size="lg" onClick={handleCalculate} data-testid="button-calculate">
                  Calculate Payment
                </Button>
              </div>
            </Card>

            {/* Results */}
            <div className="space-y-5">
              {(calculated || monthly > 0) ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="p-8 border-2 border-accent/30 bg-accent/5">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-1">Estimated Monthly Payment</p>
                    <p className="text-5xl font-serif font-bold text-accent mb-1" data-testid="result-monthly">
                      {formatCurrency(monthly)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">/month (principal + interest)</p>

                    <div className="space-y-3 border-t border-border pt-5">
                      {[
                        { label: "Purchase Price", value: formatCurrency(price) },
                        { label: "Down Payment", value: `${formatCurrency(down)} (${downPct}%)` },
                        { label: "Loan Amount", value: formatCurrency(principal) },
                        { label: "Interest Rate", value: `${rate}%` },
                        { label: "Loan Term", value: `${term} Years` },
                        { label: "Total Interest Paid", value: formatCurrency(totalInterest) },
                        { label: "Total Cost", value: formatCurrency(totalPayment + down) },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{row.label}</span>
                          <span className="font-medium text-foreground" data-testid={`result-${row.label.toLowerCase().replace(/\s+/g, '-')}`}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5 border border-border bg-white">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      <strong className="not-italic text-foreground">Disclaimer:</strong> This calculator provides estimates only. Actual payment, rate, and loan terms may vary based on your creditworthiness, down payment, property type, and other factors. Contact a licensed professional for personalized guidance.
                    </p>
                  </Card>

                  <div className="flex gap-3">
                    <Link href="/home-buying-plan" className="flex-1">
                      <Button className="w-full" variant="outline" data-testid="button-start-plan-calc">Start My Buying Plan</Button>
                    </Link>
                    <Link href="/contact" className="flex-1">
                      <Button className="w-full" data-testid="button-contact-calc">Talk to an Expert</Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <Card className="p-10 border border-border text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign size={28} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Enter your details and click "Calculate Payment" to see your estimated monthly payment.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
