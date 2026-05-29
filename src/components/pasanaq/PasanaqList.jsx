// ./pasanaq/src/components/PasanaqList.jsx:

import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { formatCurrency } from "../../utils/currency"

export default function PasanaqList() {

  const { user } = useAuth()

  const [pasanaqs, setPasanaqs] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetchPasanaqs()

  }, [])

  useEffect(() => {

  if (!user) return

  const channel =
    supabase.channel(
      `dashboard-${user.id}`
    )

  channel

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "pasanaq_members",
        filter: `user_id=eq.${user.id}`,
      },

      async () => {

        await fetchPasanaqs()

      }
    )

    .subscribe()

  return () => {

    supabase.removeChannel(channel)

  }

}, [user])

  async function fetchPasanaqs() {

  const { data, error } =
    await supabase

      .from("pasanaq_members")

      .select(`
        pasanaq_id,
        pasanaqs (
          id,
          name,
          description,
          contribution_amount,
          frequency,
          currency
        )
      `)

      .eq("user_id", user.id)

  if (error) {

    console.error(error)

    setLoading(false)

    return
  }

  console.log(data)

  const uniquePasanaqs =

  Array.from(

    new Map(

      data.map((item) => [

        item.pasanaqs.id,
        item.pasanaqs

      ])

    ).values()

  )

setPasanaqs(uniquePasanaqs)

  setLoading(false)
}

  if (loading) {

    return (

      <p className="text-dark">

        Cargando Pasanaqs...

      </p>
    )
  }

  if (pasanaqs.length === 0) {

    return (

      <p className="text-dark">

        Todavía no tienes Pasanaqs.

      </p>
    )
  }

  return (

    <div className="space-y-4">

      {pasanaqs.map((pasanaq) => (

        <Link
          to={`/pasanaq/${pasanaq.id}`}
          key={pasanaq.id}
          className="
            block
            no-underline
          "
        >

          <h3 className="
            text-xl
            font-bold
            text-petroleum
          ">

            {pasanaq.name}

          </h3>

          <p className="
            text-dark
            mt-2
          ">

            {pasanaq.description}

          </p>

          <div className="
            mt-4
            flex
            gap-4
          ">

            <span className="
              bg-savings
              text-white
              px-4
              py-2
              rounded-xl
            ">

              {formatCurrency(
                pasanaq.contribution_amount,
                pasanaq.currency
              )}

            </span>

            <span className="
              bg-fintech
              text-white
              px-4
              py-2
              rounded-xl
            ">

              {pasanaq.frequency}

            </span>

          </div>

        </Link>
      ))}

    </div>
  )
}
