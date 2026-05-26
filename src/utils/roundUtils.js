// ./pasanaq/src/utils/roundUtils.js:

export function calculateTotalExpected(
  contributions
) {

  return contributions.reduce(

    (sum, contribution) =>

      sum +
      Number(
        contribution.totalAmount || 0
      ),

    0
  )
}

export function calculateTotalPaid(
  contributions
) {

  return contributions.reduce(

    (sum, contribution) =>

      sum +
      Number(
        contribution.paidAmount || 0
      ),

    0
  )
}

export function calculatePaidMembers(
  contributions
) {

  return contributions.filter(

    (contribution) =>

      contribution.paidSlots >=
      contribution.totalSlots

  ).length
}

export function calculateTotalMembers(
  contributions
) {

  return contributions.length
}
