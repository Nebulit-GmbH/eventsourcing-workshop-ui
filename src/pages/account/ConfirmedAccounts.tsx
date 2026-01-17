import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRegistrationStore } from '@/store/registrationStore';
import { Users, Mail, CheckCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfirmedAccounts() {
  const { 
    getConfirmedAccounts, 
    getConfirmationMailsToSend, 
    notifyCustomer 
  } = useRegistrationStore();
  
  const confirmedAccounts = getConfirmedAccounts();
  const pendingNotifications = getConfirmationMailsToSend();

  const handleSendNotification = (userId: string, email: string) => {
    notifyCustomer(userId);
    toast.success(`Confirmation email sent to ${email}`);
  };

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Accounts Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and pending confirmations
          </p>
        </div>

        {/* Pending Notifications */}
        {pendingNotifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-medium flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-500" />
              Confirmation Mails to Send
              <Badge variant="secondary">{pendingNotifications.length}</Badge>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingNotifications.map((item) => (
                <Card key={item.userId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{item.email}</p>
                    <Button 
                      size="sm" 
                      onClick={() => handleSendNotification(item.userId, item.email)}
                      className="w-full gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Send Confirmation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Confirmed Accounts */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-medium flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Confirmed Accounts
            <Badge variant="secondary">{confirmedAccounts.length}</Badge>
          </h2>
          
          {confirmedAccounts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-xl font-medium">No confirmed accounts yet</h3>
                <p className="text-muted-foreground mt-2">
                  Accounts will appear here once they confirm their email.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {confirmedAccounts.map((account) => (
                <Card key={account.userId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{account.name}</CardTitle>
                      <Badge variant="default" className="bg-green-500">Confirmed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{account.email}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-mono">
                      ID: {account.userId.slice(0, 8)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
