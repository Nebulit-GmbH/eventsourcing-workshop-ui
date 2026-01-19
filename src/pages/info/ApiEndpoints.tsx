import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_BASE_URL = 'http://localhost:8080';

interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  description: string;
}

const catalogEndpoints: Endpoint[] = [
  { method: 'GET', path: '/catalogentries', description: 'Get all catalog entries' },
  { method: 'GET', path: '/catalogentrydetails/{id}', description: 'Get catalog entry details by ID' },
  { method: 'GET', path: '/itemstopublish/{id}', description: 'Get items ready for publication' },
  { method: 'GET', path: '/itemdetailsforpublication/{id}', description: 'Get item details for publication' },
  { method: 'POST', path: '/createcatalogentry/{id}', description: 'Create a new catalog entry' },
  { method: 'POST', path: '/updatecatalogentry/{id}', description: 'Update an existing catalog entry' },
  { method: 'POST', path: '/archivecatalogentry/{id}', description: 'Archive a catalog entry' },
  { method: 'POST', path: '/publishitem/{id}', description: 'Publish an item' },
  { method: 'POST', path: '/exportitem/{id}', description: 'Export an item' },
  { method: 'POST', path: '/exportitemarchived/{id}', description: 'Export an archived item' },
];

const accountEndpoints: Endpoint[] = [
  { method: 'GET', path: '/confirmedaccounts', description: 'Get all confirmed accounts' },
  { method: 'GET', path: '/confirmationmailstosend', description: 'Get pending confirmation emails' },
  { method: 'GET', path: '/emailstoconfirmtodo/{id}', description: 'Get emails pending confirmation' },
  { method: 'POST', path: '/createaccount/{id}', description: 'Create a new account' },
  { method: 'POST', path: '/updateaccount/{id}', description: 'Update an account' },
  { method: 'POST', path: '/deactivateaccount/{id}', description: 'Deactivate an account' },
  { method: 'POST', path: '/confirmaccount/{id}', description: 'Confirm an account' },
  { method: 'POST', path: '/notifycustomer/{id}', description: 'Send notification to customer' },
  { method: 'POST', path: '/importuser/{id}', description: 'Import a user' },
];

const borrowingEndpoints: Endpoint[] = [
  { method: 'GET', path: '/booksforrent/{id}', description: 'Get book available for rent' },
  { method: 'GET', path: '/bookdetaillookupforborrowingdetails', description: 'Get book details for borrowing' },
  { method: 'GET', path: '/bookdetaillookupforactivereservations', description: 'Get book details for active reservations' },
  { method: 'GET', path: '/activereservations', description: 'Get all active reservations' },
  { method: 'GET', path: '/reservations', description: 'Get all reservations' },
  { method: 'GET', path: '/reservationsforexpiration/{id}', description: 'Get reservations for expiration check' },
  { method: 'GET', path: '/reservationlookupforborrowingdetails/{id}', description: 'Get reservation lookup for borrowing' },
  { method: 'GET', path: '/reservationnotificationtosend/{id}', description: 'Get reservation notification to send' },
  { method: 'GET', path: '/useremaillookupforreservationnotification/{id}', description: 'Get user email for reservation notification' },
  { method: 'GET', path: '/customerborrowings', description: 'Get customer borrowings' },
  { method: 'POST', path: '/reservebook/{id}', description: 'Reserve a book' },
  { method: 'POST', path: '/expirereservation/{id}', description: 'Expire a reservation' },
  { method: 'POST', path: '/markreservationaspickedup/{id}', description: 'Mark reservation as picked up' },
  { method: 'POST', path: '/marklost/{id}', description: 'Mark book as lost' },
  { method: 'POST', path: '/markdamaged/{id}', description: 'Mark book as damaged' },
  { method: 'POST', path: '/sendreservationnotification/{id}', description: 'Send reservation notification' },
];

const notificationEndpoints: Endpoint[] = [
  { method: 'GET', path: '/subscribe/{sessionId}', description: 'SSE subscription endpoint' },
  { method: 'GET', path: '/status/{sessionId}', description: 'Get connection status' },
  { method: 'POST', path: '/send/{sessionId}', description: 'Send notification to session' },
  { method: 'POST', path: '/broadcast', description: 'Broadcast notification to all' },
];

function EndpointList({ endpoints }: { endpoints: Endpoint[] }) {
  return (
    <div className="space-y-2">
      {endpoints.map((endpoint, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <Badge
            variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
            className={endpoint.method === 'GET' 
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20' 
              : 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20'
            }
          >
            {endpoint.method}
          </Badge>
          <div className="flex-1 min-w-0">
            <code className="text-sm font-mono text-foreground break-all">
              {endpoint.path}
            </code>
            <p className="text-xs text-muted-foreground mt-1">
              {endpoint.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ApiEndpoints() {
  const totalEndpoints = 
    catalogEndpoints.length + 
    accountEndpoints.length + 
    borrowingEndpoints.length + 
    notificationEndpoints.length;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">API Endpoints</h1>
          <p className="text-muted-foreground mt-1">
            Backend API reference • Base URL: <code className="text-sm bg-secondary px-2 py-0.5 rounded">{API_BASE_URL}</code>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              {totalEndpoints} endpoints across 4 API domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold">{catalogEndpoints.length}</div>
                <div className="text-sm text-muted-foreground">Catalog</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold">{accountEndpoints.length}</div>
                <div className="text-sm text-muted-foreground">Account</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold">{borrowingEndpoints.length}</div>
                <div className="text-sm text-muted-foreground">Borrowing</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold">{notificationEndpoints.length}</div>
                <div className="text-sm text-muted-foreground">Notification</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="borrowing">Borrowing</TabsTrigger>
            <TabsTrigger value="notification">Notification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="catalog" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Catalog API</CardTitle>
                <CardDescription>Manage catalog entries and publications</CardDescription>
              </CardHeader>
              <CardContent>
                <EndpointList endpoints={catalogEndpoints} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account API</CardTitle>
                <CardDescription>User account management and confirmation</CardDescription>
              </CardHeader>
              <CardContent>
                <EndpointList endpoints={accountEndpoints} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="borrowing" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Borrowing API</CardTitle>
                <CardDescription>Book reservations and borrowing management</CardDescription>
              </CardHeader>
              <CardContent>
                <EndpointList endpoints={borrowingEndpoints} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notification" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification API</CardTitle>
                <CardDescription>Real-time notifications via SSE</CardDescription>
              </CardHeader>
              <CardContent>
                <EndpointList endpoints={notificationEndpoints} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
