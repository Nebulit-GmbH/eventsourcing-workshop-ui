import { User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, SessionUser } from '@/hooks/useAuth';
import { useConfirmedAccounts } from '@/hooks/useAccount';

// Fallback mock users if no confirmed accounts
const MOCK_USERS: SessionUser[] = [
  { userId: 'user-1', email: 'alice@example.com', name: 'Alice Johnson' },
  { userId: 'user-2', email: 'bob@example.com', name: 'Bob Smith' },
  { userId: 'user-3', email: 'carol@example.com', name: 'Carol Williams' },
];

export function UserSelector() {
  const { currentUser, setCurrentUser } = useAuth();
  const { data: confirmedAccounts } = useConfirmedAccounts();

  // Use confirmed accounts if available, otherwise use mock users
  const users: SessionUser[] = confirmedAccounts && confirmedAccounts.length > 0
    ? confirmedAccounts.map(a => ({
        userId: a.user_id,
        email: a.email,
        name: a.name,
      }))
    : MOCK_USERS;

  const handleUserChange = (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>Current User:</span>
      </div>
      <Select value={currentUser?.userId || ''} onValueChange={handleUserChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.userId} value={user.userId}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
