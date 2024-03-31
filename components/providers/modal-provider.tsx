'use client';

import { useState, useEffect } from 'react';
import { CreateServerModel } from '@/components/modals/create-model';

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
    </>
  );
};
