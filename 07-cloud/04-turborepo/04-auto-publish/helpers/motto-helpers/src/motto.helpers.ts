import { House } from "@<user-name>/house-helpers";

const MOTTOS: Record<House, string> = {
  stark: "Winter is Coming!",
  targaryen: "Fire and Blood!",
  lannister: "Hear Me Roar!",
  baratheon: "Ours is the Fury!",
  tyrell: "Growing Strong!",
};

export const getHouseMotto = (house: House): string => MOTTOS[house];
