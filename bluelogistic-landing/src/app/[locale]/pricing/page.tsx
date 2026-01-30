'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, Check, ArrowRight } from 'lucide-react';

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
    prices: [5.80, 6.30, 7.10, 7.50, 8.40, 9.10, 9.90],
  },
  germany: {
    key: 'germany',
    flag: '🇩🇪',
    prices: [10.10, 14.00, 14.00, 14.00, 14.00, 14.00, 14.00],
  },
  central: {
    key: 'centralEurope',
    flag: '🇨🇿🇭🇺🇸🇮🇸🇰',
    countries: 'CZ, HU, SI, SK',
    prices: [12.00, 16.00, 16.00, 16.00, 16.00, 16.00, 16.00],
  },
  western: {
    key: 'westernEurope',
    flag: '🇧🇪🇫🇷🇮🇹🇳🇱',
    countries: 'BE, DK, FR, HR, IT, LU, NL, PL, CH',
    prices: [16.00, 20.00, 20.00, 20.00, 20.00, 20.00, 20.00],
  },
  spain: {
    key: 'spain',
    flag: '🇪🇸',
    prices: [18.00, 24.00, 24.00, 30.00, 30.00, 40.00, 40.00],
  },
  extended: {
    key: 'extendedEu',
    flag: '🇧🇬🇫🇮🇬🇷🇸🇪',
    countries: 'BG, EE, FI, GR, IE, LT, LV, PT, RO, SE',
    prices: [20.00, 40.00, 40.00, 40.00, 40.00, 40.00, 40.00],
  },
  balkans: {
    key: 'balkans',
    flag: '🇧🇦🇷🇸',
    countries: 'BA, RS',
    prices: [20.00, 30.00, 30.00, 36.00, 36.00, 44.00, 44.00],
  },
  iceland: {
    key: 'iceland',
    flag: '🇮🇸',
    prices: [91.06, 92.92, 96.06, 98.04, 99.86, 102.34, 104.80],
  },
};

const weights = ['3kg', '5kg', '10kg', '15kg', '20kg', '25kg', '31.5kg'];

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [activeTab, setActiveTab] = useState('austria');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Industrial Style */}
      <section className="relative bg-gradient-to-br from-[#0D2556] via-[#1a3a7a] to-[#0D2556] text-white py-24 md:py-32 overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute inset-0 diagonal-stripes opacity-10" />

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-2 h-32 bg-[#D8420E]" />
        <div className="absolute top-0 left-0 w-32 h-2 bg-[#D8420E]" />
        <div className="absolute bottom-0 right-0 w-2 h-32 bg-[#22C55E]" />
        <div className="absolute bottom-0 right-0 w-32 h-2 bg-[#22C55E]" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D8420E]/20 border-2 border-[#D8420E]/30 rounded-full mb-6"
          >
            <Zap className="w-5 h-5 text-[#D8420E]" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Transparent Pricing
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
          >
            {t('pageTitle')}
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1.5 bg-[#D8420E] mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-medium"
          >
            {t('pageSubtitle')}
          </motion.p>
        </div>

        {/* Bottom angular cut */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 60%, 0 100%)' }} />
      </section>

      {/* Pricing Tables */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            {/* Region Tabs - Industrial Style */}
            <TabsList className="flex flex-wrap justify-center gap-2 bg-[#F8FAFC] p-2 rounded-lg mb-12 border-2 border-[#E2E8F0]">
              {Object.entries(pricingData).map(([key, data]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-[#0D2556] data-[state=active]:text-white bg-white text-[#0D2556] border border-[#E2E8F0] hover:border-[#0D2556] rounded font-bold uppercase tracking-wider text-xs px-4 py-2 transition-all"
                >
                  <span className="mr-2 text-base">{data.flag.split('').slice(0, 2).join('')}</span>
                  <span className="hidden sm:inline">{t(data.key as any)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Pricing Content */}
            {Object.entries(pricingData).map(([key, data]) => (
              <TabsContent key={key} value={key}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-2 border-[#E2E8F0] shadow-xl hover-lift overflow-hidden">
                    {/* Card Header with Industrial Design */}
                    <CardHeader className="text-center border-b-2 border-[#D8420E] bg-gradient-to-r from-[#F8FAFC] to-white p-8">
                      <CardTitle className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <span className="text-5xl">{data.flag}</span>
                        <div className="flex flex-col items-center md:items-start">
                          <span className="text-3xl font-black text-[#0D2556] uppercase tracking-tight">
                            {t(data.key as any)}
                          </span>
                          {data.countries && (
                            <span className="text-sm text-[#64748B] mt-1 font-medium">
                              {data.countries}
                            </span>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                      {/* Desktop Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#0D2556] text-white">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">
                                {t('weightLabel')}
                              </th>
                              <th className="px-6 py-4 text-right text-sm font-black uppercase tracking-wider">
                                Price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {weights.map((weight, index) => (
                              <motion.tr
                                key={weight}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                              >
                                <td className="px-6 py-5 text-[#0D2556] font-bold">
                                  {t('upTo')} {weight}
                                </td>
                                <td className="px-6 py-5 text-right text-[#0D2556] font-black text-lg">
                                  €{data.prices[index].toFixed(2)}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden p-4 space-y-3">
                        {weights.map((weight, index) => (
                          <motion.div
                            key={weight}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#F8FAFC] border-2 border-[#E2E8F0] p-4 rounded-lg flex justify-between items-center"
                          >
                            <span className="text-[#0D2556] font-black text-lg">
                              {t('upTo')} {weight}
                            </span>
                            <span className="text-[#0D2556] font-black text-xl">
                              €{data.prices[index].toFixed(2)}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Smart Weight Splitting - Enhanced Design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-16"
          >
            <Card className="border-2 border-[#D8420E]/30 bg-gradient-to-br from-[#D8420E]/5 to-white shadow-xl overflow-hidden">
              {/* Top accent bar */}
              <div className="h-2 bg-gradient-to-r from-[#D8420E] to-[#ff6b35]" />

              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-[#D8420E] flex items-center justify-center relative">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white" />
                    <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-black text-[#0D2556] mb-3 uppercase">
                      {t('smartSplitting')}
                    </h3>
                    <p className="text-[#64748B] mb-4 text-lg font-medium leading-relaxed">
                      {t('smartSplittingDesc')}
                    </p>
                    <div className="bg-white border-2 border-[#D8420E]/20 px-5 py-3 rounded-lg inline-flex items-center gap-2">
                      <Check className="w-5 h-5 text-[#22C55E]" strokeWidth={3} />
                      <span className="text-[#0D2556] font-bold">
                        {t('smartSplittingExample')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-[#D8420E] hover:bg-[#ff5722] text-white px-12 py-7 text-lg font-black uppercase tracking-wider shadow-2xl shadow-[#D8420E]/30 hover:shadow-[#D8420E]/50 hover:scale-105 transition-all duration-300 group border-2 border-[#D8420E]"
            >
              <Link href="/contact" className="flex items-center gap-3">
                {t('heading').includes('Einfache') ? 'Jetzt buchen' : 'Book Now'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="mt-4 text-[#64748B] text-sm font-medium">
              {t('heading').includes('Einfache') ? 'Keine Einrichtungsgebühren • Keine versteckten Kosten' : 'No setup fees • No hidden costs'}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
