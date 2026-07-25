"use client"

import { Zap, ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2383E2] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-gray-900">QMEET</span>
          </a>
          <a href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: July 25, 2026</p>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p className="text-sm leading-relaxed">By accessing or using QMEET, you agree to be bound by these Terms of Service. If you disagree, please do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p className="text-sm leading-relaxed">QMEET is an autonomous meeting intelligence platform that uses AI agents to analyze meetings, extract action items, and automate follow-ups. Features include transcription, task extraction, sentiment analysis, and email automation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Account Registration</h2>
            <p className="text-sm leading-relaxed">You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and password. QMEET is not liable for any loss due to unauthorized account access.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Acceptable Use</h2>
            <p className="text-sm leading-relaxed mb-2">You agree NOT to:</p>
            <ul className="list-disc ml-6 text-sm space-y-1">
              <li>Upload meetings without consent of all participants</li>
              <li>Use QMEET for illegal or unauthorized purposes</li>
              <li>Attempt to reverse engineer or hack our systems</li>
              <li>Resell or redistribute QMEET services</li>
              <li>Upload malicious content or spam</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Subscription & Billing</h2>
            <p className="text-sm leading-relaxed">Paid subscriptions renew automatically. You can cancel anytime from Settings. Refunds are provided for annual plans prorated to unused months.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p className="text-sm leading-relaxed">QMEET retains all rights to our software, AI models, and branding. You retain full ownership of your meeting content and data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">QMEET is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount you paid in the last 12 months.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Termination</h2>
            <p className="text-sm leading-relaxed">You may terminate your account anytime. We may suspend accounts that violate these terms. Upon termination, your data is deleted within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Governing Law</h2>
            <p className="text-sm leading-relaxed">These terms are governed by the laws of India. Any disputes will be resolved in the courts of Bengaluru, Karnataka.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
            <p className="text-sm leading-relaxed">Questions? Email legal@qmeet.ai</p>
          </section>
        </div>
      </div>
    </div>
  )
}