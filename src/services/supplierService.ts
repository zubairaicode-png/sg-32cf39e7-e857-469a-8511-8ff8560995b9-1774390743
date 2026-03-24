import { supabase } from "@/integrations/supabase/client";
import type { Supplier } from "@/types";

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Suppliers query:", { data, error });
    if (error) throw error;

    return (data || []).map(supplier => ({
      id: supplier.id,
      code: supplier.supplier_code,
      nameArabic: supplier.name_arabic,
      nameEnglish: supplier.name_english,
      vatNumber: supplier.vat_number || undefined,
      commercialRegister: supplier.commercial_registration || undefined,
      email: supplier.email || undefined,
      phone: supplier.phone || undefined,
      mobile: supplier.mobile_number || undefined,
      buildingNumber: supplier.building_number || "",
      streetName: supplier.street_name || "",
      district: supplier.district || "",
      city: supplier.city || "",
      postalCode: supplier.postal_code || "",
      country: supplier.country || "",
      creditLimit: supplier.credit_limit || 0,
      paymentTerms: supplier.payment_term || "",
      balance: supplier.current_balance || 0,
      isActive: supplier.is_active || true,
      createdAt: supplier.created_at || new Date().toISOString(),
    }));
  },

  async getById(id: string): Promise<Supplier | null> {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      code: data.supplier_code,
      nameArabic: data.name_arabic,
      nameEnglish: data.name_english,
      vatNumber: data.vat_number || undefined,
      commercialRegister: data.commercial_registration || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      mobile: data.mobile_number || undefined,
      buildingNumber: data.building_number || "",
      streetName: data.street_name || "",
      district: data.district || "",
      city: data.city || "",
      postalCode: data.postal_code || "",
      country: data.country || "",
      creditLimit: data.credit_limit || 0,
      paymentTerms: data.payment_term || "",
      balance: data.current_balance || 0,
      isActive: data.is_active || true,
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  async create(supplier: Omit<Supplier, "id" | "createdAt" | "balance">): Promise<Supplier> {
    const { data, error } = await supabase
      .from("suppliers")
      .insert({
        supplier_code: supplier.code,
        name_arabic: supplier.nameArabic,
        name_english: supplier.nameEnglish,
        vat_number: supplier.vatNumber,
        commercial_registration: supplier.commercialRegister,
        email: supplier.email,
        phone: supplier.phone,
        mobile_number: supplier.mobile,
        building_number: supplier.buildingNumber,
        street_name: supplier.streetName,
        district: supplier.district,
        city: supplier.city,
        postal_code: supplier.postalCode,
        country: supplier.country,
        credit_limit: supplier.creditLimit,
        payment_term: supplier.paymentTerms,
        is_active: supplier.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      code: data.supplier_code,
      nameArabic: data.name_arabic,
      nameEnglish: data.name_english,
      vatNumber: data.vat_number || undefined,
      commercialRegister: data.commercial_registration || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      mobile: data.mobile_number || undefined,
      buildingNumber: data.building_number || "",
      streetName: data.street_name || "",
      district: data.district || "",
      city: data.city || "",
      postalCode: data.postal_code || "",
      country: data.country || "",
      creditLimit: data.credit_limit || 0,
      paymentTerms: data.payment_term || "",
      balance: data.current_balance || 0,
      isActive: data.is_active || true,
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  async update(id: string, updates: Partial<Omit<Supplier, "id" | "createdAt" | "balance">>): Promise<Supplier> {
    const updateData: any = {};
    if (updates.code) updateData.supplier_code = updates.code;
    if (updates.nameArabic) updateData.name_arabic = updates.nameArabic;
    if (updates.nameEnglish) updateData.name_english = updates.nameEnglish;
    if (updates.vatNumber) updateData.vat_number = updates.vatNumber;
    if (updates.commercialRegister) updateData.commercial_registration = updates.commercialRegister;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.mobile) updateData.mobile_number = updates.mobile;
    if (updates.buildingNumber) updateData.building_number = updates.buildingNumber;
    if (updates.streetName) updateData.street_name = updates.streetName;
    if (updates.district) updateData.district = updates.district;
    if (updates.city) updateData.city = updates.city;
    if (updates.postalCode) updateData.postal_code = updates.postalCode;
    if (updates.country) updateData.country = updates.country;
    if (updates.creditLimit !== undefined) updateData.credit_limit = updates.creditLimit;
    if (updates.paymentTerms) updateData.payment_term = updates.paymentTerms;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabase
      .from("suppliers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      code: data.supplier_code,
      nameArabic: data.name_arabic,
      nameEnglish: data.name_english,
      vatNumber: data.vat_number || undefined,
      commercialRegister: data.commercial_registration || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      mobile: data.mobile_number || undefined,
      buildingNumber: data.building_number || "",
      streetName: data.street_name || "",
      district: data.district || "",
      city: data.city || "",
      postalCode: data.postal_code || "",
      country: data.country || "",
      creditLimit: data.credit_limit || 0,
      paymentTerms: data.payment_term || "",
      balance: data.current_balance || 0,
      isActive: data.is_active || true,
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("suppliers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};