// ./pasanaq/src/utils/activityFormatter.jsx

export function formatActivityMessage(
  message
) {

  const currencies =

    [
      "Bs",
      "\\$",
      "USD",
      "BOB",
      "EUR",
      "ARS",
      "PEN",
      "CLP",
      "¥",
      "£",
    ]

  const currencyPattern =
    currencies.join("|")

  const amountRegex =
    new RegExp(

      `(\\d+(?:\\.\\d+)?\\s?(?:${currencyPattern}))`,

      "g"
    )

  const parts =
    message.split(amountRegex)

  return parts.map(
    (part, index) => {

      const isAmount =

        new RegExp(

          `^(\\d+(?:\\.\\d+)?\\s?(?:${currencyPattern}))$`

        ).test(part)

      if (isAmount) {

        return (

          <strong
            key={index}
            className="
              text-gold
            "
          >

            {part}

          </strong>
        )
      }

      return part
    }
  )
}
