// ./pasanaq/src/components/rounds/ContributionItem.jsx:

import { Link }
from "react-router-dom"

import Avatar
from "../profiles/Avatar"

import { formatCurrency }
from "../../utils/currency"

export default function ContributionItem({

  contribution,

  currentRole,

  currentUserId,

  payContribution,

  pasanaq,

}) {

  const progress =

    contribution.totalAmount > 0

    ? (
        contribution.paidAmount /
        contribution.totalAmount
      ) * 100

    : 0

  const canSeeBalance =
    currentRole === "owner"

    ||

    currentRole === "admin"

    ||

    currentUserId === contribution.user_id

  const futureRoundsCovered = contribution.totalAmount > 0

        ? Math.floor(
          contribution.wallet_balance / contribution.totalAmount
        )

        : 0

  return (

    <div

      className="
        border
        border-silver
        rounded-xl
        px-4
        py-4
        space-y-4
      "
    >

      <div
        className="
          flex
          justify-between
          items-start
        "
      >

        <div className="flex-1">

          <Link

            to={
              `/profile/${contribution.user_id}`
            }

            className="
              font-semibold
              text-dark
              hover:underline
            "
          >

            <Avatar
              name={
                contribution.profiles
                  ?.full_name
              }
              size="sm"
              avatarUrl={
                contribution.profiles
                  ?.avatar_url
              }
            />

            {
              contribution.profiles
                ?.full_name
            }

          </Link>

          <p
            className="
              text-sm
              opacity-70
              mt-1
            "
          >

            {
              formatCurrency(
                contribution.paidAmount,
                pasanaq.currency
              )
            }

            {" / "}

            {
              formatCurrency(
                contribution.totalAmount,
                pasanaq.currency
              )
            }

          </p>

          <div
            className="
              w-full
              h-3
              bg-silver
              rounded-full
              overflow-hidden
              mt-3
            "
          >

            <div
              className="
                h-full
                bg-gold
                rounded-full
              "
              style={{
                width:
                  `${progress}%`
              }}
            />

          </div>

        </div>

        <div className="ml-4 text-right">

          {

            progress >= 100

? (

  <div>

    <span
      className="
        text-savings
        font-bold
        block
      "
    >

      Pagado

    </span>

    {

  (

    currentRole === "owner"

    ||

    currentRole === "admin"

  )

  && (

    <button

      onClick={() =>

        payContribution(
          contribution
        )
      }

      className="
        mt-2
        bg-gold
        text-white
        px-4
        py-2
        rounded-xl
        font-semibold
      "
    >

      Cobrar

    </button>

  )

}


  </div>

)

            : (

              currentRole === "owner"

              ||

              currentRole === "admin"

            )

            ? (

              <button

                onClick={() =>

                  payContribution(
                    contribution
                  )
                }

                className="
                  bg-gold
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  font-semibold
                "
              >

                Cobrar

              </button>

            )

            : (

              <span
                className="
                  text-gold
                  font-bold
                "
              >

                Pendiente

              </span>

            )
          }

                    {

  contribution.totalAmount >

  contribution.paidAmount

  && (

    <p
      className="
        text-sm
        text-red-500
        font-semibold
        mt-1
      "
    >

      Debe:

      {" "}

      {

        formatCurrency(

          contribution.totalAmount -

          contribution.paidAmount,

          pasanaq.currency

        )

      }

    </p>

  )

}

        </div>

      </div>

      {

  progress >= 100

  &&

  canSeeBalance

  &&

  contribution.wallet_balance > 0

  && (

    <div
      className="
        mt-3
        text-right
      "
    >

    <p
      className="
        text-sm
        text-fintech
        font-semibold
        mt-1
      "
    >

      Saldo a favor:

      {" "}

      {
          formatCurrency(
          contribution.wallet_balance,
          pasanaq.currency
        )
      }

      </p>

      <p
          className="
          text-sm
          text-fintech
          "
      >

          Proximas rondas cubiertas:
          {" "}

          {futureRoundsCovered}

          </p>

    </div>
  )
}

    </div>
  )
}
