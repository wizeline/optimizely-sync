/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { mocked } from 'ts-jest/utils';
import origNodeFetch from 'node-fetch';
import OptimizelyClient from './optimizely-client';

jest.mock('node-fetch', () => jest.fn());

const nodeFetch = mocked(origNodeFetch);

describe('optimizely-client', () => {
  describe('OptimizelyClient', () => {
    const config = {
      accessToken: 'fake-token',
      projectId: 1234567890,
    };

    it('is a class', () => {
      expect(new OptimizelyClient(config)).toBeInstanceOf(OptimizelyClient);
    });

    describe('listEnvironments', () => {
      it('calls the correct endpoint with the correct method and headers', async () => {
        const fakeEnvironments = Symbol();
        nodeFetch.mockReturnValue(
          // @ts-expect-error -- Intetionally returning a subset of the Response object
          Promise.resolve({
            json: () => fakeEnvironments,
          }),
        );
        const optimizelyClient = new OptimizelyClient(config);

        const environments = await optimizelyClient.listEnvironments();

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/environments?project_id=${config.projectId}`,
          expect.objectContaining({
            headers: expect.objectContaining<Record<string, string>>({
              Authorization: `Bearer ${config.accessToken}`,
              'Content-Type': 'application/json',
            }),
          }),
        );
        expect(environments).toEqual(fakeEnvironments);
      });
    });

    describe('listFeatures', () => {
      it('calls the correct endpoint with the correct method and headers', async () => {
        const fakeFeatures = Symbol();
        nodeFetch.mockReturnValue(
          // @ts-expect-error -- Intetionally returning a subset of the Response object
          Promise.resolve({
            json: () => fakeFeatures,
          }),
        );
        const optimizelyClient = new OptimizelyClient(config);

        const features = await optimizelyClient.listFeatures();

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/features?project_id=${config.projectId}`,
          expect.objectContaining({
            headers: expect.objectContaining<Record<string, string>>({
              Authorization: `Bearer ${config.accessToken}`,
              'Content-Type': 'application/json',
            }),
          }),
        );
        expect(features).toEqual(fakeFeatures);
      });
    });

    describe('createFeature', () => {
      it('calls the correct endpoint with the correct method and headers', async () => {
        const featureBody = {
          key: 'new_feature_page',
        };
        const fakeFeature = Symbol();
        nodeFetch.mockReturnValue(
          // @ts-expect-error -- Intetionally returning a subset of the Response object
          Promise.resolve({
            json: () => fakeFeature,
          }),
        );
        const optimizelyClient = new OptimizelyClient(config);

        const feature = await optimizelyClient.createFeature(featureBody);

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/features?project_id=${config.projectId}`,
          {
            headers: expect.objectContaining<Record<string, string>>({
              Authorization: `Bearer ${config.accessToken}`,
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              project_id: config.projectId,
              key: featureBody.key,
            }),
            method: 'POST',
          },
        );
        expect(feature).toEqual(fakeFeature);
      });
    });

    describe('fetchWithAuth', () => {
      it('adds an Authorization header when no init is passed', async () => {
        const optimizelyClient = new OptimizelyClient(config);

        await optimizelyClient.fetchWithAuth('/some-endpoint');

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/some-endpoint?project_id=${config.projectId}`,
          expect.objectContaining({
            headers: expect.objectContaining<Record<string, string>>({
              Authorization: `Bearer ${config.accessToken}`,
            }),
          }),
        );
      });

      it('adds an Authorization header when an init is passed without headers', async () => {
        const optimizelyClient = new OptimizelyClient(config);

        await optimizelyClient.fetchWithAuth('/some-endpoint', {
          method: 'POST',
        });

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/some-endpoint?project_id=${config.projectId}`,
          expect.objectContaining({
            headers: expect.objectContaining<Record<string, string>>({
              Authorization: `Bearer ${config.accessToken}`,
            }),
            method: 'POST',
          }),
        );
      });

      it('uses the passed Authorization header when one is supplied', async () => {
        const optimizelyClient = new OptimizelyClient(config);

        await optimizelyClient.fetchWithAuth('/some-endpoint', {
          headers: {
            Authorization: 'this should override',
          },
        });

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/some-endpoint?project_id=${config.projectId}`,
          expect.objectContaining({
            headers: expect.objectContaining<Record<string, string>>({
              Authorization: 'this should override',
            }),
          }),
        );
      });
    });

    describe('fetchJson', () => {
      it('adds a Content-Type header when no init is passed', async () => {
        const optimizelyClient = new OptimizelyClient(config);

        await optimizelyClient.fetchJson('/some-endpoint');

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/some-endpoint?project_id=${config.projectId}`,
          expect.objectContaining({
            headers: expect.objectContaining<Record<string, string>>({
              'Content-Type': 'application/json',
            }),
          }),
        );
      });

      it('uses the passed Content-Type header when one is passed', async () => {
        const optimizelyClient = new OptimizelyClient(config);

        await optimizelyClient.fetchJson('/some-endpoint', {
          headers: {
            'Content-Type': 'text/plain',
          },
        });

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/some-endpoint?project_id=${config.projectId}`,
          expect.objectContaining({
            headers: expect.objectContaining<Record<string, string>>({
              'Content-Type': 'text/plain',
            }),
          }),
        );
      });

      it('rejects when the status code is not 2xx', async () => {
        nodeFetch.mockReturnValue(
          // @ts-expect-error -- Intetionally returning a subset of the Response object
          Promise.resolve({
            status: 404,
            text: () => 'A response body',
          }),
        );
        const optimizelyClient = new OptimizelyClient(config);

        await expect(
          optimizelyClient.fetchJson('/some-endpoint'),
        ).rejects.toMatchInlineSnapshot(
          `[Error: Bad status code: 404. Error: A response body]`,
        );
      });
    });

    describe('getFeature', () => {
      it('calls the correct endpoint with the correct method and headers', async () => {
        const featureId = 5;
        const fakeFeature = Symbol();
        nodeFetch.mockReturnValue(
          // @ts-expect-error -- Intetionally returning a subset of the Response object
          Promise.resolve({
            json: () => fakeFeature,
          }),
        );
        const optimizelyClient = new OptimizelyClient(config);

        const feature = await optimizelyClient.getFeature(featureId);

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/features/${featureId}?project_id=${config.projectId}`,
          expect.objectContaining({
            headers: expect.objectContaining<Record<string, string>>({
              Authorization: `Bearer ${config.accessToken}`,
              'Content-Type': 'application/json',
            }),
          }),
        );
        expect(feature).toEqual(fakeFeature);
      });
    });

    describe('updateFeature', () => {
      it('calls the correct endpoint with the correct method and headers', async () => {
        const featureId = 5;
        const featureBody = {
          description: 'New description',
        };
        const fakeFeatureResponse = Symbol();
        nodeFetch.mockReturnValue(
          // @ts-expect-error -- Intetionally returning a subset of the Response object
          Promise.resolve({
            json: () => fakeFeatureResponse,
          }),
        );
        const optimizelyClient = new OptimizelyClient(config);

        const feature = await optimizelyClient.updateFeature(
          featureId,
          featureBody,
        );

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/features/${featureId}?project_id=${config.projectId}`,
          {
            headers: expect.objectContaining<Record<string, string>>({
              Authorization: `Bearer ${config.accessToken}`,
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              description: featureBody.description,
            }),
            method: 'PATCH',
          },
        );
        expect(feature).toEqual(fakeFeatureResponse);
      });
    });

    describe('deleteFeature', () => {
      it('calls the correct endpoint with the correct method and headers', async () => {
        const featureId = 5;
        nodeFetch.mockReturnValue(
          // @ts-expect-error -- Intetionally returning a subset of the Response object
          Promise.resolve({
            status: 204,
          }),
        );
        const optimizelyClient = new OptimizelyClient(config);

        const response = await optimizelyClient.deleteFeature(featureId);

        expect(nodeFetch).toBeCalledTimes(1);
        expect(nodeFetch).toBeCalledWith(
          `https://api.optimizely.com/v2/features/${featureId}?project_id=${config.projectId}`,
          {
            headers: expect.objectContaining<Record<string, string>>({
              Authorization: `Bearer ${config.accessToken}`,
            }),
            method: 'DELETE',
          },
        );
        expect(response).toEqual(undefined);
      });

      it('rejects when the status code is not 204', async () => {
        const featureId = 5;
        nodeFetch.mockReturnValue(
          // @ts-expect-error -- Intetionally returning a subset of the Response object
          Promise.resolve({
            status: 404,
            text: () => 'A response body',
          }),
        );
        const optimizelyClient = new OptimizelyClient(config);

        await expect(
          optimizelyClient.deleteFeature(featureId),
        ).rejects.toMatchInlineSnapshot(
          `[Error: Unable to delete feature "5".  Error: A response body]`,
        );
      });
    });
  });
});
