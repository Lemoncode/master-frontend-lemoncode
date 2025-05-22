import * as React from 'react';
import { Row } from '@tanstack/react-table';
import { render } from '@testing-library/react';
import { BodyComponent } from './body.component';
import { RowComponent } from './row.component';
import { CellComponent } from './cell.component';

interface TestRow {
  testRow: number;
}

describe('common/table/BodyComponent', () => {
  it('should render as expected', () => {
    // Arrange
    const props = {
      rows: [
        { original: { testRow: 1 } },
        { original: { testRow: 2 } },
        { original: { testRow: 3 } },
      ] as unknown as Row<TestRow>[],
      rowRenderer: (props) => (
        <RowComponent>
          <CellComponent>{props.row.testRow}</CellComponent>
        </RowComponent>
      ),
      prepareRow: vi.fn(),
    };

    // Act
    const { getByText } = render(<BodyComponent<TestRow> {...props} />);

    // Assert
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
  });
});
