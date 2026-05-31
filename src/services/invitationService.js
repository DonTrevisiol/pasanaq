// ./pasanaq/src/services/invitationService.js

import { supabase }
from "./supabase"

export async function generateInviteLink({

  pasanaqId,

  invitedBy,

}) {

  const token =
    crypto.randomUUID()

  const {
    error
  } = await supabase

    .from("invitations")

    .insert({

      pasanaq_id:
        pasanaqId,

      invited_by:
        invitedBy,

      token,
    })

  if (error) {

    throw error
  }

  return (
    `${window.location.origin}/invite/${token}`
  )
}
