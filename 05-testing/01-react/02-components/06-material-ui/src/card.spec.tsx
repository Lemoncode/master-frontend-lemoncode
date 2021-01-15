import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardComponent } from './card';

describe('Card component specs', () => {
  it('should display a card with title and body when it feeds a title and body', () => {
    // Arrange
    const props = {
      title: 'Test title',
      body: 'Test body',
      onClick: jest.fn(),
    };

    // Act
    render(<CardComponent {...props} />);

    const titleElement = screen.getByText(props.title);
    const bodyElement = screen.getByText(props.body);

    // Assert
    expect(titleElement).toBeInTheDocument();
    expect(bodyElement).toBeInTheDocument();
  });

  it('should call onClick property when it clicks on "Learn more" button', () => {
    // Arrange
    const props = {
      title: 'Test title',
      body: 'Test body',
      onClick: jest.fn(),
    };

    // Act
    render(<CardComponent {...props} />);

    const buttonElement = screen.getByRole('button', { name: 'Learn more' });
    userEvent.click(buttonElement);

    // Assert
    expect(props.onClick).toHaveBeenCalled();
  });
});
