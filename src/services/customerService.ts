import { supabase } from "@/integrations/supabase/client";
import type { Customer } from "@/types";

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Customers query:", { data, error });
    if (error) throw error;

    return (data || []).map(customer => ({
      id: customer.id,
      code: customer.code,
      nameArabic: customer.name_arabic,
      nameEnglish: customer.name_english,
      vatNumber: customer.vat_number || undefined,
      commercialRegister: customer.commercial_register || undefined,
      email: customer.email || undefined,
      phone: customer.phone || undefined,
      mobile: customer.mobile || undefined,
      buildingNumber: customer.building_number,
      streetName: customer.street_name,
      district: customer.district,
      city: customer.city,
      postalCode: customer.postal_code,
      country: customer.country,
      creditLimit: customer.credit_limit,
      paymentTerms: customer.payment_terms,
      balance: customer.balance,
      isActive: customer.is_active,
      createdAt: customer.created_at,
    }));
  },

  async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      code: data.code,
      nameArabic: data.name_arabic,
      nameEnglish: data.name_english,
      vatNumber: data.vat_number || undefined,
      commercialRegister: data.commercial_register || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      mobile: data.mobile || undefined,
      buildingNumber: data.building_number,
      streetName: data.street_name,
      district: data.district,
      city: data.city,
      postalCode: data.postal_code,
      country: data.country,
      creditLimit: data.credit_limit,
      paymentTerms: data.payment_terms,
      balance: data.balance,
      isActive: data.is_active,
      createdAt: data.created_at,
    };
  },

  async create(customer: Omit<Customer, "id" | "createdAt" | "balance">): Promise<Customer> {
    const { data, error } = await supabase
      .from("customers")
      .insert({
        code: customer.code,
        name_arabic: customer.nameArabic,
        name_english: customer.nameEnglish,
        vat_number: customer.vatNumber,
        commercial_register: customer.commercialRegister,
        email: customer.email,
        phone: customer.phone,
        mobile: customer.mobile,
        building_number: customer.buildingNumber,
        street_name: customer.streetName,
        district: customer.district,
        city: customer.city,
        postal_code: customer.postalCode,
        country: customer.country,
        credit_limit: customer.creditLimit,
        payment_terms: customer.paymentTerms,
        is_active: customer.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      code: data.code,
      nameArabic: data.name_arabic,
      nameEnglish: data.name_english,
      vatNumber: data.vat_number || undefined,
      commercialRegister: data.commercial_register || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      mobile: data.mobile || undefined,
      buildingNumber: data.building_number,
      streetName: data.street_name,
      district: data.district,
      city: data.city,
      postalCode: data.postal_code,
      country: data.country,
      creditLimit: data.credit_limit,
      paymentTerms: data.payment_terms,
      balance: data.balance,
      isActive: data.is_active,
      createdAt: data.created_at,
    };
  },

  async update(id: string, updates: Partial<Omit<Customer, "id" | "createdAt" | "balance">>): Promise<Customer> {
    const updateData: any = {};
    if (updates.code) updateData.code = updates.code;
    if (updates.nameArabic) updateData.name_arabic = updates.nameArabic;
    if (updates.nameEnglish) updateData.name_english = updates.nameEnglish;
    if (updates.vatNumber) updateData.vat_number = updates.vatNumber;
    if (updates.commercialRegister) updateData.commercial_register = updates.commercialRegister;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.mobile) updateData.mobile = updates.mobile;
    if (updates.buildingNumber) updateData.building_number = updates.buildingNumber;
    if (updates.streetName) updateData.street_name = updates.streetName;
    if (updates.district) updateData.district = updates.district;
    if (updates.city) updateData.city = updates.city;
    if (updates.postalCode) updateData.postal_code = updates.postalCode;
    if (updates.country) updateData.country = updates.country;
    if (updates.creditLimit !== undefined) updateData.credit_limit = updates.creditLimit;
    if (updates.paymentTerms) updateData.payment_terms = updates.paymentTerms;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      code: data.code,
      nameArabic: data.name_arabic,
      nameEnglish: data.name_english,
      vatNumber: data.vat_number || undefined,
      commercialRegister: data.commercial_register || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      mobile: data.mobile || undefined,
      buildingNumber: data.building_number,
      streetName: data.street_name,
      district: data.district,
      city: data.city,
      postalCode: data.postal_code,
      country: data.country,
      creditLimit: data.credit_limit,
      paymentTerms: data.payment_terms,
      balance: data.balance,
      isActive: data.is_active,
      createdAt: data.created_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};