import { flattenObject } from './object.helpers';

describe('common/helpers/object.helpers specs', () => {
  describe('flattenObject', () => {
    it('should return null when if feeds entity equals undefined', () => {
      // Arrange
      const entity = undefined;

      // Act
      const result = flattenObject(entity);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when if feeds entity equals null', () => {
      // Arrange
      const entity = null;

      // Act
      const result = flattenObject(entity);

      // Assert
      expect(result).toBeNull();
    });

    it('should return same object when if feeds entity equals simple object', () => {
      // Arrange
      const entity = {
        id: '1',
        name: 'test',
      };

      // Act
      const result = flattenObject(entity);

      // Assert
      expect(result).toEqual(entity);
    });

    it('should return same object when if feeds entity equals simple object with undefined, null and empty string values, array, boolean', () => {
      // Arrange
      const entity = {
        id: undefined,
        name: null,
        role: '',
        companies: [],
        profiles: ['1'],
        isActive: false,
      };

      // Act
      const result = flattenObject(entity);

      // Assert
      expect(result).toEqual(entity);
    });

    it('should return same object when if feeds entity equals object with key names with dot annotation', () => {
      // Arrange
      const entity = {
        id: '1',
        name: 'test name',
        'role.name': 'test role name',
      };

      // Act
      const result = flattenObject(entity);

      // Assert
      expect(result).toEqual(entity);
    });

    it('should return flat object when if feeds entity equals object with nested object one deep level', () => {
      // Arrange
      const entity = {
        id: '1',
        name: 'test name',
        role: {
          name: 'test role name',
        },
      };

      // Act
      const result = flattenObject(entity);

      // Assert
      const expectedResult = {
        id: '1',
        name: 'test name',
        'role.name': 'test role name',
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return flat object when if feeds entity equals object with nested object two deep levels', () => {
      // Arrange
      const entity = {
        id: '1',
        name: 'test name',
        user: {
          role: {
            id: 'test role id',
            name: 'test role name',
          },
        },
      };

      // Act
      const result = flattenObject(entity);

      // Assert
      const expectedResult = {
        id: '1',
        name: 'test name',
        'user.role.id': 'test role id',
        'user.role.name': 'test role name',
      };
      expect(result).toEqual(expectedResult);
    });

    it('should return flat object when if feeds entity equals object with key names with dot annotation, with nested object one, two and three deep levels', () => {
      // Arrange
      const entity = {
        id: '1',
        name: 'test name',
        'country.name': 'test country name',
        user: {
          id: 'test user id',
          role: {
            id: 'test role id',
            name: 'test role name',
            type: {
              name: 'test type name',
            },
          },
        },
      };

      // Act
      const result = flattenObject(entity);

      // Assert
      const expectedResult = {
        id: '1',
        name: 'test name',
        'country.name': 'test country name',
        'user.id': 'test user id',
        'user.role.id': 'test role id',
        'user.role.name': 'test role name',
        'user.role.type.name': 'test type name',
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
