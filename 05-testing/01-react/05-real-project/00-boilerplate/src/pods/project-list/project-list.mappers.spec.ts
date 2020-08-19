import * as apiModel from './api/project-list.api-model';
import * as viewModel from './project-list.vm';
import { mapProjectListFromApiToVm } from './project-list.mappers';

describe('./pods/project-list', () => {
  it('should return empty array when feeding undefined project list', () => {
    // Arrange
    const projectList = undefined;

    // Act
    const result = mapProjectListFromApiToVm(projectList);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return empty array when feeding null project list', () => {
    // Arrange
    const projectList = null;

    // Act
    const result = mapProjectListFromApiToVm(projectList);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return empty array when feeding empty array project list', () => {
    // Arrange
    const projectList = [];

    // Act
    const result = mapProjectListFromApiToVm(projectList);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return one item with values when passing one item with values', () => {
    // Arrange
    const projectList: apiModel.Project[] = [
      {
        id: 'test id',
        isActive: true,
        code: 'test code',
        name: 'test project name',
        lastDateIncurred: '02/02/2020',
        creationDate: '05/11/2019',
      },
    ];

    const expectedResult: viewModel.Project[] = [
      {
        id: 'test id',
        isActive: true,
        code: 'test code',
        name: 'test project name',
        lastDateIncurred: '02/02/2020',
        creationDate: '05/11/2019',
      },
    ];

    // Act
    const result = mapProjectListFromApiToVm(projectList);

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return two item with values when passing two item with values', () => {
    // Arrange
    const projectList: apiModel.Project[] = [
      {
        id: 'test id 1',
        isActive: true,
        code: 'test code',
        name: 'test project name 1',
        lastDateIncurred: '02/02/2020',
        creationDate: '05/11/2019',
      },
      {
        id: 'test id 2',
        isActive: false,
        code: 'test code',
        name: 'test project name 2',
        lastDateIncurred: '02/11/2020',
        creationDate: '05/05/2019',
      },
    ];

    const expectedResult: viewModel.Project[] = [
      {
        id: 'test id 1',
        isActive: true,
        code: 'test code',
        name: 'test project name 1',
        lastDateIncurred: '02/02/2020',
        creationDate: '05/11/2019',
      },
      {
        id: 'test id 2',
        isActive: false,
        code: 'test code',
        name: 'test project name 2',
        lastDateIncurred: '02/11/2020',
        creationDate: '05/05/2019',
      },
    ];

    // Act
    const result = mapProjectListFromApiToVm(projectList);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});
