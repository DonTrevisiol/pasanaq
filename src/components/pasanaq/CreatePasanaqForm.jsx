// ./pasanaq/src/components/CreatePasanaqForm.jsx:

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"
import { useAuth } from "../../context/AuthContext"
import toast from "react-hot-toast"

export default function CreatePasanaqForm() {

  const { user } = useAuth()

  const navigate = useNavigate()

  const [name, setName] = useState("")

  const [description, setDescription] =
    useState("")

  const [amount, setAmount] = useState("")

  const [frequency, setFrequency] =
    useState("monthly")

  const [currency, setCurrency] =
    useState("BOB")

  async function handleCreate(event) {

    event.preventDefault()

    const {
      data,
      error
    } = await supabase

      .from("pasanaqs")

      .insert({
        name,
        description,
        contribution_amount: amount,
        currency,
        frequency,
        created_by: user.id,
        status: "draft",
      })

      .select()

      .single()

    if (error) {

      console.error(error)

      toast.error(error.message)

      return
    }

    const pasanaq = data

    const {
      error: memberError
    } = await supabase

      .from("pasanaq_members")

      .insert({
        pasanaq_id: pasanaq.id,
        user_id: user.id,
        role: "owner",
        position: 1,
      })

    if (memberError) {

      console.error(memberError)

      toast.error(memberError.message)

      return
    }

    const {
  data: profileData
} = await supabase

  .from("profiles")

  .select("full_name")

  .eq("id", user.id)

  .single()

const userName =

  profileData?.full_name
  || "Un usuario"

await supabase

  .from("activities")

  .insert({

    pasanaq_id:
      pasanaq.id,

    user_id:
      user.id,

    type:
      "pasanaq_created",

    message:
      `${userName} creó el Pasanaq ${pasanaq.name}`,

  })

    toast.success("Pasanaq creado")

    navigate(0)
  }

  return (

    <form
      onSubmit={handleCreate}
      className="
        bg-white
        p-8
        rounded-2xl
        shadow-lg
        space-y-5
        max-w-xl
      "
    >

      <h2 className="
        text-2xl
        font-bold
        text-petroleum
      ">

        Crear Pasanaq

      </h2>

      <input
        type="text"
        placeholder="Nombre del grupo"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        className="
          w-full
          border
          border-silver
          rounded-xl
          px-4
          py-3
        "
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        className="
          w-full
          border
          border-silver
          rounded-xl
          px-4
          py-3
        "
      />

      <input
        type="number"
        placeholder="Monto por aporte"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
        className="
          w-full
          border
          border-silver
          rounded-xl
          px-4
          py-3
        "
      />

      <div className="mt-5">

  <label
    className="
      block
      font-semibold
      mb-2
      text-dark
    "
  >

    Moneda

  </label>

  <select

    value={currency}

    onChange={(e) =>
      setCurrency(e.target.value)
    }

    className="
      w-full
      border
      border-silver
      rounded-xl
      p-4
      bg-white
    "
  >

    <option value="BOB">
      Bolivianos (Bs)
    </option>

    <option value="USD">
      Dólares ($)
    </option>

    <option value="ARS">
      Pesos Argentinos
    </option>

    <option value="PEN">
      Soles Peruanos
    </option>

    <option value="CLP">
      Pesos Chilenos
    </option>

    <option value="EUR">
      Euros (€)
    </option>

  </select>

</div>



      <select
        value={frequency}
        onChange={(e) =>
          setFrequency(e.target.value)
        }
        className="
          w-full
          border
          border-silver
          rounded-xl
          px-4
          py-3
        "
      >

        <option value="daily">
          Diario
        </option>

        <option value="weekly">
          Semanal
        </option>

        <option value="monthly">
          Mensual
        </option>

      </select>

      <button
        type="submit"
        className="
          bg-savings
          text-white
          px-6
          py-3
          rounded-xl
          w-full
        "
      >

        Crear grupo

      </button>

    </form>
  )
}
