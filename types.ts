import { Server as NetServer, Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

import { Server, Member, Profile } from '@prisma/client';

type MemberWithProfile = Member & { profile: Profile };

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfile[];
};

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
