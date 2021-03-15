export type OptimizelySyncConfig = Record<string, Record<string, number>>;

export type OptimizelySyncArgment = {
  accessToken: string;
  config: OptimizelySyncConfig;
  projectId: number;
};
