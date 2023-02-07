import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as api from './name-api';
import { UserEdit } from './user-edit';
import { NameCollection } from './name-collection';

const renderWithRouter = (component) =>
  render(
    <HashRouter>
      <Routes>
        <Route path="/" element={component} />
        <Route path="users/:name" element={<UserEdit />} />
      </Routes>
    </HashRouter>
  );

describe('NameCollection component specs', () => {
  it('should display a list with one item when it mounts the component and it resolves the async call', async () => {
    // Arrange
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe']);

    // Act
    renderWithRouter(<NameCollection />);

    const itemsBeforeWait = screen.queryAllByRole('listitem');
    expect(itemsBeforeWait).toHaveLength(0);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(1);
    expect(getStub).toHaveBeenCalled();
  });

  it('should remove initial list when it mounts the component and it resolves the async call', async () => {
    // Arrange
    const initialNameCollection = ['initial-user'];
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe']);

    // Act
    renderWithRouter(
      <NameCollection initialNameCollection={initialNameCollection} />
    );

    const initialItems = screen.getAllByRole('listitem');
    expect(initialItems).toHaveLength(1);
    expect(initialItems[0].textContent).toEqual('initial-user');

    await waitForElementToBeRemoved(screen.queryByText('initial-user'));

    // Assert
    expect(screen.queryByText('initial-user')).not.toBeInTheDocument();
  });

  it('should navigate to second user edit page when click in second user name', async () => {
    // Arrange
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe', 'Jane Doe']);

    // Act
    renderWithRouter(<NameCollection />);

    const links = await screen.findAllByRole('link');

    screen.debug();

    const secondUser = links[1];
    await userEvent.click(secondUser);

    screen.debug();

    const userEditElement = screen.getByRole('heading', {
      name: 'User name: Jane Doe',
    });

    // Assert
    expect(userEditElement).toBeInTheDocument();
  });
});
