import { equals } from 'ramda';
import type { OptimizelySyncConfig } from './optimizely-sync-types';
import { getConfigFeatureKeys } from './optimizely-sync-config-helpers';
import { isInteger, isObject } from './type-guards';

function isOptimizelySyncConfig(
  config: unknown,
): config is OptimizelySyncConfig {
  // config is an object of objects.
  if (!isObject(config)) {
    throw new Error(
      'Config must be of type Record<string, Record<string, number>>.',
    );
  }

  const envConfigs = Object.values(config);
  if (!envConfigs.every(isObject)) {
    throw new Error(
      'Config must be of type Record<string, Record<string, number>>.',
    );
  }

  envConfigs.forEach((envConfig) => {
    const featureValues = Object.values(envConfig);
    featureValues.forEach((featureValue) => {
      if (
        !isInteger(featureValue) ||
        featureValue < 0 ||
        featureValue > 10000
      ) {
        throw new Error(
          'Feature values must be an integer between 0 and 10,000 (inclusive).',
        );
      }
    });
  });

  return true;
}

export const validateConfig = (
  config: unknown,
): config is OptimizelySyncConfig => {
  if (!isOptimizelySyncConfig(config)) {
    throw new Error('config is not a valid OptimizelySyncConfig.');
  }

  // All environments have the same keys
  const envFeatures = getConfigFeatureKeys(config);
  if (!envFeatures.every(equals(envFeatures[0]))) {
    throw new Error(`All environments don't have the same features.`);
  }

  return true;
};
