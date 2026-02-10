'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase/init';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    try {
      return initializeFirebase();
    } catch (error) {
      console.error("Critical error during Firebase initialization:", error);
      // Return nulls so the provider can handle the "services not available" state
      return { firebaseApp: null, auth: null, firestore: null };
    }
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp as any}
      auth={firebaseServices.auth as any}
      firestore={firebaseServices.firestore as any}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}