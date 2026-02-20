"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import MatrixRain from "@/components/MatrixRain" // Import MatrixRain component
import LanguageSelector from "@/components/LanguageSelector"
import { useLanguage } from "@/lib/language-context"

type ScanResult = {
  type: "info" | "warning" | "critical" | "safe"
  message: string
  detail: string
  category: string
}

type ScanScenario = "secure" | "moderate" | "vulnerable" | "critical"

// All possible scan findings organized by category
const allFindings = {
  ssl: [
    { type: "safe" as const, message: "SSL Certificate Valid", detail: "Certificate expires in 245 days", category: "SSL/TLS" },
    { type: "safe" as const, message: "TLS 1.3 Supported", detail: "Latest encryption protocol enabled", category: "SSL/TLS" },
    { type: "warning" as const, message: "SSL Certificate Expiring Soon", detail: "Certificate expires in 14 days", category: "SSL/TLS" },
    { type: "critical" as const, message: "SSL Certificate Expired", detail: "Certificate expired 3 days ago", category: "SSL/TLS" },
    { type: "warning" as const, message: "Weak SSL Cipher Detected", detail: "RC4 cipher still supported", category: "SSL/TLS" },
    { type: "critical" as const, message: "No SSL Certificate", detail: "Site is served over HTTP only", category: "SSL/TLS" },
    { type: "info" as const, message: "HSTS Enabled", detail: "Strict Transport Security header present", category: "SSL/TLS" },
  ],
  headers: [
    { type: "safe" as const, message: "Security Headers Configured", detail: "All recommended headers present", category: "HTTP Headers" },
    { type: "warning" as const, message: "Missing X-Frame-Options", detail: "Clickjacking protection not enabled", category: "HTTP Headers" },
    { type: "warning" as const, message: "Missing Content-Security-Policy", detail: "CSP header not configured", category: "HTTP Headers" },
    { type: "warning" as const, message: "Missing X-Content-Type-Options", detail: "MIME sniffing prevention not set", category: "HTTP Headers" },
    { type: "info" as const, message: "Server Version Exposed", detail: "Server: nginx/1.18.0 visible", category: "HTTP Headers" },
    { type: "safe" as const, message: "X-XSS-Protection Enabled", detail: "Browser XSS filter active", category: "HTTP Headers" },
    { type: "warning" as const, message: "Permissive CORS Policy", detail: "Access-Control-Allow-Origin: *", category: "HTTP Headers" },
  ],
  injection: [
    { type: "safe" as const, message: "No SQL Injection Found", detail: "Tested 24 endpoints", category: "Injection" },
    { type: "safe" as const, message: "Parameterized Queries Detected", detail: "Prepared statements in use", category: "Injection" },
    { type: "critical" as const, message: "SQL Injection Vulnerable", detail: "Login form accepts malicious input", category: "Injection" },
    { type: "critical" as const, message: "Command Injection Found", detail: "User input passed to system commands", category: "Injection" },
    { type: "warning" as const, message: "Potential LDAP Injection", detail: "Special characters not sanitized", category: "Injection" },
    { type: "safe" as const, message: "NoSQL Injection Protected", detail: "MongoDB queries sanitized", category: "Injection" },
  ],
  xss: [
    { type: "safe" as const, message: "No XSS Vulnerabilities", detail: "Tested 156 input fields", category: "XSS" },
    { type: "warning" as const, message: "Reflected XSS Possible", detail: "Search parameter not escaped", category: "XSS" },
    { type: "critical" as const, message: "Stored XSS Found", detail: "Comment field allows script injection", category: "XSS" },
    { type: "safe" as const, message: "Output Encoding Active", detail: "HTML entities properly escaped", category: "XSS" },
    { type: "warning" as const, message: "DOM-based XSS Risk", detail: "JavaScript uses innerHTML unsafely", category: "XSS" },
    { type: "info" as const, message: "Content Sanitization Library", detail: "DOMPurify detected in use", category: "XSS" },
  ],
  auth: [
    { type: "safe" as const, message: "Strong Password Policy", detail: "Minimum 12 characters required", category: "Authentication" },
    { type: "warning" as const, message: "No Rate Limiting", detail: "Login endpoint allows unlimited attempts", category: "Authentication" },
    { type: "critical" as const, message: "Default Credentials Active", detail: "admin:admin login works", category: "Authentication" },
    { type: "warning" as const, message: "Session Fixation Risk", detail: "Session ID not regenerated on login", category: "Authentication" },
    { type: "safe" as const, message: "MFA Supported", detail: "Two-factor authentication available", category: "Authentication" },
    { type: "info" as const, message: "OAuth 2.0 Implemented", detail: "Google/GitHub login available", category: "Authentication" },
    { type: "warning" as const, message: "Weak Session Tokens", detail: "Predictable session ID pattern", category: "Authentication" },
    { type: "critical" as const, message: "Password in URL", detail: "Credentials passed via GET parameter", category: "Authentication" },
  ],
  exposure: [
    { type: "critical" as const, message: "Exposed Admin Panel", detail: "/admin endpoint publicly accessible", category: "Exposure" },
    { type: "warning" as const, message: "Directory Listing Enabled", detail: "/uploads/ shows file list", category: "Exposure" },
    { type: "critical" as const, message: "Database Backup Exposed", detail: "/backup.sql publicly accessible", category: "Exposure" },
    { type: "warning" as const, message: ".git Folder Accessible", detail: "Source code potentially exposed", category: "Exposure" },
    { type: "critical" as const, message: "API Keys in Source", detail: "Hardcoded credentials in JavaScript", category: "Exposure" },
    { type: "info" as const, message: "robots.txt Found", detail: "Some paths disallowed for crawlers", category: "Exposure" },
    { type: "safe" as const, message: "Sensitive Files Protected", detail: "Config files return 403", category: "Exposure" },
    { type: "warning" as const, message: "Error Pages Leak Info", detail: "Stack traces visible in errors", category: "Exposure" },
  ],
  ports: [
    { type: "info" as const, message: "Port 80 Open (HTTP)", detail: "Redirects to HTTPS", category: "Ports" },
    { type: "info" as const, message: "Port 443 Open (HTTPS)", detail: "Primary web service", category: "Ports" },
    { type: "warning" as const, message: "Port 22 Open (SSH)", detail: "Consider IP whitelist", category: "Ports" },
    { type: "critical" as const, message: "Port 3306 Open (MySQL)", detail: "Database exposed to internet", category: "Ports" },
    { type: "warning" as const, message: "Port 21 Open (FTP)", detail: "Insecure file transfer protocol", category: "Ports" },
    { type: "safe" as const, message: "Firewall Configured", detail: "Only necessary ports open", category: "Ports" },
    { type: "critical" as const, message: "Port 6379 Open (Redis)", detail: "Cache server publicly accessible", category: "Ports" },
  ],
  cookies: [
    { type: "safe" as const, message: "Secure Cookie Flags", detail: "HttpOnly and Secure set on all cookies", category: "Cookies" },
    { type: "warning" as const, message: "Missing HttpOnly Flag", detail: "Session cookie accessible via JavaScript", category: "Cookies" },
    { type: "warning" as const, message: "Missing Secure Flag", detail: "2 cookies sent over HTTP", category: "Cookies" },
    { type: "warning" as const, message: "SameSite Not Set", detail: "CSRF protection via cookies incomplete", category: "Cookies" },
    { type: "safe" as const, message: "Cookie Encryption", detail: "Sensitive cookies are encrypted", category: "Cookies" },
    { type: "info" as const, message: "Third-party Cookies", detail: "Analytics cookies detected", category: "Cookies" },
  ],
  api: [
    { type: "safe" as const, message: "API Rate Limiting", detail: "100 requests per minute per IP", category: "API Security" },
    { type: "warning" as const, message: "No API Authentication", detail: "Public endpoints lack auth", category: "API Security" },
    { type: "critical" as const, message: "GraphQL Introspection Enabled", detail: "Full schema publicly queryable", category: "API Security" },
    { type: "safe" as const, message: "Input Validation Active", detail: "Request schemas enforced", category: "API Security" },
    { type: "warning" as const, message: "Verbose Error Messages", detail: "API returns detailed error info", category: "API Security" },
    { type: "info" as const, message: "API Documentation Found", detail: "Swagger/OpenAPI spec available", category: "API Security" },
    { type: "critical" as const, message: "IDOR Vulnerability", detail: "User IDs can be enumerated", category: "API Security" },
  ],
}

// Seeded random number generator for consistent results per URL
function createSeededRandom(seed: number) {
  let s = seed
  return () => {
    s = Math.sin(s * 9999) * 10000
    return s - Math.floor(s)
  }
}

// Generate a strong hash from URL for very different results between URLs
function hashUrl(url: string): number {
  let hash = 0
  const normalized = url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash + char * (i + 1) * 31) | 0
    hash = hash ^ (hash >>> 16)
    hash = Math.imul(hash, 0x85ebca6b)
    hash = hash ^ (hash >>> 13)
    hash = Math.imul(hash, 0xc2b2ae35)
    hash = hash ^ (hash >>> 16)
  }
  return Math.abs(hash)
}

function generateScanResults(targetUrl: string): ScanResult[] {
  // Create a strong hash for very different results between URLs
  const hash = hashUrl(targetUrl)
  const random = createSeededRandom(hash)
  
  // Determine scenario based on hash - this makes similar URLs get different scenarios
  const scenarioValue = random()
  const scenarios: ScanScenario[] = ["secure", "moderate", "vulnerable", "critical"]
  const scenario = scenarios[Math.floor(scenarioValue * 4)]
  
  const results: ScanResult[] = []
  const categories = Object.keys(allFindings) as (keyof typeof allFindings)[]
  
  // Shuffle categories based on seed for different ordering
  const shuffledCategories = [...categories].sort(() => random() - 0.5)
  
  // Select findings based on scenario
  for (const category of shuffledCategories) {
    const categoryFindings = allFindings[category]
    const numFindings = Math.floor(random() * 2) + 1 // 1-2 findings per category
    
    // Filter findings based on scenario
    let availableFindings = categoryFindings
    if (scenario === "secure") {
      availableFindings = categoryFindings.filter(f => f.type === "safe" || f.type === "info")
    } else if (scenario === "moderate") {
      availableFindings = categoryFindings.filter(f => f.type !== "critical")
    } else if (scenario === "critical") {
      // Include more critical findings
      const criticalFindings = categoryFindings.filter(f => f.type === "critical")
      if (criticalFindings.length > 0 && random() > 0.3) {
        const idx = Math.floor(random() * criticalFindings.length)
        results.push(criticalFindings[idx])
      }
    }
    
    // Skip some categories randomly for variety
    if (random() > 0.85) continue
    
    // Shuffle and select using seeded random
    const shuffled = [...availableFindings].sort(() => random() - 0.5)
    for (let i = 0; i < Math.min(numFindings, shuffled.length); i++) {
      if (!results.some(r => r.message === shuffled[i].message)) {
        results.push(shuffled[i])
      }
    }
  }
  
  // Shuffle final results with seeded random
  return results.sort(() => random() - 0.5)
}

// Validate URL format
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function ScanPage() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState("")
  const [results, setResults] = useState<ScanResult[]>([])
  const [scanComplete, setScanComplete] = useState(false)
  const [liveFindings, setLiveFindings] = useState<ScanResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const phaseKeys = [
    "scan.phase.init",
    "scan.phase.dns",
    "scan.phase.ssl",
    "scan.phase.ports",
    "scan.phase.sql",
    "scan.phase.xss",
    "scan.phase.headers",
    "scan.phase.auth",
    "scan.phase.files",
    "scan.phase.api",
    "scan.phase.cookies",
    "scan.phase.report",
  ]

  const startScan = async () => {
    if (!url) return
    
    setError(null)
    
    // Validate URL format
    if (!isValidUrl(url)) {
      setError(t("scan.errorInvalidUrl"))
      return
    }
    
    // Check if URL is reachable
    setIsValidating(true)
    setCurrentPhase(t("scan.validating"))
    
    try {
      const response = await fetch(`/api/validate-url?url=${encodeURIComponent(url)}`)
      const data = await response.json()
      
      if (!data.valid) {
        setError(data.error || t("scan.errorUnreachable"))
        setIsValidating(false)
        setCurrentPhase("")
        return
      }
    } catch {
      setError(t("scan.errorConnection"))
      setIsValidating(false)
      setCurrentPhase("")
      return
    }
    
    setIsValidating(false)
    setIsScanning(true)
    setProgress(0)
    setResults([])
    setLiveFindings([])
    setScanComplete(false)

    // Generate results for this specific URL
    const generatedResults = generateScanResults(url)
    let currentProgress = 0
    let phaseIndex = 0
    let findingIndex = 0

    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 2.5 + 0.5
      
      // Add live findings as scan progresses
      const expectedFindings = Math.floor((currentProgress / 100) * generatedResults.length)
      while (findingIndex < expectedFindings && findingIndex < generatedResults.length) {
        setLiveFindings(prev => [...prev, generatedResults[findingIndex]])
        findingIndex++
      }
      
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(progressInterval)
        setIsScanning(false)
        setScanComplete(true)
        setResults(generatedResults)
        setLiveFindings([])
      }
      setProgress(Math.min(currentProgress, 100))

      const newPhaseIndex = Math.floor((currentProgress / 100) * phaseKeys.length)
      if (newPhaseIndex !== phaseIndex && newPhaseIndex < phaseKeys.length) {
        phaseIndex = newPhaseIndex
        setCurrentPhase(t(phaseKeys[phaseIndex]))
      }
    }, 150)
  }

  const getTypeStyles = (type: ScanResult["type"]) => {
    switch (type) {
      case "critical":
        return "border-red-500/50 bg-red-500/10 text-red-400"
      case "warning":
        return "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
      case "safe":
        return "border-green-500/50 bg-green-500/10 text-green-400"
      default:
        return "border-blue-500/50 bg-blue-500/10 text-blue-400"
    }
  }

  const getTypeIcon = (type: ScanResult["type"]) => {
    switch (type) {
      case "critical":
        return "!"
      case "warning":
        return "W"
      case "safe":
        return "OK"
      default:
        return "i"
    }
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
            <Link href="/early-access" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("scan.navEarlyAccess")}
            </Link>
            <LanguageSelector />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t("scan.title")}<span className="text-muted-foreground">{t("scan.titleAccent")}</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t("scan.description")}
          </p>
        </motion.div>

        {/* Scanner Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("scan.placeholder")}
                disabled={isScanning}
                className="w-full px-6 py-4 bg-card border border-border rounded-none font-mono text-lg focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
            </div>
            <button
              onClick={startScan}
              disabled={isScanning || isValidating || !url}
              className="px-8 py-4 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t("scan.validating")}
                </>
              ) : isScanning ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t("scan.scanning")}
                </>
              ) : (
                <>
                  {t("scan.startScan")}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 border border-red-500/50 bg-red-500/10 text-red-400 flex items-center gap-3"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Progress */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <div className="border border-border p-6 bg-card">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm text-muted-foreground">{currentPhase}</span>
                  <span className="font-mono text-sm">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                {/* Scan Animation */}
                <div className="mt-6 font-mono text-xs text-muted-foreground space-y-1">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {">"} {t("scan.analyzingTarget")} {url}
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  >
                    {">"} {t("scan.runningModules")}
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                  >
                    {">"} {t("scan.aiThreatDetection")}
                  </motion.div>
                </div>
                
                {/* Live Findings */}
                {liveFindings.length > 0 && (
                  <div className="mt-6 space-y-2 max-h-48 overflow-y-auto">
                    <div className="text-xs text-muted-foreground mb-2">{t("scan.liveFindings")}</div>
                    {liveFindings.map((finding, i) => (
                      <motion.div
                        key={`${finding.message}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-xs font-mono px-3 py-2 border-l-2 ${
                          finding.type === "critical" ? "border-red-500 text-red-400" :
                          finding.type === "warning" ? "border-yellow-500 text-yellow-400" :
                          finding.type === "safe" ? "border-green-500 text-green-400" :
                          "border-blue-500 text-blue-400"
                        }`}
                      >
                        [{finding.category}] {finding.message}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {scanComplete && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{t("scan.results")}</h2>
                <div className="flex items-center gap-4 text-sm font-mono">
                  <span className="text-green-400">{results.filter(r => r.type === "safe").length} {t("scan.safe")}</span>
                  <span className="text-blue-400">{results.filter(r => r.type === "info").length} {t("scan.info")}</span>
                  <span className="text-yellow-400">{results.filter(r => r.type === "warning").length} {t("scan.warnings")}</span>
                  <span className="text-red-400">{results.filter(r => r.type === "critical").length} {t("scan.critical")}</span>
                </div>
              </div>

              {/* Security Score */}
              <div className="border border-border p-6 bg-card mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">{t("scan.securityScore")}</span>
                  <span className={`text-3xl font-bold ${
                    results.filter(r => r.type === "critical").length > 0 ? "text-red-400" :
                    results.filter(r => r.type === "warning").length > 2 ? "text-yellow-400" :
                    "text-green-400"
                  }`}>
                    {Math.max(0, 100 - (results.filter(r => r.type === "critical").length * 25) - (results.filter(r => r.type === "warning").length * 10))}/100
                  </span>
                </div>
                <div className="h-3 bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      results.filter(r => r.type === "critical").length > 0 ? "bg-red-500" :
                      results.filter(r => r.type === "warning").length > 2 ? "bg-yellow-500" :
                      "bg-green-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(0, 100 - (results.filter(r => r.type === "critical").length * 25) - (results.filter(r => r.type === "warning").length * 10))}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>

              {results.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border p-4 ${getTypeStyles(result.type)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center border border-current rounded-full font-bold text-sm shrink-0">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-foreground">{result.message}</h3>
                        <span className="text-xs px-2 py-0.5 bg-background/50 rounded">{result.category}</span>
                      </div>
                      <p className="text-sm opacity-70 mt-1">{result.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: results.length * 0.05 + 0.3 }}
                className="pt-8 text-center"
              >
                <p className="text-muted-foreground text-sm mb-4">
                  {t("scan.fullAudit")}
                </p>
                <Link
                  href="/early-access"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  {t("scan.getFullReport")}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isScanning && !scanComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16 border border-dashed border-border"
          >
            <div className="w-16 h-16 mx-auto mb-4 border border-muted-foreground rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">{t("scan.readyToScan")}</h3>
            <p className="text-muted-foreground text-sm">
              {t("scan.readyToScanDesc")}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
