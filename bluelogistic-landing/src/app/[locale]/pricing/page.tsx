'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap } from 'lucide-react';

interface PricingRegion {
  key: string;
  flag: string;
  countries?: string;
  prices: number[];
}

const pricingData: Record<string, PricingRegion> = {
  austria: {
    key: 'austria',
    flag: '🇦🇹',
    prices: [2.90, 3.15, 3.55, 3.75, 4.20, 4.55, 4.95],
  },
  germany: {
    key: 'germany',
    flag: '🇩🇪',
    prices: [5.05, 7.00, 7.00, 7.00, 7.00, 7.00, 7.00],
  },
  central: {
    key: 'centralEurope',
    flag: '🇨🇿🇭🇺🇸🇮🇸🇰',
    countries: 'CZ, HU, SI, SK',
    prices: [6.00, 8.00, 8.00, 8.00, 8.00, 8.00, 8.00],
  },
  western: {
    key: 'westernEurope',
    flag: '🇧🇪🇫🇷🇮🇹🇳🇱',
    countries: 'BE, DK, FR, HR, IT, LU, NL, PL, CH',
    prices: [8.00, 10.00, 10.00, 10.00, 10.00, 10.00, 10.00],
  },
  spain: {
    key: 'spain',
    flag: '🇪🇸',
    prices: [9.00, 12.00, 12.00, 15.00, 15.00, 20.00, 20.00],
  },
  extended: {
    key: 'extendedEu',
    flag: '🇧🇬🇫🇮🇬🇷🇸🇪',
    countries: 'BG, EE, FI, GR, IE, LT, LV, PT, RO, SE',
    prices: [10.00, 20.00, 20.00, 20.00, 20.00, 20.00, 20.00],
  },
  balkans: {
    key: 'balkans',
    flag: '🇧🇦🇷🇸',
    countries: 'BA, RS',
    prices: [10.00, 15.00, 15.00, 18.00, 18.00, 22.00, 22.00],
  },
  iceland: {
    key: 'iceland',
    flag: '🇮🇸',
    prices: [45.53, 46.46, 48.03, 49.02, 49.93, 51.17, 52.40],
  },
};

const weights = ['3kg', '5kg', '10kg', '15kg', '20kg', '25kg', '31.5kg'];

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [activeTab, setActiveTab] = useState('austria');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0D2556] to-[#1a3a7a] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {t('pageTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            {t('pageSubtitle')}
          </motion.p>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-8">
              {Object.entries(pricingData).map(([key, data]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-[#0D2556] data-[state=active]:text-white bg-white border border-[#E2E8F0] rounded-lg px-4 py-2"
                >
                  <span className="mr-2">{data.flag.split('').slice(0, 2).join('')}</span>
                  <span className="hidden sm:inline">{t(data.key as keyof typeof t)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(pricingData).map(([key, data]) => (
              <TabsContent key={key} value={key}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-[#E2E8F0]">
                    <CardHeader className="text-center border-b border-[#E2E8F0]">
                      <CardTitle className="flex items-center justify-center gap-3">
                        <span className="text-3xl">{data.flag}</span>
                        <span className="text-2xl text-[#0D2556]">
                          {t(data.key as keyof typeof t)}
                        </span>
                      </CardTitle>
                      {data.countries && (
                        <p className="text-sm text-[#64748B] mt-2">
                          {data.countries}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#F8FAFC]">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D2556]">
                                {t('weightLabel')}
                              </th>
                              <th className="px-6 py-4 text-right text-sm font-semibold text-[#0D2556]">
                                {t('costPrice')}
                              </th>
                              <th className="px-6 py-4 text-right text-sm font-semibold text-[#D8420E]">
                                {t('sellingPrice')}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {weights.map((weight, index) => (
                              <tr
                                key={weight}
                                className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                              >
                                <td className="px-6 py-4 text-[#0D2556] font-medium">
                                  {t('upTo')} {weight}
                                </td>
                                <td className="px-6 py-4 text-right text-[#64748B]">
                                  €{data.prices[index].toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right text-[#D8420E] font-semibold">
                                  €{(data.prices[index] * 2).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Smart Weight Splitting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-12"
          >
            <Card className="border-[#D8420E]/20 bg-[#D8420E]/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#D8420E] rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0D2556] mb-2">
                      {t('smartSplitting')}
                    </h3>
                    <p className="text-[#64748B] mb-3">
                      {t('smartSplittingDesc')}
                    </p>
                    <p className="text-sm text-[#0D2556] bg-white/50 px-4 py-2 rounded-lg inline-block">
                      {t('smartSplittingExample')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              asChild
              size="lg"
              className="bg-[#D8420E] hover:bg-[#b93a0c] text-white px-8"
            >
              <Link href="http://localhost:3000/register">
                {t('heading').includes('Einfache') ? 'Kostenlos starten' : 'Get Started Free'}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
