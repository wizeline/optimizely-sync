import nodeFetch, { RequestInit, Response } from 'node-fetch';
import type {
  Environment,
  Feature,
  PartialFeature,
  RolloutRule,
} from './optimizely-client-types';

export default class OptimizelyClient {
  private accessToken: string;
  private projectId: number;

  constructor(config: { accessToken: string; projectId: number }) {
    this.accessToken = config.accessToken;
    this.projectId = config.projectId;
  }

  static fineEveryoneRolloutRule(env: Environment): undefined | RolloutRule {
    return env.rollout_rules.find(
      (rule) => rule.audience_conditions === 'everyone',
    );
  }

  fetchWithAuth(path: string, init?: RequestInit): Promise<Response> {
    const requestInit: RequestInit = {
      ...init,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        ...init?.headers,
      },
    };

    return nodeFetch(
      `https://api.optimizely.com/v2${path}?project_id=${this.projectId}`,
      requestInit,
    );
  }

  async fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
    const requestInit: RequestInit = {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    };

    const response = await this.fetchWithAuth(path, requestInit);

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Bad status code: ${response.status}. Error: ${await response.text()}`,
      );
    }

    return response.json() as Promise<T>;
  }

  listEnvironments(): Promise<unknown> {
    return this.fetchJson('/environments');
  }

  listFeatures(): Promise<Feature[]> {
    return this.fetchJson<Feature[]>('/features');
  }

  createFeature(body: PartialFeature): Promise<unknown> {
    return this.fetchJson<Feature>(`/features`, {
      method: 'POST',
      body: JSON.stringify({
        project_id: this.projectId,
        ...body,
      }),
    });
  }

  getFeature(id: number): Promise<Feature> {
    return this.fetchJson<Feature>(`/features/${id}`);
  }

  updateFeature(id: number, body: PartialFeature): Promise<unknown> {
    return this.fetchJson<Feature>(`/features/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async deleteFeature(id: number): Promise<void> {
    const response = await this.fetchWithAuth(`/features/${id}`, {
      method: 'DELETE',
    });

    if (response.status !== 204) {
      throw new Error(
        `Unable to delete feature "${id}".  Error: ${await response.text()}`,
      );
    }
  }
}
