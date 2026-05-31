// ./pasanaq/src/services/createPasanaqService.js

import { supabase }
from "./supabase"

export async function createPasanaq({

  name,
  description,
  amount,
  currency,
  frequency,
  userId,
  selectedNumbers,

}) {

  const {
    data,
    error
  } = await supabase

    .from("pasanaqs")

    .insert({

      name,

      description,

      contribution_amount:
        amount,

      currency,

      frequency,

      created_by:
        userId,

      status:
        "draft",

    })

    .select()

    .single()

  if (error) {

    throw error
  }

  const {
    error: memberError
  } = await supabase

    .from("pasanaq_members")

    .insert({

      pasanaq_id:
        data.id,

      user_id:
        userId,

      role:
        "owner",

      position:
        1,

      member_number:
        selectedNumbers,

    })

  if (memberError) {

    throw memberError
  }

  const {
    data: profileData
  } = await supabase

    .from("profiles")

    .select("full_name")

    .eq("id", userId)

    .single()

  const userName =

    profileData?.full_name
    || "Un usuario"

  await supabase

    .from("activities")

    .insert({

      pasanaq_id:
        data.id,

      user_id:
        userId,

      type:
        "pasanaq_created",

      message:
        `${userName} creó el Pasanaq ${data.name}`,

    })

  return data
}
