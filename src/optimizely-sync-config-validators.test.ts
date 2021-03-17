import { validateConfig } from './optimizely-sync-config-validators';

describe('optimizely-sync-config-validators', () => {
  describe('validateConfig', () => {
    it('is a function', () => {
      expect(typeof validateConfig).toBe('function');
    });
  });
});
