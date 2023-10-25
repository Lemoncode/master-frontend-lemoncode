import { Account } from "./account";
import { Movement } from "./movement";
import { User } from "./user";

export interface DB {
  userList: User[];
  accountList: Account[];
  movementList: Movement[];
}

export const db: DB = {
  userList: [
    {
      id: "1",
      name: "User",
      email: "user@email.com",
      password: "test",
    },
  ],
  accountList: [
    {
      id: "1",
      iban: "ES91 2100 0418 4502 0005 1332",
      type: "1",
      name: "Gastos mes",
      balance: 1490,
      lastTransaction: "2019-12-09T21:30:00",
      userId: "1",
    },
    {
      id: "2",
      iban: "ES79 2100 0813 6101 2345 6789",
      type: "3",
      name: "Compartida",
      balance: 2480,
      lastTransaction: "2019-11-21T14:07:38",
      alias: "compartida",
      userId: "1",
    },
    {
      id: "3",
      iban: "ES66 2100 0418 4012 3456 7891",
      type: "2",
      name: "Ahorro",
      balance: 8500,
      lastTransaction: "2019-11-15T08:29:04",
      userId: "1",
    },
  ],
  movementList: [
    {
      id: "1",
      description: "Nómina noviembre",
      amount: 900,
      balance: 1490,
      transaction: "2019-12-09T21:30:00",
      realTransaction: "2019-12-09T21:30:00",
      accountId: "3",
      userId: "1",
    },
    {
      id: "2",
      description: "Alquiler noviembre",
      amount: -400,
      balance: 590,
      transaction: "2019-12-07T11:30:00",
      realTransaction: "2019-12-08T20:00:10",
      accountId: "1",
      userId: "1",
    },
    {
      id: "3",
      description: "Gastos móvil",
      amount: -24,
      balance: 990,
      transaction: "2019-12-01T07:01:00",
      realTransaction: "2019-12-02T12:00:10",
      accountId: "1",
      userId: "1",
    },
    {
      id: "4",
      description: "Luz diciembre",
      amount: -110,
      balance: 2480,
      transaction: "2020-01-02T10:00:00",
      realTransaction: "2020-01-03T10:00:00",
      accountId: "2",
      userId: "1",
    },
    {
      id: "5",
      description: "Agua diciembre",
      amount: -20,
      balance: 2590,
      transaction: "2020-01-01T09:00:00",
      realTransaction: "2020-01-01T09:00:00",
      accountId: "2",
      userId: "1",
    },
    {
      id: "6",
      description: "Internet diciembre",
      amount: -35,
      balance: 2610,
      transaction: "2020-01-01T08:00:00",
      realTransaction: "2020-01-01T08:00:00",
      accountId: "2",
      userId: "1",
    },
    {
      id: "7",
      description: "Luz noviembre",
      amount: -89,
      balance: 2645,
      transaction: "2019-12-01T07:01:00",
      realTransaction: "2019-12-02T12:00:10",
      accountId: "2",
      userId: "1",
    },
    {
      id: "8",
      description: "Ahorro diciembre",
      amount: 1500,
      balance: 8500,
      transaction: "2019-12-29T13:30:10",
      realTransaction: "2019-12-30T13:30:10",
      accountId: "3",
      userId: "1",
    },
    {
      id: "9",
      description: "Ahorro noviembre",
      amount: 2200,
      balance: 6000,
      transaction: "2019-11-29T11:30:10",
      realTransaction: "2019-11-29T11:30:10",
      accountId: "3",
      userId: "1",
    },
  ],
};
