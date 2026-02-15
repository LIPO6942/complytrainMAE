'use client';

import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
// import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './firestore-permission-error';

/**
 * Initiates a setDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions) {
  setDoc(docRef, data, options).catch(error => {
    const err = new (FirestorePermissionError as any)({
      path: docRef.path,
      operation: 'write',
      requestResourceData: data,
    });
    console.error('[setDocumentNonBlocking] Permission error:', err);
  })
  // Execution continues immediately
}


/**
 * Initiates an addDoc operation for a collection reference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export function addDocumentNonBlocking(colRef: CollectionReference, data: any) {
  const promise = addDoc(colRef, data)
    .catch(error => {
      const err = new (FirestorePermissionError as any)({
        path: colRef.path,
        operation: 'create',
        requestResourceData: data,
      });
      console.error('[addDocumentNonBlocking] Permission error:', err);
    });
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: any) {
  updateDoc(docRef, data)
    .catch(error => {
      const err = new (FirestorePermissionError as any)({
        path: docRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      console.error('[updateDocumentNonBlocking] Permission error:', err);
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  deleteDoc(docRef)
    .catch(error => {
      const err = new (FirestorePermissionError as any)({
        path: docRef.path,
        operation: 'delete',
      });
      console.error('[deleteDocumentNonBlocking] Permission error:', err);
    });
}
