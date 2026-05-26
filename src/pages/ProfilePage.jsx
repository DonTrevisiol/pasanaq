/* ./pasanaq/src/pages/ProfilePage.jsx: */

import { useEffect, useState }
from "react"

import { useParams, Link }
from "react-router-dom"

import { supabase }
from "../services/supabase"

import ProfileHeader from "../components/profiles/ProfileHeader"

import ProfileStats from "../components/profiles/ProfileStats"

import Avatar from "../components/profiles/Avatar"

import { useAuth } from "../context/AuthContext"

export default function ProfilePage() {

  const { id } = useParams()

  const { user } = useAuth()

  const [profile, setProfile] =
    useState(null)

  const [stats, setStats] =
    useState({
      pasanaqs: 0,
      roundsWon: 0,
    })

  useEffect(() => {

    fetchProfile()

    fetchStats()

  }, [])

  async function fetchProfile() {

    const {
      data,
      error
    } = await supabase

      .from("profiles")

      .select("*")

      .eq("id", id)

      .single()

    if (error) {

      console.log(error)

      return
    }

    setProfile(data)
    console.log(data)
  }

  async function fetchStats() {

    // PASANAQS

    const {
      data: memberships
    } = await supabase

      .from("pasanaq_members")

      .select("*")

      .eq("user_id", id)

    // ROUNDS WON

    const {
      data: rounds
    } = await supabase

      .from("rounds")

      .select("*")

      .eq("receiver_id", id)

    setStats({
      pasanaqs:
        memberships?.length || 0,

      roundsWon:
        rounds?.length || 0,
    })
  }

  if (!profile) {

    return (

      <div className="p-10">

        Cargando perfil...

      </div>
    )
  }

  return (

  <div className="p-10">

    <Link
      to="/dashboard"
      className="
        inline-block
        mb-6
        bg-fintech
        text-white
        px-5
        py-3
        rounded-xl
        font-semibold
      "
    >

      ← Volver al Dashboard

    </Link>

      <div
        className="
          bg-white
          rounded-2xl
          shadow-lg
          p-8
          max-w-2xl
        "
      >

      <ProfileHeader
        profile={profile}
        refreshProfile={fetchProfile}
        isOwnProfile={user?.id === profile?.id}
      />

      <ProfileStats
        stats={{
          totalPasanaqs: 0,
          roundsReceived: 0,
          totalContributed: 0,
          totalReceived: 0,
        }}
      />

      <br></br>

        <div
          className="
            mt-8
            grid
            grid-cols-2
            gap-5
          "
        >

          <div
            className="
              bg-fintech
              text-white
              rounded-xl
              p-5
            "
          >

            <p className="opacity-80">

              Pasanaqs

            </p>

            <h2
              className="
                text-3xl
                font-bold
                mt-2
              "
            >

              {stats.pasanaqs}

            </h2>

          </div>

          <div
            className="
              bg-gold
              text-white
              rounded-xl
              p-5
            "
          >

            <p className="opacity-80">

              Rondas cobradas

            </p>

            <h2
              className="
                text-3xl
                font-bold
                mt-2
              "
            >

              {stats.roundsWon}

            </h2>

          </div>

        </div>

      </div>

    </div>
  )
}
