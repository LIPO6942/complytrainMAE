'use client';

/**
 * STUB FILE - Simplified to avoid circular dependencies.
 */

export class FirestorePermissionError extends Error {
    request: any;

    constructor(context: any) {
        super('Firestore Permission Denied: ' + context.operation + ' on ' + context.path);
        this.name = 'FirebaseError';
        this.request = {
            auth: null,
            method: context.operation,
            path: '/databases/(default)/documents/' + context.path,
            resource: context.requestResourceData ? { data: context.requestResourceData } : undefined,
        };
    }
}
