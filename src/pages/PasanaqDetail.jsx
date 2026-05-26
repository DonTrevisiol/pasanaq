/* ./pasanaq/src/pages/PasanaqDetail.jsx */

import { useParams, Link } from "react-router-dom"

import toast from "react-hot-toast"

import ActivityFeed from "../components/activity/ActivityFeed"

import { supabase }
from "../services/supabase"

import PasanaqHeader
from "../components/pasanaq/PasanaqHeader"

import MembersSection
from "../components/members/MembersSection"

import RoundSection
from "../components/rounds/RoundSection"

import usePasanaq
from "../hooks/usePasanaq"

export default function PasanaqDetail() {

  const { id } = useParams()

  const {
    pasanaq,
    members,
    currentRole,
    round,
    contributions,
    payments,
    roundHistory,
    loading,
    refreshData,
  } = usePasanaq(id)

  if (loading) {

    return (

      <div className="p-10">

        Cargando Pasanaq...

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

      <PasanaqHeader
        pasanaq={pasanaq}
        round={round}
        members={members}
        currentRole={currentRole}
        refreshData={refreshData}
      />

      <MembersSection
        members={members}
      />

      <RoundSection
        round={round}
        contributions={contributions}
        currentRole={currentRole}
        refreshData={refreshData}
        pasanaq={pasanaq}
        payments={payments}
        members={members}
      />

      <div
        className="
          mt-10
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            text-petroleum
          "
        >

          Historial de rondas

        </h2>

        <div
          className="
            mt-6
            space-y-4
          "
        >

          {

            roundHistory.map(
              (historyRound) => (

                <div

                  key={historyRound.id}

                  className="
                    border
                    border-silver
                    rounded-xl
                    p-5
                    flex
                    justify-between
                    items-center
                  "
                >

                  <div>

                    <h3
                      className="
                        font-bold
                        text-lg
                        text-dark
                      "
                    >

                      Ronda #
                      {
                        historyRound
                          .round_number
                      }

                    </h3>

                    <p
                      className="
                        opacity-70
                      "
                    >

                      Receptor:
                      {" "}

                      {
                        historyRound
                          .profiles
                          ?.full_name
                      }

                    </p>

                  </div>

                  <span
                    className={`
                      px-4
                      py-2
                      rounded-xl
                      text-white
                      font-semibold

                      ${
                        historyRound.status ===
                        "completed"

                        ? "bg-savings"

                        : "bg-fintech"
                      }
                    `}
                  >

                    {
                      historyRound.status
                    }

                  </span>


                </div>

              )
            )
          }

        </div>


      </div>
        <ActivityFeed
          pasanaqId={id}
        />

    </div>
  )
}
