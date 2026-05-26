// ./pasanaq/src/components/pasanaq/PasanaqHeader.jsx:

import PasanaqActions from "./PasanaqActions"
import { formatCurrency } from "../../utils/currency"

export default function PasanaqHeader({

  pasanaq,

  round,

  members,

  currentRole,

  refreshData,

}) {

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-8
      "
    >

      <h1
        className="
          text-4xl
          font-bold
          text-petroleum
        "
      >

        {pasanaq.name}

      </h1>

      <p
        className="
          text-dark
          mt-4
        "
      >

        {pasanaq.description}

      </p>

      <div
        className="
          mt-6
          flex
          gap-4
        "
      >

        <div
          className="
            bg-savings
            text-white
            px-5
            py-3
            rounded-xl
          "
        >

          {
            formatCurrency(
              pasanaq.contribution_amount,
              pasanaq.currency
            )
          }


        </div>

        <div
          className="
            bg-fintech
            text-white
            px-5
            py-3
            rounded-xl
          "
        >

          {pasanaq.frequency}

        </div>

      </div>

      <div className="mt-6">

        <PasanaqActions
          pasanaq={pasanaq}
          round={round}
          members={members}
          currentRole={currentRole}
          refreshData={refreshData}
        />

      </div>

    </div>
  )
}
