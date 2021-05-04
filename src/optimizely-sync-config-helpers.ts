import { difference, pluck } from 'ramda';
import type {
  Environment,
  Feature,
  RolloutRule,
} from './optimizely-client-types';
import type { OptimizelySyncConfig } from './optimizely-sync-types';

type ConfigDiff = Array<{
  envName: string;
  featureName: string;
  leftValue: number;
  rightValue: number;
}>;
export const compareConfigs = (
  left: OptimizelySyncConfig,
  right: OptimizelySyncConfig,
): ConfigDiff => {
  const differences: ConfigDiff = [];

  Object.entries(left).forEach(([envName, features]) => {
    Object.entries(features).forEach(([featureName, leftValue]) => {
      const rightValue = right[envName]?.[featureName];
      if (leftValue !== rightValue) {
        differences.push({ envName, featureName, leftValue, rightValue });
      }
    });
  });
  return differences;
};

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

export const findEveryoneRolloutRule = (
  env: Environment,
): undefined | RolloutRule => {
  return env.rollout_rules.find(
    (rule) => rule.audience_conditions === 'everyone',
  );
};

export const transformOptimizelyFeaturesToSyncConfig = (
  optimizelyFeatures: Feature[],
): OptimizelySyncConfig => {
  const config: OptimizelySyncConfig = optimizelyFeatures.reduce(
    (acc: OptimizelySyncConfig, feature: Feature) => {
      Object.entries(feature.environments).forEach(([envName, env]) => {
        acc[envName] = acc[envName] || {};
        acc[envName][feature.key] =
          findEveryoneRolloutRule(env)?.percentage_included || 0;
      });

      return acc;
    },
    {} as OptimizelySyncConfig,
  );

  return config;
};

export const transformValueToRolloutRule = (value: number): RolloutRule => {
  return {
    audience_conditions: 'everyone',
    enabled: true,
    percentage_included: value,
  };
};
