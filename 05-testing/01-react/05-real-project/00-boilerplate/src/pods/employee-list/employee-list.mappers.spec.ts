import * as apiModel from './api/employee-list.api-model';
import * as viewModel from './employee-list.vm';
import { mapEmployeeListFromApiToVm } from './employee-list.mappers';

describe('./pods/employee-list', () => {
  it('should return empty array when feeding undefined employee list', () => {
    // Arrange
    const employeeList = undefined;

    // Act
    const result = mapEmployeeListFromApiToVm(employeeList);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return empty array when feeding null employee list', () => {
    // Arrange
    const employeeList = null;

    // Act
    const result = mapEmployeeListFromApiToVm(employeeList);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return empty array when feeding empty array employee list', () => {
    // Arrange
    const employeeList = [];

    // Act
    const result = mapEmployeeListFromApiToVm(employeeList);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return one item with values when passing one item with values', () => {
    // Arrange
    const employeeList: apiModel.Employee[] = [
      {
        id: 'test id',
        isActive: true,
        name: 'test name',
        email: 'test@email.com',
        lastDateIncurred: '02/02/2020',
      },
    ];

    const expectedResult: viewModel.Employee[] = [
      {
        id: 'test id',
        isActive: true,
        name: 'test name',
        email: 'test@email.com',
        lastDateIncurred: '02/02/2020',
      },
    ];

    // Act
    const result = mapEmployeeListFromApiToVm(employeeList);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return two item with values when passing two item with values', () => {
    // Arrange
    const employeeList: apiModel.Employee[] = [
      {
        id: 'test id 1',
        isActive: true,
        name: 'test name 1',
        email: 'test@email.com',
        lastDateIncurred: '02/02/2020',
      },
      {
        id: 'test id 2',
        isActive: true,
        name: 'test name 2',
        email: 'test@email.com',
        lastDateIncurred: '02/02/2020',
      },
    ];

    const expectedResult: viewModel.Employee[] = [
      {
        id: 'test id 1',
        isActive: true,
        name: 'test name 1',
        email: 'test@email.com',
        lastDateIncurred: '02/02/2020',
      },
      {
        id: 'test id 2',
        isActive: true,
        name: 'test name 2',
        email: 'test@email.com',
        lastDateIncurred: '02/02/2020',
      },
    ];

    // Act
    const result = mapEmployeeListFromApiToVm(employeeList);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});
