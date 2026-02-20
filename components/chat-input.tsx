'use client'

import { ArrowUp } from 'lucide-react'
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  contextMode: 'none' | 'website' | 'code'
  setContextMode: (mode: 'none' | 'website' | 'code') => void
  contextValue: string
  setContextValue: (value: string) => void
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  contextMode,
  setContextMode,
  contextValue,
  setContextValue,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        onSubmit()
      }
    }
  }

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-border bg-card/60 backdrop-blur-xl p-3 sm:p-4"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim() && !isLoading) {
            onSubmit()
          }
        }}
        className="max-w-3xl mx-auto flex flex-col gap-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-muted-foreground">
          <p className="leading-tight">
            If you have a <span className="font-medium text-foreground">website</span> or{' '}
            <span className="font-medium text-foreground">code snippet</span> question, add the context here first.
          </p>
          <div className="inline-flex items-center rounded-full bg-input/60 border border-border/60 p-0.5">
            <button
              type="button"
              onClick={() => setContextMode('none')}
              className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                contextMode === 'none'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setContextMode('website')}
              className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                contextMode === 'website'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Website
            </button>
            <button
              type="button"
              onClick={() => setContextMode('code')}
              className={`px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                contextMode === 'code'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Code
            </button>
          </div>
        </div>

        {contextMode === 'website' && (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-muted-foreground">Website URL</label>
            <input
              type="url"
              value={contextValue}
              onChange={(e) => setContextValue(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-xl bg-input border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/20 transition-all"
            />
          </div>
        )}

        {contextMode === 'code' && (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-muted-foreground">Code context</label>
            <textarea
              value={contextValue}
              onChange={(e) => setContextValue(e.target.value)}
              placeholder="Paste the relevant code snippet here..."
              rows={3}
              className="w-full resize-y rounded-xl bg-input border border-border px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/20 transition-all scrollbar-thin"
            />
          </div>
        )}

        <div className="flex items-end gap-2">
          <motion.div
            className="relative flex-1"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about cybersecurity..."
              disabled={isLoading}
              rows={1}
              className="w-full resize-none rounded-xl bg-input border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/20 transition-all disabled:opacity-50 scrollbar-thin"
            />
          </motion.div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-20 disabled:cursor-not-allowed transition-all shrink-0"
            aria-label="Send message"
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </div>
      </form>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-[11px] text-muted-foreground mt-2.5 max-w-3xl mx-auto tracking-wide"
      >
        Luna X AI
      </motion.p>
    </motion.div>
  )
}

