import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useAccountActions, useEmailsToConfirm, useConfirmedAccounts } from '@/hooks/useAccount';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

export default function ConfirmAccount() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { login } = useAuth();
  const { confirmAccount } = useAccountActions();
  const { data: emailToConfirmData } = useEmailsToConfirm(userId);
  const { data: confirmedAccounts } = useConfirmedAccounts();

  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const isAlreadyConfirmed = confirmedAccounts?.some(a => a.user_id === userId);

  if (!userId) {
    return (
      <Layout>
        <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-destructive">Account Not Found</CardTitle>
              <CardDescription>
                The account you're trying to confirm doesn't exist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/auth')}>
                Back to Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isAlreadyConfirmed) {
    return (
      <Layout>
        <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="font-serif">Already Confirmed</CardTitle>
              <CardDescription>
                Your account is already confirmed. You can now login.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Please enter your confirmation token');
      return;
    }

    setIsConfirming(true);
    try {
      const result = await confirmAccount(userId, emailToConfirmData?.email || '', token.toUpperCase());

      login({
        userId: result.userId,
        email: result.email,
        name: emailToConfirmData?.email || '',
      });

      toast.success('Account confirmed!', {
        description: 'You are now logged in.',
      });
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Confirmation failed');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Confirm Your Account</CardTitle>
            <CardDescription>
              Enter the confirmation token sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {emailToConfirmData && (
              <div className="p-4 bg-secondary/50 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Your confirmation token (demo):</p>
                <code className="text-lg font-mono font-bold text-primary">
                  {emailToConfirmData.token}
                </code>
              </div>
            )}

            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Confirmation Token</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Enter your token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="font-mono text-center text-lg tracking-widest"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isConfirming}>
                Confirm Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
