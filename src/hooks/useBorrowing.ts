import { useState, useEffect, useCallback } from 'react';
import { borrowingApi, ActiveReservation, ReservationDetails, CustomerBorrowing, BookForRent } from '@/lib/api';

// Hook to fetch active reservations
export function useActiveReservations() {
  const [data, setData] = useState<ActiveReservation[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await borrowingApi.getActiveReservations();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch active reservations'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook to fetch all reservations
export function useReservations() {
  const [data, setData] = useState<ReservationDetails[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await borrowingApi.getReservations();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reservations'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook to fetch customer borrowings
export function useCustomerBorrowings() {
  const [data, setData] = useState<CustomerBorrowing[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await borrowingApi.getCustomerBorrowings();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch customer borrowings'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook to fetch books for rent
export function useBooksForRent(bookId?: string) {
  const [data, setData] = useState<BookForRent[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      if (bookId) {
        const response = await borrowingApi.getBooksForRent(bookId);
        setData([response.data]);
      } else {
        const response = await borrowingApi.getBookDetailLookupForActiveReservations();
        setData(response.data);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch books for rent'));
    } finally {
      setIsLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Direct API call functions
export function useBorrowingActions() {
  const reserveBook = async (bookId: string, userId: string) => {
    const reservationId = crypto.randomUUID();
    await borrowingApi.reserveBook(reservationId, {
      bookId,
      userId,
      reservationId,
    });
    return { reservationId, bookId, userId };
  };

  const expireReservation = async (reservationId: string) => {
    await borrowingApi.expireReservation(reservationId, { reservationId });
  };

  const markPickedUp = async (reservationId: string, userId: string) => {
    await borrowingApi.markReservationAsPickedUp(reservationId, {
      reservationId,
      userId,
    });
  };

  const markLost = async (reservationId: string, bookId: string, userId: string) => {
    await borrowingApi.markLost(reservationId, {
      reservationId,
      bookId,
      userId,
    });
  };

  const markDamaged = async (reservationId: string, bookId: string, userId: string) => {
    await borrowingApi.markDamaged(reservationId, {
      reservationId,
      bookId,
      userId,
    });
  };

  return {
    reserveBook,
    expireReservation,
    markPickedUp,
    markLost,
    markDamaged,
  };
}
