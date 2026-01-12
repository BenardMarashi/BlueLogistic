'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, DollarSign, Truck, MapPin, User, Plug } from 'lucide-react';

const categories = [
  { key: 'general', icon: HelpCircle, questions: ['generalQ1', 'generalQ2', 'generalQ3'] },
  { key: 'pricing', icon: DollarSign, questions: ['pricingQ1', 'pricingQ2', 'pricingQ3', 'pricingQ4'] },
  { key: 'shipping', icon: Truck, questions: ['shippingQ1', 'shippingQ2', 'shippingQ3', 'shippingQ4'] },
  { key: 'tracking', icon: MapPin, questions: ['trackingQ1', 'trackingQ2', 'trackingQ3'] },
  { key: 'account', icon: User, questions: ['accountQ1', 'accountQ2', 'accountQ3'] },
  { key: 'integrations', icon: Plug, questions: ['integrationsQ1', 'integrationsQ2', 'integrationsQ3'] },
];

export default function FAQPage() {
  const t = useTranslations('faq');
  const [activeCategory, setActiveCategory] = useState('general');

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
            {t('heading')}
          </motion.h1>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-8 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <motion.button
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveCategory(category.key)}
                className={`p-4 rounded-xl text-center transition-all ${
                  activeCategory === category.key
                    ? 'bg-[#0D2556] text-white shadow-lg'
                    : 'bg-white text-[#64748B] hover:shadow-md border border-[#E2E8F0]'
                }`}
              >
                <category.icon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">
                  {t(`categories.${category.key}` as keyof typeof t)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {categories.map((category) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCategory === category.key ? 1 : 0,
                  display: activeCategory === category.key ? 'block' : 'none',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#0D2556] flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0D2556]">
                    {t(`categories.${category.key}` as keyof typeof t)}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((qKey, index) => {
                    const aKey = qKey.replace('Q', 'A');
                    return (
                      <AccordionItem
                        key={qKey}
                        value={qKey}
                        className="bg-white rounded-xl border border-[#E2E8F0] px-6"
                      >
                        <AccordionTrigger className="text-left text-[#0D2556] font-medium hover:no-underline py-5">
                          {t(qKey as keyof typeof t)}
                        </AccordionTrigger>
                        <AccordionContent className="text-[#64748B] pb-5">
                          {t(aKey as keyof typeof t)}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
