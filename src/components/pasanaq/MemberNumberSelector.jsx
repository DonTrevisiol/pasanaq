// ./pasanaq/src/components/pasanaq/MemberNumberSelector.jsx

export default function MemberNumberSelector({

  selectedNumbers,

  setSelectedNumbers,

  payoutMode,

  setPayoutMode,

  pasanaq,

}) {

  const totalContribution =

    selectedNumbers *

    (pasanaq?.contribution_amount || 0)

  const frequencyLabel = {

    daily: "día",

    weekly: "semana",

    monthly: "mes",

  }[pasanaq?.frequency]

  function handleNumbersChange(event) {

    const newNumber =
      Number(event.target.value)

    setSelectedNumbers(newNumber)

    if (newNumber < 2) {

      setPayoutMode("any")

    }

  }

  return (

    <div className="mt-6">

      <label
        className="
          block
          font-semibold
          mb-3
        "
      >

        ¿Cuántos números quieres jugar?

      </label>

      <select

        value={selectedNumbers}

        onChange={handleNumbersChange}

        className="
          w-full
          border
          border-silver
          rounded-xl
          p-4
        "
      >

        <option value={1}>
          1 número
        </option>

        <option value={2}>
          2 números
        </option>

        <option value={3}>
          3 números
        </option>

      </select>

      <p
        className="
          mt-3
          text-sm
          opacity-70
        "
      >

        Debes escoger cuidadosamente
        cuántos números deseas jugar.

        Cada número representa un
        aporte obligatorio en cada ronda.

        Una vez confirmada la cantidad,
        no podrás modificarla luego.

      </p>

      {

        selectedNumbers >= 2

        && (

          <div className="mt-8">

            <label
              className="
                block
                font-semibold
                mb-3
              "
            >

              ¿Cómo quieres recibir tus cofres?

            </label>

            <div className="space-y-3">

              <label
                className="
                  flex
                  items-start
                  gap-3
                  border
                  border-silver
                  rounded-xl
                  p-4
                  cursor-pointer
                "
              >

                <input

                  type="radio"

                  name="payoutMode"

                  value="any"

                  checked={
                    payoutMode === "any"
                  }

                  onChange={(e) =>

                    setPayoutMode(
                      e.target.value
                    )

                  }

                  className="mt-1"

                />

                <div>

                  <p className="font-semibold">

                    No importa

                  </p>

                  <p
                    className="
                      text-sm
                      opacity-70
                      mt-1
                    "
                  >

                    Mis cofres pueden salir
                    juntos o separados.

                  </p>

                </div>

              </label>

              <label
                className="
                  flex
                  items-start
                  gap-3
                  border
                  border-silver
                  rounded-xl
                  p-4
                  cursor-pointer
                "
              >

                <input

                  type="radio"

                  name="payoutMode"

                  value="together"

                  checked={
                    payoutMode === "together"
                  }

                  onChange={(e) =>

                    setPayoutMode(
                      e.target.value
                    )

                  }

                  className="mt-1"

                />

                <div>

                  <p className="font-semibold">

                    Cofres juntos

                  </p>

                  <p
                    className="
                      text-sm
                      opacity-70
                      mt-1
                    "
                  >

                    Prefiero recibir mis cofres
                    de forma consecutiva.

                  </p>

                </div>

              </label>

              <label
                className="
                  flex
                  items-start
                  gap-3
                  border
                  border-silver
                  rounded-xl
                  p-4
                  cursor-pointer
                "
              >

                <input

                  type="radio"

                  name="payoutMode"

                  value="separate"

                  checked={
                    payoutMode === "separate"
                  }

                  onChange={(e) =>

                    setPayoutMode(
                      e.target.value
                    )

                  }

                  className="mt-1"

                />

                <div>

                  <p className="font-semibold">

                    Cofres separados

                  </p>

                  <p
                    className="
                      text-sm
                      opacity-70
                      mt-1
                    "
                  >

                    Prefiero que mis cofres
                    no sean consecutivos.

                  </p>

                </div>

              </label>

            </div>

            <p
              className="
                mt-3
                text-sm
                opacity-60
              "
            >

              Esta preferencia se tendrá
              en cuenta al organizar el
              orden de los cofres.

            </p>

          </div>

        )

      }

      <div
        className="
          mt-5
          bg-gold
          text-white
          rounded-xl
          p-5
        "
      >

        <p
          className="
            text-sm
            opacity-80
          "
        >

          Total de aportes

        </p>

        <h3
          className="
            text-3xl
            font-bold
            mt-2
          "
        >

          {totalContribution}
          {" "}
          {pasanaq.currency}

        </h3>

        <p
          className="
            mt-2
            text-sm
            opacity-90
          "
        >

          Deberás aportar esta cantidad
          cada {frequencyLabel}

        </p>

      </div>

    </div>
  )
}
