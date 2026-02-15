'use client';

// Minimal types for security rules simulation
interface SecurityRuleContext {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
    requestResourceData?: any;
}

interface SecurityRuleRequest {
    auth: any;
    method: string;
    path: string;
    resource?: { data: any };
}

/**
 * A custom error class designed to be consumed by an LLM for debugging.
 * Re-implemented as a function-style class to avoid TDZ issues.
 */
export function FirestorePermissionError(this: any, context: SecurityRuleContext) {
    var requestObject: SecurityRuleRequest = {
        auth: null,
        method: context.operation,
        path: '/databases/(default)/documents/' + context.path,
        resource: context.requestResourceData ? { data: context.requestResourceData } : undefined,
    };

    var message = 'Firestore Permission Denied: ' + context.operation + ' on ' + context.path;

    // Create an Error object to get the stack trace
    var err = new Error(message) as any;
    Object.setPrototypeOf(err, FirestorePermissionError.prototype);

    err.name = 'FirebaseError';
    err.request = requestObject;

    return err;
}

FirestorePermissionError.prototype = Object.create(Error.prototype);
FirestorePermissionError.prototype.constructor = FirestorePermissionError;
