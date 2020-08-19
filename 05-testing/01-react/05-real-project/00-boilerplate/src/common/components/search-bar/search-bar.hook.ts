import React from 'react';
import { useDebounce } from 'common/hooks';
import { filterByText } from 'common/helpers';

export const useSearchBar = <Entity, Key extends keyof Entity>(
  collection: Entity[],
  fields: Key[] | string[]
) => {
  const [search, setSearch] = React.useState('');
  const [filteredList, setFilteredList] = React.useState<Entity[]>(collection);
  React.useEffect(() => {
    setFilteredList(collection);
  }, [collection]);

  const debouncedSearch = useDebounce(search, 250);
  React.useEffect(() => {
    const newFilteredList = filterByText(collection, debouncedSearch, fields);
    setFilteredList(newFilteredList);
  }, [debouncedSearch]);

  return {
    search,
    onSearch: setSearch,
    filteredList,
  };
};
