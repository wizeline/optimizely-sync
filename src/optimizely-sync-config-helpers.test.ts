import {
  compareConfigs,
  findEveryoneRolloutRule,
  findUnconfiguredFeatures,
  findUndeployedFeatures,
  getConfigFeatureKeys,
  getOptimizelyFeatureKeys,
  transformOptimizelyFeaturesToSyncConfig,
  transformValueToRolloutRule,
} from './optimizely-sync-config-helpers';
import type { Environment, Feature } from './optimizely-client-types';
import type { OptimizelySyncConfig } from './optimizely-sync-types';

describe('optimizely-sync-config-helpers', () => {
  describe('compareConfigs', () => {
    it('is a function', () => {
      expect(typeof compareConfigs).toBe('function');
    });
    it('returns a list of differences', () => {
      const config1: OptimizelySyncConfig = {
        anEnvName: {
          feature_1: 100,
        },
      };
      const config2: OptimizelySyncConfig = {
        anEnvName: {
          feature_1: 200,
        },
      };
      expect(compareConfigs(config1, config2)).toEqual([
        {
          envName: 'anEnvName',
          featureName: 'feature_1',
          leftValue: 100,
          rightValue: 200,
        },
      ]);
    });
    it('works with configs with different environments', () => {
      const config1: OptimizelySyncConfig = {
        anEnvName: {
          feature_1: 100,
        },
      };
      const config2: OptimizelySyncConfig = {};
      expect(compareConfigs(config1, config2)).toEqual([
        {
          envName: 'anEnvName',
          featureName: 'feature_1',
          leftValue: 100,
          rightValue: undefined,
        },
      ]);
    });
    it('works with configs with different features', () => {
      const config1: OptimizelySyncConfig = {
        anEnvName: {
          feature_1: 100,
        },
      };
      const config2: OptimizelySyncConfig = {
        anEnvName: {},
      };
      expect(compareConfigs(config1, config2)).toEqual([
        {
          envName: 'anEnvName',
          featureName: 'feature_1',
          leftValue: 100,
          rightValue: undefined,
        },
      ]);
    });
  });

  describe('findEveryoneRolloutRule', () => {
    it('is a function', () => {
      expect(typeof findEveryoneRolloutRule).toBe('function');
    });
    it('returns the correct rule when there is one', () => {
      const env: Environment = {
        id: 123,
        is_primary: true,
        rollout_rules: [
          {
            audience_conditions: 'wrong',
            enabled: true,
            percentage_included: 10000,
          },
          {
            audience_conditions: 'everyone',
            enabled: true,
            percentage_included: 1234,
          },
        ],
      };
      expect(findEveryoneRolloutRule(env)).toEqual(env?.rollout_rules?.[1]);
    });
    it('returns undefined whenthere is no everyone rule', () => {
      const env: Environment = {
        id: 123,
        is_primary: true,
        rollout_rules: [
          {
            audience_conditions: 'wrong',
            enabled: true,
            percentage_included: 10000,
          },
        ],
      };
      expect(findEveryoneRolloutRule(env)).toBeUndefined();
    });
  });

  describe('findUnconfiguredFeatures', () => {
    it('is a function', () => {
      expect(typeof findUnconfiguredFeatures).toBe('function');
    });
    it('returns an list of unconfigured features', () => {
      const config: OptimizelySyncConfig = {
        development: {
          feature_2: 0,
          feature_1: 0,
        },
      };
      const features: Partial<Feature>[] = [
        { key: 'feature_3' },
        { key: 'feature_2' },
      ];
      expect(
        // @ts-expect-error -- Features is not complete
        findUnconfiguredFeatures(config, features),
      ).toEqual(['feature_3']);
    });
  });

  describe('findUndeployedFeatures', () => {
    it('is a function', () => {
      expect(typeof findUndeployedFeatures).toBe('function');
    });
    it('returns an list of undeployed features', () => {
      const config: OptimizelySyncConfig = {
        development: {
          feature_2: 0,
          feature_1: 0,
        },
      };
      const features: Partial<Feature>[] = [
        { key: 'feature_3' },
        { key: 'feature_2' },
      ];
      expect(
        // @ts-expect-error -- Features is not complete
        findUndeployedFeatures(config, features),
      ).toEqual(['feature_1']);
    });
  });

  describe('getConfigFeatureKeys', () => {
    it('is a function', () => {
      expect(typeof getConfigFeatureKeys).toBe('function');
    });
    it('returns an array of array of sorted features', () => {
      const config: OptimizelySyncConfig = {
        development: {
          feature_2: 0,
          feature_1: 0,
        },
      };
      expect(getConfigFeatureKeys(config)).toEqual([
        ['feature_1', 'feature_2'],
      ]);
    });
  });

  describe('getOptimizelyFeatureKeys', () => {
    it('is a function', () => {
      expect(typeof getOptimizelyFeatureKeys).toBe('function');
    });
    it('returns an sorted array of feature keys', () => {
      const features: Partial<Feature>[] = [
        { key: 'feature_2' },
        { key: 'feature_1' },
      ];
      expect(
        // @ts-expect-error -- Features is not complete
        getOptimizelyFeatureKeys(features),
      ).toEqual(['feature_1', 'feature_2']);
    });
  });

  describe('transformOptimizelyFeaturesToSyncConfig', () => {
    it('is a function', () => {
      expect(typeof transformOptimizelyFeaturesToSyncConfig).toBe('function');
    });
    it('returns an an OptimizelySyncConfig', () => {
      const features: Feature[] = [
        {
          archived: false,
          created: '2021-03-12T00:55:02.510765Z',
          description: '',
          environments: {
            development: {
              id: 20028898671,
              is_primary: false,
              rollout_rules: [
                {
                  audience_conditions: 'everyone',
                  enabled: true,
                  percentage_included: 10000,
                },
              ],
            },
            production: {
              id: 20043627162,
              is_primary: true,
              rollout_rules: [
                {
                  audience_conditions: 'everyone',
                  enabled: true,
                  percentage_included: 0,
                },
              ],
            },
          },
          id: 20077886818,
          key: 'feature_1',
          last_modified: '2021-03-15T21:57:28.532568Z',
          name: 'feature_1',
          project_id: 20054550640,
          variables: [],
        },
        {
          archived: false,
          created: '2021-03-12T04:32:06.229857Z',
          environments: {
            development: {
              id: 20028898671,
              is_primary: false,
              rollout_rules: [
                {
                  audience_conditions: 'everyone',
                  enabled: true,
                  percentage_included: 10000,
                },
              ],
            },
            production: {
              id: 20043627162,
              is_primary: true,
              rollout_rules: [
                {
                  // Intentionally have a case where there is not an 'everyone' audience
                  audience_conditions: 'other',
                  enabled: true,
                  percentage_included: 1234,
                },
              ],
            },
          },
          id: 20056873713,
          key: 'feature_2',
          last_modified: '2021-03-15T21:57:28.594528Z',
          name: 'feature_2',
          project_id: 20054550640,
          variables: [],
        },
      ];

      expect(transformOptimizelyFeaturesToSyncConfig(features)).toEqual({
        development: {
          feature_1: 10000,
          feature_2: 10000,
        },
        production: {
          feature_1: 0,
          feature_2: 0,
        },
      });
    });
  });

  describe('transformValueToRolloutRule', () => {
    it('is a function', () => {
      expect(typeof transformValueToRolloutRule).toBe('function');
    });
    it('returns an RolloutRule', () => {
      expect(transformValueToRolloutRule(1234)).toEqual({
        audience_conditions: 'everyone',
        enabled: true,
        percentage_included: 1234,
      });
    });
  });
});
