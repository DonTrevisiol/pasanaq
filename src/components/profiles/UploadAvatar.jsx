// ./pasanaq/src/components/profiles/UploadAvatar.jsx

import { useState } from "react"

import { supabase }
from "../../services/supabase"

import toast
from "react-hot-toast"

export default function UploadAvatar({

  userId,

  refreshProfile,

}) {

  const [uploading, setUploading] =
    useState(false)

  async function handleUpload(event) {

    const file =
      event.target.files[0]

    if (!file) return

    setUploading(true)

    const fileExt =
      file.name.split(".").pop()

    const fileName =
      `${userId}.${fileExt}`

    const filePath =
      `avatars/${fileName}`

    const {
      error: uploadError
    } = await supabase.storage

      .from("avatars")

      .upload(
        filePath,
        file,
        {
          upsert: true,
        }
      )

    if (uploadError) {

      console.error(uploadError)

      toast.error(
        uploadError.message,
        {duration: 6000,}
      )

      setUploading(false)

      return
    }

    const {
      data: publicUrlData
    } = supabase.storage

      .from("avatars")

      .getPublicUrl(filePath)

    const avatarUrl =
      publicUrlData.publicUrl

    const {
      error: updateError
    } = await supabase

      .from("profiles")

      .update({
        avatar_url: avatarUrl,
      })

      .eq("id", userId)

    if (updateError) {

      console.error(updateError)

      toast.error(
        updateError.message,
        {duration: 6000,}
      )

      setUploading(false)

      return
    }

    toast.success(
      "Avatar actualizado",
      {duration: 4000,}
    )

    await refreshProfile()

    setUploading(false)
  }

  return (

    <div>

      <label
        className="
          cursor-pointer
          bg-fintech
          text-white
          px-5
          py-3
          rounded-xl
          font-semibold
          inline-block
        "
      >

        {
          uploading

          ? "Subiendo..."

          : "Cambiar avatar"
        }

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />

      </label>

    </div>
  )
}
