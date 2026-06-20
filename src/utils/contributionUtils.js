// ./pasanaq/src/utils/contributionUtils.js

export function groupContributions({

  contributions,

  contributionAmount,

  members,
}) {

  return Object.values(

    contributions.reduce(

      (acc, contribution) => {

        const userId =
          contribution.user_id

        if (!acc[userId]) {

  const member =

    members.find(

      (member) =>

        member.user_id === userId
    )

  acc[userId] = {

    user_id:
      contribution.user_id,

    profiles:
      contribution.profiles,

    wallet_balance:

      Number(
        member?.wallet_balance || 0
      ),

    totalAmount: 0,

    paidAmount: 0,

    totalSlots: 0,

    paidSlots: 0,
  }
}

        const amount =

          Number(
            contribution.amount
          )

        const paidAmount =

          Number(
            contribution.paid_amount || 0
          )

        acc[userId]
          .totalAmount += amount

        acc[userId]
          .paidAmount +=
            paidAmount

        acc[userId]
          .totalSlots =

          acc[userId]
            .totalAmount /

          Number(
            contributionAmount
          )

        acc[userId]
          .paidSlots =

          acc[userId]
            .paidAmount /

          Number(
            contributionAmount
          )

        return acc

      },

      {}
    )
  )
}
