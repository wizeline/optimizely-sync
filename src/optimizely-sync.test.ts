import {
  createFeatures,
  deleteFeatures,
  persistFeatures,
} from './optimizely-sync';

describe('optimizely-sync-config-validators', () => {
  describe('createFeatures', () => {
    it('is a function', () => {
      expect(typeof createFeatures).toBe('function');
    });
  });

  describe('deleteFeatures', () => {
    it('is a function', () => {
      expect(typeof deleteFeatures).toBe('function');
    });
  });

  describe('persistFeatures', () => {
    it('is a function', () => {
      expect(typeof persistFeatures).toBe('function');
    });
  });
});
