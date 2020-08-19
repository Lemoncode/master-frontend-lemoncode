import { filterByFields } from './filter.helper';

describe('common/helpers/filter.helper specs', () => {
  describe('filterByFields', () => {
    it('should return empty array when it feeds collection equals undefined', () => {
      // Arrange
      const collection: any[] = undefined;
      const filter = undefined;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when it feeds collection equals null', () => {
      // Arrange
      const collection: any[] = null;
      const filter = undefined;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array when it feeds collection equals empty array', () => {
      // Arrange
      const collection: any[] = [];
      const filter = undefined;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return same array when it feeds collection with one item and filter equals undefined', () => {
      // Arrange
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
      ];
      const filter = undefined;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter equals null', () => {
      // Arrange
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
      ];
      const filter = null;

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return same array when it feeds collection with one item and filter with name and cif equals undefined', () => {
      // Arrange
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
      ];
      const filter = {
        name: 'name 1',
        cif: '',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual(collection);
    });

    it('should return empty array when it feeds collection with one item and filter with name equals "names" and cif equals empty string', () => {
      // Arrange
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', cif: 'cif 2', isBlocked: false },
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
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
        { id: '2', name: 'name 2', cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        name: 'name 1',
        cif: 'cif',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: false },
      ]);
    });

    it('should return one item array when it feeds collection with two items and filter with isBlocked equals true ', () => {
      // Arrange
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: true },
        { id: '2', name: 'name 2', cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        isBlocked: true,
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: true },
      ]);
    });

    it('should return one item array when it feeds collection with two items and filter with isBlocked equals false ', () => {
      // Arrange
      const collection: any[] = [
        { id: '1', name: 'name 1', cif: 'cif 1', isBlocked: true },
        { id: '2', name: 'name 2', cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        isBlocked: false,
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([
        { id: '2', name: 'name 2', cif: 'cif 2', isBlocked: false },
      ]);
    });

    it('should return empty array when it feeds collection with two items with null values and filter with name equals "test"', () => {
      // Arrange
      const collection: any[] = [
        { id: '1', name: null, cif: 'cif 1', isBlocked: true },
        { id: '2', name: null, cif: 'cif 2', isBlocked: false },
      ];
      const filter = {
        name: 'test',
      };

      // Act
      const result = filterByFields(collection, filter);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
