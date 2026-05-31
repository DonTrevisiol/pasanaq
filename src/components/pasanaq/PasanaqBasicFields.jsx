// ./pasanaq/src/components/pasanaq/PasanaqBasicFields.jsx

export default function PasanaqBasicFields({

  name,
  setName,

  description,
  setDescription,

}) {

  return (

    <>

      <input

        type="text"

        placeholder="Nombre del grupo"

        value={name}

        onChange={(e) =>
          setName(e.target.value)
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

      <textarea

        placeholder="Descripción"

        value={description}

        onChange={(e) =>
          setDescription(
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

    </>

  )
}
