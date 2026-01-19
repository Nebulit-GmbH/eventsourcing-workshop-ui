import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationStatus } from '@/hooks/useNotification';

export function ConnectionIndicator() {
  const { isConnected } = useNotificationStatus();

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors',
        isConnected
          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
          : 'bg-destructive/10 text-destructive'
      )}
    >
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span className="hidden sm:inline">System Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span className="hidden sm:inline">System Down</span>
        </>
      )}
    </div>
  );
}
