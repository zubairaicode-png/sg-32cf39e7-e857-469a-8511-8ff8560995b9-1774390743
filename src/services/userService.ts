import { supabase } from "@/integrations/supabase/client";
import type { User } from "@/types";
import { crypto } from "crypto";

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
      isActive: user.is_active,
      createdAt: user.created_at,
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
      isActive: data.is_active,
      createdAt: data.created_at,
      lastLogin: data.last_login || undefined,
    };
  },

  async create(user: Omit<User, "id" | "createdAt">): Promise<User> {
    // Generate UUID if we need it for users table not handled by auth
    const tempId = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from("users")
      .insert({
        id: tempId,
        username: user.username,
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        permissions: user.permissions,
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
      isActive: data.is_active,
      createdAt: data.created_at,
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
      isActive: data.is_active,
      createdAt: data.created_at,
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