import { expect } from '@playwright/test';

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
}

export function validateType(value: any, expectedType: string, path: string): void {
  switch(expectedType.toLowerCase()) {
    case 'string':
      expect(typeof value).toBe('string');
      break;
    case 'number':
      expect(typeof value).toBe('number');
      break;
    case 'boolean':
      expect(typeof value).toBe('boolean');
      break;
    case 'date':
      expect(Date.parse(value)).not.toBeNaN();
      break;
    case 'array':
      expect(Array.isArray(value)).toBeTruthy();
      break;
    case 'object':
      expect(typeof value).toBe('object');
      expect(value).not.toBeNull();
      break;
    default:
      throw new Error(`Unsupported type: ${expectedType}`);
  }
}