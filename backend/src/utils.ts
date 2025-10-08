// =====================================================
// FILE: backend/src/utils.ts
// Updated: 2025-10-07 19:45 IST | Initial creation
// - Small helpers: makeTempDir, cleanupDir, writeFileAsync
// - Uses fs.promises and os.tmpdir
// =====================================================
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

/**
 * Create a safe temporary directory for a job.
 * Returns absolute path.
 */
export async function makeTempDir(prefix = 'latex-job-'): Promise<string> {
  const base = os.tmpdir()
  const dir = await fs.mkdtemp(path.join(base, prefix))
  return dir
}

/**
 * Remove directory recursively (best-effort).
 */
export async function cleanupDir(dirPath: string): Promise<void> {
  try {
    // fs.rm with recursive true is available in modern Node versions
    await fs.rm(dirPath, { recursive: true, force: true })
  } catch (err) {
    // fallback: try unlink each file (best-effort)
    try {
      const files = await fs.readdir(dirPath)
      await Promise.all(
        files.map((f) => fs.unlink(path.join(dirPath, f)).catch(() => {}))
      )
      await fs.rmdir(dirPath).catch(() => {})
    } catch {
      // ignore
    }
  }
}

/**
 * Convenience write file with mode and encoding
 */
export async function writeFileAsync(
  filePath: string,
  content: string | Buffer
): Promise<void> {
  await fs.writeFile(filePath, content)
}
// =====================================================
// END OF FILE: backend/src/utils.ts
// =====================================================