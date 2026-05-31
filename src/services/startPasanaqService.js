// ./pasanaq/src/services/startPasanaqService.js

import { supabase }
from "./supabase"

export async function startPasanaqService({

  pasanaq,

  members,

}) {

  const sortedMembers =

    [...members]

      .sort(
        (a, b) =>
          a.position - b.position
      )

  const firstReceiver =
    sortedMembers[0]

  if (!firstReceiver) {

    throw new Error(
      "No hay miembros"
    )
  }

  await supabase

    .from("pasanaqs")

    .update({
      status: "active"
    })

    .eq(
      "id",
      pasanaq.id
    )

  const {
    data: roundData,
    error: roundError
  } = await supabase

    .from("rounds")

    .insert({

      pasanaq_id:
        pasanaq.id,

      round_number:
        1,

      receiver_id:
        firstReceiver.user_id,

      status:
        "active",

    })

    .select()

    .single()

  if (roundError) {

    throw roundError
  }

  const contributions =

    members.map(

      (member) => ({

        round_id:
          roundData.id,

        user_id:
          member.user_id,

        amount:

          Number(
            pasanaq.contribution_amount
          )

          *

          Number(
            member.member_number || 1
          ),

        paid_amount:
          0,

        status:
          "pending",
      })
    )

  const {
    error: contributionError
  } = await supabase

    .from("contributions")

    .insert(contributions)

  if (contributionError) {

    throw contributionError
  }

  const {
    data: profileData
  } = await supabase

    .from("profiles")

    .select("full_name")

    .eq(
      "id",
      firstReceiver.user_id
    )

    .single()

  await supabase

    .from("activities")

    .insert({

      pasanaq_id:
        pasanaq.id,

      user_id:
        firstReceiver.user_id,

      type:
        "round_started",

      message:
`${profileData?.full_name} inició el Pasanaq y el receptor actual es ${firstReceiver.profiles?.full_name}`,

    })

  return roundData
}
