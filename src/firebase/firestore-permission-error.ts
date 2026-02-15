'use client';

/**
 * STUB FILE - Simplified to avoid circular dependencies.
 */

export function FirestorePermissionError(context: any) {
    const err = new Error('Firestore Permission Denied: ' + context.operation + ' on ' + context.path) as any;
    err.name = 'FirebaseError';
    err.request = {
        auth: null,
        method: context.operation,
        path: '/databases/(default)/documents/' + context.path,
        resource: context.requestResourceData ? { data: context.requestResourceData } : undefined,
    };
    return err;
}
