import Axios, { AxiosError } from 'axios';
import { Member } from './api-model';
import { getMembers } from './api';

describe('api specs', () => {
  it('should return members when it resolves the request successfully', async () => {
    // Arrange
    const members: Member[] = [
      {
        id: 1,
        login: 'test login',
        avatar_url: 'test avatar_url',
      },
    ];

    const getStub = jest.spyOn(Axios, 'get').mockResolvedValue({
      data: members,
    });

    // Act
    const result = await getMembers();

    // Assert
    expect(getStub).toHaveBeenCalledWith(
      'https://api.github.com/orgs/lemoncode/members'
    );
    expect(result).toEqual(members);
  });

  it('should throw an error with "Too much Github API calls!" when it rejects the request with 403 status code', async () => {
    // Arrange
    const getStub = jest.spyOn(Axios, 'get').mockRejectedValue({
      response: {
        status: 403,
      },
    } as AxiosError);

    // Act
    try {
      const result = await getMembers();
    } catch (error) {
      // Assert
      expect(getStub).toHaveBeenCalledWith(
        'https://api.github.com/orgs/lemoncode/members'
      );
      expect(error).toEqual('Too much Github API calls!');
    }
  });

  it('should throw an error with "Unavailable service" when it rejects the request with 503 status code', async () => {
    // Arrange
    const getStub = jest.spyOn(Axios, 'get').mockRejectedValue({
      response: {
        status: 503,
      },
    } as AxiosError);

    // Act
    try {
      const result = await getMembers();
    } catch (error) {
      // Assert
      expect(getStub).toHaveBeenCalledWith(
        'https://api.github.com/orgs/lemoncode/members'
      );
      expect(error).toEqual('Unavailable service');
    }
  });

  it('should return undefined when it rejects the request with different status code', async () => {
    // Arrange
    const getStub = jest.spyOn(Axios, 'get').mockRejectedValue({
      response: {
        status: 404,
      },
    } as AxiosError);

    // Act
    const result = await getMembers();
    // Assert
    expect(getStub).toHaveBeenCalledWith(
      'https://api.github.com/orgs/lemoncode/members'
    );
    expect(result).toBeUndefined();
  });
});
