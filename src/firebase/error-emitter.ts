'use client';

import type { FirestorePermissionError } from './errors';

export interface AppEvents {
  'permission-error': FirestorePermissionError;
}

type Callback<T> = (data: T) => void;

/**
 * A strongly-typed pub/sub event emitter.
 */
class Emitter<T extends Record<string, any>> {
  private events: { [K in keyof T]?: Array<Callback<T[K]>> } = {};

  on<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName]?.push(callback);
  }

  off<K extends keyof T>(eventName: K, callback: Callback<T[K]>) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName] = this.events[eventName]?.filter(cb => cb !== callback);
  }

  emit<K extends keyof T>(eventName: K, data: T[K]) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName]?.forEach(callback => callback(data));
  }
}

// Create the singleton instance. 
// We use a constant that is definitely initialized before any exports are called.
const internalEmitter = new Emitter<AppEvents>();

export const errorEmitter = internalEmitter;
