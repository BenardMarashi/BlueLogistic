'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const regions = [
  {
    key: 'domestic',
    countries: [{ code: 'AT', name: 'Austria', flag: '🇦🇹' }],
  },
  {
    key: 'centralEurope',
    countries: [
      { code: 'DE', name: 'Germany', flag: '🇩🇪' },
      { code: 'CZ', name: 'Czechia', flag: '🇨🇿' },
      { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
      { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
      { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
    ],
  },
  {
    key: 'westernEurope',
    countries: [
      { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
      { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
      { code: 'FR', name: 'France', flag: '🇫🇷' },
      { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
      { code: 'IT', name: 'Italy', flag: '🇮🇹' },
      { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
      { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
      { code: 'PL', name: 'Poland', flag: '🇵🇱' },
      { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    ],
  },
  {
    key: 'southernEurope',
    countries: [{ code: 'ES', name: 'Spain', flag: '🇪🇸' }],
  },
  {
    key: 'northernEasternEu',
    countries: [
      { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
      { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
      { code: 'FI', name: 'Finland', flag: '🇫🇮' },
      { code: 'GR', name: 'Greece', flag: '🇬🇷' },
      { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
      { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
      { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
      { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
      { code: 'RO', name: 'Romania', flag: '🇷🇴' },
      { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    ],
  },
  {
    key: 'balkans',
    countries: [
      { code: 'BA', name: 'Bosnia & Herzegovina', flag: '🇧🇦' },
      { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
    ],
  },
  {
    key: 'nordic',
    countries: [{ code: 'IS', name: 'Iceland', flag: '🇮🇸' }],
  },
];

export function Coverage() {
  const t = useTranslations('coverage');

  return (
    <section id="coverage" className="py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-[#0D2556] mb-12"
        >
          {t('heading')}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {regions.map((region, regionIndex) => (
            <motion.div
              key={region.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: regionIndex * 0.05 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-[#E2E8F0]"
            >
              <h3 className="font-semibold text-[#0D2556] mb-4 pb-2 border-b border-[#E2E8F0]">
                {t(region.key as keyof typeof t)}
              </h3>
              <div className="space-y-2">
                {region.countries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-[#64748B]">{country.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
