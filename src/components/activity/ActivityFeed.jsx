// ./pasanaq/src/components/activity/ActivityFeed.jsx:

import { useEffect, useState }
from "react"

import { supabase }
from "../../services/supabase"

import Avatar from "../profiles/Avatar"

import {
  formatActivityMessage
} from "../../utils/activityFormatter"

export default function ActivityFeed({

  pasanaqId,

}) {

  const [activities, setActivities] =
    useState([])

  useEffect(() => {

    fetchActivities()

    const channel =
      supabase.channel(
        `activities-${pasanaqId}`
      )

    channel

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter:
            `pasanaq_id=eq.${pasanaqId}`,
        },

        async () => {

          await fetchActivities()

        }
      )

      .subscribe()

    return () => {

      supabase.removeChannel(channel)

    }

  }, [pasanaqId])

  async function fetchActivities() {

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

      .eq("pasanaq_id", pasanaqId)

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

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-8
        mt-10
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          text-petroleum
        "
      >

        Actividad

      </h2>

      <div
        className="
          mt-6
          space-y-4
        "
      >

        {

          activities.map(
            (activity) => (

              <div

                key={activity.id}

                className="
                  border
                  border-silver
                  rounded-xl
                  p-4
                "
              >

                <div
                  className="
                    flex
                    items-start
                    gap-4
                  "
                >

                  <Avatar
                    name={
                      activity.profiles
                        ?.full_name
                    }
                    avatarUrl={
                      activity.profiles
                        ?.avatar_url
                    }
                    size="sm"
                  />

                  <div>

                    <p
                      className="
                        text-dark
                      "
                    >

                      {
                        formatActivityMessage(
                          activity.message
                        )
                      }

                    </p>

                    <p
                      className="
                        text-sm
                        opacity-60
                        mt-2
                      "
                    >

                      {

                        new Date(
                          activity.created_at
                        )

                        .toLocaleString()

                      }

                    </p>

                  </div>

                </div>

              </div>
            )
          )
        }

      </div>

    </div>
  )
}
