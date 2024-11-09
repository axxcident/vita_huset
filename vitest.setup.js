import { vi } from 'vitest';
import { config } from '@vue/test-utils';

// Setup global mocks
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $fetch: vi.fn()
  })
}));

// Configure Vue Test Utils
config.global.mocks = {
  $fetch: vi.fn()
};
