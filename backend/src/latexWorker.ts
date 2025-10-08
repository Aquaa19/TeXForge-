// =====================================================
// FILE: backend/src/latexWorker.ts
// UPDATED: Added .js extension to the local import
// =====================================================
import path from 'path'
import { spawn } from 'child_process'
import fs from 'fs/promises'
// CORRECTED IMPORT
import { makeTempDir, cleanupDir, writeFileAsync } from './utils.js'

export interface CompileResult {
  success: boolean
  pdfBuffer?: Buffer
  log?: string
  error?: string
}

/**
 * Compile LaTeX source to PDF using pdflatex.
 * - timeoutMs: max time allowed for compilation (default 10s)
 * - runPdfLaTeX twice for references (first pass + second pass)
 */
export async function compileLatex(
  latexSource: string,
  timeoutMs = 10000
): Promise<CompileResult> {
  const workdir = await makeTempDir('latex-')
  const texFile = path.join(workdir, 'input.tex')
  const pdfFile = path.join(workdir, 'input.pdf')
  const logFile = path.join(workdir, 'input.log')

  try {
    await writeFileAsync(texFile, latexSource)

    // helper to run pdflatex once
    const runOnce = (): Promise<{ code: number | null; stdout: string; stderr: string }> => {
      return new Promise((resolve, reject) => {
        const args = [
          '-interaction=nonstopmode',
          '-halt-on-error',
          '-file-line-error',
          '-output-format=pdf',
          'input.tex'
        ]
        const opts = { cwd: workdir }
        const child = spawn('pdflatex', args, opts)

        let stdout = ''
        let stderr = ''

        const killTimer = setTimeout(() => {
          child.kill('SIGKILL')
        }, timeoutMs)

        child.stdout?.on('data', (d) => {
          stdout += d.toString()
        })
        child.stderr?.on('data', (d) => {
          stderr += d.toString()
        })

        child.on('error', (err) => {
          clearTimeout(killTimer)
          reject(err)
        })

        child.on('close', (code) => {
          clearTimeout(killTimer)
          resolve({ code, stdout, stderr })
        })
      })
    }

    // run twice (improves references resolution)
    const pass1 = await runOnce()
    if (pass1.code !== 0) {
      const rawLog = await safeReadFile(logFile)
      return { success: false, log: rawLog, error: `pdflatex failed (pass1).` }
    }

    const pass2 = await runOnce()
    if (pass2.code !== 0) {
      const rawLog = await safeReadFile(logFile)
      return { success: false, log: rawLog, error: `pdflatex failed (pass2).` }
    }

    // read pdf
    const exists = await fileExists(pdfFile)
    if (!exists) {
      const rawLog = await safeReadFile(logFile)
      return { success: false, log: rawLog, error: 'PDF not generated.' }
    }

    const pdfBuffer = await fs.readFile(pdfFile)
    const rawLog = await safeReadFile(logFile)
    return { success: true, pdfBuffer, log: rawLog }
  } catch (err: any) {
    const rawLog = await safeReadFile(logFile)
    return { success: false, log: rawLog, error: err?.message || String(err) }
  } finally {
    // cleanup after small delay to allow the caller to read files if needed.
    // We'll schedule cleanup asynchronously so response can stream PDF before removal.
    setTimeout(() => {
      cleanupDir(workdir).catch(() => {})
    }, 1000)
  }
}

/** helpers */
async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function safeReadFile(p: string): Promise<string | undefined> {
  try {
    const b = await fs.readFile(p, 'utf8')
    return b
  } catch {
    return undefined
  }
}
// =====================================================
// END OF FILE: backend/src/latexWorker.ts
// =====================================================