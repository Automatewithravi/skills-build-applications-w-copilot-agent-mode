const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function collectionFromResponse(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.data)) return payload.data

  throw new Error('The API returned an unsupported collection response.')
}

export async function responseError(response) {
  let detail = ''
  try {
    const payload = await response.json()
    detail = typeof payload?.error === 'string' ? `: ${payload.error}` : ''
  } catch {
    // The response may not contain JSON; the HTTP status remains useful.
  }
  return new Error(`Request failed (${response.status})${detail}`)
}
