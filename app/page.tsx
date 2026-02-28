"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import Link from "next/link"

function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute inset-0 opacity-80 animate-glitch-1"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
        aria-hidden
      >
        {text}
      </span>
      <span
        className="absolute inset-0 opacity-80 animate-glitch-2"
        style={{ clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)" }}
        aria-hidden
      >
        {text}
      </span>
    </div>
  )
}

function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 2000),
      setTimeout(() => onComplete(), 2800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
      animate={{ opacity: phase >= 4 ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      style={{ pointerEvents: phase >= 4 ? "none" : "auto" }}
    >
      {phase >= 2 && (
        <motion.h1
          className="text-7xl md:text-[12rem] font-bold tracking-tighter text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
        >
          LUNA<span className="text-gray-500">X</span>
        </motion.h1>
      )}
    </motion.div>
  )
}

function FeatureCard({
  title,
  description,
  index,
}: {
  title: string
  description: string
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden border border-gray-800 p-8 md:p-12 bg-black transition-all duration-500">
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ y: "100%" }}
          animate={{ y: isHovered ? "0%" : "100%" }}
          transition={{ duration: 0.4 }}
        />
        <div className="relative z-10">
          <span className="font-mono text-sm text-gray-400">0{index + 1}</span>
          <h3 className="text-2xl md:text-4xl font-bold mt-4 mb-4 group-hover:text-black transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-400 group-hover:text-black/70 transition-colors duration-300 max-w-md">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    const x = (clientX - left - width / 2) * 0.3
    const y = (clientY - top - height / 2) * 0.3
    setPosition({ x, y })
  }

  const reset = () => setPosition({ x: 0, y: 0 })

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden group ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      <span className="relative z-20 flex items-center justify-center gap-3">
        {children}
      </span>
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ x: "-100%" }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  )
}

export default function LunaXPage() {
  const [showIntro, setShowIntro] = useState(true)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(smoothProgress, [0, 0.15], [1, 0.8])
  const heroY = useTransform(smoothProgress, [0, 0.15], [0, -100])

  const features = [
    {
      title: "Vulnerability Scanner",
      description: "AI-powered deep scanning for security vulnerabilities.",
    },
    {
      title: "Penetration Testing",
      description: "Automated ethical hacking simulations.",
    },
    {
      title: "Code Analysis",
      description: "Static and dynamic code analysis.",
    },
  ]

  const stats = [
    { value: 99, suffix: "%", label: "Accuracy Rate" },
    { value: 500, suffix: "K+", label: "Scans Completed" },
    { value: 24, suffix: "/7", label: "Monitoring" },
  ]

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      <div ref={containerRef} className="relative min-h-[500vh] bg-black text-white">
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-white origin-left z-40"
          style={{ scaleX: smoothProgress }}
        />

        <motion.section
          className="fixed inset-0 flex flex-col items-center justify-center px-6 z-10 overflow-hidden"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="/aa.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="absolute inset-0 bg-black/60 z-10" />

          <div className="relative z-20 flex flex-col items-center text-center">
            <motion.p
              className="font-mono text-sm mb-8 tracking-widest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ETHICAL HACKER AI
            </motion.p>

            <GlitchText
              text="LUNA X"
              className="text-6xl md:text-[10rem] font-bold tracking-tighter"
            />

            <motion.p
              className="text-lg md:text-xl mt-8 max-w-md text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              The future of security testing. Powered by artificial intelligence.
            </motion.p>

            <motion.div className="mt-14">
              <Link href="/ai">
                <MagneticButton className="px-8 py-4 border border-white text-white text-lg font-medium">
                  <span>Launch Beta</span>
                </MagneticButton>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <div className="h-screen" />

        <section className="relative z-20 min-h-screen flex items-center bg-black border-y border-gray-800">
          <div className="w-full max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl md:text-7xl font-bold mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 font-mono text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative z-20 py-24 bg-black">
          <div className="max-w-6xl mx-auto px-6 space-y-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} index={i} />
            ))}
          </div>
        </section>

        <section className="relative z-20 min-h-screen flex items-center justify-center bg-black border-t border-gray-800">
          <div className="text-center px-6">
            <h2 className="text-4xl md:text-7xl font-bold mb-8">
              Ready to <span className="text-gray-500">secure</span> your future?
            </h2>
            <Link href="/early-access">
              <MagneticButton className="px-12 py-5 bg-white text-black text-lg font-medium">
                <span>Get Early Access</span>
              </MagneticButton>
            </Link>
          </div>
        </section>

        <footer className="relative z-20 border-t border-gray-800 py-12 bg-black">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-bold text-2xl tracking-tighter">
              LUNA<span className="text-gray-500">X</span>
            </div>
            <p className="text-sm text-gray-400 font-mono">
              2026 Luna X. All systems protected.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
