export const flattenObject = <Entity extends object = {}>(
  entity: Entity,
  key?: string
) =>
  Boolean(entity)
    ? Object.entries(entity).reduce((flatObject, [subKey, value]) => {
        const composedKey = key ? `${key}.${subKey}` : subKey;
        const newValue =
          typeof value !== 'object' || value === null || Array.isArray(value)
            ? { [composedKey]: value }
            : flattenObject(value, composedKey);
        return {
          ...flatObject,
          ...newValue,
        };
      }, {})
    : null;
