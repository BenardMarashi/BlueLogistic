"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createPackageSchema, CreatePackageFormData } from "@/lib/validations";

interface PackageFormProps {
  onSubmit: (data: CreatePackageFormData) => void;
  isLoading?: boolean;
}

export function PackageForm({ onSubmit, isLoading = false }: PackageFormProps) {
  const form = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      description: "",
      weight: 0,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      deliveryAddress: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="customerName" render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl><Input placeholder="John Doe" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="customerEmail" render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Email</FormLabel>
              <FormControl><Input type="email" placeholder="john@example.com" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="customerPhone" render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Phone</FormLabel>
              <FormControl><Input placeholder="+355 123 456 789" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="weight" render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="1.5" disabled={isLoading} {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
          <FormItem>
            <FormLabel>Delivery Address</FormLabel>
            <FormControl><Textarea placeholder="Street, City, Postal Code" rows={2} disabled={isLoading} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Package Description</FormLabel>
            <FormControl><Textarea placeholder="Describe the package contents" rows={3} disabled={isLoading} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full md:w-auto bg-brand-orange hover:opacity-90" disabled={isLoading}>
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : "Create Package"}
        </Button>
      </form>
    </Form>
  );
}
