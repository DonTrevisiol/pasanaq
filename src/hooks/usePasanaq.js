// ./pasanaq/src/hooks/usePasanaq.js:

import {
  useEffect,
  useState
} from "react"

import { supabase }
from "../services/supabase"

export default function usePasanaq(id) {

  const [pasanaq, setPasanaq] =
    useState(null)

  const [members, setMembers] =
    useState([])

  const [currentRole, setCurrentRole] =
    useState(null)

  const [currentUserId, setCurrentUserId] =
    useState(null)

  const [round, setRound] =
    useState(null)

  const [contributions, setContributions] =
    useState([])

  const [payments, setPayments] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [roundHistory, setRoundHistory] =
    useState([])

  const [activities, setActivities] =
    useState([])

  const [roundChests, setRoundChests] =
    useState([])

  async function refreshData() {

    if (!id) return

    setLoading(true)

    await fetchPasanaq(id)

    await fetchMembers(id)

    await fetchRoundData(id)

    await fetchRoundHistory(id)

    await fetchRoundChests(id)

    await fetchActivities(id)

    setLoading(false)

  }

  useEffect(() => {

  refreshData()

}, [id])

  useEffect(() => {

  if (!id) return

  const channel =
    supabase.channel(
      `pasanaq-${id}`
    )

  channel

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "pasanaq_members",
        filter: `pasanaq_id=eq.${id}`,
      },

      async () => {

        await refreshData()

      }
    )

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "contributions",
      },

      async () => {

        await refreshData()

      }
    )

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rounds",
        filter: `pasanaq_id=eq.${id}`,
      },

      async () => {

        await refreshData()

      }
    )

    .on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "activities",
    filter: `pasanaq_id=eq.${id}`,
  },

  async () => {

    await refreshData()

    }
  )
    .subscribe()

  return () => {

    supabase.removeChannel(channel)

  }

}, [id])

  async function fetchPasanaq(id) {

    const {
      data,
      error
    } = await supabase

      .from("pasanaqs")

      .select("*")

      .eq("id", id)

      .single()

    if (error) {

      console.error(error)

      return
    }

    setPasanaq(data)
  }

  async function fetchMembers(id) {

  const {
    data,
    error
  } = await supabase

    .from("pasanaq_members")

    .select(`
      id,
      user_id,
      role,
      position,
      member_number,
      wallet_balance,
      profiles (
        full_name,
        avatar_url
      )
    `)

    .eq("pasanaq_id", id)

  if (error) {

    console.log(error)

    return
  }

  setMembers(data)

  const {
    data: authData
  } = await supabase.auth.getUser()

  setCurrentUserId(authData.user.id)

  const currentMember =
    data.find(
      (member) =>
        member.user_id ===
        authData.user.id
    )

  setCurrentRole(
    currentMember?.role || null
  )
}

async function fetchRoundData(id) {

  const {
    data: roundData,
    error: roundError
  } = await supabase

    .from("rounds")

    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)

    .eq("pasanaq_id", id)

    .eq("status", "active")

    .maybeSingle()

  if (roundError) {

    console.log(roundError)

    return
  }

  if (!roundData) {
    setRound(null)
    setContributions([])
    return
  }

  setRound(roundData)

  const {
  data: contributionsData,
  error: contributionsError
} = await supabase

  .from("contributions")

  .select(`
    *,
    profiles (
      full_name,
      avatar_url
    )
  `)

  .eq("round_id", roundData.id)



  if (contributionsError) {

    console.log(contributionsError)

    return
  }

  setContributions(contributionsData)

  const {
    data: paymentsData
  } = await supabase

  .from("payments")

  .select("*")

  .eq("round_id", roundData.id)

  setPayments(
    paymentsData || []
  )
}

  async function fetchRoundHistory(id) {

  const {
    data,
    error
  } = await supabase

    .from("rounds")

    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)

    .eq("pasanaq_id", id)

    .order(
      "round_number",
      { ascending: true }
    )

  if (error) {

    console.log(error)

    return
  }

  setRoundHistory(data)
}

  async function fetchRoundChests(id) {

  const {
    data,
    error
  } = await supabase

    .from("round_chests")

    .select("*")

    .eq(
      "pasanaq_id",
      id
    )

    .order(
      "chest_order",
      { ascending: true }
    )

  if (error) {

    console.log(error)

    return
  }

  setRoundChests(
    data || []
  )
}

  async function fetchActivities(id) {

  const {
    data,
    error
  } = await supabase

    .from("activities")

    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)

    .eq("pasanaq_id", id)

    .order(
      "created_at",
      { ascending: false }
    )

  if (error) {

    console.log(error)

    return
  }

  setActivities(data)
}

  return {

    pasanaq,

    members,

    roundChests,

    currentRole,

    currentUserId,

    round,

    contributions,

    payments,

    roundHistory,

    activities,

    loading,

    fetchPasanaq,

    fetchMembers,

    fetchRoundData,

    fetchRoundHistory,

    refreshData,
  }
}
