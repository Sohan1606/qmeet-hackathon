"use client"

import { Zap, ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: July 25, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed">QMEET collects information you provide directly, including your name, email, company, and meeting content you upload for analysis. We also collect usage data to improve our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed mb-2">We use your information to:</p>
            <ul className="list-disc ml-6 text-sm space-y-1">
              <li>Provide, maintain, and improve QMEET services</li>
              <li>Send you follow-up emails and notifications about your meetings</li>
              <li>Analyze meeting patterns to give you insights</li>
              <li>Respond to your support requests</li>
              <li>Send you product updates (you can opt out anytime)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Security</h2>
            <p className="text-sm leading-relaxed">Your meeting data is encrypted in transit (TLS 1.3) and at rest (AES-256). Meeting audio files are deleted immediately after processing. We are SOC 2 Type II compliant and undergo annual security audits.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data We DO NOT Do</h2>
            <ul className="list-disc ml-6 text-sm space-y-1">
              <li>We do NOT train our AI models on your meeting data</li>
              <li>We do NOT sell your data to third parties</li>
              <li>We do NOT share your data with advertisers</li>
              <li>We do NOT read your meetings for any purpose beyond analysis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Your Rights (GDPR)</h2>
            <p className="text-sm leading-relaxed mb-2">You have the right to:</p>
            <ul className="list-disc ml-6 text-sm space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data (right to be forgotten)</li>
              <li>Export your data in a portable format</li>
              <li>Object to processing</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">To exercise these rights, email privacy@qmeet.ai</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p className="text-sm leading-relaxed">Meeting transcripts are stored for the duration of your subscription. When you delete a meeting or cancel your account, all associated data is permanently deleted within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
            <p className="text-sm leading-relaxed">We use essential cookies for authentication and functional cookies to remember your preferences. See our cookie banner for details.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
            <p className="text-sm leading-relaxed">For privacy questions, contact our Data Protection Officer at privacy@qmeet.ai or write to us at:</p>
            <p className="text-sm mt-2">QMEET Technologies Pvt. Ltd.<br/>Bengaluru, Karnataka, India</p>
          </section>
        </div>
      </div>
    </div>
  )
}