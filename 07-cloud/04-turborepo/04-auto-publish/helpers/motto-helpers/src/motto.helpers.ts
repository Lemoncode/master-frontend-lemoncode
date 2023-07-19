import { House } from "@my-org/house-helpers";

const MOTTOS: Record<House, string> = {
  stark: "Winter is Coming!",
  targaryen: "Fire and Blood!",
  lannister: "Hear Me Roar!",
  baratheon: "Ours is the Fury!",
};

export const getHouseMotto = (house: House): string => MOTTOS[house];
