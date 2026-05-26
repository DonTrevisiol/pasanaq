// ./pasanaq/src/components/pasanaq/PasanaqActions.jsx:

import { supabase }
from "../../services/supabase"
import toast from "react-hot-toast"
import { useState } from "react"

export default function PasanaqActions({

  pasanaq,

  round,

  members,

  currentRole,

  refreshData,

}) {

  const [starting, setStarting] =
    useState(false)

  async function startPasanaq() {

    if (starting) return
    setStarting(true)

    if (members.length < 2) {
      toast.error("La soledad es buena pero no puedes iniciar un pasanaku solo")
      setStarting(false)
      return
    }

    const sortedMembers =
      [...members]

        .sort(
          (a, b) =>
            a.position - b.position
        )

    const firstReceiver =
      sortedMembers[0]

    if (!firstReceiver) {

      toast.error("No hay miembros")

      setStarting(false)

      return
    }

    await supabase
      .from("pasanaqs")

      .update({
          status: "active"
    })
      .eq("id", pasanaq.id)

    const {
      data: roundData,
      error: roundError
    } = await supabase

      .from("rounds")

      .insert({

        pasanaq_id: pasanaq.id,

        round_number: 1,

        receiver_id:
          firstReceiver.user_id,

        status: "active",

      })

      .select()

      .single()

    if (roundError) {

      console.log(roundError)

      toast.error(roundError.message)

      setStarting(false)

      return
    }

    const contributions =

  members.flatMap(

    (member) =>

      Array.from(

        {
          length:
            member.member_number || 1
        }).map(() => ({

          round_id:
            roundData.id,

          user_id:
            member.user_id,

          amount:
            pasanaq.contribution_amount,

          status: "pending",
        }))
  )


    const {
      error: contributionError
    } = await supabase

      .from("contributions")

      .insert(contributions)

    if (contributionError) {

      console.log(
        contributionError
      )

      toast.error(
        contributionError.message
      )

      setStarting(false)

      return
    }

    const {
  data: profileData
} = await supabase

  .from("profiles")

  .select("full_name")

  .eq("id", firstReceiver.user_id)

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

    setStarting(false)
    await refreshData()
  }

  const [inviteLink, setInviteLink] =
    useState("")

  async function generateInvite() {

  const token =
    crypto.randomUUID()

  const {
    error
  } = await supabase

    .from("invitations")

    .insert({

      pasanaq_id:
        pasanaq.id,

      invited_by:
        pasanaq.created_by,

      token,
    })

  if (error) {

    console.log(error)

    toast.error(error.message)

    setStarting(false)

    return
  }

  const link =
    `${window.location.origin}/invite/${token}`

  setInviteLink(link)

  navigator.clipboard.writeText(link)

  toast.success(
    "Link copiado"
  )
}

  if (round) return null

  if (currentRole !== "owner") return null

  return (

    <div className="mt-6">

      <button

        onClick={startPasanaq}

        className="
          bg-fintech
          text-white
          px-6
          py-3
          rounded-xl
          font-semibold
        "
      >

        Iniciar Pasanaq

      </button>

      <button

  onClick={generateInvite}

  className="
    bg-gold
    text-white
    px-6
    py-3
    rounded-xl
    font-semibold
    ml-4
  "
>

  Invitar miembros

</button>

{

  inviteLink

  && (

    <p
      className="
        mt-4
        text-sm
        break-all
        text-dark
      "
    >

      {inviteLink}

    </p>
  )
}

    </div>
  )
}
