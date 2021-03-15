import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export const readConfigFile = (filePath: string): unknown => {
  const strData = readFileSync(filePath);
  const data: unknown = JSON.parse(strData.toString());

  return data;
};

export const readConfigDir = (dirPath: string): Record<string, unknown> => {
  const filenames = readdirSync(dirPath);
  if (!filenames.every((filename) => filename.endsWith('.json'))) {
    throw new Error('Config directory must only contain JSON files.');
  }

  const data = Object.fromEntries(
    filenames.map((filename) => {
      const envName = filename.replace(/\.json$/, '');
      const filePath = join(dirPath, filename);
      const envData = readConfigFile(filePath);

      return [envName, envData];
    }),
  );

  return data;
};
