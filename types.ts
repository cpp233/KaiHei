import { Server, Member, Profile } from '@prisma/client';

type MemberWithProfile = Member & { profile: Profile };

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfile[];
};
