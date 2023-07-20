const MOTTOS: Record<House, string> = {
  stark: 'Winter is Coming!',
  targaryen: 'Fire and Blood!',
  lannister: 'Hear Me Roar!',
};

export const getHouseMotto = (house: House): string => MOTTOS[house];
