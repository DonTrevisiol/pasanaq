// ./pasanaq/src/components/profiles/ProfileHeader.jsx

import Avatar
from "../profiles/Avatar"

import UploadAvatar
from "./UploadAvatar"

export default function ProfileHeader({

  profile,

  refreshProfile,

  isOwnProfile,

}) {

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        p-8
        flex
        items-center
        gap-6
      "
    >

      <Avatar

        name={
          profile?.full_name
        }

        size="hero"

        avatarUrl={
          profile?.avatar_url
        }
      />

      <div>

        <h1
          className="
            text-3xl
            font-bold
            text-petroleum
          "
        >

          {
            profile?.full_name
          }

        </h1>

        <p
          className="
            text-dark
            opacity-70
            mt-2
          "
        >

          Miembro de Pasanaq

        </p>

        {
          isOwnProfile && (
            <div className="mt-4">

          <UploadAvatar

            userId={profile?.id}

            refreshProfile={
              refreshProfile
            }
          />

        </div>
          )
        }

      </div>

    </div>
  )
}
