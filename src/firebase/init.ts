import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export function getSdks(firebaseApp: FirebaseApp) {
    return {
        firebaseApp,
        auth: getAuth(firebaseApp),
        firestore: getFirestore(firebaseApp)
    };
}

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
    if (!getApps().length) {
        // Important! initializeApp() is called without any arguments because Firebase App Hosting
        // integrates with the initializeApp() function to provide the environment variables needed to
        // populate the FirebaseOptions in production. It is critical that we attempt to call initializeApp()
        // without arguments.
        let firebaseApp;
        try {
            console.log('[Firebase Init] Attempting automatic initialization...');
            // Attempt to initialize via Firebase App Hosting environment variables
            firebaseApp = initializeApp();
            console.log('[Firebase Init] Automatic initialization successful.');
        } catch (e: any) {
            // Only warn in production because it's normal to use the firebaseConfig to initialize
            // during development
            if (process.env.NODE_ENV === "production") {
                console.warn('[Firebase Init] Automatic initialization failed. Falling back to firebase config object.', e.message);
            } else {
                console.log('[Firebase Init] No automatic config found, falling back to local config.');
            }

            // Validate firebaseConfig
            if (!firebaseConfig || !firebaseConfig.projectId || !firebaseConfig.apiKey) {
                console.error('[Firebase Init] Firebase config is invalid or missing required fields!', {
                    hasConfig: !!firebaseConfig,
                    hasProjectId: !!firebaseConfig?.projectId,
                    hasApiKey: !!firebaseConfig?.apiKey
                });
                throw new Error('Firebase config is invalid or missing required fields (projectId, apiKey)');
            }

            try {
                console.log(`[Firebase Init] Initializing with project: ${firebaseConfig.projectId}`);
                firebaseApp = initializeApp(firebaseConfig);
                console.log('[Firebase Init] Manual initialization successful.');
            } catch (initError: any) {
                console.error('[Firebase Init] Failed to initialize Firebase with config object:', initError.message);
                throw initError;
            }
        }

        return getSdks(firebaseApp);
    }


    // If already initialized, return the SDKs with the already initialized App
    return getSdks(getApp());
}
