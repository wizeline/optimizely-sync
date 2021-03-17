import {
  readConfigFile,
  readConfigDir,
} from './optimizely-sync-config-readers';

describe('optimizely-sync-config-readers', () => {
  describe('readConfigFile', () => {
    it('is a function', () => {
      expect(typeof readConfigFile).toBe('function');
    });
  });

  describe('readConfigDir', () => {
    it('is a function', () => {
      expect(typeof readConfigDir).toBe('function');
    });
  });
});
