// ./pasanaq/src/pages/InvitePage.jsx

import {
  useEffect,
  useState
} from "react"

import {
  useParams,
  useNavigate
} from "react-router-dom"

import { supabase }
from "../services/supabase"

import toast from "react-hot-toast"

export default function InvitePage() {

  const { token } =
    useParams()

  const navigate =
    useNavigate()

  const [invitation, setInvitation] =
    useState(null)

  const [pasanaq, setPasanaq] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [selectedNumbers, setSelectedNumbers] =
    useState(1)

  const totalContribution =
  selectedNumbers *
  (pasanaq?.contribution_amount || 0)
  const frequencyLabel = {
      daily: "día",
      weekly: "semana",
      monthly: "mes",
}[pasanaq?.frequency]

  useEffect(() => {

    fetchInvitation()
    //handleJoin()

  }, [])

  async function fetchInvitation() {

    const {
      data,
      error
    } = await supabase

      .from("invitations")

      .select("*")

      .eq("token", token)

      .single()

    if (error || !data) {

      toast.error(
        "Invitación inválida"
      )

      navigate("/dashboard")

      return
    }

    setInvitation(data)

    const {
      data: pasanaqData,
      error: pasanaqError
    } = await supabase

      .from("pasanaqs")

      .select("*")

      .eq(
        "id",
        data.pasanaq_id
      )

      .single()

    if (pasanaqError) {

      console.log(pasanaqError)

      return
    }

    setPasanaq(pasanaqData)

    setLoading(false)
  }

  async function handleJoin() {

  const confirmed =
    window.confirm(

`⚠️ ¿Estás seguro de que podrás aportar ${totalContribution} ${pasanaq.currency} cada ${frequencyLabel}?

Cada número representa una obligación de pago.

Si incumples los aportes, podrías recibir penalizaciones dentro del grupo.

Presiona "Aceptar" solo si estás completamente seguro. ⚠️`

    )

  if (!confirmed) return

  const {
    data: authData
  } = await supabase.auth.getUser()

  const user =
    authData.user

  if (!user) {

    toast.error(
      "Debes iniciar sesión"
    )

    return
  }

  // BUSCAR ÚLTIMA POSICIÓN

  const {
    data: existingMembers,
    error: membersError
  } = await supabase

    .from("pasanaq_members")

    .select("position")

    .eq(
      "pasanaq_id",
      pasanaq.id
    )

    .order(
      "position",
      { ascending: false }
    )

  if (membersError) {

    console.log(membersError)

    toast.error(
      membersError.message
    )

    return
  }

  const lastPosition =

    existingMembers?.[0]
      ?.position || 0

  // CREAR POSICIONES

  const inserts = [{

  pasanaq_id:
    pasanaq.id,

  user_id:
    user.id,

  role:
    "member",

  position:
    lastPosition + 1,

  member_number:
    selectedNumbers,
}]

  const {
    error: insertError
  } = await supabase

    .from("pasanaq_members")

    .insert(inserts)

  if (insertError) {

    console.log(insertError)

    toast.error(
      insertError.message
    )

    return
  }

  // ACTIVIDAD

  const {
    data: profileData
  } = await supabase

    .from("profiles")

    .select("full_name")

    .eq("id", user.id)

    .single()

  await supabase

    .from("activities")

    .insert({

      pasanaq_id:
        pasanaq.id,

      user_id:
        user.id,

      type:
        "member_joined",

      message:
`${profileData?.full_name} se unió al Pasanaq ${pasanaq.name} con ${selectedNumbers} número(s)`,

    })

  toast.success(
    "Te uniste al Pasanaq"
  )

  window.location.href =
    `/pasanaq/${pasanaq.id}`
}

  if (loading) {

    return (

      <div className="p-10">

        Cargando invitación...

      </div>
    )
  }

  return (

    <div
      className="
        p-10
        max-w-2xl
        mx-auto
      "
    >

      <div
        className="
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        "
      >

        <h1
          className="
            text-4xl
            font-bold
            text-petroleum
          "
        >

          Invitación al Pasanaq

        </h1>

        <div className="mt-6">

          <h2
            className="
              text-2xl
              font-bold
            "
          >

            {pasanaq.name}

          </h2>

          <p
            className="
              mt-3
              opacity-70
            "
          >

            {pasanaq.description}

            <div className="mt-6">

  <label
    className="
      block
      font-semibold
      mb-3
    "
  >

    ¿Cuántos números quieres jugar?

  </label>

  <select

    value={selectedNumbers}

    onChange={(e) =>
      setSelectedNumbers(
        Number(e.target.value)
      )
    }

    className="
      w-full
      border
      border-silver
      rounded-xl
      p-4
    "
  >

    <option value={1}>
      1 número
    </option>

    <option value={2}>
      2 números
    </option>

    <option value={3}>
      3 números
    </option>

  </select>

  <p
    className="
      mt-3
      text-sm
      opacity-70
    "
  >

    Debes escoger cuidadosamente cuántos números deseas jugar.
    Cada número representa un aporte obligatoria en cada ronda.
    Una vez confirmada la cantidad, no podrás modificarla luego.
    El incumplimiento de pagos puede generar penalizaciones dentro del grupo.

  </p>

  <div
  className="
    mt-5
    bg-gold
    text-white
    rounded-xl
    p-5
  "
>

  <p
    className="
      text-sm
      opacity-80
    "
  >

    Total de aportes

  </p>

  <h3
    className="
      text-3xl
      font-bold
      mt-2
    "
  >

    {totalContribution}
    {" "}
    {pasanaq.currency}

  </h3>

  <p
    className="
      mt-2
      text-sm
      opacity-90
    "
  >

    Deberás aportar esta cantidad
    cada {frequencyLabel}

  </p>

</div>


</div>

<button

  onClick={handleJoin}

  className="
    mt-8
    w-full
    bg-savings
    text-white
    py-4
    rounded-xl
    font-bold
  "
>

  Unirme al Pasanaq

</button>


          </p>

        </div>

      </div>

    </div>
  )
}
