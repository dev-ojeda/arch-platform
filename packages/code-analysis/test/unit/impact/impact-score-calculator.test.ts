// packages/code-analysis/test/unit/impact/impact-score-calculator.test.ts

import { describe, expect, it } from 'vitest';

import { ImpactScoreCalculator } from '../../../src/impact/impact-score-calculator.js';

describe('ImpactScoreCalculator', () => {
  it('should calculate high impact score', () => {
    const calculator = new ImpactScoreCalculator();

    const result = calculator.calculate({
      symbolId: 'user-service-create',

      affectedSymbols: [
        'controller-create',
        'handler-create',
        'service-create',
        'repository-create',
      ],

      affectedPackages: ['@arch/api', '@arch/application'],

      affectedFiles: ['controller.ts', 'handler.ts', 'service.ts'],

      depth: 3,
    });

    expect(result.symbolId).toBe('user-service-create');

    expect(result.score).toBe(17.5);

    expect(result.risk).toBe('high');

    expect(result.affectedSymbols).toBe(4);

    expect(result.affectedPackages).toBe(2);

    expect(result.depth).toBe(3);
  });

  it('should classify low impact changes', () => {
    const calculator = new ImpactScoreCalculator();

    const result = calculator.calculate({
      symbolId: 'isolated-symbol',

      affectedSymbols: [],

      affectedPackages: [],

      affectedFiles: [],

      depth: 1,
    });

    expect(result.score).toBe(2);

    expect(result.risk).toBe('low');
  });
});
