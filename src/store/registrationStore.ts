import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Account, 
  RegistrationEvent, 
  ConfirmationMailToSend,
  EmailToConfirm,
  ConfirmedAccount
} from '@/types/registration';

interface RegistrationState {
  accounts: Account[];
  events: RegistrationEvent[];
  currentUserId: string | null;
  
  // Commands
  createAccount: (email: string, name: string) => { success: boolean; error?: string; account?: Account };
  notifyCustomer: (userId: string) => void;
  confirmAccount: (userId: string, token: string) => { success: boolean; error?: string };
  updateAccount: (userId: string, email: string, name: string) => void;
  deactivateAccount: (userId: string) => void;
  
  // Queries
  getAccount: (userId: string) => Account | undefined;
  getAccountByEmail: (email: string) => Account | undefined;
  getConfirmationMailsToSend: () => ConfirmationMailToSend[];
  getEmailsToConfirm: () => EmailToConfirm[];
  getConfirmedAccounts: () => ConfirmedAccount[];
  getCurrentAccount: () => Account | null;
  
  // Auth simulation
  login: (email: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoggedIn: () => boolean;
}

const generateId = () => crypto.randomUUID();
const generateToken = () => Math.random().toString(36).substr(2, 8).toUpperCase();

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      accounts: [],
      events: [],
      currentUserId: null,

      createAccount: (email, name) => {
        // Check if email already exists
        const existing = get().accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          return { success: false, error: 'An account with this email already exists' };
        }

        const newAccount: Account = {
          userId: generateId(),
          email,
          name,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const event: RegistrationEvent = {
          type: 'ACCOUNT_CREATED',
          userId: newAccount.userId,
          timestamp: new Date(),
          data: newAccount,
        };

        set((state) => ({
          accounts: [...state.accounts, newAccount],
          events: [...state.events, event],
        }));

        return { success: true, account: newAccount };
      },

      notifyCustomer: (userId) => {
        const token = generateToken();
        
        const event: RegistrationEvent = {
          type: 'CUSTOMER_NOTIFIED',
          userId,
          timestamp: new Date(),
          data: { status: 'notified', confirmationToken: token, token },
        };

        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.userId === userId
              ? { ...account, status: 'notified', confirmationToken: token, updatedAt: new Date() }
              : account
          ),
          events: [...state.events, event],
        }));
      },

      confirmAccount: (userId, token) => {
        const account = get().accounts.find(a => a.userId === userId);
        
        if (!account) {
          return { success: false, error: 'Account not found' };
        }
        
        if (account.confirmationToken !== token) {
          return { success: false, error: 'Invalid confirmation token' };
        }

        const event: RegistrationEvent = {
          type: 'ACCOUNT_CONFIRMED',
          userId,
          timestamp: new Date(),
          data: { status: 'confirmed' },
        };

        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.userId === userId
              ? { ...account, status: 'confirmed', updatedAt: new Date() }
              : account
          ),
          events: [...state.events, event],
          currentUserId: userId, // Auto-login on confirmation
        }));

        return { success: true };
      },

      updateAccount: (userId, email, name) => {
        const event: RegistrationEvent = {
          type: 'ACCOUNT_UPDATED',
          userId,
          timestamp: new Date(),
          data: { email, name },
        };

        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.userId === userId
              ? { ...account, email, name, updatedAt: new Date() }
              : account
          ),
          events: [...state.events, event],
        }));
      },

      deactivateAccount: (userId) => {
        const event: RegistrationEvent = {
          type: 'ACCOUNT_DEACTIVATED',
          userId,
          timestamp: new Date(),
          data: { status: 'deactivated' },
        };

        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.userId === userId
              ? { ...account, status: 'deactivated', updatedAt: new Date() }
              : account
          ),
          events: [...state.events, event],
          currentUserId: state.currentUserId === userId ? null : state.currentUserId,
        }));
      },

      getAccount: (userId) => {
        return get().accounts.find((account) => account.userId === userId);
      },

      getAccountByEmail: (email) => {
        return get().accounts.find((account) => account.email.toLowerCase() === email.toLowerCase());
      },

      getConfirmationMailsToSend: () => {
        return get().accounts
          .filter((a) => a.status === 'pending')
          .map((a) => ({
            userId: a.userId,
            email: a.email,
            name: a.name,
            notificationSent: false,
          }));
      },

      getEmailsToConfirm: () => {
        return get().accounts
          .filter((a) => a.status === 'notified' && a.confirmationToken)
          .map((a) => ({
            userId: a.userId,
            email: a.email,
            token: a.confirmationToken!,
          }));
      },

      getConfirmedAccounts: () => {
        return get().accounts
          .filter((a) => a.status === 'confirmed')
          .map((a) => ({
            userId: a.userId,
            email: a.email,
            name: a.name,
          }));
      },

      getCurrentAccount: () => {
        const userId = get().currentUserId;
        if (!userId) return null;
        return get().accounts.find((a) => a.userId === userId) || null;
      },

      login: (email) => {
        const account = get().accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase() && a.status === 'confirmed'
        );
        
        if (!account) {
          return { success: false, error: 'No confirmed account found with this email' };
        }
        
        set({ currentUserId: account.userId });
        return { success: true };
      },

      logout: () => {
        set({ currentUserId: null });
      },

      isLoggedIn: () => {
        return get().currentUserId !== null;
      },
    }),
    {
      name: 'registration-storage',
    }
  )
);
