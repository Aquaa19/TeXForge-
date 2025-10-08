// =====================================================
// FILE: frontend/src/components/Spinner.tsx
// Updated: 2025-10-07 22:40 IST | New spinner overlay component
// - Fullscreen glassy spinner overlay used while generating PDF
// - Minimal, accessible, no external libs
// =====================================================

import React from 'react'

interface SpinnerProps {
  open: boolean
  label?: string
}

const Spinner: React.FC<SpinnerProps> = ({ open, label = 'Generating PDF...' }) => {
  if (!open) return null

  return (
    <div
      aria-live="polite"
      className="fixed inset-0 z-[60] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center gap-3 p-6 rounded-2xl glass border border-white/8 shadow-lg">
        <div
          role="status"
          aria-label={label}
          className="w-16 h-16 rounded-full flex items-center justify-center"
        >
          <svg className="w-12 h-12 animate-spin" viewBox="0 0 50 50" fill="none">
            <circle cx="25" cy="25" r="20" stroke="rgba(255,255,255,0.12)" strokeWidth="6"/>
            <path d="M45 25a20 20 0 00-20-20" stroke="white" strokeWidth="6" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="text-sm text-gray-200">{label}</div>
      </div>
    </div>
  )
}

export default Spinner
// =====================================================
// END OF FILE: frontend/src/components/Spinner.tsx
// =====================================================