import { isEditModeHelper } from './is-edit-mode.helper';

describe('/common/helpers/is-edit-model.helper.spect', () => {
  it('should return false when feeding id equals null', () => {
    // Arrange
    const id = null;

    // Act
    const result = isEditModeHelper(id);

    // Assert
    expect(result).not.toBeTruthy();
  });

  it('should return false when feeding id equals undefined', () => {
    // Arrange
    const id = undefined;

    // Act
    const result = isEditModeHelper(id);

    // Assert
    expect(result).not.toBeTruthy();
  });

  it('should return false when feeding id equals empty', () => {
    // Arrange
    const id = '';

    // Act
    const result = isEditModeHelper(id);

    // Assert
    expect(result).not.toBeTruthy();
  });

  it('should return false when feeding id equals 0', () => {
    // Arrange
    const id = '0';

    // Act
    const result = isEditModeHelper(id);

    // Assert
    expect(result).not.toBeTruthy();
  });

  it('should return true when feeding id equals string 1', () => {
    // Arrange
    const id = '1';

    // Act
    const result = isEditModeHelper(id);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true when feeding id equals string Abc1Io', () => {
    // Arrange
    const id = 'Abc1Io';

    // Act
    const result = isEditModeHelper(id);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true when feeding id equals number 1', () => {
    // Arrange
    const id = 1;

    // Act
    const result = isEditModeHelper(id);

    // Assert
    expect(result).toBeTruthy();
  });
});
