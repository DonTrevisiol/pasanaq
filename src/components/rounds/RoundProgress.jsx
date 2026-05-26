// ./pasanaq/src/components/rounds/RoundProgress.jsx:
import { formatCurrency } from "../../utils/currency"

export default function RoundProgress({

  totalPaid,

  totalExpected,

  paidMembers,

  totalMembers,

  totalSlots,

  pasanaq,

}) {

  return (

    <div
      className="
        bg-light
        rounded-xl
        p-5
        space-y-3
      "
    >

      <div
        className="
          flex
          justify-between
          text-lg
          font-semibold
        "
      >

        <span>
          Cofre
        </span>

        <span>

  {
    formatCurrency(
      totalPaid,
      pasanaq?.currency
    )
  }

  {" / "}

  {
    formatCurrency(
      totalExpected,
      pasanaq?.currency
    )
  }

</span>

      </div>

      <div
        className="
          w-full
          h-4
          bg-silver
          rounded-full
          overflow-hidden
        "
      >

        <div
          className="
            h-full
            bg-gold
            rounded-full
          "
          style={{
            width: `${
              totalExpected > 0

              ? (
                  totalPaid /
                  totalExpected
                ) * 100

              : 0
            }%`
          }}
        />

      </div>

      <div
  className="
    flex
    justify-between
    text-sm
    opacity-70
  "
>

  <p>

    {paidMembers}

    {" de "}

    {totalMembers}

    {" miembros pagaron"}

  </p>


</div>

    </div>
  )
}
