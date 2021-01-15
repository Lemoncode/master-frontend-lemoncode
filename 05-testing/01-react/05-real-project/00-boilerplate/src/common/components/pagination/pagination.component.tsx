import React from 'react';
import Pagination from '@material-ui/lab/Pagination';

interface Props {
  pageIndex: number;
  pageCount: number;
  onChange: (pageIndex: number) => void;
  className?: string;
}

export const PaginationComponent: React.FunctionComponent<Props> = props => {
  const { pageIndex, pageCount, onChange, className } = props;

  const handleChange = (event, value) => {
    onChange(value - 1);
  };

  return (
    <Pagination
      className={className}
      color="primary"
      count={pageCount}
      page={pageIndex + 1}
      onChange={handleChange}
    />
  );
};
