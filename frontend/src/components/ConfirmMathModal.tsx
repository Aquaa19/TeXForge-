// =====================================================
// FILE: frontend/src/components/ConfirmMathModal.tsx
// Updated: 2025-10-07 20:55 IST | Plain modal (no framer-motion, no custom Button)
// - Replaces previous modal that imported "@/components/ui/button"
// - Default action = "display" is shown visually but selection is via buttons
// =====================================================
import React from 'react'

interface ConfirmMathModalProps {
  open: boolean
  onClose: (choice: 'display' | 'inline' | 'none') => void
}

const ConfirmMathModal: React.FC<ConfirmMathModalProps> = ({ open, onClose }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onClose('none')}
      />

      <div className="relative z-10 w-11/12 max-w-md glass p-6 rounded-xl border border-white/8">
        <h2 className="text-lg font-semibold text-indigo-200 mb-2">
          Possible math fragment detected
        </h2>

        <p className="text-sm text-gray-300 mb-4">
          Your LaTeX code looks like a math expression (for example <code className="bg-black/20 px-1 rounded">\int x^2 dx</code>).
          Would you like to wrap it automatically before compiling?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onClose('display')}
            className="w-full px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-medium"
            autoFocus
          >
            📘 Display math  —  \[ ... \] (recommended)
          </button>

          <button
            onClick={() => onClose('inline')}
            className="w-full px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white font-medium"
          >
            📗 Inline math  —  \( ... \)
          </button>

          <button
            onClick={() => onClose('none')}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-white/10 text-gray-300 hover:bg-white/5"
          >
            🚫 Keep as-is
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmMathModal
