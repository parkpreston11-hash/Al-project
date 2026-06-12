import { Switch, Route, Router as WouterRouter } from "wouter";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
