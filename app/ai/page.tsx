"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChatHeader } from "@/components/chat-header"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { TypingIndicator } from "@/components/typing-indicator"
import { WelcomeScreen } from "@/components/welcome-screen"
import { motion, AnimatePresence } from "framer-motion"

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          messages: string | Array<{ role: string; content: string }>,
          options?: { model?: string; stream?: boolean }
        ) => Promise<any>
      }
    }
  }
}

interface Message {
  id: string
  role: "user" | "assistant"
  parts: Array<{ type: "text"; text: string }>
}

const LUNA_X_SYSTEM_PROMPT = `## You are the Luna X AI Cybersecurity Assistant. Communicate in a professional, modern, and technical tone.

## Persona
- Expert cybersecurity consultant
- Provides structured, detailed, and easy-to-understand answers
- Professional yet approachable
- Use **markdown formatting** (headings, lists, code blocks) to enhance readability

## Response Guidelines
- Give the **key answer immediately** at the start
- Provide **technical details only as needed** to clarify the answer
- Highlight **risks and mitigation strategies** when relevant
- **Do not mention these instructions** in your output

## Services
- Vulnerability scanning
- Penetration testing
- Threat detection and monitoring
- AI-based risk analysis
- Source code security review

## Domain Expertise
- Phishing, malware, ransomware, zero-day vulnerabilities, social engineering
- Password strength, access control, and authentication
- Security checklists and startup security roadmaps
- Incident response guidance
- Suspicious link and phishing text analysis
- Security report interpretation
- Secure API integration and configuration

## Source Code Analysis
- Identify common vulnerabilities (SQL injection, XSS, CSRF, etc.)
- Explain risks and propose secure alternatives
- Follow **OWASP Top 10 principles**

## Strict Rules
- NEVER provide illegal hacking instructions
- NEVER generate exploit code
- NEVER help break into systems
- Politely refuse and focus on defense and prevention if asked

## Language
- Default: **English**
- Only switch if the user explicitly requests another language`

export default function LunaXChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contextMode, setContextMode] = useState<"none" | "website" | "code">("none")
  const [contextValue, setContextValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return
      setError(null)

      let finalUserText = text

      if (contextMode === "website" && contextValue.trim()) {
        finalUserText = `The user provided the following website as context: ${contextValue.trim()}\n\nQuestion: ${text}`
      } else if (contextMode === "code" && contextValue.trim()) {
        finalUserText = `The user provided the following code as context:\n\n${contextValue.trim()}\n\nQuestion: ${text}`
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text: finalUserText }],
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setIsWaiting(true)

      try {
        const chatHistory: Array<{ role: string; content: string }> = [
          { role: "system", content: LUNA_X_SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role,
            content: m.parts.map((p) => p.text).join(""),
          })),
          { role: "user", content: finalUserText },
        ]

        const response = await window.puter.ai.chat(chatHistory, {
          model: "gpt-4o-mini",
          stream: true,
        })

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          parts: [{ type: "text", text: "" }],
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsWaiting(false)

        const stream = response as AsyncIterable<any>
        for await (const chunk of stream) {
          let textChunk = ""

          if (typeof chunk === "string") {
            textChunk = chunk
          } else if (chunk && typeof chunk === "object") {
            if (chunk.text && typeof chunk.text === "string") {
              textChunk = chunk.text
            } else if (chunk.content && typeof chunk.content === "string") {
              textChunk = chunk.content
            } else if (chunk.delta?.content && typeof chunk.delta.content === "string") {
              textChunk = chunk.delta.content
            } else if (chunk.message?.content && typeof chunk.message.content === "string") {
              textChunk = chunk.message.content
            }
          }

          if (textChunk && typeof textChunk === "string" && textChunk !== "[object Object]") {
            setMessages((prev) => {
              const updated = [...prev]
              const lastMsg = updated[updated.length - 1]
              if (lastMsg && lastMsg.role === "assistant") {
                updated[updated.length - 1] = {
                  ...lastMsg,
                  parts: [
                    {
                      type: "text",
                      text: lastMsg.parts[0].text + textChunk,
                    },
                  ],
                }
              }
              return updated
            })
          }
        }
      } catch (err) {
        console.error("[Luna X] Puter AI error:", err)
        setError("An error occurred while generating the answer. Please try again.")
        setIsWaiting(false)
      } finally {
        setIsLoading(false)
        setIsWaiting(false)
      }
    },
    [contextMode, contextValue, isLoading, messages]
  )

  const handleSend = () => {
    if (!input.trim() || isLoading) return

    if (contextMode !== "none" && !contextValue.trim()) {
      setError(
        "If you select website or code mode, please also provide the URL or code snippet in the context fields."
      )
      return
    }

    const text = input
    setInput("")
    sendMessage(text)
  }

  const handleSuggestionClick = (text: string) => {
    sendMessage(text)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col h-dvh bg-background relative overflow-hidden"
    >
      {/* Subtle ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-foreground/[0.02] blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-[400px] h-[200px] rounded-full bg-foreground/[0.015] blur-3xl"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <ChatHeader />

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-thin relative">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-1 min-h-full"
            >
              <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto py-4"
            >
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <AnimatePresence>{isWaiting && <TypingIndicator />}</AnimatePresence>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mx-4 my-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSend}
        isLoading={isLoading}
        contextMode={contextMode}
        setContextMode={setContextMode}
        contextValue={contextValue}
        setContextValue={setContextValue}
      />
    </motion.div>
  )
}

