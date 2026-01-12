'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const t = useTranslations('terms');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0D2556] to-[#1a3a7a] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80"
          >
            {t('lastUpdated')}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>1. Introduction</h2>
            <p>
              Welcome to BlueLogistic. These Terms of Service govern your use of our platform
              and services. By accessing or using BlueLogistic, you agree to be bound by these terms.
            </p>

            <h2>2. Service Description</h2>
            <p>
              BlueLogistic provides a B2B package management platform that enables businesses to
              manage their European shipping operations. Our services include package creation,
              tracking, label generation, and logistics coordination.
            </p>

            <h2>3. Account Registration</h2>
            <p>
              To use our services, you must create an account. You are responsible for:
            </p>
            <ul>
              <li>Providing accurate and complete registration information</li>
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h2>4. User Responsibilities</h2>
            <p>
              As a user of BlueLogistic, you agree to:
            </p>
            <ul>
              <li>Use the platform only for lawful purposes</li>
              <li>Provide accurate package and recipient information</li>
              <li>Comply with all applicable shipping regulations</li>
              <li>Not ship prohibited or illegal items</li>
              <li>Pay all applicable fees in a timely manner</li>
            </ul>

            <h2>5. Pricing and Payment</h2>
            <p>
              Prices for shipping services are displayed in the platform and are subject to change.
              All payments are due upon package submission. We reserve the right to adjust pricing
              for weight discrepancies.
            </p>

            <h2>6. Liability Limitations</h2>
            <p>
              BlueLogistic acts as a logistics coordinator. While we strive to ensure reliable
              delivery, we are not liable for:
            </p>
            <ul>
              <li>Delays caused by carriers or customs</li>
              <li>Damage during transit beyond our control</li>
              <li>Incorrect recipient information provided by users</li>
              <li>Force majeure events</li>
            </ul>

            <h2>7. Termination</h2>
            <p>
              Either party may terminate this agreement at any time. Upon termination, you remain
              responsible for any outstanding payments, and we will fulfill any pending shipments.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the platform after
              changes constitutes acceptance of the new terms.
            </p>

            <h2>9. Contact</h2>
            <p>
              For questions about these terms, please contact us at support@bluelogistic.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
