import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookiesDialog } from './cookies-dialog';

describe('CookiesDialog component specs', () => {
  it('should display a button with text "Learn more about our cookies"', () => {
    // Arrange
    const props = {
      onAgreeClick: () => {},
    };

    // Act
    render(<CookiesDialog {...props} />);

    const buttonElement = screen.getByRole('button', {
      name: /learn more about our cookies/i,
    });

    // Assert
    expect(buttonElement).toBeInTheDocument();
  });

  it('should open dialog when click on "Learn more about our cookies" button', async () => {
    // Arrange
    const props = {
      onAgreeClick: () => {},
    };

    // Act
    render(<CookiesDialog {...props} />);

    const buttonElement = screen.getByRole('button', {
      name: /learn more about our cookies/i,
    });
    await userEvent.click(buttonElement);

    const dialogElement = screen.getByRole('dialog');

    // Assert
    expect(dialogElement).toBeInTheDocument();
  });

  it('should call onAgreeClick when it clicks on "Agree" button', async () => {
    // Arrange
    const props = {
      onAgreeClick: jest.fn(),
    };

    // Act
    render(<CookiesDialog {...props} />);

    // The only button available at this moment
    const buttonElement = screen.getByRole('button');
    await userEvent.click(buttonElement);

    const dialogElement = screen.getByRole('dialog');

    const agreeButtonElement = within(dialogElement).getByRole('button');
    await userEvent.click(agreeButtonElement);

    // Assert
    expect(props.onAgreeClick).toHaveBeenCalled();
  });
});
