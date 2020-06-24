import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NameEdit } from './name-edit';

describe('NameEdit component specs', () => {
  it('should display a label and input elements with empty userName value', () => {
    // Arrange

    // Act
    render(<NameEdit />);

    const labelElement = screen.getByRole('heading', { name: '' });
    const inputElement = screen.getByRole('textbox', { name: '' });

    // Assert
    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it('should update h3 text when input changes', () => {
    // Arrange

    // Act
    render(<NameEdit />);

    const labelElement = screen.getByRole('heading', { name: '' });
    const inputElement = screen.getByRole('textbox', {
      name: '',
    }) as HTMLInputElement;

    userEvent.type(inputElement, 'John');

    // Assert
    expect(labelElement.textContent).toEqual('John');
    expect(inputElement.value).toEqual('John');
  });
});
