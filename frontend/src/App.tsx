// =====================================================
// FILE: frontend/src/App.tsx
// Updated: 2025-10-08 13:50 IST | Changed app name and description
// =====================================================

import React, { useState } from 'react'
import EditorPane from './components/EditorPane'
import Controls from './components/Controls'
import PreambleModal from './components/PreambleModal'
import PreviewModal from './components/PreviewModal'
import ConfirmMathModal from './components/ConfirmMathModal'
import Spinner from './components/Spinner'
import {
  checkLatexStructure,
  addStandardPreamble,
  looksLikeMathFragment
} from './utils/latexUtils'
import { generatePdf } from './utils/api'

const App: React.FC = () => {
  const [latex, setLatex] = useState<string>(
    '% Write your LaTeX code here...\n\\int x^2 dx'
  )

  const [showModal, setShowModal] = useState(false)
  const [missingInfo, setMissingInfo] = useState({
    missingDocClass: false,
    missingBeginDoc: false
  })

  // preview state
  const [previewOpen, setPreviewOpen] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [pdfFilename, setPdfFilename] = useState<string>('document.pdf')
  const [compileError, setCompileError] = useState<string | null>(null)
  const [compileLog, setCompileLog] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  // math-confirm modal state
  const [confirmMathOpen, setConfirmMathOpen] = useState(false)
  const [pendingLatex, setPendingLatex] = useState<string>('')

  const doGenerate = async (source: string) => {
    setGenerating(true)
    setCompileError(null)
    setCompileLog(null)
    setPdfBlob(null)

    try {
      const result = await generatePdf(source)
      if (result.success) {
        setPdfBlob(result.blob)
        setPdfFilename(result.filename || 'document.pdf')
        setPreviewOpen(true)
      } else {
        setCompileError(result.error || 'Compilation failed')
        setCompileLog(result.log || null)
        setPreviewOpen(true)
      }
    } catch (err: any) {
      setCompileError(String(err?.message || err))
      setPreviewOpen(true)
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerate = async () => {
    const { hasDocumentClass, hasBeginDocument } = checkLatexStructure(latex)

    if (!hasDocumentClass || !hasBeginDocument) {
      setMissingInfo({
        missingDocClass: !hasDocumentClass,
        missingBeginDoc: !hasBeginDocument
      })
      setShowModal(true)
      return
    }

    if (looksLikeMathFragment(latex)) {
      setPendingLatex(latex)
      setConfirmMathOpen(true)
      return
    }

    await doGenerate(latex)
  }

  const handleConfirmPreamble = () => {
    setLatex(addStandardPreamble(latex))
    setShowModal(false)
  }

  const handleCancelPreamble = () => {
    setShowModal(false)
  }

  const handlePreview = () => {
    if (pdfBlob) {
      setPreviewOpen(true)
    } else {
      handleGenerate()
    }
  }

  const handleClear = () => {
    setLatex('')
    setPdfBlob(null)
    setCompileError(null)
    setCompileLog(null)
  }

  const handleConfirmMathClose = async (choice: 'display' | 'inline' | 'none') => {
    setConfirmMathOpen(false)
    if (!pendingLatex) return

    let wrapped = pendingLatex
    if (choice === 'display') {
      wrapped = `\\[\n${pendingLatex}\n\\]`
    } else if (choice === 'inline') {
      wrapped = `\\(${pendingLatex}\\)`
    } else {
      wrapped = pendingLatex
    }

    setPendingLatex('')
    await doGenerate(wrapped)
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12">
      <div className="glass w-full max-w-6xl p-6 md:p-8 rounded-2xl shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start gap-4">
            <h1 className="text-3xl md:text-4xl font-semibold text-indigo-300">
              TeXForge🛠️
            </h1>
            <p className="text-sm text-gray-300 max-w-xs text-center lg:text-left">
              An online LaTeX editor for seamless document creation. Compile, preview, and download your PDFs instantly.
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <EditorPane value={latex} onChange={setLatex} />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-gray-400">
                Automatically adds missing LaTeX preamble when needed.
              </div>
              <div>
                <Controls
                  onGenerate={handleGenerate}
                  onClear={handleClear}
                  onPreview={handlePreview}
                  generating={generating}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PreambleModal
        isOpen={showModal}
        missingDocumentClass={missingInfo.missingDocClass}
        missingBeginDocument={missingInfo.missingBeginDoc}
        onConfirm={handleConfirmPreamble}
        onCancel={handleCancelPreamble}
      />

      <PreviewModal
        isOpen={previewOpen}
        blob={pdfBlob}
        filename={pdfFilename}
        error={compileError || undefined}
        log={compileLog || undefined}
        onClose={() => setPreviewOpen(false)}
      />

      <ConfirmMathModal open={confirmMathOpen} onClose={handleConfirmMathClose} />

      <Spinner open={generating} />
    </div>
  )
}

export default App
// =====================================================
// END OF FILE: frontend/src/App.tsx
// =====================================================