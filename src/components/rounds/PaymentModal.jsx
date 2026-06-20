// ./pasanaq/src/components/rounds/PaymentModal.jsx:

import { useState }
from "react"

import toast
from "react-hot-toast"

export default function PaymentModal({

  open,

  onClose,

  onConfirm,

  member,

  pasanaq,

}) {

  const [amount, setAmount] =
    useState("")

  if (!open) return null

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >

      <div
        className="
          bg-white
          rounded-2xl
          p-8
          w-full
          max-w-md
          shadow-2xl
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            text-petroleum
          "
        >

          Registrar pago

        </h2>

        <p
          className="
            mt-4
            text-dark
            opacity-80
          "
        >

          Ingresa cuánto dinero entregó:

        </p>

        <p
          className="
            mt-2
            font-bold
            text-gold
          "
        >

          {
            member?.profiles
              ?.full_name
          }

        </p>

        <input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) =>
            setAmount(
              Math.max(
                1,
                Number(e.target.value)
              )
            )
          }
          className="
            w-full
            border
            border-silver
            rounded-xl
            px-4
            py-3
            mt-5
          "
          placeholder="0"
        />

        <div
          className="
            flex
            gap-4
            mt-6
          "
        >

          <button

            onClick={onClose}

            className="
              flex-1
              border
              border-silver
              rounded-xl
              py-3
            "
          >

            Cancelar

          </button>

          <button

            onClick={() => {

              if (
                !amount
                ||
                Number(amount) <= 0
              ) {

                toast.error(
                  "Monto inválido"
                )

                return
              }

              onConfirm(
                Number(amount)
              )

              setAmount("")
            }}

            className="
              flex-1
              bg-gold
              text-white
              rounded-xl
              py-3
              font-semibold
            "
          >

            Confirmar

          </button>

        </div>

      </div>

    </div>
  )
}
