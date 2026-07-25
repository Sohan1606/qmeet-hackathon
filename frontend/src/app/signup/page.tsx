"use client"

import { useState, useEffect } from "react"
import { Zap, Mail, Lock, User, Building2, ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("qmeet_user")
    if (user) router.push("/analytics")
  }, [router])

  const handleNext = (e) => {
    e.preventDefault()
    setError("")
    if (!name || !email || !password) {
      setError("Please fill in all fields")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setStep(2)
  }

  const handleFinish = (e) => {
    e.preventDefault()
    setError("")
    if (!company || !teamSize) {
      setError("Please complete workspace setup")
      return
    }
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("qmeet_user", JSON.stringify({ 
        name, email, company, teamSize,
        signupTime: new Date().toISOString()
      }))
      router.push("/analytics")
    }, 1000)
  }

  const handleOAuthSignup = (provider) => {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("qmeet_user", JSON.stringify({ 
        name: "John Doe",
        email: "john@acmecorp.com",
        company: "Acme Corp",
        teamSize: "2-10",
        signupMethod: provider,
        signupTime: new Date().toISOString()
      }))
      router.push("/analytics")
    }, 800)
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 relative">
        <div className="flex items-center gap-2 absolute top-8 left-8">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2383E2] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-gray-900">QMEET</span>
          </a>
        </div>

        <div className="max-w-md w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center gap-1.5">
              <div className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold " + (step >= 1 ? "bg-[#2383E2] text-white" : "bg-gray-200 text-gray-400")}>
                {step > 1 ? <Check className="w-3 h-3" /> : "1"}
              </div>
              <span className="text-xs font-semibold text-gray-700">Account</span>
            </div>
            <div className={"flex-1 h-px " + (step >= 2 ? "bg-[#2383E2]" : "bg-gray-200")}></div>
            <div className="flex items-center gap-1.5">
              <div className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold " + (step >= 2 ? "bg-[#2383E2] text-white" : "bg-gray-200 text-gray-400")}>2</div>
              <span className="text-xs font-semibold text-gray-700">Workspace</span>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-600 mb-8 text-sm">Start with 5 free meetings per month, no credit card required</p>

              <div className="space-y-2 mb-6">
                <button onClick={() => handleOAuthSignup("google")} disabled={loading} className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-sm text-gray-700 transition-colors disabled:opacity-50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500">Or sign up with email</span>
                </div>
              </div>

              <form onSubmit={handleNext} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/10 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Work email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@company.com" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/10 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="8+ characters" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/10 text-sm" />
                  </div>
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2383E2] text-white rounded-lg font-semibold text-sm hover:bg-[#1a6dc4] transition-colors shadow-sm">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By signing up, you agree to our <a href="/terms" className="underline hover:text-[#2383E2]">Terms</a> and <a href="/privacy" className="underline hover:text-[#2383E2]">Privacy Policy</a>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Set up your workspace</h1>
              <p className="text-gray-600 mb-8 text-sm">Tell us about your team so we can personalize your experience</p>

              <form onSubmit={handleFinish} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Company name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="Acme Corp" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2383E2] focus:ring-2 focus:ring-[#2383E2]/10 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Team size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Just me", "2-10", "11-50", "51-200", "201-1000", "1000+"].map(size => (
                      <button key={size} type="button" onClick={() => setTeamSize(size)} className={"py-2.5 px-3 border rounded-lg text-sm font-medium transition-all " + (teamSize === size ? "border-[#2383E2] bg-blue-50 text-[#2383E2]" : "border-gray-200 hover:border-gray-300")}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2383E2] text-white rounded-lg font-semibold text-sm hover:bg-[#1a6dc4] transition-colors disabled:opacity-70 shadow-sm">
                  {loading ? (<><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Setting up workspace...</>) : (<>Create workspace <ArrowRight className="w-4 h-4" /></>)}
                </button>

                <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
                  Back
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <a href="/login" className="text-[#2383E2] font-semibold hover:underline">Log in</a>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#2383E2] via-blue-600 to-blue-800 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        <div className="relative">
          <div className="text-[10px] font-semibold uppercase tracking-widest opacity-70 mb-3">What you get free</div>
          <h2 className="text-3xl font-bold leading-tight mb-6">Start turning your meetings into results instantly.</h2>
          <div className="space-y-3">
            {["5 free meetings analyzed per month", "All 6 AI agents included", "Automatic follow-up emails", "Meeting effectiveness scoring", "7-day analysis history", "No credit card required"].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="p-4 bg-white/10 backdrop-blur rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["JD", "SK", "MC", "PS"].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-blue-700 flex items-center justify-center text-xs font-bold">{i}</div>
                ))}
              </div>
              <span className="text-sm">1,247 teams onboarded this month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}