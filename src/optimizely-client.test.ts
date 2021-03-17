import OptimizelyClient from './optimizely-client';

describe('optimizely-client', () => {
  describe('OptimizelyClient', () => {
    it('is a class', () => {
      const config = {
        accessToken: 'fake-token',
        projectId: 1234567890,
      };
      expect(new OptimizelyClient(config)).toBeInstanceOf(OptimizelyClient);
    });
  });
});
