import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('merges classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });
});
