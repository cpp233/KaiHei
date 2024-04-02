import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

import { NextApiResponseServerIO } from '@/types';
import { WS_URL_IO } from '@/lib/getEnv';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandle = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    // console.log('没有io');
    // console.log(res.socket);
    const path = WS_URL_IO;
    const httpServer: NetServer = res.socket.server as unknown as NetServer;
    const io = new ServerIO(httpServer, { path, addTrailingSlash: false });
    res.socket.server.io = io;
  }
  // console.log('有一个进来了');

  res.end();
};

export default ioHandle;
