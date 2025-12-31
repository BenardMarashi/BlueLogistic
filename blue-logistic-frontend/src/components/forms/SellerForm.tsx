"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createSellerSchema, CreateSellerFormData } from "@/lib/validations";

interface SellerFormProps {
  onSubmit: (data: CreateSellerFormData) => void;
  isLoading?: boolean;
}

export function SellerForm({ onSubmit, isLoading = false }: SellerFormProps) {
  const form = useForm<CreateSellerFormData>({
    resolver: zodResolver(createSellerSchema),
    defaultValues: { name: "", email: "", password: "", companyName: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl><Input placeholder="John Doe" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="companyName" render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl><Input placeholder="Acme Corp" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="john@acme.com" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Password</FormLabel>
              <FormControl><Input type="password" placeholder="Min 8 characters" disabled={isLoading} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <Button type="submit" className="w-full md:w-auto bg-brand-orange hover:opacity-90" disabled={isLoading}>
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : "Create Seller"}
        </Button>
      </form>
    </Form>
  );
}
