'use client';

import { useSocket } from '@/components/providers/socket-provider';
import { Badge } from './ui/badge';

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant='outline' className='bg-yellow-600 text-white border-none'>
        {/* Fallback : Polling every 1s */}
        http:每秒轮训
      </Badge>
    );
  }

  return (
    <Badge variant='outline' className='bg-emerald-600 text-white border-none'>
      {/* Live : Real-time update */}
      websocket:实时
    </Badge>
  );
};

export default SocketIndicator;
