// =====================================================
// FILE: frontend/src/utils/latexUtils.ts
// Updated: 2025-10-07 19:55 IST | Add math-fragment detection
// - Existing helpers: checkLatexStructure, addStandardPreamble
// - New helper: looksLikeMathFragment(src) -> boolean
//   (used to prompt user to wrap raw math like "\int x^2 dx")
// =====================================================

export interface LatexCheckResult {
  hasDocumentClass: boolean
  hasBeginDocument: boolean
}

/**
 * Checks if LaTeX code has document structure elements.
 */
export function checkLatexStructure(latex: string): LatexCheckResult {
  const normalized = latex.toLowerCase()
  return {
    hasDocumentClass: normalized.includes('\\documentclass'),
    hasBeginDocument: normalized.includes('\\begin{document}')
  }
}

/**
 * Adds a default LaTeX preamble and wraps content safely.
 */
export function addStandardPreamble(content: string): string {
  return `\\pdfminorversion=4
\\documentclass[]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amssymb,latexsym,amsmath}
\\usepackage[a4paper,top=3cm,bottom=2cm,left=3cm,right=3cm,marginparwidth=1.75cm]{geometry}
\\usepackage{graphicx}
\\usepackage[colorlinks=true, allcolors=blue]{hyperref}
\\begin{document}

${content}

\\end{document}`
}

/**
 * Heuristic to detect if the user pasted a short math fragment
 * that likely needs to be wrapped in math mode.
 *
 * Returns true for inputs that:
 * - contain common math indicators (like \int, \sum, \frac, ^, _)
 * - do NOT already include $...$ inline math or \begin{...} blocks
 * - are not a full document (no \documentclass)
 *
 * This is intentionally conservative to avoid false positives.
 */
export function looksLikeMathFragment(src: string): boolean {
  const s = String(src ?? '').trim()
  if (s.length === 0) return false

  // If the user already provided a full document, don't try to guess
  if (s.includes('\\documentclass')) return false
  if (s.includes('\\begin{document}')) return false

  // Common math tokens that indicate math-mode content
  const mathIndicators = [
    '\\int',
    '\\sum',
    '\\frac',
    '\\sqrt',
    '\\sin',
    '\\cos',
    '\\tan',
    '\\lim',
    '^',
    '_',
    '\\alpha',
    '\\beta',
    '\\gamma',
    '\\partial'
  ]

  const hasMathToken = mathIndicators.some((tok) => s.includes(tok))
  if (!hasMathToken) return false

  // If there's any dollar sign or explicit math environment, assume it's already correct
  const hasDollar = /\$/.test(s)
  const hasMathEnv = /\\(?:\[|begin\{(equation|align|gather|multline|displaymath)\})/.test(s)

  if (hasDollar || hasMathEnv) return false

  // Finally, avoid flagging very long documents
  if (s.length > 2000) return false

  return true
}
// =====================================================
// END OF FILE: frontend/src/utils/latexUtils.ts
// =====================================================