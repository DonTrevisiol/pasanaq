// ./pasanaq/src/components/members/MembersSection.jsx:

import { Link } from "react-router-dom"
import Avatar from "../profiles/Avatar"

export default function MembersSection({

  members,

}) {

  return (

    <div
      className="
        mt-10
        bg-white
        rounded-2xl
        shadow-lg
        p-8
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          text-petroleum
        "
      >

        Miembros

      </h2>

      <div
        className="
          mt-6
          space-y-4
        "
      >

        {
  members.map((member) => (

    <div

      key={member.user_id}

      className="
        flex
        justify-between
        items-center
        border-b
        border-silver
        pb-3
      "
    >

      <Link
        to={`/profile/${member.user_id}`}
        className="
          text-dark
          hover:underline
          font-semibold
        "
      >

        <Avatar
          name={
            member.profiles
              ?.full_name
          }
          avatarUrl={
            member.profiles
              ?.avatar_url
          }
        />

        {
          member.profiles
            ?.full_name
          || "Usuario"
        }

        <span
          className="
            ml-3
            text-sm
            opacity-70
          "
        >

          Números:
          {" "}
          {member.member_number}

        </span>

      </Link>

      <span
        className="
          bg-gold
          text-white
          px-4
          py-2
          rounded-xl
          text-sm
        "
      >

        {member.role}

      </span>

    </div>
  ))
}

      </div>

    </div>
  )
}
