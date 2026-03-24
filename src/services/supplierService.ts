import { supabase } from "@/integrations/supabase/client";
import type { Supplier } from "@/types";

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error fetching suppliers:", error);
      throw error;
    }

    return (data || []).map(supplier => ({
      id: supplier.id,
      code: supplier.supplier_code,
      nameArabic: supplier.name_arabic,
      nameEnglish: supplier.name_english,
      vatNumber: supplier.vat_number || undefined,
      commercialRegister: supplier.commercial_registration || undefined,
      email: supplier.email || undefined,
      phone: supplier.phone || undefined,
      buildingNumber: supplier.building_number || "",
      streetName: supplier.street_name || "",
      district: supplier.district || "",
      city: supplier.city || "",
      postalCode: supplier.postal_code || "",
      country: supplier.country || "",
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

    if (error) {
      console.error("Supabase Error fetching supplier by ID:", error);
      throw error;
    }
    
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
      buildingNumber: data.building_number || "",
      streetName: data.street_name || "",
      district: data.district || "",
      city: data.city || "",
      postalCode: data.postal_code || "",
      country: data.country || "",
      paymentTerms: data.payment_term || "",
      balance: data.current_balance || 0,
      isActive: data.is_active || true,
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  async create(supplier: Omit<Supplier, "id" | "createdAt" | "balance">): Promise<Supplier> {
    const insertData = {
      supplier_code: supplier.code,
      name_arabic: supplier.nameArabic,
      name_english: supplier.nameEnglish,
      vat_number: supplier.vatNumber,
      commercial_registration: supplier.commercialRegister,
      email: supplier.email,
      phone: supplier.phone,
      building_number: supplier.buildingNumber,
      street_name: supplier.streetName,
      district: supplier.district,
      city: supplier.city,
      postal_code: supplier.postalCode,
      country: supplier.country,
      payment_term: supplier.paymentTerms as "cash" | "net15" | "net30" | "net60" | "net90",
      is_active: supplier.isActive,
    };

    console.log("Attempting to insert supplier into Supabase:", insertData);

    const { data, error } = await supabase
      .from("suppliers")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error creating supplier:", error);
      throw error;
    }

    return {
      id: data.id,
      code: data.supplier_code,
      nameArabic: data.name_arabic,
      nameEnglish: data.name_english,
      vatNumber: data.vat_number || undefined,
      commercialRegister: data.commercial_registration || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      buildingNumber: data.building_number || "",
      streetName: data.street_name || "",
      district: data.district || "",
      city: data.city || "",
      postalCode: data.postal_code || "",
      country: data.country || "",
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
    if (updates.vatNumber !== undefined) updateData.vat_number = updates.vatNumber;
    if (updates.commercialRegister !== undefined) updateData.commercial_registration = updates.commercialRegister;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.buildingNumber !== undefined) updateData.building_number = updates.buildingNumber;
    if (updates.streetName !== undefined) updateData.street_name = updates.streetName;
    if (updates.district !== undefined) updateData.district = updates.district;
    if (updates.city !== undefined) updateData.city = updates.city;
    if (updates.postalCode !== undefined) updateData.postal_code = updates.postalCode;
    if (updates.country !== undefined) updateData.country = updates.country;
    if (updates.paymentTerms !== undefined) updateData.payment_term = updates.paymentTerms as "cash" | "net15" | "net30" | "net60" | "net90";
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabase
      .from("suppliers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error updating supplier:", error);
      throw error;
    }

    return {
      id: data.id,
      code: data.supplier_code,
      nameArabic: data.name_arabic,
      nameEnglish: data.name_english,
      vatNumber: data.vat_number || undefined,
      commercialRegister: data.commercial_registration || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      buildingNumber: data.building_number || "",
      streetName: data.street_name || "",
      district: data.district || "",
      city: data.city || "",
      postalCode: data.postal_code || "",
      country: data.country || "",
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

    if (error) {
      console.error("Supabase Error deleting supplier:", error);
      throw error;
    }
  },
};