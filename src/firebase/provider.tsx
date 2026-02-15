
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
// import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

// Define a type for the user profile data from Firestore
interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user' | string; // Be more specific if you have fixed roles
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  agencyCode?: string;
  badges?: string[];
  lastSignInTime?: string;
  totalTimeSpent?: number;
  averageScore?: number;
  quizAttempts?: number;
  quizzesPassed?: number;
  completedQuizzes?: string[];
  scores?: Record<string, number>;
  userAnswers?: Record<string, Record<number, number[]>>;
  notificationPreferences?: {
    email?: boolean;
    newCourses?: boolean;
    courseUpdates?: boolean;
    quizReminders?: boolean;
  };
}

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  userProfile: UserProfile | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser()
export interface UserHookResult {
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
    userProfile: null,
  });

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) {
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided."), userProfile: null });
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setUserAuthState(prevState => ({ ...prevState, user: firebaseUser, isUserLoading: false, userError: null }));
        } else {
          // User is signed out
          setUserAuthState({ user: null, userProfile: null, isUserLoading: false, userError: null });
        }
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error, userProfile: null });
      }
    );
    return () => unsubscribeAuth();
  }, [auth]);

  // Effect to subscribe to the user's profile document in Firestore
  useEffect(() => {
    // If there is no authenticated user, there is no profile to fetch.
    if (!firestore || !userAuthState.user) {
      // Ensure profile is null if user logs out.
      if (userAuthState.userProfile !== null) {
        setUserAuthState(prevState => ({ ...prevState, userProfile: null }));
      }
      return;
    }

    const firebaseUser = userAuthState.user;
    const userDocRef = doc(firestore, 'users', firebaseUser.uid);

    // Set up the real-time listener.
    const unsubscribeProfile = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          // If the document exists, update the userProfile state.
          setUserAuthState(prevState => ({ ...prevState, userProfile: docSnap.data() as UserProfile }));
        } else {
          // If the document does not exist (e.g., new user, or after a reset),
          // set the userProfile to null.
          setUserAuthState(prevState => ({ ...prevState, userProfile: null }));
        }
      },
      (error) => {
        // Handle errors, particularly permission errors.
        console.error("FirebaseProvider: Error fetching user profile:", error);
        const permError = new (FirestorePermissionError as any)({
          path: userDocRef.path,
          operation: 'get'
        });
        console.error('[FirebaseProvider] Permission error:', permError);
        setUserAuthState(prevState => ({ ...prevState, userProfile: null }));
      }
    );

    // Clean up the listener when the component unmounts or the user changes.
    return () => unsubscribeProfile();
  }, [firestore, userAuthState.user]);


  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      user: userAuthState.user,
      userProfile: userAuthState.userProfile,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    userProfile: context.userProfile,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};


