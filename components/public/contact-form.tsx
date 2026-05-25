"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(100),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(1, "Nomor HP harus diisi").max(20),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(2000),
});

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      const fieldErrors: Record<string, string> = {};
      Object.entries(flattened.fieldErrors).forEach(([field, messages]) => {
        if (messages && messages[0]) {
          fieldErrors[field] = messages[0];
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Terjadi kesalahan saat mengirim pesan.");
        return;
      }

      toast.success("Pesan terkirim! Tim kami akan menghubungi Anda segera.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Terjadi kesalahan. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Nama Lengkap"
        name="name"
        type="text"
        placeholder="Masukkan nama Anda"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        disabled={isLoading}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="email@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isLoading}
      />

      <Input
        label="Nomor HP"
        name="phone"
        type="tel"
        placeholder="+62 812 3456 7890"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        disabled={isLoading}
      />

      <Textarea
        label="Pesan"
        name="message"
        placeholder="Tulis pesan Anda di sini..."
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        disabled={isLoading}
      />

      <Button
        variant="gold-filled"
        type="submit"
        className="w-full text-lg py-3"
        disabled={isLoading}
      >
        {isLoading ? "Mengirim..." : "Kirim Pesan"}
      </Button>

      <p className="text-xs text-gray-600 text-center">
        Kami akan merespons pesan Anda dalam 24 jam.
      </p>
    </form>
  );
}
