// ./pasanaq/src/components/rounds/RoundCard.jsx

import { supabase }
from "../../services/supabase"
import { useState } from "react"
import toast from "react-hot-toast"
import Avatar from "../profiles/Avatar"
import PaymentModal from "./PaymentModal"
import RoundProgress from "./RoundProgress"
import ContributionItem from "./ContributionItem"
import ContributionList from "./ContributionList"
import RoundHeader from "./RoundHeader"
import { groupContributions } from "../../utils/contributionUtils"
import { registerPayment } from "../../services/paymentService"
import { closeRound } from "../../services/roundService"
import { consumeBalance } from "../../services/balanceService"
import useRound from "../../hooks/useRound"
import {
  calculateTotalExpected,
  calculateTotalPaid,
  calculatePaidMembers,
  calculateTotalMembers,
} from "../../utils/roundUtils"
export default function RoundCard({

  round,
  contributions,
  payments,
  currentRole,
  refreshData,
  pasanaq,
  members,

}) {

  const {

  processingId,

  selectedMember,

  paymentModalOpen,

  setPaymentModalOpen,

  setSelectedMember,

  payContribution,

  handlePayment,

  handleCloseRound,

} = useRound({

  round,

  pasanaq,

  refreshData,
})

const groupedContributions =

  groupContributions({
    contributions,
    payments,
    contributionAmount: pasanaq.contribution_amount,
  })

  const totalExpected =

  calculateTotalExpected(
    groupedContributions
  )

const totalPaid =

  calculateTotalPaid(
    groupedContributions
  )

const paidMembers =

  calculatePaidMembers(
    groupedContributions
  )

const totalMembers =
  calculateTotalMembers(
    groupedContributions
  )

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-8
        space-y-6
      "
    >

      <RoundHeader
        round={round}
      />

      <RoundProgress
        totalPaid={totalPaid}
        totalExpected={totalExpected}
        paidMembers={paidMembers}
        totalMembers={totalMembers}
        pasanaq={pasanaq}
        totalSlots={contributions.length}

      />

      <ContributionList
        contributions={groupedContributions}
        currentRole={currentRole}
        payContribution={payContribution}
        processingId={processingId}
        pasanaq={pasanaq}
        payments={payments}
      />

{

  currentRole === "owner"

  &&

  contributions.length > 0

  &&

  groupedContributions.every(
    (contribution) =>

    contribution.paidSlots >=contribution.totalSlots
  )

  && (

    <button

      onClick={handleCloseRound}
      disabled={processingId === "closing-round"}
      className="
        w-full
        bg-fintech
        text-white
        py-4
        rounded-xl
        font-bold
        text-lg
        mt-6
      "
    >
    {
      processingId === "closing-round"

      ? "Procesando..."
      : "Cerrar ronda"
    }

    </button>
  )
}

  <PaymentModal

  open={paymentModalOpen}

  onClose={() => {

    setPaymentModalOpen(false)

    setSelectedMember(null)
  }}

  onConfirm={handlePayment}

  member={selectedMember}

  pasanaq={pasanaq}

/>

    </div>
  )
}
