// Core functionality
export * from './client';
export * from './server';
export * from './events';
export * from './types';

// Features
export * from './handlers';
export * from './middleware';
export * from './services';
export * from './utils';
export * from './hooks';

// Default exports
export { default as useSocket } from '../hooks/useSocket';