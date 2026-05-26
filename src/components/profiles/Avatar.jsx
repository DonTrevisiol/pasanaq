// ./pasanaq/src/components/profiles/Avatar.jsx

export default function Avatar({

  name,

  avatarUrl,

  size = "md",

}) {

  const initials =
    name
      ?.split(" ")
      .map(
        (word) => word[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase()

  const sizes = {

    sm: `
      w-8
      h-8
      text-sm
    `,

    md: `
      w-12
      h-12
      text-lg
    `,

    xl: `
      w-24
      h-24
      text-4xl
    `,
    xxl: `
      w-32
      h-32
      text-5xl
    `,
    hero: `
      w-40
      h-40
      text-6xl
    `,
  }

  const colors = [

    "bg-fintech",

    "bg-savings",

    "bg-gold",

    "bg-petroleum",
  ]

  const colorIndex =

    name
      ?.charCodeAt(0)

      % colors.length

  const avatarColor =
    colors[colorIndex]

  if (avatarUrl) {

    return (

      <img

        src={avatarUrl}

        alt={name}

        className={`
          ${sizes[size]}
          rounded-full
          object-cover
          border-2
          border-white
          shrink-0
        `}
      />
    )
  }

  return (

    <div
      className={`
        ${sizes[size]}
        rounded-full
        border-2
        border-white
        ${avatarColor}
        text-white
        flex
        items-center
        justify-center
        font-bold
        shrink-0
      `}
    >

      {initials}

    </div>
  )
}
