import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const HEALTH_CHECK_URL = 'http://localhost:8080/actuator/health';

export function ConnectionIndicator() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(HEALTH_CHECK_URL, { method: 'GET' });
        setIsConnected(response.ok);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

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
