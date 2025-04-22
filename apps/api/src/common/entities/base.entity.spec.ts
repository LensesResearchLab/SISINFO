import 'reflect-metadata';
import { Base } from './base.entity';

class BaseTest extends Base {}

describe('Base Entity', () => {
  it('should create an instance of Base with an id', () => {
    const base = new BaseTest();
    const mockId = '123e4567-e89b-12d3-a456-426614174000';
    base.id = mockId;

    expect(base).toBeInstanceOf(Base);
    expect(base.id).toBe(mockId);
  });
});
