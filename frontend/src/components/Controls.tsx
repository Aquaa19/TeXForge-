// =====================================================
// FILE: frontend/src/components/Controls.tsx
// Updated: 2025-10-07 20:55 IST | Add generating prop to disable buttons while compiling
// =====================================================
import React from 'react'

interface ControlsProps {
  onGenerate: () => void
  onClear: () => void
  onPreview: () => void
  generating?: boolean
}

const Controls: React.FC<ControlsProps> = ({
  onGenerate,
  onClear,
  onPreview,
  generating = false
}) => {
  const btnClass =
    'px-4 py-2 rounded-md transition text-white font-semibold shadow-md'

  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={onGenerate}
        className={btnClass + ' bg-indigo-500 hover:bg-indigo-600'}
        disabled={generating}
      >
        {generating ? 'Generating...' : 'Generate PDF'}
      </button>

      <button
        onClick={onPreview}
        className={btnClass + ' bg-indigo-500 hover:bg-indigo-600'}
        disabled={generating}
      >
        Preview
      </button>

      <button
        onClick={onClear}
        className={btnClass + ' bg-red-500 hover:bg-red-600'}
        disabled={generating}
      >
        Clear
      </button>
    </div>
  )
}

export default Controls
// =====================================================
// END OF FILE: frontend/src/components/Controls.tsx
// =====================================================