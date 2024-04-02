'use client';

import { useState, useEffect } from 'react';
import { CreateServerModel } from '@/components/modals/create-server-model';
import { InviteModel } from '@/components/modals/invite-model';
import { EditServerModel } from '@/components/modals/edit-server-model';
import { LeaveServerModel } from '@/components/modals/leave-server-model';
import { DeleteServerModel } from '@/components/modals/delete-server-model';
import { MembersModel } from '@/components/modals/members-model';
import { CreateChannelModel } from '@/components/modals/create-channel-model';
import { DeleteChannelModel } from '@/components/modals/delete-channel-model';
import { EditChannelModel } from '@/components/modals/edit-channel-model';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModel></CreateServerModel>
      <InviteModel></InviteModel>
      <EditServerModel></EditServerModel>
      <LeaveServerModel></LeaveServerModel>
      <DeleteServerModel></DeleteServerModel>
      <MembersModel></MembersModel>

      <CreateChannelModel></CreateChannelModel>
      <DeleteChannelModel></DeleteChannelModel>
      <EditChannelModel></EditChannelModel>
    </>
  );
};
