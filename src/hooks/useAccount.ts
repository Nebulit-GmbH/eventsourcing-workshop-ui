import { useState, useEffect, useCallback } from 'react';
import { accountApi, ConfirmedAccount, ConfirmationMailToSend, EmailToConfirm } from '@/lib/api';

// Hook to fetch confirmed accounts
export function useConfirmedAccounts() {
  const [data, setData] = useState<ConfirmedAccount[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await accountApi.getConfirmedAccounts();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch confirmed accounts'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook to fetch confirmation mails to send
export function useConfirmationMailsToSend() {
  const [data, setData] = useState<ConfirmationMailToSend[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await accountApi.getConfirmationMailsToSend();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch confirmation mails'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// Hook to fetch emails to confirm
export function useEmailsToConfirm(userId: string | undefined) {
  const [data, setData] = useState<EmailToConfirm | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await accountApi.getEmailsToConfirm(userId);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch email to confirm'));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      refetch();
    } else {
      setIsLoading(false);
    }
  }, [userId, refetch]);

  return { data, isLoading, error, refetch };
}

// Direct API call functions
export function useAccountActions() {
  const createAccount = async (email: string, name: string) => {
    const userId = crypto.randomUUID();
    await accountApi.createAccount(userId, {
      userId,
      email,
      name,
    });
    return { userId, email, name };
  };

  const notifyCustomer = async (userId: string, email: string, name: string) => {
    const token = crypto.randomUUID().split('-')[0].toUpperCase();
    await accountApi.notifyCustomer(userId, {
      userId,
      email,
      name,
      token,
    });
    return { userId, token };
  };

  const confirmAccount = async (userId: string, email: string, token: string) => {
    await accountApi.confirmAccount(userId, {
      user_id: userId,
      email,
      token,
    });
    return { userId, email };
  };

  const updateAccount = async (userId: string, email: string, name: string) => {
    await accountApi.updateAccount(userId, {
      user_id: userId,
      email,
      name,
    });
    return { userId, email, name };
  };

  const deactivateAccount = async (userId: string) => {
    await accountApi.deactivateAccount(userId, { user_id: userId });
  };

  return {
    createAccount,
    notifyCustomer,
    confirmAccount,
    updateAccount,
    deactivateAccount,
  };
}
