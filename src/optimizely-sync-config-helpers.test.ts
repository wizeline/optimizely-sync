import {
  findUnconfiguredFeatures,
  findUndeployedFeatures,
  getConfigFeatureKeys,
  getOptimizelyFeatureKeys,
} from './optimizely-sync-config-helpers';
import type { Feature } from './optimizely-client-types';
import type { OptimizelySyncConfig } from './optimizely-sync-types';

describe('optimizely-sync-config-helpers', () => {
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
});

/*
export const findUndeployedFeatures = (
  config: OptimizelySyncConfig,
  features: Feature[],
): string[] => {
  const configFeatures = getConfigFeatureKeys(config)[0];
  const deployedFeatures = getOptimizelyFeatureKeys(features);

  return difference(configFeatures, deployedFeatures);
};

export const findUnconfiguredFeatures = (
  config: OptimizelySyncConfig,
  features: Feature[],
): string[] => {
  const configFeatures = getConfigFeatureKeys(config)[0];
  const deployedFeatures = getOptimizelyFeatureKeys(
    features.filter((feature) => !feature.archived),
  );

  return difference(deployedFeatures, configFeatures);
};
*/
