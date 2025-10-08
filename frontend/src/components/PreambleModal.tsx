// =====================================================
// FILE: frontend/src/components/PreambleModal.tsx
// Updated: 2025-10-07 18:40 IST | Fixed JSX brace escaping
// - Escaped literal LaTeX braces inside JSX by rendering a JS string
// - No other logic changes
// =====================================================
import React from 'react'

interface PreambleModalProps {
  isOpen: boolean
  missingDocumentClass: boolean
  missingBeginDocument: boolean
  onConfirm: () => void
  onCancel: () => void
}

const PreambleModal: React.FC<PreambleModalProps> = ({
  isOpen,
  missingDocumentClass,
  missingBeginDocument,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null

  const missingItems: string[] = []
  if (missingDocumentClass) missingItems.push('\\documentclass')
  if (missingBeginDocument) missingItems.push('\\begin{document}')

  // literal snippet shown in modal — use a JS string to avoid JSX parsing issues
  const literalSnippet = `\\begin{document} ... \\end{document}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* modal */}
      <div className="relative z-10 w-11/12 max-w-lg glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-indigo-200 mb-2">
          Missing LaTeX structure
        </h2>

        <p className="text-sm text-gray-200 mb-4">
          Your document appears to be missing the following LaTeX element
          {missingItems.length > 1 ? 's' : ''}:
        </p>

        <ul className="text-sm text-gray-100 list-disc pl-5 mb-4">
          {missingItems.map((m) => (
            <li key={m} className="mb-1">
              <code className="bg-black/20 px-2 py-0.5 rounded">{m}</code>
            </li>
          ))}
        </ul>

        <p className="text-sm text-gray-300 mb-6">
          Would you like to automatically add a standard preamble and wrap your
          content in <code className="bg-black/20 px-2 py-0.5 rounded">{literalSnippet}</code> ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-transparent border border-white/10 text-gray-200 hover:bg-white/5 transition"
          >
            No, cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
          >
            Yes, add preamble
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreambleModal
