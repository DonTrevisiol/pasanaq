// ./pasanaq/src/components/rounds/RoundHeader.jsx

import Avatar
from "../profiles/Avatar"

export default function RoundHeader({

  round,
}) {

  return (

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
            name={
              round.profiles
                ?.full_name
            }

            avatarUrl={
              round.profiles
                ?.avatar_url
            }
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
  )
}
