'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Clock, PiggyBank, ClipboardCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ValueProps() {
  const t = useTranslations('valueProps');

  const cards = [
    {
      icon: Clock,
      title: t('card1Title'),
      description: t('card1Description'),
    },
    {
      icon: PiggyBank,
      title: t('card2Title'),
      description: t('card2Description'),
    },
    {
      icon: ClipboardCheck,
      title: t('card3Title'),
      description: t('card3Description'),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-[#0D2556] mb-12"
        >
          {t('heading')}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-[#E2E8F0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="pt-8 pb-8 px-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D2556]/5 mb-6">
                    <card.icon className="w-8 h-8 text-[#0D2556]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0D2556] mb-3">
                    {card.title}
                  </h3>
                  <p className="text-[#64748B] leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
