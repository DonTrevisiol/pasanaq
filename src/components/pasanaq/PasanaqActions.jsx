// ./pasanaq/src/components/pasanaq/PasanaqActions.jsx:

import { supabase }
from "../../services/supabase"
import toast from "react-hot-toast"
import { useState } from "react"
import { generateInviteLink } from "../../services/invitationService"
import { startPasanaqService } from "../../services/startPasanaqService"

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

  try {

    if (members.length < 2) {

      toast.error(
        "La soledad es buena pero no puedes iniciar un pasanaku solo"
      )

      setStarting(false)

      return
    }

    await startPasanaqService({

      pasanaq,

      members,

    })

    await refreshData()

  } catch (error) {

    console.log(error)

    toast.error(
      error.message
    )

  } finally {

    setStarting(false)
  }
}

  const [inviteLink, setInviteLink] =
    useState("")

async function generateInvite() {

  try {

    const link =

      await generateInviteLink({

        pasanaqId:
          pasanaq.id,

        invitedBy:
          pasanaq.created_by,

      })

    setInviteLink(link)

    navigator.clipboard
      .writeText(link)

    toast.success(
      "Link copiado"
    )

  } catch (error) {

    console.log(error)

    toast.error(
      error.message
    )
  }
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
