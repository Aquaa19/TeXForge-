// =====================================================
// FILE: backend/src/server.ts
// UPDATED: Added .js extension to the local import
// =====================================================
import express from 'express'
import cors from 'cors'
// CORRECTED IMPORT
import { compileLatex } from './latexWorker.js'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000

app.use(cors())
app.use(express.json({ limit: '2mb' })) // limit large payloads

app.post('/api/generate', async (req, res) => {
  try {
    const { latex } = req.body ?? {}
    if (!latex || typeof latex !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing latex string' })
    }

    // compile with 10s timeout
    const result = await compileLatex(latex, 10000)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Compilation failed',
        log: result.log
      })
    }

    // stream PDF
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="document.pdf"')
    res.send(result.pdfBuffer)
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || String(err) })
  }
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`LaTeX backend listening on http://localhost:${PORT}`)
})
// =====================================================
// END OF FILE: backend/src/server.ts
// =====================================================