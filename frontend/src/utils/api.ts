// =====================================================
// FILE: frontend/src/utils/api.ts
// Updated: 2025-10-07 20:10 IST | PDF generation API helpers
// - Uses axios to POST LaTeX and returns either PDF Blob or error+log
// =====================================================
import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface GeneratePdfSuccess {
  success: true
  blob: Blob
  filename?: string
}

export interface GeneratePdfFailure {
  success: false
  error?: string
  log?: string
  status?: number
}

export type GeneratePdfResult = GeneratePdfSuccess | GeneratePdfFailure

export async function generatePdf(latex: string): Promise<GeneratePdfResult> {
  try {
    const resp = await axios.post('${API_BASE_URL}/api/generate', { latex }, { responseType: 'arraybuffer' })

    const contentType = (resp.headers['content-type'] || '').toLowerCase()
    if (contentType.includes('application/pdf')) {
      const filenameHeader = resp.headers['content-disposition'] || ''
      let filename = 'document.pdf'
      const match = filenameHeader.match(/filename="?(.*?)"?($|;)/)
      if (match) filename = match[1]
      const blob = new Blob([resp.data], { type: 'application/pdf' })
      return { success: true, blob, filename }
    } else {
      // If not PDF, try parse arraybuffer as text / JSON
      const text = new TextDecoder().decode(new Uint8Array(resp.data))
      try {
        const parsed = JSON.parse(text)
        return { success: false, error: parsed.error, log: parsed.log, status: resp.status }
      } catch {
        return { success: false, error: text, status: resp.status }
      }
    }
  } catch (err: any) {
    // Axios error: may have response with JSON body
    if (err?.response?.data) {
      try {
        const arr = err.response.data as ArrayBuffer
        const text = new TextDecoder().decode(new Uint8Array(arr))
        const parsed = JSON.parse(text)
        return { success: false, error: parsed.error, log: parsed.log, status: err.response.status }
      } catch {
        return { success: false, error: String(err.message) }
      }
    }
    return { success: false, error: err?.message || String(err) }
  }
}
// =====================================================
// END OF FILE: frontend/src/utils/api.ts
// =====================================================