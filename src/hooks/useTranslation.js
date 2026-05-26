// ./pasanaq/src/hooks/useTranslation.js:

import translations
from "../i18n"

export default function useTranslation() {

  const language = "es"

  const t =
    translations[language]

  return t
}
