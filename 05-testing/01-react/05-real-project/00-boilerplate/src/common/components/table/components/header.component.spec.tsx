import * as React from 'react';
import { HeaderGroup } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { HeaderComponent } from './header.component';

describe('common/table/HeaderComponent', () => {
  it('should be rendered as expected passing required properties', () => {
    // Arrange
    const props = {
      headerGroups: [
        {
          id: '1',
          headers: [
            {
              column: {
                columnDef: {
                  header: 'Test label',
                },
              },
              getContext: vi.fn(),
            },
          ],
        },
      ] as unknown as HeaderGroup<any>[],
    };

    // Act
    const { getByText } = render(<HeaderComponent {...props} />);

    // Assert
    expect(getByText('Test label')).toBeInTheDocument();
  });

  it('should render two columns passing two columns', () => {
    // Arrange
    const props = {
      headerGroups: [
        {
          id: '1',
          headers: [
            {
              column: {
                columnDef: {
                  header: 'Test label 1',
                },
              },
              getContext: vi.fn(),
            },
          ],
        },
        {
          id: '2',
          headers: [
            {
              column: {
                columnDef: {
                  header: 'Test label 2',
                },
              },
              getContext: vi.fn(),
            },
          ],
        },
      ] as unknown as HeaderGroup<any>[],
    };

    // Act
    const { getByText } = render(<HeaderComponent {...props} />);

    // Assert
    expect(getByText('Test label 1')).toBeInTheDocument();
    expect(getByText('Test label 2')).toBeInTheDocument();
  });
});
