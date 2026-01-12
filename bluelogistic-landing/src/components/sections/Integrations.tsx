'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Package, Code2, FileSpreadsheet, ShoppingBag, Store } from 'lucide-react';

const integrations = [
  { key: 'apiAccess', descKey: 'apiAccessDesc', icon: Code2, available: true },
  { key: 'csvImport', descKey: 'csvImportDesc', icon: FileSpreadsheet, available: true },
  { key: 'shopify', descKey: 'shopifyDesc', icon: ShoppingBag, available: false },
  { key: 'woocommerce', descKey: 'woocommerceDesc', icon: Store, available: false },
];

export function Integrations() {
  const t = useTranslations('integrations');

  return (
    <section className="py-20 bg-blue-50/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D2556] mb-4">
            {t('heading')}
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            {t('subheading')}
          </p>
        </motion.div>

        {/* Hub and spoke layout */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Center hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center mb-8"
            >
              <div className="w-24 h-24 bg-[#0D2556] rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Integration cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl p-6 text-center shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow ${
                    !integration.available ? 'opacity-75' : ''
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                      integration.available
                        ? 'bg-[#22C55E]/10'
                        : 'bg-[#64748B]/10'
                    }`}
                  >
                    <integration.icon
                      className={`w-6 h-6 ${
                        integration.available
                          ? 'text-[#22C55E]'
                          : 'text-[#64748B]'
                      }`}
                    />
                  </div>
                  <h3 className="font-semibold text-[#0D2556] mb-1">
                    {t(integration.key as keyof typeof t)}
                  </h3>
                  <p
                    className={`text-sm ${
                      integration.available
                        ? 'text-[#22C55E]'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {t(integration.descKey as keyof typeof t)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button
            asChild
            variant="outline"
            className="border-[#0D2556] text-[#0D2556] hover:bg-[#0D2556] hover:text-white"
          >
            <Link href="/contact">{t('requestIntegration')}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
