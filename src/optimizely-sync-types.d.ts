export type OptimizelySyncConfig = Record<
  string,
  Record<string, number | boolean>
>;

export type OptimizelySyncArgment = {
  accessToken: string;
  config: OptimizelySyncConfig;
  projectId: number;
};
