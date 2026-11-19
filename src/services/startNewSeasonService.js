// ./pasanaq/src/services/startNewSeasonService.js

import { supabase } from "./supabase"

export async function startNewSeasonService({
  pasanaq,
  members,
}) {

  console.log("Iniciando temporada nueva...")

  const newSeason =
    (pasanaq.current_season || 1) + 1

  const {
    error: seasonError
  } = await supabase

    .from("pasanaqs")

    .update({

      current_season: newSeason,

      status: "active",

    })

    .eq(
      "id",
      pasanaq.id
    )

  if (seasonError) {

    throw seasonError

  }

  console.log(
    "Nueva temporada:",
    newSeason
  )

}
