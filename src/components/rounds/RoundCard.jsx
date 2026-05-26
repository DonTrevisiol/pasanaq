// ./pasanaq/src/components/RoundCard.jsx

import { supabase }
from "../../services/supabase"
import { useState } from "react"
import toast from "react-hot-toast"
import Avatar from "../profiles/Avatar"
import PaymentModal from "./PaymentModal"
import RoundProgress from "./RoundProgress"
import ContributionItem from "./ContributionItem"
import ContributionList from "./ContributionList"
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

  const [processingId, setProcessingId] =
    useState(null)

  const [selectedMember, setSelectedMember] =
    useState(null)

  const [paymentModalOpen, setPaymentModalOpen] =
    useState(false)

  async function payContribution(member) {
    setSelectedMember(member)
    setPaymentModalOpen(true)
  }

  async function handleCloseRound() {
    setProcessingId("closing-round")

  // CERRAR RONDA ACTUAL

  const {
    error: closeError
  } = await supabase

    .from("rounds")

    .update({
      status: "completed"
    })

    .eq("id", round.id)

  if (closeError) {

    console.error(closeError)

    toast.error(closeError.message)
    setProcessingId(null)

    return
  }

  // BUSCAR MIEMBROS

  const {
    data: members,
    error: membersError
  } = await supabase

    .from("pasanaq_members")

    .select(`
      *,
      profiles (
        full_name
      )
    `)

    .eq(
      "pasanaq_id",
      round.pasanaq_id
    )

    .order(
      "position",
      { ascending: true }
    )

  if (membersError) {

    console.error(membersError)

    toast.error(membersError.message)
    setProcessingId(null)

    return
  }

  // BUSCAR SIGUIENTE RECEPTOR

  const nextReceiver =
    members.find(
      (member) =>
        member.position ===
        round.round_number + 1
    )

  // SI YA TODOS COBRARON

  if (!nextReceiver) {
    await supabase
      .from("pasanaqs")

      .update({
        status: "finished"
      })
      .eq("id", round.pasanaq_id)
    toast.success(
      "Todas las rondas finalizaron"
    )

    await refreshData()

    setProcessingId(null)

    return
  }

  // CREAR NUEVA RONDA

  const {
    data: newRound,
    error: newRoundError
  } = await supabase

    .from("rounds")

    .insert({
      pasanaq_id:
        round.pasanaq_id,

      round_number:
        round.round_number + 1,

      receiver_id:
        nextReceiver.user_id,

      status: "active",
    })

    .select()

    .single()

  if (newRoundError) {

    console.error(newRoundError)

    toast.error(newRoundError.message)

    setProcessingId(null)

    return
  }

  // BUSCAR DATOS PASANAQ

  const {
    data: pasanaqData,
    error: pasanaqError
  } = await supabase

    .from("pasanaqs")

    .select("*")

    .eq(
      "id",
      round.pasanaq_id
    )

    .single()

  if (pasanaqError) {

    console.error(pasanaqError)

    toast.error(pasanaqError.message)
    setProcessingId(null)

    return
  }

  // CREAR CONTRIBUTIONS

  const contributions =

  members.flatMap((member) =>

      Array.from({

          length:
            member.member_number || 1
        }).map(() => ({

          round_id:
            newRound.id,

          user_id:
            member.user_id,

          amount: pasanaqData.contribution_amount,

          status: "pending",
        }))
  )

  const {
    error: contributionsError
  } = await supabase

    .from("contributions")

    .insert(contributions)

    for (const member of members) {
      await consumeBalance(
        member.user_id
      )
    }

  if (contributionsError) {

    console.error(
      contributionsError
    )

    toast.error(contributionsError.message)
    setProcessingId(null)

    return
  }

  await supabase

  .from("activities")

  .insert({

    pasanaq_id:
      round.pasanaq_id,

    user_id:
      round.receiver_id,

    type:
      "round_completed",

    message:
      `La ronda #${round.round_number} finalizó`,

  })

  await supabase

  .from("activities")

  .insert({

    pasanaq_id:
      round.pasanaq_id,

    user_id:
      nextReceiver.user_id,

    type:
      "round_started",

    message:
      `Comenzó la ronda #${newRound.round_number} y el receptor actual es ${nextReceiver.profiles?.full_name}`,

  })

  for (const member of members) {
    await consumeBalance(
      member.user_id
    )
  }

  toast.success("Nueva ronda creada")

  await refreshData()
  setProcessingId(null)
}

async function handlePayment(amount) {

  if (!selectedMember) return

  setProcessingId(
    selectedMember.user_id
  )

  // SUMAR BALANCE

  const {
    data: profileData,
    error: profileError
  } = await supabase

    .from("profiles")

    .select("balance")

    .eq(
      "id",
      selectedMember.user_id
    )

    .single()

  if (profileError) {

    console.log(profileError)

    return
  }

  const currentBalance =

    Number(
      profileData.balance || 0
    )

  const newBalance =
    currentBalance + amount

  await supabase

    .from("profiles")

    .update({
      balance: newBalance
    })

    .eq(
      "id",
      selectedMember.user_id
    )

  // REGISTRAR PAYMENT

    const {

  data: paymentData,

  error: paymentError

} = await supabase

  .from("payments")

  .insert({

    pasanaq_id:
      round.pasanaq_id,

    round_id:
      round.id,

    user_id:
      selectedMember.user_id,

    amount,

  })

  .select()

console.log(paymentData)

console.log(paymentError)

  // CONSUMIR BALANCE

  await consumeBalance(
    selectedMember.user_id
  )

  // ACTIVIDAD

  await supabase

    .from("activities")

    .insert({

      pasanaq_id:
        round.pasanaq_id,

      user_id:
        selectedMember.user_id,

      type:
        "payment_received",

      message:
        `${selectedMember.profiles?.full_name} entregó ${amount} ${pasanaq.currency}`,

    })

  setPaymentModalOpen(false)

  setSelectedMember(null)

  await refreshData()

  setProcessingId(null)
}

async function consumeBalance(
  userId
) {

  const {
    data: profile
  } = await supabase

    .from("profiles")

    .select("balance")

    .eq("id", userId)

    .single()

  let balance =

    Number(
      profile.balance || 0
    )

  if (balance <= 0) return

  const {
    data: pendingContributions
  } = await supabase

    .from("contributions")

    .select("*")

    .eq("user_id", userId)

    .order(
      "created_at",
      { ascending: true }
    )

  for (
    const contribution
    of pendingContributions
  ) {

    if (balance <= 0) break

    const amount =

      Number(
        contribution.amount
      )

    const paidAmount =

      Number(
        contribution.paid_amount || 0
      )

    const remaining =

      amount - paidAmount

    if (remaining <= 0)
      continue

    // CUÁNTO PODEMOS PAGAR

    const paymentApplied =

      Math.min(
        balance,
        remaining
      )

    const newPaidAmount =

      paidAmount +
      paymentApplied

    const fullyPaid =

      newPaidAmount >= amount

    await supabase

      .from("contributions")

      .update({

        paid_amount:
          newPaidAmount,

        status:

          fullyPaid
          ? "paid"
          : "partial",

        paid_at:

          fullyPaid

          ? new Date()
              .toISOString()

          : null,
      })

      .eq(
        "id",
        contribution.id
      )

    balance -=
      paymentApplied
  }

  await supabase

    .from("profiles")

    .update({
      balance
    })

    .eq("id", userId)
}

const groupedContributions =

  members.map((member) => {

    const userPayments =

      payments.filter(
        (payment) =>

          payment.user_id ===
          member.user_id
      )

    const totalPaid =

      userPayments.reduce(

        (sum, payment) =>

          sum +
          Number(payment.amount),

        0
      )

    const slotValue =

      Number(
        pasanaq.contribution_amount
      )

    const totalSlots =

      member.member_number || 1

    return {

      user_id:
        member.user_id,

      profiles:
        member.profiles,

      totalAmount:
        totalSlots * slotValue,

      paidAmount:
        totalPaid,

      totalSlots,

      paidSlots:
          totalPaid / slotValue
    }
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

      <div>

        <h2
          className="
            text-3xl
            font-bold
            text-petroleum
          "
        >
          Ronda #{round.round_number}
        </h2>

        <div
  className="
    flex
    justify-between
    items-start
    gap-5
    flex-wrap
  "
>

  <div>

    <p
      className="
        text-dark
        opacity-70
      "
    >

      Estado:
      {" "}
      {round.status}

    </p>

  </div>

  <div
    className="
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

      Receptor actual

    </p>

    <Avatar
      name={round.profiles?.full_name}
      avatarUrl={round.profiles?.avatar_url}
    />

    <h3
      className="
        text-2xl
        font-bold
        mt-2
      "
    >

      {
        round.profiles
          ?.full_name
      }

    </h3>

  </div>

</div>


      </div>

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
