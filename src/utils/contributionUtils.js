// ./pasanaq/src/utils/contributionUtils.js

export function groupContributions({
  contributions,
  payments,
  contributionAmount,
}) {

  return Object.values(

    contributions.reduce(

      (acc, contribution) => {

        const userId =
          contribution.user_id

        if (!acc[userId]) {

          acc[userId] = {

            user_id:
              contribution.user_id,

            profiles:
              contribution.profiles,

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

        acc[userId]
          .totalAmount += amount

        acc[userId]
          .totalSlots += 1

        const userPayments =

          payments.filter(
            (payment) =>

              payment.user_id ===
              userId
          )

        const totalPaid =

          userPayments.reduce(

            (sum, payment) =>

              sum +
              Number(payment.amount),

            0
          )

        acc[userId]
          .paidAmount =
            totalPaid

        acc[userId]
          .paidSlots =

            totalPaid /

            Number(
              contributionAmount
            )

        return acc

      },

      {}
    )
  )
}
