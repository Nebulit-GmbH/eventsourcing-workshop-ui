import { User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBorrowingStore } from '@/store/borrowingStore';

export function UserSelector() {
  const { getUsers, getCurrentUser, setCurrentUser } = useBorrowingStore();
  const users = getUsers();
  const currentUser = getCurrentUser();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>Current User:</span>
      </div>
      <Select value={currentUser.userId} onValueChange={setCurrentUser}>
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
