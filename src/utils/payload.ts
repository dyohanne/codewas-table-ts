import type { AncestorConceptMap, CodeWASPayload, ConceptRow } from "./types"

export function normalizePayload(
  payload: CodeWASPayload | ConceptRow[],
): { data: ConceptRow[]; ancestorConceptsById: AncestorConceptMap } {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      ancestorConceptsById: buildAncestorConceptMapFromRows(payload),
    }
  }

  return {
    data: payload.results ?? [],
    ancestorConceptsById: payload.ancestorConcepts ?? {},
  }
}

function buildAncestorConceptMapFromRows(rows: ConceptRow[]): AncestorConceptMap {
  const conceptsById: AncestorConceptMap = {}

  rows.forEach((row) => {
    ;(row.ancestorConcepts ?? []).forEach((ancestor) => {
      if (!ancestor?.conceptId) return
      conceptsById[String(ancestor.conceptId)] = ancestor
    })
  })

  return conceptsById
}
