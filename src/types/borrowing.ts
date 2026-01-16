// ============= Borrowing Domain Types =============

// Mock Users
export interface User {
  userId: string;
  email: string;
  name: string;
}

// Book (derived from published CatalogEntry)
export interface Book {
  bookId: string; // maps to itemId
  title: string;
  description: string;
}

// Reservation Aggregate
export interface Reservation {
  reservationId: string;
  bookId: string;
  userId: string;
  status: 'active' | 'picked_up' | 'expired' | 'lost' | 'damaged';
  borrowDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Borrowing Events
export type BorrowingEventType = 
  | 'BOOK_RESERVED'
  | 'RESERVATION_EXPIRED'
  | 'RESERVATION_PICKED_UP'
  | 'BOOK_MARKED_LOST'
  | 'BOOK_MARKED_DAMAGED'
  | 'RESERVATION_NOTIFICATION_SENT';

export interface BorrowingEvent {
  type: BorrowingEventType;
  reservationId: string;
  timestamp: Date;
  data: Partial<Reservation>;
}

// Commands
export type ReserveBookCommand = {
  bookId: string;
  userId: string;
};

export type ExpireReservationCommand = {
  reservationId: string;
};

export type MarkPickedUpCommand = {
  reservationId: string;
  userId: string;
};

export type MarkLostCommand = {
  reservationId: string;
  bookId: string;
  userId: string;
};

export type MarkDamagedCommand = {
  reservationId: string;
  bookId: string;
  userId: string;
};

// Read Models
export interface BooksForRent {
  bookId: string;
  title: string;
  description: string;
  isAvailable: boolean;
}

export interface ActiveReservation {
  reservationId: string;
  bookId: string;
  userId: string;
  createdAt: Date;
}

export interface CustomerBorrowing {
  reservationId: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
}

export interface ReservationForExpiration {
  reservationId: string;
  bookId: string;
  userId: string;
  borrowDate: Date;
}
