import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Plus, Send, BookOpen, CalendarClock, ClipboardList, User, Users, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRegistrationStore } from '@/store/registrationStore';
import { toast } from 'sonner';

const catalogNavItems = [
  { href: '/', label: 'Catalog', icon: Book },
  { href: '/publish', label: 'Publishing', icon: Send },
];

const borrowingNavItems = [
  { href: '/books', label: 'Books for Rent', icon: BookOpen },
  { href: '/reservations', label: 'Reservations', icon: ClipboardList },
  { href: '/active', label: 'Active', icon: CalendarClock },
  { href: '/borrowings', label: 'My Borrowings', icon: User },
];

const registrationNavItems = [
  { href: '/accounts', label: 'Accounts Overview', icon: Users },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, getCurrentAccount, logout } = useRegistrationStore();
  
  const currentAccount = getCurrentAccount();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent">
              <Book className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">
              Catalog
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                catalogNavItems.some(item => item.href === location.pathname)
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}>
                <Book className="h-4 w-4" />
                Catalog
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Catalog Management</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {catalogNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link to={item.href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                borrowingNavItems.some(item => item.href === location.pathname)
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}>
                <BookOpen className="h-4 w-4" />
                Borrowing
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Borrowing Context</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {borrowingNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link to={item.href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                registrationNavItems.some(item => item.href === location.pathname) || location.pathname === '/account'
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}>
                <Users className="h-4 w-4" />
                Registration
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Registration Context</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {registrationNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link to={item.href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                {isLoggedIn() && (
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/create">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Entry</span>
            </Button>
          </Link>
          
          {isLoggedIn() ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentAccount?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{currentAccount?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button className="gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
