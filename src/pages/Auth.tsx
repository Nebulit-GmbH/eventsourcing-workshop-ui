import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRegistrationStore } from '@/store/registrationStore';
import { toast } from 'sonner';
import { UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function Auth() {
  const navigate = useNavigate();
  const { createAccount, notifyCustomer, login, isLoggedIn } = useRegistrationStore();
  
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupError, setSignupError] = useState('');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Redirect if already logged in
  if (isLoggedIn()) {
    navigate('/');
    return null;
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    const validation = signupSchema.safeParse({ email: signupEmail, name: signupName });
    if (!validation.success) {
      setSignupError(validation.error.errors[0].message);
      return;
    }

    const result = createAccount(signupEmail, signupName);
    
    if (result.success && result.account) {
      // Automatically send notification (mock)
      notifyCustomer(result.account.userId);
      toast.success('Account created! Check your email for confirmation.', {
        description: `A confirmation token has been sent to ${signupEmail}`,
      });
      navigate(`/confirm/${result.account.userId}`);
    } else {
      setSignupError(result.error || 'Failed to create account');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const validation = loginSchema.safeParse({ email: loginEmail });
    if (!validation.success) {
      setLoginError(validation.error.errors[0].message);
      return;
    }

    const result = login(loginEmail);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      setLoginError(result.error || 'Login failed');
    }
  };

  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">Welcome</CardTitle>
            <CardDescription>
              Sign up for a new account or login to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </TabsTrigger>
                <TabsTrigger value="login" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                  {signupError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {signupError}
                    </div>
                  )}
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  {loginError && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {loginError}
                    </div>
                  )}
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Only confirmed accounts can login
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
