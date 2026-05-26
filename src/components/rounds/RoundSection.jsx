// ./pasanaq/src/components/rounds/RoundSection.jsx:

import RoundCard
from "./RoundCard"

export default function RoundSection({

  round,

  contributions,

  payments,

  currentRole,

  refreshData,

  pasanaq,

  members,

}) {

  if (!round) return null

  return (

    <div className="mt-10">

      <RoundCard
        round={round}
        contributions={contributions}
        currentRole={currentRole}
        refreshData={refreshData}
        pasanaq={pasanaq}
        payments={payments}
        members={members}
      />

    </div>
  )
}
