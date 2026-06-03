import { useState, useEffect } from "react"
import type { AncestorConceptMap, CodeWASPayload, ConceptRow } from "../utils/types"
import { normalizePayload } from "../utils/payload"

export function useDataSource() {
  const [data, setData] = useState<ConceptRow[] | null>(null)
  const [ancestorConceptsById, setAncestorConceptsById] = useState<AncestorConceptMap>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filePath, setPath] = useState<string | null>(null)

  const setPayload = (payload: CodeWASPayload | ConceptRow[]) => {
    const normalized = normalizePayload(payload)
    setData(normalized.data)
    setAncestorConceptsById(normalized.ancestorConceptsById)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const path = params.get("path")

    setPath(path)

    if (!path) return // no param → let FileUpload handle it

    setLoading(true)
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
      .then((json) => setPayload(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, []) // runs once on mount

  return { data, ancestorConceptsById, setPayload, loading, error, filePath }
}
