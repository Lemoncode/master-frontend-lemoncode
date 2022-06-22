import React from 'react';
import { TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface LabelProps {
  placeholder: string;
}

interface Props {
  search: string;
  onSearch: (search: string) => void;
  labels: LabelProps;
  className?: string;
}

export const SearchBarComponent: React.FunctionComponent<Props> = (props) => {
  const { search, onSearch, labels, className } = props;

  return (
    <TextField
      className={className}
      value={search}
      onChange={(e) => onSearch(e.target.value)}
      placeholder={labels.placeholder}
      InputProps={{
        startAdornment: <SearchIcon />,
      }}
    />
  );
};
