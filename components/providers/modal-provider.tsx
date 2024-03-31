'use client';

import { useState, useEffect } from 'react';
import { CreateServerModel } from '@/components/modals/create-model';
import { InviteModel } from '@/components/modals/invite-model';
import { EditServerModel } from '@/components/modals/edit-model';
import { MembersModel } from '@/components/modals/members-model';

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
      <MembersModel></MembersModel>
    </>
  );
};
