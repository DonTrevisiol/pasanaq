// ./pasanaq/src/components/rounds/RoundFutureChest.jsx

export default function RoundFutureChest({

  round,
  roundChests,
  currentUserId,
  currentRole,
  members,

}) {

  if (
    !round ||
    !roundChests ||
    roundChests.length === 0
  ) {

    return null
  }

  const currentOrder =
    round.round_number

  const currentChest =
    roundChests.find(

      (chest) =>

        chest.chest_order ===
        currentOrder
    )

  const isCurrentReceiver =

    currentChest?.user_id ===
    currentUserId

  const myNextChest =

    roundChests.find(

      (chest) =>

        chest.user_id ===
        currentUserId

        &&

        chest.chest_order >
        currentOrder
    )

  const futureChests =

    roundChests.filter(

      (chest) =>

        chest.chest_order >
        currentOrder
    )

  const getMemberName = (
    userId
  ) => {

      if(!members?.length) {
          return "Usuario"
    }

    const member =
      members.find(

        (member) =>

          member.user_id ===
          userId
      )

    return (

      member?.profiles
        ?.full_name

      ||

      "Jugador"
    )
  }

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-6
        space-y-5
      "
    >

      {

        isCurrentReceiver

        ? (

          <div
            className="
              bg-savings/10
              border
              border-savings
              rounded-xl
              p-4
            "
          >

            <h3
              className="
                text-xl
                font-bold
                text-savings
              "
            >

              🎉 ESTE ES TU COFRE

            </h3>

            <p
              className="
                text-dark
                mt-2
              "
            >

              Estás cobrando en esta ronda.

            </p>

          </div>

        )

        : myNextChest

        ? (

          <div>

            <h3
              className="
                text-xl
                font-bold
                text-petroleum
              "
            >

              Tu próximo cofre

            </h3>

            <div
              className="
                mt-3
                bg-fintech/10
                rounded-xl
                p-4
              "
            >

              <p
                className="
                  text-lg
                  font-semibold
                "
              >

                Ronda {

                  myNextChest
                    .chest_order

                }

              </p>

              <p
                className="
                  text-dark
                  opacity-80
                  mt-1
                "
              >

                {

                  myNextChest
                    .chest_order

                  -

                  currentOrder

                  === 1

                  ? "Te toca después de esta ronda"

                  : `Faltan ${
                      myNextChest
                        .chest_order

                      -

                      currentOrder
                    } rondas`

                }

              </p>

            </div>

          </div>

        )

        : null
      }

      {

        (
          currentRole === "owner"

          ||

          currentRole === "admin"
        )

        &&

        futureChests.length > 0

        && (

          <div>

            <h3
              className="
                text-xl
                font-bold
                text-petroleum
              "
            >

              Próximos cofres

            </h3>

            <div
              className="
                mt-3
                space-y-2
              "
            >

              {

                futureChests.map(

                  (chest) => (

                    <div

                      key={chest.id}

                      className="
                        flex
                        justify-between
                        items-center
                        border
                        border-silver
                        rounded-xl
                        p-3
                      "
                    >

                      <div>

                        <span
                          className="
                            font-semibold
                          "
                        >

                          Ronda {

                            chest
                              .chest_order

                          }

                        </span>

                        {" → "}

                        {

                          getMemberName(
                            chest.user_id
                          )

                        }

                      </div>

                      {

                        chest.user_id ===
                        currentUserId

                        && (

                          <span
                            className="
                              text-fintech
                              font-bold
                            "
                          >

                            ← Tu cofre

                          </span>

                        )
                      }

                    </div>

                  )
                )
              }

            </div>

          </div>

        )
      }

    </div>
  )
}
