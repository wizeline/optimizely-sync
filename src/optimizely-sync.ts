import type OptimizelyClient from './optimizely-client';

import {
  compareConfigs,
  findUnconfiguredFeatures,
  findUndeployedFeatures,
  transformOptimizelyFeaturesToSyncConfig,
  transformValueToRolloutRule,
} from './optimizely-sync-config-helpers';
import { OptimizelySyncConfig } from './optimizely-sync-types';
import { Feature } from './optimizely-client-types';

export async function createFeatures(
  dryRun: boolean,
  optimizelyClient: OptimizelyClient,
  config: OptimizelySyncConfig,
  features: Feature[],
): Promise<void> {
  const featureToCreate = findUndeployedFeatures(config, features);
  if (featureToCreate.length > 0) {
    if (dryRun) {
      console.log(
        `Features that would have been created: ${featureToCreate.join(', ')}`,
      );
    } else {
      console.log(
        `Creating the following features: ${featureToCreate.join(', ')}`,
      );
      const createFeatureResults = await Promise.allSettled(
        featureToCreate.map((key) =>
          optimizelyClient.createFeature({
            key,
          }),
        ),
      );
      console.log(createFeatureResults);
    }
  }
}

export async function deleteFeatures(
  dryRun: boolean,
  optimizelyClient: OptimizelyClient,
  config: OptimizelySyncConfig,
  features: Feature[],
): Promise<void> {
  const featuresToDelete = findUnconfiguredFeatures(config, features);
  if (featuresToDelete.length > 0) {
    if (dryRun) {
      console.log(
        `Features that would have been deleted: ${featuresToDelete.join(', ')}`,
      );
    } else {
      console.log(
        `Deleting the following features: ${featuresToDelete.join(', ')}`,
      );
      const deletedFeatureResults = await Promise.allSettled(
        featuresToDelete.map(async (key) => {
          const featureId = features.find((feature) => feature.key === key)?.id;
          if (!featureId) {
            throw new Error(`Could not find id for "${key}" to delete.`);
          }

          return optimizelyClient.deleteFeature(featureId);
        }),
      );
      console.log(deletedFeatureResults);
    }
  }
}

export function detectChanges(
  config: OptimizelySyncConfig,
  features: Feature[],
): boolean {
  const deployedConfig = transformOptimizelyFeaturesToSyncConfig(features);
  const configDiff = compareConfigs(config, deployedConfig);

  if (configDiff.length === 0) {
    console.log('No changes needed.');
    return false;
  }

  console.log('Changes:');
  configDiff.forEach(({ envName, featureName, leftValue, rightValue }) => {
    console.log(
      `  • Envinronment ${envName}'s "${featureName}" feature will change from "${rightValue}" to "${leftValue}"`,
    );
  });
  return true;
}

export async function persistFeatures(
  dryRun: boolean,
  optimizelyClient: OptimizelyClient,
  config: OptimizelySyncConfig,
  features: Feature[],
): Promise<void> {
  if (!dryRun) {
    console.log('Persisting configuration:');
    const data = await Promise.allSettled(
      features.map((feature) => {
        const featureEnvConfig = Object.fromEntries(
          Object.keys(feature.environments).map((envName) => {
            return [
              envName,
              {
                rollout_rules: [
                  transformValueToRolloutRule(config[envName][feature.key]),
                ],
              },
            ];
          }),
        );

        return optimizelyClient.updateFeature(feature.id, {
          environments: featureEnvConfig,
        });
      }),
    );
    console.log(data);
  }
}
