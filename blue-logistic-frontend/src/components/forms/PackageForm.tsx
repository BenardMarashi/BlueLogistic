"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createPackageSchema, CreatePackageFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "@/hooks/useLocale";

interface PackageFormProps {
  onSubmit: (data: CreatePackageFormData) => void;
  isLoading?: boolean;
}

export function PackageForm({ onSubmit, isLoading = false }: PackageFormProps) {
  const [countrySearch, setCountrySearch] = useState("");
  const t = useTranslations("packages");
  const tc = useTranslations("common");
  const tCountries = useTranslations("countries");
  const { messages } = useLocale();

  // Get country options from translations
  const countryOptions = Object.keys((messages as Record<string, unknown>).countries || {})
    .map((code) => ({ value: code, label: tCountries(code) }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const form = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      description: "",
      weight: 0,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
      destinationCountry: "AT",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="customerName" render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customerName")}</FormLabel>
              <FormControl><Input placeholder="John Doe" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="customerEmail" render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customerEmail")}</FormLabel>
              <FormControl><Input type="email" placeholder="john@example.com" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="customerPhone" render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customerPhone")}</FormLabel>
              <FormControl><Input placeholder="+355 123 456 789" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="weight" render={({ field }) => (
            <FormItem>
              <FormLabel>{t("weight")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="1.5" disabled={isLoading} {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="destinationCountry" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("destinationCountry")}</FormLabel>
              <FormControl>
                <Command className="border rounded-md">
                  <CommandInput
                    placeholder={t("searchCountry")}
                    value={countrySearch}
                    onValueChange={setCountrySearch}
                    disabled={isLoading}
                  />
                  {countrySearch && (
                    <CommandList className="max-h-48">
                      <CommandEmpty>{t("noCountryFound")}</CommandEmpty>
                      <CommandGroup>
                        {countryOptions.map((country) => (
                          <CommandItem
                            key={country.value}
                            value={country.label}
                            onSelect={() => {
                              field.onChange(country.value);
                              setCountrySearch(country.label);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === country.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  )}
                </Command>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("deliveryAddress")}</FormLabel>
            <FormControl><Textarea placeholder="Street, City, Postal Code" rows={2} disabled={isLoading} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>{t("packageDescription")}</FormLabel>
            <FormControl><Textarea placeholder="Describe the package contents" rows={3} disabled={isLoading} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full md:w-auto bg-brand-orange hover:opacity-90" disabled={isLoading}>
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{tc("creating")}</>) : t("createPackage")}
        </Button>
      </form>
    </Form>
  );
}
