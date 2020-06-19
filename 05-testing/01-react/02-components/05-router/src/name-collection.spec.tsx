import * as React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as api from './name-api';
import { UserEdit } from './user-edit';
import { NameCollection } from './name-collection';

const renderWithRouter = (component) => {
  return {
    ...render(
      <HashRouter>
        <Switch>
          <Route path="/users/:name" component={UserEdit} />
        </Switch>
        {component}
      </HashRouter>
    ),
  };
};

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

  it('should display a list with two items when it mounts the component and it resolves the async call', async () => {
    // Arrange
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe', 'Jane Doe']);

    // Act
    renderWithRouter(<NameCollection />);

    const items = await screen.findAllByRole('listitem');

    // Assert
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toEqual('John Doe');
    expect(items[1].textContent).toEqual('Jane Doe');
    expect(getStub).toHaveBeenCalled();
  });

  it('should navigate to second user edit page when click in second user name', async () => {
    // Arrange
    const getStub = jest
      .spyOn(api, 'getNameCollection')
      .mockResolvedValue(['John Doe', 'Jane Doe']);

    // Act
    renderWithRouter(<NameCollection />);

    const links = await screen.findAllByRole('link');

    const secondUser = links[1];
    userEvent.click(secondUser);

    const userEditElement = screen.getByRole('heading', {
      name: 'User name: Jane Doe',
    });

    // Assert
    expect(userEditElement).toBeInTheDocument();
  });
});
