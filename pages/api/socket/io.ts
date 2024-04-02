import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';

import { NextApiResponseServerIO } from '@/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandle = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    // console.log('没有io');
    // console.log(res.socket);
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, { path, addTrailingSlash: false });
    res.socket.server.io = io;
  }
  // console.log('有一个进来了');
  res.end();
};

export default ioHandle;
