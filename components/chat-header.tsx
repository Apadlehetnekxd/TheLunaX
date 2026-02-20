'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function ChatHeader() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card/60 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center"
        >
          <Link href="/" className="inline-block">
            <h1 className="text-[13px] font-semibold tracking-[0.35em] uppercase leading-none select-none">
              <span className="lunax-luna">LUNA</span>
              <span className="lunax-x">X</span>
            </h1>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  )
}

