'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function ImprintPage() {
  const t = useTranslations('imprint');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0D2556] to-[#1a3a7a] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold"
          >
            {t('title')}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>Company Information</h2>
            <p>
              <strong>BlueLogistic GmbH</strong><br />
              Musterstraße 123<br />
              1010 Vienna<br />
              Austria
            </p>

            <h2>Contact</h2>
            <p>
              Email: info@bluelogistic.com<br />
              Phone: +43 1 234 5678
            </p>

            <h2>Company Registration</h2>
            <p>
              Commercial Register: Vienna Commercial Court<br />
              Registration Number: FN 123456a<br />
              VAT ID: ATU12345678
            </p>

            <h2>Managing Directors</h2>
            <p>
              [Managing Director Name]
            </p>

            <h2>Regulatory Authority</h2>
            <p>
              Supervisory Authority: Magistrat der Stadt Wien
            </p>

            <h2>Professional Regulations</h2>
            <p>
              Applicable professional regulations: Austrian Trade Regulations (Gewerbeordnung)
            </p>

            <h2>Dispute Resolution</h2>
            <p>
              The European Commission provides a platform for online dispute resolution (ODR):
              <a href="https://ec.europa.eu/consumers/odr" className="text-[#D8420E] hover:underline ml-1">
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p>
              We are not willing or obliged to participate in dispute resolution proceedings
              before a consumer arbitration board.
            </p>

            <h2>Liability for Content</h2>
            <p>
              As a service provider, we are responsible for our own content on these pages
              according to general laws. However, we are not obligated to monitor transmitted
              or stored third-party information or to investigate circumstances that indicate
              illegal activity.
            </p>

            <h2>Liability for Links</h2>
            <p>
              Our offer contains links to external websites of third parties, on whose contents
              we have no influence. Therefore, we cannot assume any liability for these external
              contents. The respective provider or operator of the pages is always responsible
              for the contents of the linked pages.
            </p>

            <h2>Copyright</h2>
            <p>
              The content and works created by the site operators on these pages are subject to
              Austrian copyright law. Duplication, processing, distribution, or any form of
              commercialization of such material beyond the scope of the copyright law shall
              require the prior written consent of its respective author or creator.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
