import { describe, it, expect } from 'vitest';
import config from '../next.config.mjs';

describe('next config', () => {
  it('exports a default object', () => {
    expect(typeof config).toBe('object');
  });
  it('has experimental.serverActions.bodySizeLimit set to "2mb"', () => {
    expect(config?.experimental?.serverActions?.bodySizeLimit).toBe('2mb');
  });
});
