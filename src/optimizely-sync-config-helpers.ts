import { difference, pluck } from 'ramda';
import type { Feature } from './optimizely-client-types';
import type { OptimizelySyncConfig } from './optimizely-sync-types';

export const getConfigFeatureKeys = (
  config: OptimizelySyncConfig,
): string[][] => {
  return Object.values(config)
    .map(Object.keys)
    .map((x) => x.sort());
};

export const getOptimizelyFeatureKeys = (features: Feature[]): string[] => {
  return pluck('key', features).sort();
};

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
