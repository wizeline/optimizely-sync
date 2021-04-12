import { validateConfig } from './optimizely-sync-config-validators';

describe('optimizely-sync-config-validators', () => {
  describe('validateConfig', () => {
    it('is a function', () => {
      expect(typeof validateConfig).toBe('function');
    });

    describe('invalid input validations', () => {
      const invalidConfigErrorSnapshot = `"Config must be of type Record<string, Record<string, number>>."`;
      const differentFeaturesErrorSnapshot = `"All environments don't have the same features."`;
      const invalidFeatureValueErrorSnapshot = `"Feature values must be an integer between 0 and 10,000 (inclusive)."`;

      it('throws an error if number is passed', () => {
        expect(() => validateConfig(1)).toThrowErrorMatchingInlineSnapshot(
          invalidConfigErrorSnapshot,
        );
      });

      it('throws an error if string is passed', () => {
        expect(() => validateConfig('')).toThrowErrorMatchingInlineSnapshot(
          invalidConfigErrorSnapshot,
        );
      });

      it('throws an error if boolean is passed', () => {
        expect(() => validateConfig(true)).toThrowErrorMatchingInlineSnapshot(
          invalidConfigErrorSnapshot,
        );
      });

      it('throws an error when passed an object of nubmers', () => {
        expect(() =>
          validateConfig({ dev: 1 }),
        ).toThrowErrorMatchingInlineSnapshot(invalidConfigErrorSnapshot);
      });

      it('throws an error when passed an object of strings', () => {
        expect(() =>
          validateConfig({ dev: '' }),
        ).toThrowErrorMatchingInlineSnapshot(invalidConfigErrorSnapshot);
      });

      it('throws an error when passed an object of booleans', () => {
        expect(() =>
          validateConfig({ dev: true }),
        ).toThrowErrorMatchingInlineSnapshot(invalidConfigErrorSnapshot);
      });

      it('throws an error when passed two environments with different features', () => {
        const config = {
          dev: { featureOne: 10000 },
          qa: { differentFeature: 0 },
        };

        expect(() => validateConfig(config)).toThrowErrorMatchingInlineSnapshot(
          differentFeaturesErrorSnapshot,
        );
      });

      it('throws an error when passed feature is configured with a negative number', () => {
        const config = {
          dev: { featureOne: -5 },
        };

        expect(() => validateConfig(config)).toThrowErrorMatchingInlineSnapshot(
          invalidFeatureValueErrorSnapshot,
        );
      });

      it('throws an error when passed feature is configured with a number over 10,000', () => {
        const config = {
          dev: { featureOne: 10001 },
        };

        expect(() => validateConfig(config)).toThrowErrorMatchingInlineSnapshot(
          invalidFeatureValueErrorSnapshot,
        );
      });

      it('throws an error when passed feature is configured with a decimal', () => {
        const config = {
          dev: { featureOne: 5000.5 },
        };

        expect(() => validateConfig(config)).toThrowErrorMatchingInlineSnapshot(
          invalidFeatureValueErrorSnapshot,
        );
      });

      it('throws an error when passed feature is configured with an object', () => {
        const config = {
          dev: { featureOne: {} },
        };

        expect(() => validateConfig(config)).toThrowErrorMatchingInlineSnapshot(
          invalidFeatureValueErrorSnapshot,
        );
      });

      it('throws an error when passed feature is configured with a string', () => {
        const config = {
          dev: { featureOne: '' },
        };

        expect(() => validateConfig(config)).toThrowErrorMatchingInlineSnapshot(
          invalidFeatureValueErrorSnapshot,
        );
      });

      it('throws an error when passed feature is configured with a boolean', () => {
        const config = {
          dev: { featureOne: true },
        };

        expect(() => validateConfig(config)).toThrowErrorMatchingInlineSnapshot(
          invalidFeatureValueErrorSnapshot,
        );
      });
    });

    describe('valid input validations', () => {
      it('accepts an empty object', () => {
        expect(validateConfig({})).toEqual(true);
      });

      it('accepts an object with one environment and no features', () => {
        expect(validateConfig({ dev: {} })).toEqual(true);
      });

      it('accepts an object with multiple environment and no features', () => {
        expect(validateConfig({ dev: {}, qa: {} })).toEqual(true);
      });

      it('accepts an object with one environment and one feature', () => {
        expect(validateConfig({ dev: { featureOne: 10000 } })).toEqual(true);
      });

      it('accepts an object with two environments each with one feature', () => {
        const config = { dev: { featureOne: 10000 }, qa: { featureOne: 0 } };
        expect(validateConfig(config)).toEqual(true);
      });
    });
  });
});
