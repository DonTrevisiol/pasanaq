// ./pasanaq/src/hooks/useRound.js:

import {
  useState
}
from "react"

import toast
from "react-hot-toast"

import {
  registerPayment
}
from "../services/paymentService"

import {
  closeRound
}
from "../services/roundService"

import {
  consumeBalance
}
from "../services/balanceService"

export default function useRound({

  round,

  pasanaq,

  refreshData,
}) {

  const [processingId, setProcessingId] =
    useState(null)

  const [selectedMember, setSelectedMember] =
    useState(null)

  const [paymentModalOpen, setPaymentModalOpen] =
    useState(false)

  async function payContribution(
    member
  ) {

    setSelectedMember(member)

    setPaymentModalOpen(true)
  }

  async function handlePayment(
    amount
  ) {

    if (!selectedMember) return

    setProcessingId(
      selectedMember.user_id
    )

    try {

      await registerPayment({

        round,

        member:
          selectedMember,

        amount,

        pasanaq,
      })

      await consumeBalance(
        selectedMember.user_id
      )

      setPaymentModalOpen(false)

      setSelectedMember(null)

      await refreshData()

    } catch (error) {

      console.error(error)

      toast.error(error.message)
    }

    setProcessingId(null)
  }

  async function handleCloseRound() {

    setProcessingId(
      "closing-round"
    )

    try {

      const result =

        await closeRound({

          round,

          refreshData,
        })

      if (result.finished) {

        toast.success(
          "Todas las rondas finalizaron"
        )

      } else {

        toast.success(
          "Nueva ronda creada"
        )
      }

    } catch (error) {

      console.error(error)

      toast.error(error.message)
    }

    setProcessingId(null)
  }

  return {

    processingId,

    selectedMember,

    paymentModalOpen,

    setPaymentModalOpen,

    setSelectedMember,

    payContribution,

    handlePayment,

    handleCloseRound,
  }
}
