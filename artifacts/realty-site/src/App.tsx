import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect, Component, type ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Listings from "@/pages/Listings";
import PropertyDetails from "@/pages/PropertyDetails";
import RecentlySold from "@/pages/RecentlySold";
import SellYourHome from "@/pages/SellYourHome";
import LoanOfficer from "@/pages/LoanOfficer";
import MortgageCalculator from "@/pages/MortgageCalculator";
import HomeBuyingPlan from "@/pages/HomeBuyingPlan";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontFamily: "sans-serif", color: "#0f2044", gap: "12px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Something went wrong</h1>
          <p style={{ color: "#666" }}>Please refresh the page to try again.</p>
          <button onClick={() => window.location.reload()} style={{ padding: "8px 20px", background: "#c9a84c", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/listings" component={Listings} />
      <Route path="/listings/:id" component={PropertyDetails} />
      <Route path="/sold" component={RecentlySold} />
      <Route path="/sell" component={SellYourHome} />
      <Route path="/loans" component={LoanOfficer} />
      <Route path="/calculator" component={MortgageCalculator} />
      <Route path="/home-buying-plan" component={HomeBuyingPlan} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
