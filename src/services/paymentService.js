/* ./pasanaq/src/services/paymentService.js: */

import { supabase }
from "./supabase"

export async function registerPayment({

  round,

  member,

  amount,

  pasanaq,

}) {

  // BALANCE ACTUAL

  const {
    data: profileData,
    error: profileError
  } = await supabase

    .from("profiles")

    .select("balance")

    .eq(
      "id",
      member.user_id
    )

    .single()

  if (profileError) {

    throw profileError
  }

  const currentBalance =

    Number(
      profileData.balance || 0
    )

  const newBalance =
    currentBalance + amount

  // ACTUALIZAR BALANCE

  const {
    error: updateError
  } = await supabase

    .from("profiles")

    .update({
      balance: newBalance
    })

    .eq(
      "id",
      member.user_id
    )

  if (updateError) {

    throw updateError
  }

  // REGISTRAR PAYMENT

  const {
    error: paymentError
  } = await supabase

    .from("payments")

    .insert({

      pasanaq_id:
        round.pasanaq_id,

      user_id:
        member.user_id,

      amount,
    })

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
