import * as apiModel from './api-model';
import * as viewModel from './view-model';
import { mapMemberListFromApiToVm } from './mapper';

describe('mapper specs', () => {
  it.each<{ members: apiModel.Member[] }>([
    { members: undefined },
    { members: null },
    { members: [] },
  ])(
    'should return empty array when it feeds members equals $members',
    ({ members }) => {
      // Arrange

      // Act
      const result = mapMemberListFromApiToVm(members);

      // Assert
      const expectedResult: viewModel.Member[] = [];
      expect(result).toEqual(expectedResult);
    }
  );

  it('should return array one mapped item when it feed array with one item', () => {
    // Arrange
    const members: apiModel.Member[] = [
      { id: 1, login: 'test login', avatar_url: 'test avatar' },
    ];

    // Act
    const result = mapMemberListFromApiToVm(members);

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
