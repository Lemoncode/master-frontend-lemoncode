import * as calculator from './calculator';
import * as business from './business';

jest.mock('./business', () => ({
  isLowerThan: jest.fn(),
  max: 7,
}));

describe('Calculator tests', () => {
  describe('add', () => {
    it('should return 4 when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(result).toEqual(4);
    });

    it('should call to isLowerThan when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(business.isLowerThan).toHaveBeenCalled();
      expect(business.isLowerThan).toHaveBeenCalledWith(4, 7);
    });
  });
});
