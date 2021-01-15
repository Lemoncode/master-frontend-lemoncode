import { mapToCollection } from './collection.mapper';

describe('common/mappers/collection.mapper spec', () => {
  describe('mapToCollection', () => {
    it('shoudl return empty array when it feeds collectio equals undefined', () => {
      //Arrange
      const value = undefined;

      const map = item => ({
        value1: item.value1 * 2,
        value2: item.value2 + 'C',
      });

      //Act

      const result = mapToCollection(value, map);

      //Assert
      const valores = [];
      expect(result).toEqual(valores);
    });

    it('shoudl return empty array when it feeds collectio equals null', () => {
      //Arrange
      const value = null;

      const map = item => ({
        value1: item.value1 * 2,
        value2: item.value2 + 'C',
      });

      //Act

      const result = mapToCollection(value, map);

      //Assert
      const valores = [];
      expect(result).toEqual(valores);
    });

    it('shoudl return empty array when it feeds collectio equals empty array', () => {
      //Arrange
      const value = [];

      const map = item => ({
        value1: item.value1 * 2,
        value2: item.value2 + 'C',
      });

      //Act

      const result = mapToCollection(value, map);

      //Assert
      const valores = [];
      expect(result).toEqual(valores);
    });

    it('should return mapped collection when it feeds collection and function to map ', () => {
      //Arrange
      const collection = [
        {
          value1: 1,
          value2: 'A',
        },
        {
          value1: 2,
          value2: 'B',
        },
      ];

      const map = item => ({
        value1: item.value1 * 2,
        value2: item.value2 + 'C',
      });

      //Act
      const result = mapToCollection(collection, map);

      //Assert
      const valores = [
        {
          value1: 2,
          value2: 'AC',
        },
        {
          value1: 4,
          value2: 'BC',
        },
      ];
      expect(result).toEqual(valores);
    });
  });
});
