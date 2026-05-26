// ./pasanaq/src/components/profiles/ProfileStats.jsx

export default function ProfileStats({

  stats,

}) {

  const items = [

    {
      label: "Pasanaqs",
      value:
        stats.totalPasanaqs,
    },

    {
      label: "Rondas cobradas",
      value:
        stats.roundsReceived,
    },

    {
      label: "Total aportado",
      value:
        `${stats.totalContributed} Bs`,
    },

    {
      label: "Total recibido",
      value:
        `${stats.totalReceived} Bs`,
    },
  ]

  return (

    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-5
        mt-8
      "
    >

      {

        items.map((item) => (

          <div

            key={item.label}

            className="
              bg-white
              rounded-2xl
              shadow-lg
              p-6
              text-center
            "
          >

            <p
              className="
                text-sm
                opacity-70
              "
            >

              {item.label}

            </p>

            <h3
              className="
                text-2xl
                font-bold
                text-petroleum
                mt-2
              "
            >

              {item.value}

            </h3>

          </div>

        ))
      }

    </div>
  )
}
