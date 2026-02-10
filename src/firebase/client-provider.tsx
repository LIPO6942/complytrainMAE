'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from './init';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    try {
      return initializeFirebase();
    } catch (error: any) {
      console.error("[Firebase Provider] Critical error during Firebase initialization:", error);
      if (error.stack) {
        console.error("[Firebase Provider] Error stack:", error.stack);
      }
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