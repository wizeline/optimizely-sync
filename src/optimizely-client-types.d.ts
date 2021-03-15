export type Environment = {
  id: number;
  is_primary: boolean;
  rollout_rules: RolloutRule[];
};

export type Feature = {
  archived: boolean;
  created: string;
  description: string;
  environments: Record<string, Environment>;
  id: number;
  key: string;
  last_modified: string;
  name: name;
  project_id: number;
  variables: Variable[];
};

export interface PartialFeature extends Partial<Feature> {
  environments?: Record<string, Partial<Environment>>;
  variables?: Partial<Variable>[];
}

export type RolloutRule = {
  audience_conditions: string;
  enabled: boolean;
  percentage_included: number;
};

type VariableType = 'boolean';
type Variable = {
  archived: boolean;
  default_value: string;
  description: string;
  id: number;
  key: string;
  type: VariableType;
};
