// ./pasanaq/src/components/pasanaq/MemberNumberSelector.jsx

export default function MemberNumberSelector({

  selectedNumbers,

  setSelectedNumbers,

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

        onChange={(e) =>

          setSelectedNumbers(

            Number(e.target.value)
          )
        }

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
