// ./pasanaq/src/components/CreatePasanaqForm.jsx

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase" //borrar si se puede
import { useAuth } from "../../context/AuthContext"
import toast from "react-hot-toast"

import PasanaqBasicFields
from "./PasanaqBasicFields"

import MemberNumberSelector
from "./MemberNumberSelector"

import PasanaqContributionFields
from "./PasanaqContributionFields"

import { createPasanaq }
from "../../services/createPasanaqService"

export default function CreatePasanaqForm() {

  const { user } =
    useAuth()

  const navigate =
    useNavigate()

  const [name, setName] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [amount, setAmount] =
    useState("")

  const [frequency, setFrequency] =
    useState("monthly")

  const [currency, setCurrency] =
    useState("BOB")

  const [selectedNumbers, setSelectedNumbers] =
    useState(1)

  // ANY = el usuario no exige que sus cofres
  // estén juntos ni separados.
  const [payoutMode, setPayoutMode] =
    useState("any")

  const totalContribution =
    selectedNumbers *
    Number(amount || 0)

  const frequencyLabel = {

    daily: "día",

    weekly: "semana",

    monthly: "mes",

  }[frequency]

  async function handleCreate(event) {

    event.preventDefault()

    if (
      !amount ||
      Number(amount) <= 0
    ) {

      toast.error(
        "El aporte debe ser mayor a 0"
      )

      return
    }

    if (
      selectedNumbers < 1
    ) {

      toast.error(
        "Debes seleccionar al menos un número"
      )

      return
    }

    if (!name.trim()) {

      toast.error(
        "Debes ingresar un nombre"
      )

      return
    }

    const confirmed =
      window.confirm(

`⚠️ ¿Estás seguro de que podrás aportar ${totalContribution} ${currency} cada ${frequencyLabel}?

Cada número representa una obligación de pago.

Si incumples los aportes, podrías recibir penalizaciones dentro del grupo.

Presiona "Aceptar" solo si estás completamente seguro. ⚠️`

      )

    if (!confirmed) return

    try {

      await createPasanaq({

        name,

        description,

        amount,

        currency,

        frequency,

        userId:
          user.id,

        selectedNumbers,

        payoutMode,

      })

      toast.success(
        "Pasanaq creado"
      )

      navigate(0)

    } catch (error) {

      console.error(error)

      toast.error(
        error.message ||
        "No se pudo crear el Pasanaq"
      )
    }
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

      <h2
        className="
          text-2xl
          font-bold
          text-petroleum
        "
      >

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

        selectedNumbers={
          selectedNumbers
        }

        setSelectedNumbers={
          setSelectedNumbers
        }

        payoutMode={
          payoutMode
        }

        setPayoutMode={
          setPayoutMode
        }

        pasanaq={{
          contribution_amount:
            amount,

          currency,

          frequency,
        }}

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
