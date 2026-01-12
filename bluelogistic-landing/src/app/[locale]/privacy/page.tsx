'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const t = useTranslations('privacy');

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
              BlueLogistic is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, and safeguard your information when you use our platform.
            </p>

            <h2>2. Data Controller</h2>
            <p>
              BlueLogistic GmbH is the data controller responsible for your personal data.
              For privacy inquiries, contact us at privacy@bluelogistic.com.
            </p>

            <h2>3. Data We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email, company name, address</li>
              <li><strong>Package Data:</strong> Recipient names, addresses, phone numbers</li>
              <li><strong>Transaction Data:</strong> Shipping history, payment records</li>
              <li><strong>Usage Data:</strong> How you interact with our platform</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            </ul>

            <h2>4. How We Use Your Data</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Provide and improve our shipping services</li>
              <li>Process transactions and send confirmations</li>
              <li>Communicate about your account and shipments</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and abuse</li>
            </ul>

            <h2>5. Legal Basis (GDPR)</h2>
            <p>We process your data based on:</p>
            <ul>
              <li><strong>Contract Performance:</strong> To fulfill shipping services</li>
              <li><strong>Legitimate Interests:</strong> To improve our services</li>
              <li><strong>Legal Obligations:</strong> Tax and customs requirements</li>
              <li><strong>Consent:</strong> For marketing communications (when given)</li>
            </ul>

            <h2>6. Data Sharing</h2>
            <p>We share data with:</p>
            <ul>
              <li>Shipping carriers (to fulfill deliveries)</li>
              <li>Payment processors (to handle transactions)</li>
              <li>Legal authorities (when required by law)</li>
            </ul>
            <p>We do not sell your personal data.</p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active and for 7 years after
              for tax and legal compliance purposes.
            </p>

            <h2>8. Your Rights</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request data deletion</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
              <li>Object to processing</li>
              <li>Withdraw consent</li>
            </ul>

            <h2>9. Cookies</h2>
            <p>
              We use essential cookies for platform functionality and analytics cookies to
              improve our service. You can manage cookie preferences in your browser settings.
            </p>

            <h2>10. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              data, including encryption, access controls, and regular security audits.
            </p>

            <h2>11. Contact</h2>
            <p>
              For privacy inquiries or to exercise your rights, contact us at:
              privacy@bluelogistic.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
