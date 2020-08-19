const getStringLowerCase = (value: string) =>
  value ? value.toLowerCase().trim() : '';

const filterByField = <Entity, Filter>(
  entity: Entity,
  filter: Filter,
  field: string
) => {
  const filterField = getStringLowerCase(`${filter[field]}`);
  const entityField = getStringLowerCase(`${entity[field]}`);

  return !filterField || entityField.indexOf(filterField) >= 0;
};

const isUndefinedOrNull = value => value === undefined || value === null;

export const filterByFields = <Entity, Filter>(
  collection: Entity[],
  filter: Filter
) =>
  Array.isArray(collection)
    ? collection.filter(
        item =>
          !filter ||
          Object.keys(filter).every(
            field =>
              isUndefinedOrNull(filter[field]) ||
              filterByField(item, filter, field)
          )
      )
    : [];
