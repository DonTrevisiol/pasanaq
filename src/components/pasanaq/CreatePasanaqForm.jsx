// ./pasanaq/src/components/CreatePasanaqForm.jsx:

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"
import { useAuth } from "../../context/AuthContext"
import toast from "react-hot-toast"
import PasanaqBasicFields from "./PasanaqBasicFields"
import MemberNumberSelector from "./MemberNumberSelector"
import PasanaqContributionFields from "./PasanaqContributionFields"
import { createPasanaq } from "../../services/createPasanaqService"

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

  const [selectedNumbers, setSelectedNumbers] =
    useState(1)

  async function handleCreate(event) {

    event.preventDefault()

    const pasanaq =
      await createPasanaq({
        name,
        description,
        amount,
        currency,
        frequency,
        userId:
          user.id,
        selectedNumbers,
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

      <PasanaqBasicFields
        name={name}
        setName={setName}

        description={description}
        setDescription={setDescription}
      />

      <PasanaqContributionFields
        amount={amount}
        setAmount={setAmount}

        currency={currency}
        setCurrency={setCurrency}

        frequency={frequency}
        setFrequency={setFrequency}
      />

      <MemberNumberSelector
        selectedNumbers={selectedNumbers}
        setSelectedNumbers={setSelectedNumbers}
        pasanaq={{contribution_amount: amount, currency, frequency}}
      />

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
