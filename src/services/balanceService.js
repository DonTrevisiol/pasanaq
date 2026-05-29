/* ./pasanaq/src/services/balanceService.js: */

import { supabase }
from "./supabase"

export async function consumeBalance(
  userId
) {

  // PERFIL

  const {
    data: profile,
    error: profileError
  } = await supabase

    .from("profiles")

    .select("balance")

    .eq("id", userId)

    .single()

  if (profileError) {

    throw profileError
  }

  let balance =

    Number(
      profile.balance || 0
    )

  if (balance <= 0) return

  // CONTRIBUTIONS PENDIENTES

  const {
    data: pendingContributions,
    error: contributionsError
  } = await supabase

    .from("contributions")

    .select("*")

    .eq("user_id", userId)

    .neq("status", "paid")

    .order(
      "created_at",
      { ascending: true }
    )

  if (contributionsError) {

    throw contributionsError
  }

  for (
  const contribution
  of pendingContributions
) {

  if (balance <= 0) break

  const amount =

    Number(
      contribution.amount
    )

  const alreadyPaid =

    Number(
      contribution.paid_amount || 0
    )

  const remaining =

    amount - alreadyPaid

  // YA ESTABA PAGADO

  if (remaining <= 0) {

    continue
  }

  // PAGO COMPLETO

  if (balance >= remaining) {

    const newPaidAmount =

      alreadyPaid + remaining

    await supabase

      .from("contributions")

      .update({

        status: "paid",

        paid_amount:
          newPaidAmount,

        paid_at:
          new Date()
            .toISOString(),
      })

      .eq(
        "id",
        contribution.id
      )

    balance -= remaining
  }

  // PAGO PARCIAL

  else {

    const newPaidAmount =

      alreadyPaid + balance

    await supabase

      .from("contributions")

      .update({

        paid_amount:
          newPaidAmount,
      })

      .eq(
        "id",
        contribution.id
      )

    balance = 0
  }
}

  // GUARDAR BALANCE RESTANTE

  const {
    error: updateError
  } = await supabase

    .from("profiles")

    .update({
      balance
    })

    .eq("id", userId)

  if (updateError) {

    throw updateError
  }
}
