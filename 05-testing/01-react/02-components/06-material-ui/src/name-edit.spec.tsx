import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NameEdit } from './name-edit';

describe('NameEdit component specs', () => {
  it('should display a heading and input elements with empty userName value', () => {
    // Arrange

    // Act
    render(<NameEdit />);

    const h3Element = screen.getByRole('heading', { level: 3 });
    const inputElement = screen.getByRole('textbox');

    // Assert
    expect(h3Element).toBeInTheDocument();
    expect(h3Element.textContent).toEqual('');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('value', '');
  });

  it('should update h3 text when input changes', async () => {
    // Arrange

    // Act
    render(<NameEdit />);

    const inputElement = screen.getByRole('textbox') as HTMLInputElement;

    await userEvent.type(inputElement, 'John');
    const h3Element = screen.getByRole('heading', { level: 3 });

    // Assert
    expect(h3Element.textContent).toEqual('John');
    expect(inputElement).toHaveAttribute('value', 'John');
  });
});
