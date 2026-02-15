'use client';

// import { useState, useEffect } from 'react';
// import { errorEmitter } from '@/firebase/error-emitter';
// import { FirestorePermissionError } from '@/firebase/errors';

/**
 * TEMPORARILY DISABLED to eliminate circular dependency with errorEmitter.
 * This component listened for globally emitted 'permission-error' events.
 */
export function FirebaseErrorListener() {
  // Disabled to fix TDZ error
  return null;
}
