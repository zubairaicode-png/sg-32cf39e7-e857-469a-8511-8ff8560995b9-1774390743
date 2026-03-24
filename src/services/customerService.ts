import { supabase } from "@/integrations/supabase/client";
import type { Customer } from "@/types";

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error fetching customers:", error);
      throw error;
    }

    return (data || []).map((customer) => ({
      id: customer.id,
      code: customer.customer_code,
      nameArabic: customer.name_arabic || "",
      nameEnglish: customer.name_english,
      vatNumber: customer.vat_number || undefined,
      commercialRegister: customer.commercial_registration || undefined,
      email: customer.email || undefined,
      phone: customer.phone || undefined,
      buildingNumber: customer.building_number || "",
      streetName: customer.street_name || "",
      district: customer.district || "",
      city: customer.city || "",
      postalCode: customer.postal_code || "",
      country: customer.country || "",
      creditLimit: Number(customer.credit_limit) || 0,
      paymentTerms: customer.payment_term || "net30",
      balance: Number(customer.current_balance) || 0,
      isActive: customer.is_active ?? true,
      createdAt: customer.created_at || new Date().toISOString(),
    }));
  },

  async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase Error fetching customer by ID:", error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      code: data.customer_code,
      nameArabic: data.name_arabic || "",
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
      creditLimit: Number(data.credit_limit) || 0,
      paymentTerms: data.payment_term || "net30",
      balance: Number(data.current_balance) || 0,
      isActive: data.is_active ?? true,
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  async create(customer: Omit<Customer, "id" | "createdAt" | "balance">): Promise<Customer> {
    // Get the auth user
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      throw new Error("User not authenticated. Please log in again.");
    }

    // Check if this auth user has a matching record in the users table
    // The customers.created_by FK references the users table, not auth.users
    const { data: dbUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", authUser.id)
      .maybeSingle();

    // If no matching users row exists, insert the user first
    if (!dbUser) {
      console.warn("No users table record found for auth user. Attempting to create one.");
      const { error: userInsertError } = await supabase.from("users").insert({
        id: authUser.id,
        username: authUser.email?.split("@")[0] || "user",
        email: authUser.email || "",
        full_name: authUser.user_metadata?.full_name || authUser.email || "User",
        role: "admin",
        permissions: [],
        is_active: true,
      });

      if (userInsertError) {
        console.error("Failed to create users record:", userInsertError);
        // Continue without created_by to avoid blocking customer creation
      }
    }

    // Re-check after potential insert
    const { data: resolvedUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", authUser.id)
      .maybeSingle();

    const insertData = {
      customer_code: customer.code,
      name_english: customer.nameEnglish,
      name_arabic: customer.nameArabic || null,
      vat_number: customer.vatNumber || null,
      commercial_registration: customer.commercialRegister || null,
      email: customer.email || null,
      phone: customer.phone || null,
      building_number: customer.buildingNumber || null,
      street_name: customer.streetName || null,
      district: customer.district || null,
      city: customer.city,
      postal_code: customer.postalCode || null,
      country: customer.country || "Saudi Arabia",
      credit_limit: customer.creditLimit ?? 0,
      payment_term: customer.paymentTerms as "cash" | "net15" | "net30" | "net60" | "net90",
      is_active: customer.isActive ?? true,
      // Only include created_by if we confirmed the user exists in the users table
      created_by: resolvedUser ? authUser.id : null,
    };

    console.log("Inserting customer data:", insertData);

    const { data, error } = await supabase
      .from("customers")
      .insert(insertData)
      .select()
      .single();

    console.log("Insert result:", { data, error });

    if (error) {
      console.error("Supabase Error creating customer:", error);
      throw new Error(error.message || "Failed to create customer");
    }

    return {
      id: data.id,
      code: data.customer_code,
      nameEnglish: data.name_english,
      nameArabic: data.name_arabic || "",
      vatNumber: data.vat_number || undefined,
      commercialRegister: data.commercial_registration || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      buildingNumber: data.building_number || "",
      streetName: data.street_name || "",
      district: data.district || "",
      city: data.city,
      postalCode: data.postal_code || "",
      country: data.country || "Saudi Arabia",
      creditLimit: Number(data.credit_limit) || 0,
      paymentTerms: data.payment_term || "net30",
      balance: Number(data.current_balance) || 0,
      isActive: data.is_active ?? true,
      createdAt: data.created_at,
    };
  },

  async update(
    id: string,
    updates: Partial<Omit<Customer, "id" | "createdAt" | "balance">>
  ): Promise<Customer> {
    const updateData: Record<string, unknown> = {};
    if (updates.code !== undefined) updateData.customer_code = updates.code;
    if (updates.nameArabic !== undefined) updateData.name_arabic = updates.nameArabic;
    if (updates.nameEnglish !== undefined) updateData.name_english = updates.nameEnglish;
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
    if (updates.creditLimit !== undefined) updateData.credit_limit = updates.creditLimit;
    if (updates.paymentTerms !== undefined)
      updateData.payment_term = updates.paymentTerms as "cash" | "net15" | "net30" | "net60" | "net90";
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase Error updating customer:", error);
      throw error;
    }

    return {
      id: data.id,
      code: data.customer_code,
      nameArabic: data.name_arabic || "",
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
      creditLimit: Number(data.credit_limit) || 0,
      paymentTerms: data.payment_term || "net30",
      balance: Number(data.current_balance) || 0,
      isActive: data.is_active ?? true,
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) {
      console.error("Supabase Error deleting customer:", error);
      throw error;
    }
  },
};