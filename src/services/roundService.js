/* ./pasanaq/src/services/paymentService.js: */

import { supabase }
from "./supabase"

export async function closeRound({

  round,

  refreshData,
}) {

  // CERRAR RONDA

  const {
    error: closeError
  } = await supabase

    .from("rounds")

    .update({
      status: "completed"
    })

    .eq("id", round.id)

  if (closeError) {

    throw closeError
  }

  // MIEMBROS

  const {
    data: members,
    error: membersError
  } = await supabase

    .from("pasanaq_members")

    .select(`
      *,
      profiles (
        full_name
      )
    `)

    .eq(
      "pasanaq_id",
      round.pasanaq_id
    )

    .order(
      "position",
      { ascending: true }
    )

  if (membersError) {

    throw membersError
  }

  // SIGUIENTE RECEPTOR

  const nextReceiver =

    members.find(

      (member) =>

        member.position ===

        round.round_number + 1
    )

  // TERMINADO

  if (!nextReceiver) {

    await supabase

      .from("pasanaqs")

      .update({
        status: "finished"
      })

      .eq(
        "id",
        round.pasanaq_id
      )

    await refreshData()

    return {
      finished: true
    }
  }

  // NUEVA RONDA

  const {
    data: newRound,
    error: newRoundError
  } = await supabase

    .from("rounds")

    .insert({

      pasanaq_id:
        round.pasanaq_id,

      round_number:
        round.round_number + 1,

      receiver_id:
        nextReceiver.user_id,

      status: "active",
    })

    .select()

    .single()

  if (newRoundError) {

    throw newRoundError
  }

  // DATOS PASANAQ

  const {
    data: pasanaqData,
    error: pasanaqError
  } = await supabase

    .from("pasanaqs")

    .select("*")

    .eq(
      "id",
      round.pasanaq_id
    )

    .single()

  if (pasanaqError) {

    throw pasanaqError
  }

  // CONTRIBUTIONS

  const contributions =

    members.map(

      (member) => ({

        round_id:
          newRound.id,

        user_id:
          member.user_id,

        amount:
          pasanaqData
            .contribution_amount
          *
          Number(member.member_number || 1),

        status: "pending",
      })
    )

  const {
    error: contributionsError
  } = await supabase

    .from("contributions")

    .insert(contributions)

  if (contributionsError) {

    throw contributionsError
  }

  // ACTIVITIES

  await supabase

    .from("activities")

    .insert({

      pasanaq_id:
        round.pasanaq_id,

      user_id:
        round.receiver_id,

      type:
        "round_completed",

      message:
`La ronda #${round.round_number} finalizó`,
    })

  await supabase

    .from("activities")

    .insert({

      pasanaq_id:
        round.pasanaq_id,

      user_id:
        nextReceiver.user_id,

      type:
        "round_started",

      message:
`Comenzó la ronda #${newRound.round_number} y el receptor actual es ${nextReceiver.profiles?.full_name}`,
    })

  await refreshData()

  return {
    finished: false
  }
}
