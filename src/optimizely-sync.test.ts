import {
  createFeatures,
  deleteFeatures,
  persistFeatures,
} from './optimizely-sync';
import type { PartialFeature } from './optimizely-client-types';
import type { OptimizelySyncConfig } from './optimizely-sync-types';

describe('optimizely-sync', () => {
  describe('createFeatures', () => {
    it('is a function', () => {
      expect(typeof createFeatures).toBe('function');
    });
    it('does nothing if there is nothing to create', async () => {
      const consoleLog = jest.spyOn(console, 'log').mockImplementation();

      const dryRun = false;
      const mockedOptimizelyClient = {
        createFeature: jest.fn(),
      };
      const config: OptimizelySyncConfig = {
        someEnv: {
          someFeature: 10000,
        },
      };
      const features: PartialFeature[] = [
        {
          key: 'someFeature',
          environments: {
            someEnv: {
              id: 123,
              is_primary: true,
              rollout_rules: [
                {
                  audience_conditions: 'everyone',
                  enabled: true,
                  percentage_included: 10000,
                },
              ],
            },
          },
        },
      ];

      await createFeatures(
        dryRun,
        // @ts-expect-error -- intentionally passing a partial OptimizelyConfig
        mockedOptimizelyClient,
        config,
        features,
      );

      expect(consoleLog).toBeCalledTimes(0);
      expect(mockedOptimizelyClient.createFeature).toBeCalledTimes(0);

      consoleLog.mockRestore();
    });

    it('only logs when dryRun is true', async () => {
      const consoleLog = jest.spyOn(console, 'log').mockImplementation();

      const dryRun = true;
      const mockedOptimizelyClient = {
        createFeature: jest.fn(),
      };
      const config: OptimizelySyncConfig = {
        someEnv: {
          someFeature: 10000,
        },
      };
      const features: PartialFeature[] = [];

      await createFeatures(
        dryRun,
        // @ts-expect-error -- intentionally passing a partial OptimizelyConfig
        mockedOptimizelyClient,
        config,
        features,
      );

      expect(consoleLog).toBeCalledTimes(1);
      expect(mockedOptimizelyClient.createFeature).toBeCalledTimes(0);

      consoleLog.mockRestore();
    });

    it('logs and executes dryRun is false', async () => {
      const consoleLog = jest.spyOn(console, 'log').mockImplementation();

      const dryRun = false;
      const mockedOptimizelyClient = {
        createFeature: jest.fn(),
      };
      const config: OptimizelySyncConfig = {
        someEnv: {
          someFeature: 10000,
          otherFeature: 5000,
        },
      };
      const features: PartialFeature[] = [];

      await createFeatures(
        dryRun,
        // @ts-expect-error -- intentionally passing a partial OptimizelyConfig
        mockedOptimizelyClient,
        config,
        features,
      );

      expect(consoleLog).toBeCalledTimes(2);
      // There are two features so it should run twice
      expect(mockedOptimizelyClient.createFeature).toBeCalledTimes(2);

      consoleLog.mockRestore();
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
