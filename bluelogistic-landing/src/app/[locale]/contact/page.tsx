'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Clock, Calendar, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.append('access_key', 'b9fdd631-7a92-422e-a45d-d9de16ea5a24');
    formData.append('subject', `BlueLogistic Inquiry: ${subject}`);
    formData.append('from_name', 'BlueLogistic Contact Form');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-[#E2E8F0]">
                <CardContent className="p-6">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-[#22C55E]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0D2556] mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-[#64748B]">
                        {t('responseTime')}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Honeypot for spam protection */}
                      <input type="checkbox" name="botcheck" className="hidden" />

                      <div>
                        <label className="block text-sm font-medium text-[#0D2556] mb-2">
                          {t('nameLabel')} *
                        </label>
                        <Input
                          name="name"
                          required
                          placeholder={t('namePlaceholder')}
                          className="border-[#E2E8F0]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#0D2556] mb-2">
                          {t('emailLabel')} *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          required
                          placeholder={t('emailPlaceholder')}
                          className="border-[#E2E8F0]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#0D2556] mb-2">
                          {t('companyLabel')}
                        </label>
                        <Input
                          name="company"
                          placeholder={t('companyPlaceholder')}
                          className="border-[#E2E8F0]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#0D2556] mb-2">
                          {t('subjectLabel')} *
                        </label>
                        <Select required value={subject} onValueChange={setSubject}>
                          <SelectTrigger className="border-[#E2E8F0]">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Inquiry">
                              {t('subjects.general')}
                            </SelectItem>
                            <SelectItem value="Demo Request">
                              {t('subjects.demo')}
                            </SelectItem>
                            <SelectItem value="Support">
                              {t('subjects.support')}
                            </SelectItem>
                            <SelectItem value="Partnership">
                              {t('subjects.partnership')}
                            </SelectItem>
                            <SelectItem value="Other">
                              {t('subjects.other')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#0D2556] mb-2">
                          {t('messageLabel')} *
                        </label>
                        <Textarea
                          name="message"
                          required
                          placeholder={t('messagePlaceholder')}
                          className="border-[#E2E8F0] min-h-[120px]"
                        />
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#D8420E] hover:bg-[#b93a0c] text-white disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          t('submit')
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-[#0D2556] mb-6">
                  {t('heading')}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0D2556]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#0D2556]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0D2556]">Email</p>
                      <a
                        href={`mailto:${t('infoEmail')}`}
                        className="text-[#D8420E] hover:underline"
                      >
                        {t('infoEmail')}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#0D2556]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#0D2556]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0D2556]">{t('responseTime')}</p>
                      <p className="text-[#64748B]">{t('officeHours')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Demo CTA */}
              <Card className="border-[#D8420E]/20 bg-[#D8420E]/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#D8420E] flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0D2556] mb-2">
                        {t('bookDemo')}
                      </h3>
                      <p className="text-[#64748B] text-sm mb-4">
                        Schedule a personalized demo with our team.
                      </p>
                      <Button className="bg-[#D8420E] hover:bg-[#b93a0c] text-white">
                        {t('bookDemo')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
