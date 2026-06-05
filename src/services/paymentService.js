/* ./pasanaq/src/services/paymentService.js: */

import { supabase }
from "./supabase"

export async function registerPayment({

  round,

  member,

  amount,

  pasanaq,

}) {

  // REGISTRAR PAYMENT

  const {
    error: paymentError
  } = await supabase

    .from("payments")

    .insert({

      pasanaq_id:
        round.pasanaq_id,

      round_id:
        round.id,

      user_id:
        member.user_id,

      amount,
    })

  const {
  data: contributions
} = await supabase

  .from("contributions")

  .select("*")

  .eq(
    "round_id",
    round.id
  )

  .eq(
    "user_id",
    member.user_id
  )

let remainingPayment = amount

for (const contribution of contributions) {

  const remaining =

    Number(
      contribution.amount
    )

    -

    Number(
      contribution.paid_amount || 0
    )

  if (remaining <= 0) {

    continue
  }

  const paymentForThisContribution =

    Math.min(
      remainingPayment,
      remaining
    )

  const newPaidAmount =

    Number(
      contribution.paid_amount || 0
    )

    +

    paymentForThisContribution

  await supabase

    .from("contributions")

    .update({

      paid_amount:
        newPaidAmount,

      status:

        newPaidAmount >=
        Number(
          contribution.amount
        )

        ? "paid"

        : "pending",
    })

    .eq(
      "id",
      contribution.id
    )
    remainingPayment -= paymentForThisContribution
}

if (remainingPayment > 0) {

  const {
    data: memberData
  } = await supabase

    .from("pasanaq_members")

    .select("wallet_balance")

    .eq(
      "pasanaq_id",
      round.pasanaq_id
    )

    .eq(
      "user_id",
      member.user_id
    )

    .single()

  const currentWallet =

    Number(
      memberData?.wallet_balance || 0
    )

  await supabase

    .from("pasanaq_members")

    .update({

      wallet_balance:
        currentWallet +
        remainingPayment
    })

    .eq(
      "pasanaq_id",
      round.pasanaq_id
    )

    .eq(
      "user_id",
      member.user_id
    )
}

  if (paymentError) {

    throw paymentError
  }

  // ACTIVIDAD

  const {
    error: activityError
  } = await supabase

    .from("activities")

    .insert({

      pasanaq_id:
        round.pasanaq_id,

      user_id:
        member.user_id,

      type:
        "payment_received",

      message:
`${member.profiles?.full_name} entregó ${amount} ${pasanaq.currency}`,

    })

  if (activityError) {

    throw activityError
  }
}
