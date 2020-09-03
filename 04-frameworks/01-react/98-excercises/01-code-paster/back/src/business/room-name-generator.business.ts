const baseNames = [
  'FISTRO',
  'PECADOR',
  'PRADERA',
  'NOPUEDOR',
  'JARL',
  'REACT',
  'CURRY',
  'HOOKS',
  'KETCHUP',
  'TURING',
  'ALAN',
  'CHUCK',
  'NORRIS',
  'DELAWARE',
  'MALAGA',
  'PALO',
  'VALLEY',
  'LEMON',
];

const baseTrainerTokens = [
  'son_goku',
  'vegeta',
  'bardock',
  'king_vegeta',
  'nappa',
  'toma',
  'selypar',
  'gine',
  'bulma',
  'piccolo',
  'krilin',
  'freezer',
];

const generateRandomNumberRange = (min: number, max: number) => {
  return Math.floor(Math.random() * max) + min;
};

// TODO Unit test this

const chooseRandomStringFromArray = (valueCollection: string[]) => {
  const maxNumber = valueCollection.length - 1;
  const randomNumber = generateRandomNumberRange(0, maxNumber);

  return valueCollection[randomNumber];
};

const generateRandomRoomSuffix = (): string => {
  const randomNumber = generateRandomNumberRange(0, 9999);

  return randomNumber.toString();
};

export const generateNewRoomName = () =>
  `${chooseRandomStringFromArray(baseNames)}-${generateRandomRoomSuffix()}`;

export const generateNewTrainerToken = () =>
  `${chooseRandomStringFromArray(
    baseTrainerTokens
  )}-${generateRandomRoomSuffix()}`;
