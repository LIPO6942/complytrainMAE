
import { initializeApp, getApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { firebaseConfig } from './config';

const apps = getApps();

if (!apps.length) {
  initializeApp({
    ...firebaseConfig,
  });
}

const app = getApp();
const auth = getAuth(app);

export { app, auth };
