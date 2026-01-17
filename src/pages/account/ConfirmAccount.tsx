import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegistrationStore } from '@/store/registrationStore';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

export default function ConfirmAccount() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { confirmAccount, getAccount, getEmailsToConfirm } = useRegistrationStore();
  
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const account = userId ? getAccount(userId) : null;
  const emailToConfirm = getEmailsToConfirm().find(e => e.userId === userId);

  if (!account) {
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

  if (account.status === 'confirmed') {
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

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Please enter your confirmation token');
      return;
    }

    const result = confirmAccount(userId!, token.toUpperCase());
    
    if (result.success) {
      toast.success('Account confirmed!', {
        description: 'You are now logged in.',
      });
      navigate('/');
    } else {
      setError(result.error || 'Confirmation failed');
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
              Enter the confirmation token sent to <strong>{account.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {emailToConfirm && (
              <div className="p-4 bg-secondary/50 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Your confirmation token (demo):</p>
                <code className="text-lg font-mono font-bold text-primary">
                  {emailToConfirm.token}
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
              <Button type="submit" className="w-full">
                Confirm Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
