#!/usr/bin/env node

/* eslint-disable no-process-exit */
import OptimizelyClient from './optimizely-client';
import { Command } from 'commander';
import {
  readConfigDir,
  readConfigFile,
} from './optimizely-sync-config-readers';
import { validateConfig } from './optimizely-sync-config-validators';
import {
  createFeatures,
  deleteFeatures,
  persistFeatures,
} from './optimizely-sync';

const EXIT_CODES = {
  NO_ACCESS_TOKEN: 1,
  NO_PROJECT_ID: 2,
  NO_CONFIG: 3,
  TOO_MANY_CONFIG_FLAGS: 4,
  INVALID_CONFIG: 5,
} as const;

const program = new Command();

program
  .option('--dry-run', 'Log what would be done')
  .option(
    '-c, --config-file <path>',
    'The path to the file that contains your desired configuration.',
  )
  .option(
    '-d, --config-dir <path>',
    'The path to the directory that contains json files with your desired configurations.',
  )
  .option(
    '-p, --project-id <projectId>',
    'The id of the Optimizely project.  Can also be set via the OPTIMIZELY_PROJECT_ID environment variable.',
  )
  .option(
    '-t, --access-token <token>',
    'An Optimizely Personal Access Token.  Can also be set via the OPTIMIZELY_ACCESS_TOKEN environment variable.',
  );

program.parse(process.argv);

type CliOptions = {
  accessToken: string;
  configDir?: string;
  configFile?: string;
  dryRun: boolean;
  projectId: number;
};

function validateOptions(options: Record<string, string>): CliOptions {
  const accessToken =
    options.accessToken || process.env.OPTIMIZELY_ACCESS_TOKEN;
  const configDir = options.configDir;
  const configFile = options.configFile;
  const dryRun = !!options.dryRun;
  const projectId = options.projectId || process.env.OPTIMIZELY_PROJECT_ID;

  if (!accessToken) {
    console.error(
      `No Access Token provied.  Please use the '--access-token' flag or the OPTIMIZELY_ACCESS_TOKEN environment variable.`,
    );
    process.exit(EXIT_CODES.NO_ACCESS_TOKEN);
  }

  if (!projectId) {
    console.error(
      `No Project Id provied.  Please use the '--project-id' flag or the OPTIMIZELY_PROJECT_ID environment variable.`,
    );
    process.exit(EXIT_CODES.NO_PROJECT_ID);
  }

  if (!options.configFile && !options.configDir) {
    console.error(
      `No config provied.  Please use either the '--config-file' or '--config-dir' flag.`,
    );
    process.exit(EXIT_CODES.NO_CONFIG);
  }

  if (options.configFile && options.configDir) {
    console.error(
      `Too many config flags provied.  Please use only one of '--config-file' or '--config-dir'.`,
    );
    process.exit(EXIT_CODES.TOO_MANY_CONFIG_FLAGS);
  }

  return {
    accessToken,
    dryRun,
    projectId: Number(projectId),
    configDir,
    configFile,
  };
}

function readConfig(options: CliOptions): unknown {
  let config: unknown;

  if (options.configFile) {
    config = readConfigFile(options.configFile);
  } else if (options.configDir) {
    config = readConfigDir(options.configDir);
  } else {
    throw new Error('Either a configFile, or configDir must be specified');
  }

  return config;
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const options = validateOptions(program.opts());
  const config = readConfig(options);

  console.log(`Config: \n${JSON.stringify(config, null, 4)}`);

  try {
    if (!validateConfig(config)) {
      throw new Error(
        'Unexpected error.  validateConfig should throw not return false.',
      );
    }
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(EXIT_CODES.INVALID_CONFIG);
  }

  const optimizelyClient = new OptimizelyClient({
    accessToken: options.accessToken,
    projectId: options.projectId,
  });

  const features = await optimizelyClient.listFeatures();

  await createFeatures(options.dryRun, optimizelyClient, config, features);
  await deleteFeatures(options.dryRun, optimizelyClient, config, features);
  await persistFeatures(options.dryRun, optimizelyClient, config, features);
})();
