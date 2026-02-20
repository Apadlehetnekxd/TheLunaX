"use client"

import React from "react"
import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import Link from "next/link"
import MatrixRain from "./MatrixRain" // Import MatrixRain component

// Glitch Text Component
function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute inset-0 text-foreground opacity-80 animate-glitch-1"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
        aria-hidden
      >
        {text}
      </span>
      <span 
        className="absolute inset-0 text-foreground opacity-80 animate-glitch-2"
        style={{ clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)" }}
        aria-hidden
      >
        {text}
      </span>
    </div>
  )
}

// Hero Background Animation - Animated rings and glow effect
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px]">
        {/* Pulsing core glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white/5 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Rotating rings */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-white/10 rounded-full"
            style={{
              inset: `${i * 60}px`,
            }}
            animate={{
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.02, 1],
            }}
            transition={{
              rotate: {
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        ))}

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-white/5" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-white/5" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-white/5" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-white/5" />

      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          top: ["0%", "100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

// Intro Animation
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
      className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden"
      animate={{ opacity: phase >= 4 ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      style={{ pointerEvents: phase >= 4 ? "none" : "auto" }}
    >
      {/* Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />
      </div>

      {/* Glitch Bars */}
      {phase >= 1 && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[2px] bg-foreground"
              initial={{ width: 0, left: "50%" }}
              animate={{
                width: ["0%", "100%", "0%"],
                left: ["50%", "0%", "100%"],
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.05,
                ease: "easeInOut",
              }}
              style={{ top: `${30 + i * 10}%` }}
            />
          ))}
        </>
      )}

      {/* Main Text */}
      {phase >= 2 && (
        <motion.div
          className="relative"
          initial={{ scale: 0, rotateX: 90 }}
          animate={{ scale: 1, rotateX: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
        >
          <motion.h1
            className="text-7xl md:text-[12rem] font-bold tracking-tighter"
            animate={phase >= 3 ? {
              x: [0, -5, 5, -3, 3, 0],
              textShadow: [
                "0 0 0 transparent",
                "-5px 0 0 rgba(255,255,255,0.8), 5px 0 0 rgba(100,100,100,0.8)",
                "5px 0 0 rgba(255,255,255,0.8), -5px 0 0 rgba(100,100,100,0.8)",
                "0 0 0 transparent",
              ]
            } : {}}
            transition={{ duration: 0.5, repeat: phase >= 3 ? 2 : 0 }}
          >
            <span className="inline-block">LUNA</span>
            <span className="inline-block text-muted-foreground">X</span>
          </motion.h1>

          {/* Underline */}
          <motion.div
            className="absolute -bottom-4 left-0 h-1 bg-foreground"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.div>
      )}

      {/* Corner Brackets */}
      {phase >= 2 && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-16 h-16 border-l-2 border-t-2 border-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-16 h-16 border-r-2 border-b-2 border-foreground"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          />
        </>
      )}
    </motion.div>
  )
}

// Interactive Feature Card
function FeatureCard({ 
  title, 
  description, 
  index 
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
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden border border-border p-8 md:p-12 bg-card transition-all duration-500 group-hover:border-foreground">
        {/* Hover Fill Effect */}
        <motion.div
          className="absolute inset-0 bg-foreground"
          initial={{ y: "100%" }}
          animate={{ y: isHovered ? "0%" : "100%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Content */}
        <div className="relative z-10">
          <span className="font-mono text-sm text-muted-foreground group-hover:text-background transition-colors duration-300">
            0{index + 1}
          </span>
          <h3 className="text-2xl md:text-4xl font-bold mt-4 mb-4 group-hover:text-background transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground group-hover:text-background/70 transition-colors duration-300 max-w-md">
            {description}
          </p>
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-foreground group-hover:border-t-background transition-colors duration-300" />
      </div>
    </motion.div>
  )
}

// Animated Counter
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
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Magnetic Button
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
      <span className="relative z-10 flex items-center justify-center gap-3">
        {children}
      </span>
      <motion.div
        className="absolute inset-0 bg-foreground"
        initial={{ x: "-100%" }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.button>
  )
}

// Main Page
export default function LunaXPage() {
  const [showIntro, setShowIntro] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const heroOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(smoothProgress, [0, 0.15], [1, 0.8])
  const heroY = useTransform(smoothProgress, [0, 0.15], [0, -100])

  useEffect(() => {
    if (!showIntro) {
      setTimeout(() => setIsLoaded(true), 100)
    }
  }, [showIntro])

  const features = [
    {
      title: "Vulnerability Scanner",
      description: "AI-powered deep scanning for security vulnerabilities. Real-time threat detection with zero false positives.",
    },
    {
      title: "Penetration Testing",
      description: "Automated ethical hacking simulations. Test your defenses before attackers do.",
    },
    {
      title: "Code Analysis",
      description: "Static and dynamic code analysis. Find security flaws in your source before deployment.",
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
      
      <div ref={containerRef} className="relative min-h-[500vh] bg-background">

        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-foreground origin-left z-40"
          style={{ scaleX: smoothProgress }}
        />

        {/* Hero Section */}
        <motion.section
          className="fixed inset-0 flex flex-col items-center justify-center px-6 z-10"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <HeroBackground />
          {isLoaded && (
            <>
              <motion.p
                className="font-mono text-sm text-muted-foreground mb-8 tracking-widest"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ETHICAL HACKER AI
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <GlitchText
                  text="LUNA X"
                  className="text-6xl md:text-[10rem] font-bold tracking-tighter leading-none"
                />
              </motion.div>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground mt-8 max-w-md text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                The future of security testing. Powered by artificial intelligence.
              </motion.p>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link href="/ai">
                  <MagneticButton className="px-8 py-4 border border-foreground text-foreground group-hover:text-background transition-colors text-lg font-medium">
                    <span className="group-hover:text-background transition-colors duration-300">
                    Launch Beta
                    </span>
                    <svg
                      className="w-5 h-5 group-hover:text-background transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </MagneticButton>
                </Link>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <span className="text-xs font-mono text-muted-foreground tracking-widest">SCROLL</span>
                <motion.div
                  className="w-[1px] h-12 bg-gradient-to-b from-foreground to-transparent"
                  animate={{ scaleY: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </>
          )}
        </motion.section>

        {/* Spacer for scroll */}
        <div className="h-screen" />

        {/* Stats Section */}
        <section className="relative z-20 min-h-screen flex items-center bg-background/80 backdrop-blur-sm border-y border-border">
          <div className="w-full max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="text-5xl md:text-7xl font-bold mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-muted-foreground font-mono text-sm tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-20 py-24 md:py-32 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="mb-16 md:mb-24"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold">
                <GlitchText text="CAPABILITIES" />
              </h2>
            </motion.div>

            <div className="space-y-6">
              {features.map((feature, i) => (
                <FeatureCard key={i} {...feature} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-20 min-h-screen flex items-center justify-center bg-background border-t border-border">
          <div className="text-center px-6">
            <motion.h2
              className="text-4xl md:text-7xl font-bold mb-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to<br />
              <span className="text-muted-foreground">secure</span> your future?
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/early-access">
                <MagneticButton className="px-12 py-5 bg-foreground text-background text-lg font-medium">
                  <span>Get Early Access</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </MagneticButton>
              </Link>
            </motion.div>

            <motion.p
              className="mt-8 text-sm text-muted-foreground font-mono"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              No credit card required. Start free.
            </motion.p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-20 border-t border-border py-12 bg-background">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-bold text-2xl tracking-tighter">
              LUNA<span className="text-muted-foreground">X</span>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              2026 Luna X. All systems protected.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
