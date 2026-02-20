'use client'

import { Shield, ScanSearch, Bug, Brain, Code2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void
}

const suggestions = [
  {
    icon: ScanSearch,
    title: '01 · Vulnerability Scanner',
    prompt:
      'Explain how a vulnerability scanner works and what types of issues it can find on a modern web application.',
  },
  {
    icon: Bug,
    title: '02 · Penetration Testing',
    prompt:
      'Walk me through a typical penetration testing workflow and where Luna X can help automate the process.',
  },
  {
    icon: Code2,
    title: '03 · Code Security',
    prompt:
      'What are the most common vulnerabilities in web application code and how can I avoid them?',
  },
  {
    icon: Brain,
    title: 'Security roadmap',
    prompt:
      'Help me design a short security roadmap for a new startup (infrastructure, application, human factors).',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-16 sm:py-20">
      {/* Logo with subtle breathing animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 12 }}
        className="relative mb-4"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-2xl bg-foreground/6 blur-xl"
        />
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-foreground text-background">
          <Shield className="w-7 h-7" />
        </div>
      </motion.div>

      {/* Spacer under logo */}
      <div className="mb-4" />

      {/* Title with stagger */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2 text-center"
      >
        The Luna X
      </motion.h2>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="text-2xl sm:text-3xl font-semibold text-foreground mb-3 text-center text-balance tracking-tight"
      >
        AI Cybersecurity Co‑Pilot
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-sm text-muted-foreground text-center max-w-sm mb-8 leading-relaxed text-pretty"
      >
        Minimal, focused AI assistant to help you reason about security architecture, threats and mitigation.
      </motion.p>

      {/* Animated line separator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-12 h-px bg-foreground/20 mb-10 origin-center"
      />

      {/* Suggestion cards with stagger */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg"
      >
        {suggestions.map((suggestion) => (
          <motion.button
            key={suggestion.title}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-foreground/20 hover:bg-secondary transition-colors text-left group"
          >
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary shrink-0 group-hover:bg-foreground/10 transition-colors"
            >
              <suggestion.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
              {suggestion.title}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Bottom scanning line animation */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-px"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="h-full bg-foreground/10"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ width: '30%' }}
        />
      </motion.div>
    </div>
  )
}

