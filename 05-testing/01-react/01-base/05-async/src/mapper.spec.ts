import * as apiModel from './api-model';
import * as viewModel from './view-model';
import { mapToMemberVMList } from './mapper';

describe('mapper specs', () => {
  it('should return empty array when it feeds undefined', () => {
    // Arrange
    const members: apiModel.Member[] = undefined;

    // Act
    const result: viewModel.Member[] = mapToMemberVMList(members);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return empty array when it feeds null', () => {
    // Arrange
    const members: apiModel.Member[] = null;

    // Act
    const result: viewModel.Member[] = mapToMemberVMList(members);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return empty array when it feeds empty array', () => {
    // Arrange
    const members: apiModel.Member[] = [];

    // Act
    const result: viewModel.Member[] = mapToMemberVMList(members);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return array one mapped item when it feed array with one item', () => {
    // Arrange
    const members: apiModel.Member[] = [
      { id: 1, login: 'test login', avatar_url: 'test avatar' },
    ];

    // Act
    const result: viewModel.Member[] = mapToMemberVMList(members);

    // Assert
    const expectedResult: viewModel.Member[] = [
      {
        id: '1',
        login: 'test login',
        avatarUrl: 'test avatar',
      },
    ];
    expect(result).toEqual(expectedResult);
  });
});
