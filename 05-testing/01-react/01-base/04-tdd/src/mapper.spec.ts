import * as apiModel from './api-model';
import * as viewModel from './view-model';
import { mapMemberListFromApiToVm } from './mapper';

describe('mapper specs', () => {
  it.each<apiModel.Member[]>([undefined, null, []])(
    'should return empty array when it feeds members equals %p',
    (members: any) => {
      // Arrange

      // Act
      const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

      // Assert
      expect(result).toEqual([]);
    }
  );

  it('should return array one mapped item when it feed array with one item', () => {
    // Arrange
    const members: apiModel.Member[] = [
      { id: 1, login: 'test login', avatar_url: 'test avatar' },
    ];

    // Act
    const result: viewModel.Member[] = mapMemberListFromApiToVm(members);

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
