import * as apiModel from './api/list.api-model';
import * as viewModel from './list.vm';
import { mapMemberListFromApiToVm } from './list.mappers';

describe('list mappers specs', () => {
  describe('mapMemberListFromApiToVm', () => {
    it('should return empty array when it feeds memberList equals undefined', () => {
      // Arrange
      const memberList: apiModel.Member[] = undefined;

      // Act
      const result = mapMemberListFromApiToVm(memberList);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when it feeds memberList equals null', () => {
      // Arrange
      const memberList: apiModel.Member[] = null;

      // Act
      const result = mapMemberListFromApiToVm(memberList);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when it feeds memberList equals empty array', () => {
      // Arrange
      const memberList: apiModel.Member[] = [];

      // Act
      const result = mapMemberListFromApiToVm(memberList);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return array with one mapped item when it feeds memberList with one item', () => {
      // Arrange
      const memberList: apiModel.Member[] = [
        {
          id: 'test-id',
          login: 'test-login',
          avatar_url: 'test-avatar-url',
        },
      ];

      // Act
      const result = mapMemberListFromApiToVm(memberList);

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
