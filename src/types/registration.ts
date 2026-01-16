// ============= Registration Domain Types =============

export interface Account {
  userId: string;
  email: string;
  name: string;
  status: 'pending' | 'notified' | 'confirmed' | 'deactivated';
  confirmationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Registration Events
export type RegistrationEventType = 
  | 'ACCOUNT_CREATED'
  | 'CUSTOMER_NOTIFIED'
  | 'ACCOUNT_CONFIRMED'
  | 'ACCOUNT_UPDATED'
  | 'ACCOUNT_DEACTIVATED';

export interface RegistrationEvent {
  type: RegistrationEventType;
  userId: string;
  timestamp: Date;
  data: Partial<Account> & { token?: string };
}

// Commands
export type CreateAccountCommand = {
  email: string;
  name: string;
};

export type NotifyCustomerCommand = {
  userId: string;
  email: string;
  name: string;
};

export type ConfirmAccountCommand = {
  userId: string;
  email: string;
  token: string;
};

export type UpdateAccountCommand = {
  userId: string;
  email: string;
  name: string;
};

export type DeactivateAccountCommand = {
  userId: string;
};

// Read Models
export interface ConfirmationMailToSend {
  userId: string;
  email: string;
  name: string;
  notificationSent: boolean;
}

export interface EmailToConfirm {
  userId: string;
  email: string;
  token: string;
}

export interface ConfirmedAccount {
  userId: string;
  email: string;
  name: string;
}
