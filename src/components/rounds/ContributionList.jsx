// ./pasanaq/src/components/rounds/ContributionList.jsx

import ContributionItem
from "./ContributionItem"

export default function ContributionList({

  contributions,

  currentRole,

  payContribution,

  pasanaq,

}) {

  return (

    <div className="space-y-3">

      {

        contributions.map(
          (contribution) => (

            <ContributionItem

              key={
                contribution.user_id
              }

              contribution={
                contribution
              }

              currentRole={
                currentRole
              }

              payContribution={
                payContribution
              }

              pasanaq={pasanaq}

            />

          )
        )
      }

    </div>
  )
}
