import * as React from 'react';
import { render, screen } from '@testing-library/react';
import * as api from './name-api';
import { NameCollection } from './name-collection';

describe('NameCollection component specs', () => {
  it('should display a list with one item when it mounts the component and it resolves the async call', async () => {
    // Arrange
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe']);

    // Act
    render(<NameCollection />);

    const itemsBeforeWait = screen.queryAllByRole('listitem');
    expect(itemsBeforeWait).toHaveLength(0);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(1);
    expect(getStub).toHaveBeenCalled();
  });

  it('should display a list with two items when it mounts the component and it resolves the async call', async () => {
    // Arrange
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe', 'Jane Doe']);

    // Act
    render(<NameCollection />);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toEqual('John Doe');
    expect(items[1].textContent).toEqual('Jane Doe');
    expect(getStub).toHaveBeenCalled();
  });
});
