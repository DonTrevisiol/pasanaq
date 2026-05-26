// ./pasanaq/src/utils/currency.js

export function formatCurrency(

  amount,

  currency = "BOB"

) {

  const symbols = {

    BOB: "Bs",

    USD: "$",

    ARS: "$",

    PEN: "S/",

    CLP: "$",

    EUR: "€",
  }

  return `
    ${symbols[currency]}
    ${amount}
  `
}
