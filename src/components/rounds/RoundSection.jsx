// ./pasanaq/src/components/rounds/RoundSection.jsx:

import RoundCard
from "./RoundCard"

export default function RoundSection({

  round,

  contributions,

  payments,

  currentRole,

  currentUserId,

  refreshData,

  pasanaq,

  members,

  roundChests,

}) {

  if (!round) return null

  console.log("RoundSection currentUserId: ", currentUserId)

  return (

    <div className="mt-10">

      <RoundCard
        round={round}
        contributions={contributions}
        currentRole={currentRole}
        currentUserId={currentUserId}
        refreshData={refreshData}
        pasanaq={pasanaq}
        payments={payments}
        members={members}
        roundChests={roundChests}
      />

    </div>
  )
}
