import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/types";

export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Users query:", { data, error });
    if (error) throw error;

    return (data || []).map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role as User["role"],
      permissions: user.permissions as User["permissions"],
      isActive: user.is_active || true,
      createdAt: user.created_at || new Date().toISOString(),
      lastLogin: user.last_login || undefined,
    }));
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.full_name,
      role: data.role as User["role"],
      permissions: data.permissions as User["permissions"],
      isActive: data.is_active || true,
      createdAt: data.created_at || new Date().toISOString(),
      lastLogin: data.last_login || undefined,
    };
  },

  async create(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const tempId = globalThis.crypto.randomUUID();
    
    const { data, error } = await supabase
      .from("users")
      .insert({
        id: tempId,
        username: user.username,
        email: user.email,
        full_name: user.fullName,
        role: user.role as any,
        permissions: user.permissions as any,
        is_active: user.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.full_name,
      role: data.role as User["role"],
      permissions: data.permissions as User["permissions"],
      isActive: data.is_active || true,
      createdAt: data.created_at || new Date().toISOString(),
      lastLogin: data.last_login || undefined,
    };
  },

  async update(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User> {
    const updateData: any = {};
    if (updates.username) updateData.username = updates.username;
    if (updates.email) updateData.email = updates.email;
    if (updates.fullName) updateData.full_name = updates.fullName;
    if (updates.role) updateData.role = updates.role;
    if (updates.permissions) updateData.permissions = updates.permissions;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.full_name,
      role: data.role as User["role"],
      permissions: data.permissions as User["permissions"],
      isActive: data.is_active || true,
      createdAt: data.created_at || new Date().toISOString(),
      lastLogin: data.last_login || undefined,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};