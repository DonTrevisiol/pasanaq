// ./pasanaq/src/components/pasanaq/PasanaqContributionFields.jsx

export default function PasanaqContributionFields({

  amount,
  setAmount,

  currency,
  setCurrency,

  frequency,
  setFrequency,

}) {

  return (

    <>

      <input

        type="number"

        placeholder="Monto por aporte"

        value={amount}

        onChange={(e) =>
          setAmount(
            e.target.value
          )
        }

        className="
          w-full
          border
          border-silver
          rounded-xl
          px-4
          py-3
        "

      />

      <div className="mt-5">

        <label
          className="
            block
            font-semibold
            mb-2
            text-dark
          "
        >

          Moneda

        </label>

        <select

          value={currency}

          onChange={(e) =>
            setCurrency(
              e.target.value
            )
          }

          className="
            w-full
            border
            border-silver
            rounded-xl
            p-4
            bg-white
          "
        >

          <option value="BOB">
            Bolivianos (Bs)
          </option>

          <option value="USD">
            Dólares ($)
          </option>

          <option value="ARS">
            Pesos Argentinos
          </option>

          <option value="PEN">
            Soles Peruanos
          </option>

          <option value="CLP">
            Pesos Chilenos
          </option>

          <option value="EUR">
            Euros (€)
          </option>

        </select>

      </div>

      <select

        value={frequency}

        onChange={(e) =>
          setFrequency(
            e.target.value
          )
        }

        className="
          w-full
          border
          border-silver
          rounded-xl
          px-4
          py-3
        "

      >

        <option value="daily">
          Diario
        </option>

        <option value="weekly">
          Semanal
        </option>

        <option value="monthly">
          Mensual
        </option>

      </select>

    </>

  )
}
