import * as apiModel from './api/list.api-model';
import * as viewModel from './list.vm';
import { mapMemberListFromApiToVm } from './list.mappers';

describe('list mappers specs', () => {
  describe('mapMemberListFromApiToVm', () => {
    it.each<{ members: apiModel.Member[] }>([
      { members: undefined! },
      { members: null! },
      { members: [] },
    ])(
      'should return empty array when it feeds members equals $members',
      ({ members }) => {
        // Arrange

        // Act
        const result = mapMemberListFromApiToVm(members);

        // Assert
        expect(result).toEqual([]);
      }
    );

    it('should return array with one mapped item when it feeds members with one item', () => {
      // Arrange
      const members: apiModel.Member[] = [
        {
          id: 'test-id',
          login: 'test-login',
          avatar_url: 'test-avatar-url',
        },
      ];

      // Act
      const result = mapMemberListFromApiToVm(members);

      // Assert
      const expectedResult: viewModel.Member[] = [
        {
          id: 'test-id',
          name: 'test-login',
          imageUrl: 'test-avatar-url',
        },
      ];
      expect(result).toEqual(expectedResult);
    });
  });
});
