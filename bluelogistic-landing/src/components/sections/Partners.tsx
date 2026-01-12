'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Building2, Store, ShoppingBag, Truck, Package, Warehouse, Globe, ShoppingCart } from 'lucide-react';

const partners = [
  { name: 'TechShop', icon: Store },
  { name: 'EuroMart', icon: ShoppingCart },
  { name: 'GlobalGoods', icon: Globe },
  { name: 'PackPro', icon: Package },
  { name: 'SwiftShip', icon: Truck },
  { name: 'WarehouseOne', icon: Warehouse },
  { name: 'RetailPlus', icon: ShoppingBag },
  { name: 'BusinessHub', icon: Building2 },
];

export function Partners() {
  const t = useTranslations('partners');

  return (
    <section className="py-12 bg-[#F8FAFC] overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-lg text-[#64748B] mb-8"
        >
          {t('heading')}
        </motion.h2>

        {/* Infinite scrolling carousel */}
        <div className="relative">
          <div className="flex animate-scroll gap-12 hover:pause-animation">
            {/* Double the items for seamless loop */}
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-3 bg-white rounded-lg shadow-sm grayscale hover:grayscale-0 transition-all duration-300 hover:shadow-md"
              >
                <partner.icon className="w-6 h-6 text-[#0D2556]" />
                <span className="font-medium text-[#64748B] whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
