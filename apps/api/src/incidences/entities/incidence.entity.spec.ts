import 'reflect-metadata';
import { Incidence } from './incidence.entity';
import { IncidenceEnum } from '../enums/Incidence.enum';

describe('Incidence Entity', () => {
  it('should create an Incidence with expected properties', () => {
    const mockType = IncidenceEnum.SYSTEM_ERROR;
    const mockDescription = 'An error occurred during the process';

    const incidence = new Incidence();
    incidence.type = mockType;
    incidence.description = mockDescription;

    expect(incidence).toBeInstanceOf(Incidence);
    expect(incidence.type).toBe(mockType);
    expect(incidence.description).toBe(mockDescription);
  });
});
