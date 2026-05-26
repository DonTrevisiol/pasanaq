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

        <div className="ml-4">

          {

            progress >= 100

            ? (

              <span
                className="
                  text-savings
                  font-bold
                "
              >

                Pagado

              </span>

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

        </div>

      </div>

    </div>
  )
}
