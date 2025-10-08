// =====================================================
// FILE: frontend/src/components/EditorPane.tsx
// Updated: 2025-10-07 18:55 IST | Robust Monaco loader + fallback
// - Dynamically imports monaco to avoid HMR/runtime issues
// - Try/catch with console.error for debugging
// - Fallback textarea if Monaco fails to initialize
// =====================================================

import React, { useRef, useEffect, useState } from 'react'

interface EditorPaneProps {
  value: string
  onChange: (val: string) => void
}

const EditorPane: React.FC<EditorPaneProps> = ({ value, onChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const monacoEditorRef = useRef<any>(null)
  const modelRef = useRef<any>(null)
  const [monacoLoaded, setMonacoLoaded] = useState<boolean | null>(null)

  // Initialize Monaco dynamically
  useEffect(() => {
    let mounted = true

    async function initMonaco() {
      try {
        const monaco = await import('monaco-editor')

        if (!mounted) return

        modelRef.current = monaco.editor.createModel(value ?? '', 'plaintext')
        monacoEditorRef.current = monaco.editor.create(containerRef.current!, {
          model: modelRef.current,
          language: 'plaintext',
          theme: 'vs-dark',
          automaticLayout: true,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on'
        })

        try {
          monaco.editor.setModelLanguage(modelRef.current, 'latex')
        } catch {
          // ignore if latex language not present
        }

        monacoEditorRef.current.onDidChangeModelContent(() => {
          try {
            const val = monacoEditorRef.current.getValue()
            onChange(val)
          } catch (err) {
            console.error('Monaco getValue error', err)
          }
        })

        setMonacoLoaded(true)
      } catch (err) {
        console.error('Failed to load monaco-editor:', err)
        setMonacoLoaded(false)
      }
    }

    initMonaco()

    return () => {
      mounted = false
      try {
        if (monacoEditorRef.current) {
          monacoEditorRef.current.dispose()
          monacoEditorRef.current = null
        }
        if (modelRef.current) {
          try {
            modelRef.current.dispose()
          } catch {}
          modelRef.current = null
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep editor in sync with external value updates (e.g., preamble insertion)
  useEffect(() => {
    try {
      if (modelRef.current && modelRef.current.getValue() !== value) {
        modelRef.current.setValue(value)
      }
    } catch (err) {
      // if Monaco not loaded yet, ignore
    }
  }, [value])

  // If Monaco failed to load, show a fallback textarea
  if (monacoLoaded === false) {
    return (
      <div className="w-full">
        <div className="rounded-lg overflow-hidden border border-white/8 p-2 bg-black/10">
          <textarea
            aria-label="LaTeX source editor"
            placeholder="Write your LaTeX code here..."
            title="LaTeX editor area"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[60vh] min-h-[300px] bg-transparent resize-none outline-none text-white p-3"
          />
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Monaco failed to load — using a fallback editor. Check console for errors.
        </div>
      </div>
    )
  }

  // While Monaco is loading, show an empty container (keeps layout stable)
  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden border border-white/8">
        <div
          ref={containerRef}
          style={{ width: '100%', height: '60vh', minHeight: 300 }}
        />
      </div>
      {monacoLoaded === null && (
        <div className="text-xs text-gray-400 mt-2">Loading editor...</div>
      )}
    </div>
  )
}

export default EditorPane
