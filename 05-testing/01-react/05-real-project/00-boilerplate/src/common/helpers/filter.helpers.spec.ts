import { filterByFields, filterByText } from './filter.helpers';
import { Lookup } from 'common/models';

interface Item {
  id: string;
  name: string;
  age: number;
  cif: string;
  isBlocked: boolean;
  role?: Lookup;
}

describe('common/helpers/filter.helpers specs', () => {
  describe('filterByFields', () => {
    it('should return empty array when it feeds collection equals undefined', () => {
      // Arrange
      const collection: Item[] = undefined;
      const filter = undefined;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when it feeds collection equals null', () => {
      // Arrange
      const collection: Item[] = null;
      const filter = undefined;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when it feeds collection equals empty array', () => {
      // Arrange
      const collection: Item[] = [];
      const filter = undefined;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return same array when it feeds collection with one item and filter equals undefined', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = undefined;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter equals null', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = null;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter with name and cif equals undefined', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: undefined,
        cif: undefined,
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter with name and cif equals null', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: null,
        cif: null,
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter with name and cif equals empty string', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: '',
        cif: '',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter with name equals "na" and cif equals empty string', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: 'na',
        cif: '',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter with name equals "name" and cif equals empty string', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: 'name',
        cif: '',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter with name equals "name 1" and cif equals empty string', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: 'name 1',
        age: 18,
        cif: '',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return empty array when it feeds collection with one item and filter with name equals "names" and cif equals empty string', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: 'names',
        cif: '',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return same array when it feeds collection with one item and filter with name equals empty string and cif equals "ci"', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: '',
        cif: 'ci',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter with name equals empty string and cif equals "cif 1"', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: '',
        cif: 'cif 1',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return empty array when it feeds collection with one item and filter with name equals empty string and cif equals "cif 12"', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: '',
        cif: 'cif 12',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return same array when it feeds collection with one item and filter with name equals "name" string and cif equals "cif"', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: 'name',
        cif: 'cif',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return two items array when it feeds collection with two items and filter with name equals "name" string and cif equals "cif"', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 19, cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        name: 'name',
        cif: 'cif',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return one item array when it feeds collection with two items and filter with name equals "name 1" string and cif equals "cif"', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 19, cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        name: 'name 1',
        age: 18,
        cif: 'cif',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ]);
    });

    it('should return one item array when it feeds collection with two items and filter with isBlocked equals true ', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: true },
        { id: '2', name: 'name 2', age: 19, cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        isBlocked: true,
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: true },
      ]);
    });

    it('should return one item array when it feeds collection with two items and filter with isBlocked equals false ', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: true },
        { id: '2', name: 'name 2', age: 19, cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        isBlocked: false,
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        { id: '2', name: 'name 2', age: 19, cif: 'cif 2', isBlocked: false },
      ]);
    });

    it('should return empty array when it feeds collection with two items with null values and filter with name equals "test"', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: null, age: 18, cif: 'cif 1', isBlocked: true },
        { id: '2', name: null, age: 19, cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        name: 'test',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return first item when it feeds collection with two items and filter with age equals "18"', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: null, age: 18, cif: 'cif 1', isBlocked: true },
        { id: '2', name: null, age: 19, cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        age: 18,
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        { id: '1', name: null, age: 18, cif: 'cif 1', isBlocked: true },
      ]);
    });

    it('should return first item when it feeds collection with two items and filter using dot annotation with role.name equals "admin" and it matchs with first item', () => {
      // Arrange
      const collection: Item[] = [
        {
          id: '1',
          name: null,
          age: 18,
          cif: 'cif 1',
          isBlocked: true,
          role: { id: '1', name: 'admin' },
        },
        {
          id: '2',
          name: null,
          age: 19,
          cif: 'cif 2',
          isBlocked: false,
          role: { id: '2', name: 'user' },
        },
      ];

      const filter = {
        'role.name': 'admin',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        {
          id: '1',
          name: null,
          age: 18,
          cif: 'cif 1',
          isBlocked: true,
          role: { id: '1', name: 'admin' },
        },
      ]);
    });

    it('should return first item when it feeds collection with two items and filter using nested object with role.name equals "admin" and it matchs with first item', () => {
      // Arrange
      const collection: Item[] = [
        {
          id: '1',
          name: null,
          age: 18,
          cif: 'cif 1',
          isBlocked: true,
          role: { id: '1', name: 'admin' },
        },
        {
          id: '2',
          name: null,
          age: 19,
          cif: 'cif 2',
          isBlocked: false,
          role: { id: '2', name: 'user' },
        },
      ];

      const filter = {
        role: {
          id: '1',
          name: 'admin',
        },
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        {
          id: '1',
          name: null,
          age: 18,
          cif: 'cif 1',
          isBlocked: true,
          role: { id: '1', name: 'admin' },
        },
      ]);
    });
  });

  describe('filterByText', () => {
    it('should return empty array when it feeds collection equals undefined', () => {
      // Arrange
      const collection: Item[] = undefined;
      const text = undefined;
      const fields = undefined;

      // Act
      const result = filterByText(collection, text, fields);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when it feeds collection equals null', () => {
      // Arrange
      const collection: Item[] = null;
      const text = undefined;
      const fields = undefined;

      // Act
      const result = filterByText(collection, text, fields);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when it feeds collection equals empty array', () => {
      // Arrange
      const collection: Item[] = [];
      const text = undefined;
      const fields = undefined;

      // Act
      const result = filterByText(collection, text, fields);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return same array when it feeds collection with one item,text equals undefined and fields equals undefined', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = undefined;
      const fields = undefined;

      // Act
      const result = filterByText(collection, text, fields);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals undefined and fields has id', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = undefined;

      // Act
      const result = filterByText(collection, text, ['id']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals undefined and fields has name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = undefined;

      // Act
      const result = filterByText(collection, text, ['name']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals undefined and fields has age', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = undefined;

      // Act
      const result = filterByText(collection, text, ['age']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals undefined and fields has cif', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = undefined;

      // Act
      const result = filterByText(collection, text, ['cif']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals undefined and fields has isBlocked', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = undefined;

      // Act
      const result = filterByText(collection, text, ['isBlocked']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals null and fields has id', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = null;

      // Act
      const result = filterByText(collection, text, ['id']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals null and fields has name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = null;

      // Act
      const result = filterByText(collection, text, ['name']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals null and fields has age', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = null;

      // Act
      const result = filterByText(collection, text, ['age']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals null and fields has cif', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = null;

      // Act
      const result = filterByText(collection, text, ['cif']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals null and fields has isBlocked', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = null;

      // Act
      const result = filterByText(collection, text, ['isBlocked']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals empty string and fields has id', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '';

      // Act
      const result = filterByText(collection, text, ['id']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals empty string and fields has name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '';

      // Act
      const result = filterByText(collection, text, ['name']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals empty string and fields has age', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '';

      // Act
      const result = filterByText(collection, text, ['age']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals empty string and fields has cif', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '';

      // Act
      const result = filterByText(collection, text, ['cif']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item, text equals empty string and fields has isBlocked', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '';

      // Act
      const result = filterByText(collection, text, ['isBlocked']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and text equals "1" and fields equals id', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '1';

      // Act
      const result = filterByText(collection, text, ['id']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and text equals "na" and fields equals name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = 'na';

      // Act
      const result = filterByText(collection, text, ['name']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and text equals "1" and fields equals age', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '1';

      // Act
      const result = filterByText(collection, text, ['age']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and text equals "1" and fields equals cif', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = 'c';

      // Act
      const result = filterByText(collection, text, ['cif']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and text equals "fal" and fields equals isBlocked', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = 'fal';

      // Act
      const result = filterByText(collection, text, ['isBlocked']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return empty array when it feeds collection with one item and text equals "2" and fields equals id', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '2';

      // Act
      const result = filterByText(collection, text, ['id']);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return same array when it feeds collection with one item and text equals "1" and fields equals id and name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '1';

      // Act
      const result = filterByText(collection, text, ['id', 'name']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and text equals "1" and fields equals id and age', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '1';

      // Act
      const result = filterByText(collection, text, ['id', 'age']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and text equals "1" and fields equals id and cif', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '1';

      // Act
      const result = filterByText(collection, text, ['id', 'cif']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and text equals "1" and fields equals id and isBlocked', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = '1';

      // Act
      const result = filterByText(collection, text, ['id', 'isBlocked']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and text equals "name" and fields equals id and name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ];
      const text = 'name';

      // Act
      const result = filterByText(collection, text, ['id', 'name']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return second item array when it feeds collection with two items and text equals "2" and fields equals id and name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ];
      const text = '2';

      // Act
      const result = filterByText(collection, text, ['id', 'name']);

      // Assert
      expect(result).toEqual([
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ]);
    });

    it('should return same array when it feeds collection with two items and text equals "name" and fields equals id and name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ];
      const text = 'name';

      // Act
      const result = filterByText(collection, text, ['id', 'name']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return firt item array when it feeds collection with two items and text equals "name 1" and fields equals id and name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ];
      const text = 'name 1';

      // Act
      const result = filterByText(collection, text, ['id', 'name']);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ]);
    });

    it('should return empty array when it feeds collection with two items and text equals "name 3" and fields equals id and name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ];
      const text = 'name 3';

      // Act
      const result = filterByText(collection, text, ['id', 'name']);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when it feeds collection with two items and text equals "true" and fields equals id and name', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ];
      const text = 'true';

      // Act
      const result = filterByText(collection, text, ['id', 'name']);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return same array when it feeds collection with two items and text equals "8" and fields equals id, name and age', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ];
      const text = '8';

      // Act
      const result = filterByText(collection, text, ['id', 'name', 'age']);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return first item array when it feeds collection with two items and text equals "18" and fields equals id, name and age', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ];
      const text = '18';

      // Act
      const result = filterByText(collection, text, ['id', 'name', 'age']);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ]);
    });

    it('should return second item array when it feeds collection with two items and text equals "28" and fields equals id, name and age', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ];
      const text = '28';

      // Act
      const result = filterByText(collection, text, ['id', 'name', 'age']);

      // Assert
      expect(result).toEqual([
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: true },
      ]);
    });

    it('should return second item array when it feeds collection with two items and role.name equals "admin" and fields equals "role.name"', () => {
      // Arrange
      const collection: Item[] = [
        {
          id: '1',
          name: 'name 1',
          age: 18,
          cif: 'cif 1',
          isBlocked: false,
          role: {
            id: '2',
            name: 'user',
          },
        },
        {
          id: '2',
          name: 'name 2',
          age: 28,
          cif: 'cif 2',
          isBlocked: true,
          role: {
            id: '1',
            name: 'admin',
          },
        },
      ];
      const text = 'admin';

      // Act
      const result = filterByText(collection, text, ['role.name']);

      // Assert
      expect(result).toEqual([
        {
          id: '2',
          name: 'name 2',
          age: 28,
          cif: 'cif 2',
          isBlocked: true,
          role: {
            id: '1',
            name: 'admin',
          },
        },
      ]);
    });
  });

  describe('upper case', () => {
    it('should return first item when it feeds collection with two items and filter with name equals "NAME 1" using filterByFields', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        name: 'NAME 1',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ]);
    });

    it('should return first item when it feeds collection with two items, text equals "NAME 1" and fields has name using filterByText', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: false },
      ];
      const text = 'NAME 1';

      // Act
      const result = filterByText(collection, text, ['name']);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ]);
    });
  });

  describe('ignore accents', () => {
    it('should return first item when it feeds collection with two items and filter with name equals "náme 1" using filterByFields', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        name: 'náme 1',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ]);
    });

    it('should return first item when it feeds collection with two items, text equals "náme 1" and fields has name using filterByText', () => {
      // Arrange
      const collection: Item[] = [
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', age: 28, cif: 'cif 2', isBlocked: false },
      ];
      const text = 'náme 1';

      // Act
      const result = filterByText(collection, text, ['name']);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', age: 18, cif: 'cif 1', isBlocked: false },
      ]);
    });
  });
});
