'use client';

/**
 * A ultra-simple, dependency-free event emitter.
 * Uses var and functional approach to bypass Temporal Dead Zone issues in production builds.
 */

// Function declarations are hoisted
function createInternalEmitter() {
  var events: Record<string, Array<(data: any) => void>> = {};

  return {
    on: function (eventName: string, callback: (data: any) => void) {
      if (!events[eventName]) events[eventName] = [];
      events[eventName].push(callback);
    },
    off: function (eventName: string, callback: (data: any) => void) {
      if (!events[eventName]) return;
      events[eventName] = events[eventName].filter(function (cb) { return cb !== callback; });
    },
    emit: function (eventName: string, data: any) {
      if (!events[eventName]) return;
      events[eventName].forEach(function (cb) {
        try {
          cb(data);
        } catch (e) {
          console.error('[Emitter] Error in callback:', e);
        }
      });
    }
  };
}

// Global-ish instance
var _instance = typeof window !== 'undefined' ? (window as any).__ERROR_EMITTER__ : null;
if (!_instance) {
  _instance = createInternalEmitter();
  if (typeof window !== 'undefined') (window as any).__ERROR_EMITTER__ = _instance;
}

// Export using var to avoid TDZ (Temporal Dead Zone)
export var errorEmitter = _instance;
