// =====================================================
// FILE: frontend/src/components/PreviewModal.tsx
// Updated: 2025-10-07 22:40 IST | Dark themed viewer + object/iframe rendering unchanged
// - Dark frame/background around the PDF viewer to match app's UI
// - Minor padding + inset shadow for glass effect
// - Download button reused as before
// =====================================================

import React, { useEffect, useState } from 'react'

interface PreviewModalProps {
  isOpen: boolean
  blob: Blob | null
  filename?: string
  error?: string
  log?: string
  onClose: () => void
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  blob,
  filename = 'document.pdf',
  error,
  log,
  onClose
}) => {
  const [objUrl, setObjUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setObjUrl(null)
      return
    }
    const url = URL.createObjectURL(blob)
    setObjUrl(url)
    return () => {
      try {
        URL.revokeObjectURL(url)
      } catch {}
    }
  }, [blob])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-11/12 max-w-4xl glass p-4 rounded-2xl border border-white/8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg text-indigo-100 font-semibold">Preview</h3>
          <div className="flex gap-3">
            {objUrl && (
              <a
                href={objUrl}
                download={filename}
                className="px-3 py-1 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm"
              >
                Download
              </a>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1 rounded-md bg-transparent border border-white/10 text-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        {/* Dark themed viewer frame */}
        <div className="h-[70vh] rounded-md overflow-hidden border border-white/6">
          <div className="w-full h-full bg-[#0f1116] p-3">
            {error ? (
              <div className="p-4 text-sm text-yellow-200">
                <div className="font-semibold text-yellow-300 mb-2">Compilation error</div>
                <div className="bg-black/20 p-3 rounded text-xs text-gray-100 max-h-[60vh] overflow-auto">
                  {error}
                  {log ? (
                    <>
                      <div className="mt-3 font-semibold text-gray-200">Log</div>
                      <pre className="whitespace-pre-wrap text-xs text-gray-200 mt-1">
                        {log}
                      </pre>
                    </>
                  ) : null}
                </div>
              </div>
            ) : objUrl ? (
              <div className="w-full h-full rounded-md overflow-hidden border border-white/12 bg-[#0b0c0f]">
                <object
                  data={objUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  aria-label="PDF preview"
                >
                  <iframe
                    src={objUrl}
                    title="PDF preview"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', backgroundColor: '#0b0c0f' }}
                  />
                </object>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <div className="text-center">
                  <div className="mb-2">No PDF available</div>
                  <div className="text-xs text-gray-500">Generate a PDF to preview it here.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewModal
// =====================================================
// END OF FILE: frontend/src/components/PreviewModal.tsx
// =====================================================