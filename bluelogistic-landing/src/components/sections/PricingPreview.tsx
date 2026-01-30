'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap } from 'lucide-react';

const destinations = [
  { key: 'austria', flag: '🇦🇹', price: '5.80', label: 'austriaLabel' },
  { key: 'germany', flag: '🇩🇪', price: '10.10' },
  { key: 'centralEurope', flag: '🇨🇿🇭🇺🇸🇮🇸🇰', price: '12.00' },
  { key: 'westernEurope', flag: '🇧🇪🇫🇷🇮🇹🇳🇱', price: '16.00' },
  { key: 'spain', flag: '🇪🇸', price: '18.00' },
  { key: 'extendedEu', flag: '🇧🇬🇫🇮🇬🇷🇸🇪', price: '20.00' },
];

export function PricingPreview() {
  const t = useTranslations('pricing');

  return (
    <section className="py-20 bg-white">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-[#E2E8F0] hover:border-[#0D2556] hover:shadow-md transition-all duration-300">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{dest.flag}</span>
                    <div>
                      <p className="font-medium text-[#0D2556]">
                        {t(dest.key as keyof typeof t)}
                      </p>
                      {dest.label && (
                        <p className="text-xs text-[#64748B]">
                          {t(dest.label as keyof typeof t)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#64748B]">{t('from')}</p>
                    <p className="text-xl font-bold text-[#0D2556]">
                      €{dest.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#64748B] mb-6 max-w-2xl mx-auto"
        >
          {t('note')}
        </motion.p>

        {/* Weight Splitting Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0D2556]/5 rounded-xl p-4 flex items-center gap-4 max-w-2xl mx-auto mb-8"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-[#D8420E] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-[#0D2556]">{t('weightSplitting')}</p>
        </motion.div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#0D2556] text-[#0D2556] hover:bg-[#0D2556] hover:text-white"
          >
            <Link href="/pricing">
              {t('viewAll')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
