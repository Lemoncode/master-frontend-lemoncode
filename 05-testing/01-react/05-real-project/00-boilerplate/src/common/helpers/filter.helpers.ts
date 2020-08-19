import get from 'lodash.get';
import { flattenObject } from './object.helpers';

const getStringLowerCase = (value: string): string =>
  value ? value.toLowerCase().trim() : '';

const removeAccents = (value: string) =>
  Boolean(value.normalize)
    ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : value;

const formatValue = value => {
  const stringValue = getStringLowerCase(`${value}`);
  return removeAccents(stringValue);
};

const filterByField = <Entity, Filter>(
  entity: Entity,
  filter: Filter,
  field: string
) => {
  const filterField = formatValue(filter[field]);
  const entityField = formatValue(get(entity, field));

  return !filterField || entityField.indexOf(filterField) >= 0;
};

const isUndefinedOrNull = value => value === undefined || value === null;

const matchEveryField = <Entity>(
  item: Entity,
  filter: Partial<Entity>
): boolean =>
  Object.keys(filter).every(
    field =>
      isUndefinedOrNull(filter[field]) || filterByField(item, filter, field)
  );

type Filter<Entity> = Partial<Entity> | { [key: string]: string };
type FilterFn = <Entity>(item: Entity, filter: Filter<Entity>) => boolean;

export const filterByFields = <Entity>(
  collection: Entity[],
  filter: Filter<Entity>,
  filterFn: FilterFn = matchEveryField
) => {
  const flatFilter = flattenObject(filter);

  return Array.isArray(collection)
    ? collection.filter(item => !flatFilter || filterFn(item, flatFilter))
    : [];
};

const matchSomeField = <Entity>(item: Entity, filter: Partial<Entity>) =>
  Object.keys(filter).some(
    field =>
      isUndefinedOrNull(filter[field]) || filterByField(item, filter, field)
  );

export const filterByText = <Entity, Key extends keyof Entity>(
  collection: Entity[],
  text: string,
  fields: Key[] | string[]
) => {
  const filter =
    Array.isArray(fields) &&
    (fields as Key[]).reduce(
      (newFilter, field) => ({
        ...newFilter,
        [field]: text,
      }),
      {}
    );

  return filterByFields(collection, filter, matchSomeField);
};
