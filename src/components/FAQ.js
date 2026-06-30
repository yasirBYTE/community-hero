'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: 'How does Community Hero work?', a: 'Community Hero lets you report civic issues by taking a photo and describing the problem. Our AI automatically categorizes and prioritizes it. Neighbors can verify and upvote the issue, and authorities track progress until resolution.' },
  { q: 'Is the platform free to use?', a: 'Yes, Community Hero is completely free for residents to report issues, verify reports, and track resolution progress. We believe civic engagement should be accessible to everyone.' },
  { q: 'How does the AI categorization work?', a: 'When you report an issue, Gemini AI analyzes the photo and description to categorize the problem (e.g., pothole, broken streetlight, water leak), assess severity, and suggest priority level. This ensures issues reach the right authorities faster.' },
  { q: 'Can I track the status of my report?', a: 'Absolutely. Every issue has a public timeline showing its journey from reported to verified to in-progress to resolved. You can also see community upvotes and comments.' },
  { q: 'Who can verify an issue?', a: 'Any registered user can upvote or verify an issue. The collective verification helps authorities understand which issues need the most urgent attention.' },
  { q: 'How is my data protected?', a: 'We use Firebase Authentication for secure login and Firestore for encrypted data storage. Your personal information is never shared without your consent.' },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about Community Hero.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-gradient overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="font-heading font-medium text-white text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-400 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
