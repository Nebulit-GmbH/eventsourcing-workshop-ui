import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateEntry from "./pages/CreateEntry";
import EntryDetails from "./pages/EntryDetails";
import EditEntry from "./pages/EditEntry";
import Publishing from "./pages/Publishing";
import BooksForRent from "./pages/BooksForRent";
import Reservations from "./pages/Reservations";
import ActiveReservations from "./pages/ActiveReservations";
import CustomerBorrowings from "./pages/CustomerBorrowings";
import Auth from "./pages/Auth";
import ConfirmAccount from "./pages/ConfirmAccount";
import Account from "./pages/Account";
import ConfirmedAccounts from "./pages/ConfirmedAccounts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Catalog Context */}
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<CreateEntry />} />
          <Route path="/entry/:id" element={<EntryDetails />} />
          <Route path="/entry/:id/edit" element={<EditEntry />} />
          <Route path="/publish" element={<Publishing />} />
          
          {/* Borrowing Context */}
          <Route path="/books" element={<BooksForRent />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/active" element={<ActiveReservations />} />
          <Route path="/borrowings" element={<CustomerBorrowings />} />
          
          {/* Registration Context */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/confirm/:userId" element={<ConfirmAccount />} />
          <Route path="/account" element={<Account />} />
          <Route path="/accounts" element={<ConfirmedAccounts />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
