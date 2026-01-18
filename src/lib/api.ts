// API wrapper for the Event Sourcing backend
// Based on OpenAPI specification

const API_BASE_URL = 'http://localhost:8080';

// ============= Payload Types (Commands) =============

export interface CreateCatalogEntryPayload {
  itemId: string;
  title: string;
  author: string;
  description: string;
}

export interface UpdateCatalogEntryPayload {
  itemId: string;
  title: string;
  author: string;
  description: string;
}

export interface ArchiveCatalogEntryPayload {
  itemId: string;
}

export interface PublishItemPayload {
  itemId: string;
}

export interface ExportItemPayload {
  itemId: string;
  title: string;
  author: string;
  description: string;
}

export interface ExportItemArchivedPayload {
  itemId: string;
}

export interface CreateAccountPayload {
  userId: string;
  email: string;
  name: string;
}

export interface UpdateAccountPayload {
  user_id: string;
  email: string;
  name: string;
}

export interface DeactivateAccountPayload {
  user_id: string;
}

export interface ConfirmAccountPayload {
  user_id: string;
  email: string;
  token: string;
}

export interface NotifyCustomerPayload {
  userId: string;
  email: string;
  name: string;
  token: string;
}

export interface ImportUserPayload {
  userId: string;
  email: string;
  name: string;
}

export interface ReserveBookPayload {
  bookId: string;
  userId: string;
  reservationId: string;
}

export interface ExpireReservationPayload {
  reservationId: string;
}

export interface MarkReservationAsPickedUpPayload {
  reservationId: string;
  userId: string;
}

export interface MarkLostPayload {
  userId: string;
  bookId: string;
  reservationId: string;
}

export interface MarkDamagedPayload {
  bookId: string;
  reservationId: string;
  userId: string;
}

export interface SendReservationNotificationPayload {
  email: string;
  name: string;
  userId: string;
  reservationId: string;
}

export interface SendNotificationRequest {
  message: string;
  type?: string;
  payload?: Record<string, unknown>;
}

// ============= Response Types (Read Models) =============

export interface NotificationResponse {
  success: boolean;
  message: string;
}

export interface ConnectionStatus {
  sessionId: string;
  connected: boolean;
  activeConnections: number;
}

// Type aliases for hooks
export type CatalogEntry = { itemId: string; title: string; author?: string; description?: string, createdDate: string };
export type ConfirmedAccount = { user_id: string; email: string; name: string };
export type ConfirmationMailToSend = { userId: string; email: string; name: string; notificationSent: string };
export type EmailToConfirm = { userId: string; email: string; token: string };
export type ActiveReservation = { bookId: string; reservationId: string; userId: string };
export type ReservationDetails = { bookId: string; userId: string };
export type CustomerBorrowing = { reservationId: string; userId: string };
export type BookForRent = { bookId: string; title: string; description: string };

export interface CatalogEntriesReadModel {
  data: Array<{
    itemId: string;
    title: string;
    createdDate: string
  }>;
}

export interface CatalogEntryDetailsReadModel {
  data: {
    itemId: string;
    title: string;
    author: string;
    description: string;
    createdDate: string
  };
}

export interface ItemsToPublishReadModel {
  data: {
    itemId: string;
    archived: boolean;
  };
}

export interface ItemDetailsForPublicationReadModel {
  data: {
    itemId: string;
    title: string;
    author: string;
    description: string;
  };
}

export interface ConfirmedAccountsReadModel {
  data: Array<{
    user_id: string;
    email: string;
    name: string;
  }>;
}

export interface ConfirmationMailsToSendReadModel {
  data: Array<{
    userId: string;
    email: string;
    name: string;
    notificationSent: string;
  }>;
}

export interface EmailsToConfirmReadModel {
  data: {
    userId: string;
    email: string;
    token: string;
  };
}

export interface BooksForRentReadModel {
  data: {
    bookId: string;
    title: string;
    description: string;
  };
}

export interface BookDetailLookupForBorrowingDetailsReadModel {
  data: Array<{
    bookId: string;
    title: string;
    description: string;
  }>;
}

export interface BookDetailLookupForActiveReservationsReadModel {
  data: Array<{
    bookId: string;
    title: string;
    description: string;
  }>;
}

export interface ActiveReservationsReadModel {
  data: Array<{
    bookId: string;
    reservationId: string;
    userId: string;
  }>;
}

export interface ReservationsReadModel {
  data: Array<{
    bookId: string;
    userId: string;
  }>;
}

export interface ReservationsForExpirationReadModel {
  data: {
    bookId: string;
    reservationId: string;
    userId: string;
    borrowDate: string;
  };
}

export interface ReservationLookupForBorrowingDetailsReadModel {
  data: {
    bookId: string;
    reservationId: string;
    userId: string;
  };
}

export interface ReservationNotificationToSendReadModel {
  data: {
    bookId: string;
    userId: string;
    reservationId: string;
  };
}

export interface UserEmailLookupForReservationNotificationReadModel {
  data: {
    userId: string;
    email: string;
    name: string;
  };
}

export interface CustomerBorrowingsReadModel {
  data: Array<{
    reservationId: string;
    userId: string;
  }>;
}

export interface DomainEventMessage {
  sequenceNumber: number;
  type: string;
  aggregateIdentifier: string;
  identifier: string;
  timestamp: string;
  payload: unknown;
  metaData: Record<string, unknown>;
}

// ============= API Error =============

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

// ============= Session Helper =============

const AUTH_STORAGE_KEY = 'auth_session';

function getCurrentUserId(): string | null {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const session = JSON.parse(stored);
      return session?.userId ?? null;
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

// ============= API Client =============

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const userId = getCurrentUserId() ?? 'anonymous';
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': userId,
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {} as T;
}

// ============= Catalog API =============

export const catalogApi = {
  // Commands
  createEntry: (id: string, payload: CreateCatalogEntryPayload) =>
    request<object>(`/createcatalogentry/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateEntry: (id: string, payload: UpdateCatalogEntryPayload) =>
    request<object>(`/updatecatalogentry/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  archiveEntry: (id: string, payload: ArchiveCatalogEntryPayload) =>
    request<object>(`/archivecatalogentry/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  publishItem: (id: string, payload: PublishItemPayload) =>
    request<object>(`/publishitem/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  exportItem: (id: string, payload: ExportItemPayload) =>
    request<object>(`/exportitem/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  exportItemArchived: (id: string, payload: ExportItemArchivedPayload) =>
    request<object>(`/exportitemarchived/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Queries
  getEntries: () =>
    request<CatalogEntriesReadModel>('/catalogentries'),

  getEntryDetails: (id: string) =>
    request<CatalogEntryDetailsReadModel>(`/catalogentrydetails/${id}`),

  getItemsToPublish: (id: string) =>
    request<ItemsToPublishReadModel>(`/itemstopublish/${id}`),

  getItemDetailsForPublication: (id: string) =>
    request<ItemDetailsForPublicationReadModel>(`/itemdetailsforpublication/${id}`),
};

// ============= Account API =============

export const accountApi = {
  // Commands
  createAccount: (id: string, payload: CreateAccountPayload) =>
    request<object>(`/createaccount/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateAccount: (id: string, payload: UpdateAccountPayload) =>
    request<object>(`/updateaccount/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deactivateAccount: (id: string, payload: DeactivateAccountPayload) =>
    request<object>(`/deactivateaccount/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  confirmAccount: (id: string, payload: ConfirmAccountPayload) =>
    request<object>(`/confirmaccount/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  notifyCustomer: (id: string, payload: NotifyCustomerPayload) =>
    request<object>(`/notifycustomer/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  importUser: (id: string, payload: ImportUserPayload) =>
    request<object>(`/importuser/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Queries
  getConfirmedAccounts: () =>
    request<ConfirmedAccountsReadModel>('/confirmedaccounts'),

  getConfirmationMailsToSend: () =>
    request<ConfirmationMailsToSendReadModel>('/confirmationmailstosend'),

  getEmailsToConfirm: (id: string) =>
    request<EmailsToConfirmReadModel>(`/emailstoconfirmtodo/${id}`),
};

// ============= Borrowing API =============

export const borrowingApi = {
  // Commands
  reserveBook: (id: string, payload: ReserveBookPayload) =>
    request<object>(`/reservebook/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  expireReservation: (id: string, payload: ExpireReservationPayload) =>
    request<object>(`/expirereservation/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  markReservationAsPickedUp: (id: string, payload: MarkReservationAsPickedUpPayload) =>
    request<object>(`/markreservationaspickedup/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  markLost: (id: string, payload: MarkLostPayload) =>
    request<object>(`/marklost/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  markDamaged: (id: string, payload: MarkDamagedPayload) =>
    request<object>(`/markdamaged/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  sendReservationNotification: (id: string, payload: SendReservationNotificationPayload) =>
    request<object>(`/sendreservationnotification/${id}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Queries
  getBooksForRent: (id: string) =>
    request<BooksForRentReadModel>(`/booksforrent/${id}`),

  getBookDetailLookupForBorrowingDetails: () =>
    request<BookDetailLookupForBorrowingDetailsReadModel>('/bookdetaillookupforborrowingdetails'),

  getBookDetailLookupForActiveReservations: () =>
    request<BookDetailLookupForActiveReservationsReadModel>('/bookdetaillookupforactivereservations'),

  getActiveReservations: () =>
    request<ActiveReservationsReadModel>('/activereservations'),

  getReservations: () =>
    request<ReservationsReadModel>('/reservations'),

  getReservationsForExpiration: (id: string) =>
    request<ReservationsForExpirationReadModel>(`/reservationsforexpiration/${id}`),

  getReservationLookupForBorrowingDetails: (id: string) =>
    request<ReservationLookupForBorrowingDetailsReadModel>(`/reservationlookupforborrowingdetails/${id}`),

  getReservationNotificationToSend: (id: string) =>
    request<ReservationNotificationToSendReadModel>(`/reservationnotificationtosend/${id}`),

  getUserEmailLookupForReservationNotification: (id: string) =>
    request<UserEmailLookupForReservationNotificationReadModel>(`/useremaillookupforreservationnotification/${id}`),

  getCustomerBorrowings: () =>
    request<CustomerBorrowingsReadModel>('/customerborrowings'),
};

// ============= Notification API =============

export const notificationApi = {
  sendNotification: (sessionId: string, payload: SendNotificationRequest) =>
    request<NotificationResponse>(`/send/${sessionId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  broadcast: (payload: SendNotificationRequest) =>
    request<NotificationResponse>('/broadcast', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getConnectionStatus: (sessionId: string) =>
    request<ConnectionStatus>(`/status/${sessionId}`),

  // SSE subscription is handled separately via EventSource
  getSubscribeUrl: (sessionId: string, timeout?: number) =>
    `${API_BASE_URL}/subscribe/${sessionId}${timeout ? `?timeout=${timeout}` : ''}`,
};

// ============= Combined API Export =============

export const api = {
  catalog: catalogApi,
  account: accountApi,
  borrowing: borrowingApi,
  notification: notificationApi,
};

export default api;
