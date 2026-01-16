import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Reservation, 
  BorrowingEvent, 
  User,
  ActiveReservation,
  CustomerBorrowing
} from '@/types/borrowing';
import { useCatalogStore } from './catalogStore';

// Mock users data
const MOCK_USERS: User[] = [
  { userId: 'user-1', email: 'alice@example.com', name: 'Alice Johnson' },
  { userId: 'user-2', email: 'bob@example.com', name: 'Bob Smith' },
  { userId: 'user-3', email: 'carol@example.com', name: 'Carol Williams' },
];

interface BorrowingState {
  reservations: Reservation[];
  events: BorrowingEvent[];
  currentUserId: string;
  
  // Commands
  reserveBook: (bookId: string, userId: string) => Reservation;
  expireReservation: (reservationId: string) => void;
  markPickedUp: (reservationId: string, userId: string) => void;
  markLost: (reservationId: string, bookId: string, userId: string) => void;
  markDamaged: (reservationId: string, bookId: string, userId: string) => void;
  
  // Queries
  getReservation: (reservationId: string) => Reservation | undefined;
  getActiveReservations: () => ActiveReservation[];
  getCustomerBorrowings: (userId: string) => CustomerBorrowing[];
  getReservationsForExpiration: () => Reservation[];
  getBooksForRent: () => { bookId: string; title: string; description: string; isAvailable: boolean }[];
  getAllReservations: () => Reservation[];
  
  // User management
  getUsers: () => User[];
  getCurrentUser: () => User;
  setCurrentUser: (userId: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBorrowingStore = create<BorrowingState>()(
  persist(
    (set, get) => ({
      reservations: [],
      events: [],
      currentUserId: 'user-1',

      reserveBook: (bookId, userId) => {
        const newReservation: Reservation = {
          reservationId: generateId(),
          bookId,
          userId,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const event: BorrowingEvent = {
          type: 'BOOK_RESERVED',
          reservationId: newReservation.reservationId,
          timestamp: new Date(),
          data: newReservation,
        };

        set((state) => ({
          reservations: [...state.reservations, newReservation],
          events: [...state.events, event],
        }));

        return newReservation;
      },

      expireReservation: (reservationId) => {
        const event: BorrowingEvent = {
          type: 'RESERVATION_EXPIRED',
          reservationId,
          timestamp: new Date(),
          data: { status: 'expired' },
        };

        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.reservationId === reservationId
              ? { ...res, status: 'expired', updatedAt: new Date() }
              : res
          ),
          events: [...state.events, event],
        }));
      },

      markPickedUp: (reservationId, userId) => {
        const event: BorrowingEvent = {
          type: 'RESERVATION_PICKED_UP',
          reservationId,
          timestamp: new Date(),
          data: { status: 'picked_up', borrowDate: new Date() },
        };

        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.reservationId === reservationId
              ? { ...res, status: 'picked_up', borrowDate: new Date(), updatedAt: new Date() }
              : res
          ),
          events: [...state.events, event],
        }));
      },

      markLost: (reservationId, bookId, userId) => {
        const event: BorrowingEvent = {
          type: 'BOOK_MARKED_LOST',
          reservationId,
          timestamp: new Date(),
          data: { status: 'lost' },
        };

        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.reservationId === reservationId
              ? { ...res, status: 'lost', updatedAt: new Date() }
              : res
          ),
          events: [...state.events, event],
        }));
      },

      markDamaged: (reservationId, bookId, userId) => {
        const event: BorrowingEvent = {
          type: 'BOOK_MARKED_DAMAGED',
          reservationId,
          timestamp: new Date(),
          data: { status: 'damaged' },
        };

        set((state) => ({
          reservations: state.reservations.map((res) =>
            res.reservationId === reservationId
              ? { ...res, status: 'damaged', updatedAt: new Date() }
              : res
          ),
          events: [...state.events, event],
        }));
      },

      getReservation: (reservationId) => {
        return get().reservations.find((res) => res.reservationId === reservationId);
      },

      getActiveReservations: () => {
        return get().reservations
          .filter((res) => res.status === 'active')
          .map((res) => ({
            reservationId: res.reservationId,
            bookId: res.bookId,
            userId: res.userId,
            createdAt: res.createdAt,
          }));
      },

      getCustomerBorrowings: (userId) => {
        return get().reservations
          .filter((res) => res.userId === userId && res.status === 'picked_up')
          .map((res) => ({
            reservationId: res.reservationId,
            userId: res.userId,
            bookId: res.bookId,
            borrowDate: res.borrowDate || res.createdAt,
          }));
      },

      getReservationsForExpiration: () => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return get().reservations.filter(
          (res) => res.status === 'active' && new Date(res.createdAt) < oneDayAgo
        );
      },

      getBooksForRent: () => {
        const catalogStore = useCatalogStore.getState();
        const publishedEntries = catalogStore.getPublishedEntries();
        const activeReservationBookIds = new Set(
          get().reservations
            .filter((res) => res.status === 'active' || res.status === 'picked_up')
            .map((res) => res.bookId)
        );

        return publishedEntries.map((entry) => ({
          bookId: entry.itemId,
          title: entry.title,
          description: entry.description,
          isAvailable: !activeReservationBookIds.has(entry.itemId),
        }));
      },

      getAllReservations: () => {
        return get().reservations;
      },

      getUsers: () => MOCK_USERS,

      getCurrentUser: () => {
        const userId = get().currentUserId;
        return MOCK_USERS.find((u) => u.userId === userId) || MOCK_USERS[0];
      },

      setCurrentUser: (userId) => {
        set({ currentUserId: userId });
      },
    }),
    {
      name: 'borrowing-storage',
    }
  )
);
