'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserPlus, Package, Truck } from 'lucide-react';

export function HowItWorks() {
  const t = useTranslations('howItWorks');
  const [activeTab, setActiveTab] = useState('create');

  const tabs = [
    {
      value: 'create',
      label: t('tab1Label'),
      icon: UserPlus,
      title: t('tab1Title'),
      subtitle: t('tab1Subtitle'),
      description: t('tab1Description'),
    },
    {
      value: 'add',
      label: t('tab2Label'),
      icon: Package,
      title: t('tab2Title'),
      subtitle: t('tab2Subtitle'),
      description: t('tab2Description'),
    },
    {
      value: 'ship',
      label: t('tab3Label'),
      icon: Truck,
      title: t('tab3Title'),
      subtitle: t('tab3Subtitle'),
      description: t('tab3Description'),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-[#0D2556] mb-12"
        >
          {t('heading')}
        </motion.h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-xl shadow-sm mb-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-[#0D2556] data-[state=active]:text-white rounded-lg py-3 transition-all"
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split('.')[0]}.</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  {/* Mockup Image */}
                  <div className="order-2 md:order-1">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E2E8F0]">
                      {/* Browser chrome */}
                      <div className="bg-[#F8FAFC] px-4 py-3 flex items-center gap-2 border-b border-[#E2E8F0]">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-[#64748B]">
                          app.bluelogistic.com
                        </div>
                      </div>

                      {/* Dashboard mockup */}
                      <div className="p-6 bg-gradient-to-br from-[#0D2556]/5 to-white min-h-[300px] flex items-center justify-center">
                        <div className="w-full max-w-xs">
                          {tab.value === 'create' && (
                            <div className="space-y-4">
                              <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-[#0D2556] rounded-xl mx-auto mb-3 flex items-center justify-center">
                                  <Package className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="font-bold text-[#0D2556]">Create Account</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-white rounded-lg border p-3">
                                  <div className="text-xs text-[#64748B] mb-1">Email</div>
                                  <div className="h-3 bg-[#E2E8F0] rounded w-3/4" />
                                </div>
                                <div className="bg-white rounded-lg border p-3">
                                  <div className="text-xs text-[#64748B] mb-1">Password</div>
                                  <div className="h-3 bg-[#E2E8F0] rounded w-1/2" />
                                </div>
                                <div className="bg-[#D8420E] text-white text-center py-2 rounded-lg text-sm font-medium">
                                  Get Started
                                </div>
                              </div>
                            </div>
                          )}

                          {tab.value === 'add' && (
                            <div className="space-y-4">
                              <h4 className="font-bold text-[#0D2556] mb-4">New Package</h4>
                              <div className="space-y-3">
                                <div className="bg-white rounded-lg border p-3">
                                  <div className="text-xs text-[#64748B] mb-1">Customer Name</div>
                                  <div className="h-3 bg-[#E2E8F0] rounded w-2/3" />
                                </div>
                                <div className="bg-white rounded-lg border p-3">
                                  <div className="text-xs text-[#64748B] mb-1">Address</div>
                                  <div className="h-3 bg-[#E2E8F0] rounded w-full" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-white rounded-lg border p-3">
                                    <div className="text-xs text-[#64748B] mb-1">Weight</div>
                                    <div className="h-3 bg-[#E2E8F0] rounded w-1/2" />
                                  </div>
                                  <div className="bg-white rounded-lg border p-3">
                                    <div className="text-xs text-[#64748B] mb-1">Destination</div>
                                    <div className="h-3 bg-[#E2E8F0] rounded w-3/4" />
                                  </div>
                                </div>
                                <div className="bg-[#0D2556] text-white text-center py-2 rounded-lg text-sm font-medium">
                                  Add Package
                                </div>
                              </div>
                            </div>
                          )}

                          {tab.value === 'ship' && (
                            <div className="space-y-3">
                              <h4 className="font-bold text-[#0D2556] mb-4">Your Packages</h4>
                              {[
                                { status: 'CREATED', color: '#64748B' },
                                { status: 'IN_STORAGE', color: '#D8420E' },
                                { status: 'DISPATCHED', color: '#22C55E' },
                              ].map((pkg, i) => (
                                <div key={i} className="bg-white rounded-lg border p-3 flex items-center justify-between">
                                  <div>
                                    <div className="text-sm font-medium text-[#0D2556]">PKG-{1000 + i}</div>
                                    <div className="text-xs text-[#64748B]">Berlin, DE</div>
                                  </div>
                                  <div
                                    className="text-xs px-2 py-1 rounded-full font-medium"
                                    style={{ backgroundColor: pkg.color + '20', color: pkg.color }}
                                  >
                                    {pkg.status}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="order-1 md:order-2 text-center md:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D2556] mb-6">
                      <tab.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0D2556] mb-2">
                      {tab.title}
                    </h3>
                    <p className="text-[#D8420E] font-medium mb-4">
                      {tab.subtitle}
                    </p>
                    <p className="text-[#64748B] leading-relaxed">
                      {tab.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
