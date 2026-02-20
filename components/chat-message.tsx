'use client'

import { Shield, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

type ChatPart = { type: 'text'; text: string }

type ChatMessageType = {
  role: 'user' | 'assistant'
  parts?: ChatPart[]
}

function getMessageText(message: ChatMessageType): string {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p): p is ChatPart => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant'
  const text = getMessageText(message)

  if (!text) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex gap-3 px-4 py-3', isAssistant ? 'items-start' : 'items-start flex-row-reverse')}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, type: 'spring', stiffness: 300 }}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full shrink-0 border',
          isAssistant
            ? 'bg-foreground text-background border-foreground/20'
            : 'bg-secondary text-muted-foreground border-border'
        )}
      >
        {isAssistant ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: isAssistant ? -12 : 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={cn('flex flex-col max-w-[85%] sm:max-w-[75%]', !isAssistant && 'items-end')}
      >
        {isAssistant && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="text-[11px] text-muted-foreground mb-1.5 px-1 uppercase tracking-wider font-medium"
          >
            Luna X
          </motion.span>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed',
            isAssistant
              ? 'bg-card border border-border rounded-tl-sm chat-markdown text-foreground'
              : 'bg-foreground text-background rounded-tr-sm font-medium'
          )}
        >
          {isAssistant ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap">{text}</p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

