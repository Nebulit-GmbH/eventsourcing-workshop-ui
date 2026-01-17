import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateEntry from "./pages/catalog/CreateEntry";
import EntryDetails from "./pages/catalog/EntryDetails";
import EditEntry from "./pages/catalog/EditEntry";
import Publishing from "./pages/catalog/Publishing";
import BooksForRent from "./pages/borrowing/BooksForRent";
import Reservations from "./pages/borrowing/Reservations";
import ActiveReservations from "./pages/borrowing/ActiveReservations";
import CustomerBorrowings from "./pages/borrowing/CustomerBorrowings";
import Auth from "./pages/account/Auth";
import ConfirmAccount from "./pages/account/ConfirmAccount";
import Account from "./pages/account/Account";
import ConfirmedAccounts from "./pages/account/ConfirmedAccounts";
import NotFound from "./pages/NotFound";
import { NotificationProvider, useNotificationAll } from "./hooks/useNotification";
import { AuthProvider } from "./hooks/useAuth";
import { toast } from "sonner";

function NotificationToaster() {
  useNotificationAll((event) => {
    console.log('Received notification:', event);
    toast.info('Notification received', {
      description: "",
    });
  });

  return null;
}

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NotificationProvider>
        <NotificationToaster />
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
        </NotificationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
