import { mapEmployeeFromApiToVm } from './employee.mappers';
import * as apiModel from './api/employee.api-model';
import * as viewModel from './employee.vm';

describe('./pods/employee/employee.mappers', () => {
  it('should return empty employee when feeding null value', () => {
    // Arrange
    const employee = null;

    // Act
    const result = mapEmployeeFromApiToVm(employee);

    // Assert
    expect(result).toEqual(viewModel.createEmptyEmployee());
  });

  it('should return empty employee when feeding undefined value', () => {
    // Arrange
    const employee = undefined;

    // Act
    const result = mapEmployeeFromApiToVm(employee);

    // Assert
    expect(result).toEqual(viewModel.createEmptyEmployee());
  });

  it('should return expected result but feeding null project list', () => {
    // Arrange
    const employee: apiModel.Employee = {
      id: 'test id',
      name: 'test name',
      email: 'test@email.com',
      isActive: true,
      temporalPassword: 'test password',
      projects: null,
    };

    const expectedResult: viewModel.Employee = {
      id: 'test id',
      name: 'test name',
      email: 'test@email.com',
      isActive: true,
      temporalPassword: 'test password',
      projects: [],
    };

    // Act
    const result = mapEmployeeFromApiToVm(employee);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return expected result but feeding undefined project list', () => {
    // Arrange
    const employee: apiModel.Employee = {
      id: 'test id',
      name: 'test name',
      email: 'test@email.com',
      isActive: true,
      temporalPassword: 'test password',
      projects: undefined,
    };

    const expectedResult: viewModel.Employee = {
      id: 'test id',
      name: 'test name',
      email: 'test@email.com',
      isActive: true,
      temporalPassword: 'test password',
      projects: [],
    };

    // Act
    const result = mapEmployeeFromApiToVm(employee);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return expected result feeding correct values', () => {
    // Arrange
    const employee: apiModel.Employee = {
      id: 'test id',
      name: 'test name',
      email: 'test@email.com',
      isActive: true,
      temporalPassword: 'test password',
      projects: [
        {
          id: 'test id',
          projectName: 'test employee name',
          isAssigned: true,
        },
      ],
    };

    const expectedResult: viewModel.Employee = {
      id: 'test id',
      name: 'test name',
      email: 'test@email.com',
      isActive: true,
      temporalPassword: 'test password',
      projects: [
        {
          id: 'test id',
          projectName: 'test employee name',
          isAssigned: true,
        },
      ],
    };

    // Act
    const result = mapEmployeeFromApiToVm(employee);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});
