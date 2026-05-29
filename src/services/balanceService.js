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

  // CONSUMIR BALANCE

  for (
    const contribution
    of pendingContributions
  ) {

    if (balance <= 0) break

    const amount =

      Number(
        contribution.amount
      )

    // PAGO COMPLETO

    if (balance >= amount) {

      await supabase

        .from("contributions")

        .update({

          status: "paid",

          paid_amount: amount,

          paid_at:
            new Date()
              .toISOString(),
        })

        .eq(
          "id",
          contribution.id
        )

      balance -= amount

    }

    // PAGO PARCIAL

    else {

      await supabase

        .from("contributions")

        .update({

          paid_amount:
            balance,
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
