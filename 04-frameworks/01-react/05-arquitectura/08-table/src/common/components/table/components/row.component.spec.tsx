import * as React from 'react';
import { render } from '@testing-library/react';
import { RowComponent } from './row.component';

describe('common/table/RowComponent', () => {
  it('should render as expected passing required properties', () => {
    // Arrange
    const props = {
      className: 'test-className',
      'data-testid': 'test-row',
    };

    // Act
    const { getByText, getByTestId } = render(
      <RowComponent {...props}>
        <td>{'Test rowData'}</td>
      </RowComponent>
    );

    // Assert
    expect(getByTestId(props['data-testid'])).toHaveClass(props.className);
    expect(getByText('Test rowData')).toBeInTheDocument();
  });

  it('should render a row component with two cells', () => {
    // Arrange
    const props = {
      className: 'test-className',
    };

    // Act
    const { getByText } = render(
      <RowComponent {...props}>
        <td>{'Test rowData 1'}</td>
        <td>{'Test rowData 2'}</td>
      </RowComponent>
    );

    // Assert
    expect(getByText('Test rowData 1')).toBeInTheDocument();
    expect(getByText('Test rowData 2')).toBeInTheDocument();
  });
});
