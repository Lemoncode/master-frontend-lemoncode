export interface ResultEntry {
  party: string;
  seats: number;
  color?: string;
}

// Source: https://es.wikipedia.org/wiki/Elecciones_generales_de_Espa%C3%B1a_de_2023
export const resultCollectionSpainJul23: ResultEntry[] = [
  {
    party: 'PP',
    seats: 137,
    color: '#1E4B8F',
  },
  {
    party: 'PSOE',
    seats: 121,
    color: '#E30713',
  },
  {
    party: 'VOX',
    seats: 33,
    color: '#63BE21',
  },
  {
    party: 'Sumar',
    seats: 31,
    color: '#E61455',
  },
  {
    party: 'ERC',
    seats: 7,
    color: '#FFB32E',
  },
  {
    party: "JxCat",
    seats: 7,
    color: "#20C0C2",
  },
  {
    party: "Bildu",
    seats: 6,
    color: "#00D0B6",
  },
  {
    party: "PNV",
    seats: 5,
    color: "#008000",
  },
  {
    party: "BNG",
    seats: 1,
    color: "#ADCFEF",
  },
  {
    party: "CC",
    seats: 1,
    color: "#FFD700",
  },
  {
    party: "UPN",
    seats: 1,
    color: "#2A52BE",
  },
];

// Approx numbers
// https://www.lavanguardia.com/elecciones/elecciones-generales-noviembre-2019

export const resultCollectionSpainNov19: ResultEntry[] = [
  {
    party: "PP",
    seats: 89,
  },
  {
    party: "PSOE",
    seats: 120,
  },
  {
    party: "VOX",
    seats: 52,
  },
  {
    party: "Sumar",
    seats: 0,
  },
  {
    party: "ERC", // Esquerra Republicana de Catalunya
    seats: 13,
  },
  {
    party: "JxCat", // Junts per Catalunya
    seats: 8,
  },
  {
    party: "Bildu",
    seats: 5,
  },
  {
    party: "PNV", // Partido Nacionalista Vasco
    seats: 6,
  },
  {
    party: "BNG", // Bloque Nacionalista Galego
    seats: 1,
  },
  {
    party: "CC", // Coalición Canaria
    seats: 2,
  },
  {
    party: "UPN", // Unión del Pueblo Navarro
    seats: 0,
  },
  // From here, new parties
  {
    party: "UP",
    seats: 35,
  },
  {
    party: "Cs",
    seats: 10,
  },
  {
    party: "Más pais",
    seats: 3,
  },
  {
    party: "CUP", // Candidatura d'Unitat Popular
    seats: 2,
  },
  {
    party: "NA+", // Navarra Suma
    seats: 1,
  },
  {
    party: "PRC", // Partido Regionalista de Cantabria
    seats: 1
  },
  {
    party: "Teruel Existe",
    seats: 1,
  },
];
