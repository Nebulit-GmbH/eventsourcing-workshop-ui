import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useRegistrationStore } from '@/store/registrationStore';
import { toast } from 'sonner';
import { User, LogOut, Trash2, AlertCircle } from 'lucide-react';

export default function Account() {
  const navigate = useNavigate();
  const { getCurrentAccount, updateAccount, deactivateAccount, logout, isLoggedIn } = useRegistrationStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const account = getCurrentAccount();

  // Redirect if not logged in
  if (!isLoggedIn() || !account) {
    navigate('/auth');
    return null;
  }

  const handleStartEdit = () => {
    setName(account.name);
    setEmail(account.email);
    setIsEditing(true);
  };

  const handleSave = () => {
    setError('');
    
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }

    updateAccount(account.userId, email, name);
    setIsEditing(false);
    toast.success('Account updated successfully');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const handleDeactivate = () => {
    deactivateAccount(account.userId);
    toast.success('Account deactivated');
    navigate('/auth');
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            My Account
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{account.name}</CardTitle>
                <CardDescription>{account.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{account.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="capitalize">{account.status}</p>
                </div>
                <Button onClick={handleStartEdit}>Edit Profile</Button>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Account Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Deactivate Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deactivate Account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will deactivate your account. You won't be able to login anymore.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeactivate} className="bg-destructive text-destructive-foreground">
                        Deactivate
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
