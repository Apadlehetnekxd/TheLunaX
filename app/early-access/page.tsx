"use client"

import React from "react"
import MatrixRain from "@/components/MatrixRain" // Import MatrixRain component

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import LanguageSelector from "@/components/LanguageSelector"
import { useLanguage } from "@/lib/language-context"



export default function EarlyAccessPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [useCase, setUseCase] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [queuePosition, setQueuePosition] = useState(0)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setQueuePosition(Math.floor(Math.random() * 500) + 100)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="relative z-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-2xl tracking-tighter hover:opacity-70 transition-opacity">
            LUNA<span className="text-muted-foreground">X</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/scan" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("ea.navTryScanner")}
            </Link>
            <LanguageSelector />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-16 h-16 mx-auto mb-6 border border-foreground flex items-center justify-center"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {t("ea.title")} <span className="text-muted-foreground">{t("ea.titleAccent")}</span> {t("ea.titleEnd")}
                  </h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {t("ea.description")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-mono text-muted-foreground mb-2">
                      {t("ea.fullName")}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("ea.namePlaceholder")}
                      required
                      className="w-full px-4 py-3 bg-card border border-border font-mono focus:outline-none focus:border-foreground transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-mono text-muted-foreground mb-2">
                      {t("ea.email")}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("ea.emailPlaceholder")}
                      required
                      className="w-full px-4 py-3 bg-card border border-border font-mono focus:outline-none focus:border-foreground transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-mono text-muted-foreground mb-2">
                      {t("ea.company")}
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={t("ea.companyPlaceholder")}
                      className="w-full px-4 py-3 bg-card border border-border font-mono focus:outline-none focus:border-foreground transition-colors"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-mono text-muted-foreground mb-2">
                      {t("ea.useCase")}
                    </label>
                    <select
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border font-mono focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">{t("ea.useCaseSelect")}</option>
                      <option value="vulnerability">{t("ea.useCaseVulnerability")}</option>
                      <option value="pentest">{t("ea.useCasePentest")}</option>
                      <option value="code">{t("ea.useCaseCode")}</option>
                      <option value="monitoring">{t("ea.useCaseMonitoring")}</option>
                      <option value="compliance">{t("ea.useCaseCompliance")}</option>
                      <option value="other">{t("ea.useCaseOther")}</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4"
                  >
                    <button
                      type="submit"
                      disabled={isSubmitting || !email || !name}
                      className="w-full py-4 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {t("ea.joining")}
                        </>
                      ) : (
                        <>
                          {t("ea.joinWaitlist")}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-xs text-muted-foreground mt-4"
                  >
                    {t("ea.consent")}
                    <br />{t("ea.noSpam")}
                  </motion.p>
                </form>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-12 pt-8 border-t border-border"
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold font-mono">2,847</div>
                      <div className="text-xs text-muted-foreground">{t("ea.onWaitlist")}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono">Q2 2026</div>
                      <div className="text-xs text-muted-foreground">{t("ea.betaLaunch")}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono">100</div>
                      <div className="text-xs text-muted-foreground">{t("ea.betaSpots")}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-8 border-2 border-green-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("ea.successTitle")}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {t("ea.successDesc1")} {name}{t("ea.successDesc2")} <span className="text-foreground">{email}</span> {t("ea.successDesc3")}
                </p>

                <div className="inline-block border border-border p-6 mb-8">
                  <div className="text-sm text-muted-foreground mb-2 font-mono">{t("ea.yourPosition")}</div>
                  <div className="text-5xl font-bold font-mono">#{queuePosition}</div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t("ea.shareText")}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button className="p-3 border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </button>
                    <button className="p-3 border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                    <button className="p-3 border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                  <Link
                    href="/scan"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t("ea.tryScanner")}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
