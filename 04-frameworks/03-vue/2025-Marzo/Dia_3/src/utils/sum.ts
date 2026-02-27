export const sum = (...operands: number[]) =>
  operands.reduce((accumulator, current) => accumulator + current, 0)
