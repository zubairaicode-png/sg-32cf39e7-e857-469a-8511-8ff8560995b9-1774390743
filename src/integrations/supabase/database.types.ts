/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      chart_of_accounts: {
        Row: {
          account_code: string
          account_name: string
          account_type: Database["public"]["Enums"]["account_type"]
          created_at: string | null
          id: string
          is_active: boolean | null
          parent_account_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_code: string
          account_name: string
          account_type: Database["public"]["Enums"]["account_type"]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parent_account_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_code?: string
          account_name?: string
          account_type?: Database["public"]["Enums"]["account_type"]
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parent_account_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          building_number: string | null
          city: string
          commercial_registration: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          current_balance: number | null
          customer_code: string
          district: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name_arabic: string | null
          name_english: string
          opening_balance: number | null
          payment_term: Database["public"]["Enums"]["payment_term"] | null
          phone: string | null
          postal_code: string | null
          street_name: string | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          building_number?: string | null
          city: string
          commercial_registration?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          current_balance?: number | null
          customer_code: string
          district?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name_arabic?: string | null
          name_english: string
          opening_balance?: number | null
          payment_term?: Database["public"]["Enums"]["payment_term"] | null
          phone?: string | null
          postal_code?: string | null
          street_name?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          building_number?: string | null
          city?: string
          commercial_registration?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          current_balance?: number | null
          customer_code?: string
          district?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name_arabic?: string | null
          name_english?: string
          opening_balance?: number | null
          payment_term?: Database["public"]["Enums"]["payment_term"] | null
          phone?: string | null
          postal_code?: string | null
          street_name?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          entry_date: string
          entry_number: string
          id: string
          is_balanced: boolean | null
          reference_number: string | null
          total_credit: number
          total_debit: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_date: string
          entry_number: string
          id?: string
          is_balanced?: boolean | null
          reference_number?: string | null
          total_credit?: number
          total_debit?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_date?: string
          entry_number?: string
          id?: string
          is_balanced?: boolean | null
          reference_number?: string | null
          total_credit?: number
          total_debit?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      journal_entry_lines: {
        Row: {
          account_code: string
          account_id: string
          account_name: string
          created_at: string | null
          credit: number | null
          debit: number | null
          description: string | null
          entry_id: string
          id: string
        }
        Insert: {
          account_code: string
          account_id: string
          account_name: string
          created_at?: string | null
          credit?: number | null
          debit?: number | null
          description?: string | null
          entry_id: string
          id?: string
        }
        Update: {
          account_code?: string
          account_id?: string
          account_name?: string
          created_at?: string | null
          credit?: number | null
          debit?: number | null
          description?: string | null
          entry_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entry_lines_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_entries: {
        Row: {
          account_id: string | null
          balance: number | null
          created_at: string | null
          credit: number | null
          customer_id: string | null
          debit: number | null
          description: string
          entry_date: string
          id: string
          reference_id: string
          reference_number: string
          supplier_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          account_id?: string | null
          balance?: number | null
          created_at?: string | null
          credit?: number | null
          customer_id?: string | null
          debit?: number | null
          description: string
          entry_date: string
          id?: string
          reference_id: string
          reference_number: string
          supplier_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          account_id?: string | null
          balance?: number | null
          created_at?: string | null
          credit?: number | null
          customer_id?: string | null
          debit?: number | null
          description?: string
          entry_date?: string
          id?: string
          reference_id?: string
          reference_number?: string
          supplier_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_invoice_items: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string
          item_description: string
          quantity: number
          total: number
          unit_price: number
          vat_amount: number
          vat_rate: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id: string
          item_description: string
          quantity: number
          total: number
          unit_price: number
          vat_amount: number
          vat_rate?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string
          item_description?: string
          quantity?: number
          total?: number
          unit_price?: number
          vat_amount?: number
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "purchase_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_invoices: {
        Row: {
          created_at: string | null
          created_by: string | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          supplier_id: string
          supplier_name: string
          supplier_vat: string | null
          total_amount: number
          updated_at: string | null
          vat_amount: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_date: string
          invoice_number: string
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          supplier_id: string
          supplier_name: string
          supplier_vat?: string | null
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          supplier_id?: string
          supplier_name?: string
          supplier_vat?: string | null
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_return_items: {
        Row: {
          created_at: string | null
          id: string
          item_description: string
          quantity: number
          return_id: string
          total: number
          unit_price: number
          vat_amount: number
          vat_rate: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_description: string
          quantity: number
          return_id: string
          total: number
          unit_price: number
          vat_amount: number
          vat_rate?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_description?: string
          quantity?: number
          return_id?: string
          total?: number
          unit_price?: number
          vat_amount?: number
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "purchase_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_returns: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          original_invoice_id: string | null
          original_invoice_number: string | null
          reason: string | null
          return_date: string
          return_number: string
          subtotal: number
          supplier_id: string
          supplier_name: string
          total_amount: number
          vat_amount: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          original_invoice_id?: string | null
          original_invoice_number?: string | null
          reason?: string | null
          return_date: string
          return_number: string
          subtotal?: number
          supplier_id: string
          supplier_name: string
          total_amount?: number
          vat_amount?: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          original_invoice_id?: string | null
          original_invoice_number?: string | null
          reason?: string | null
          return_date?: string
          return_number?: string
          subtotal?: number
          supplier_id?: string
          supplier_name?: string
          total_amount?: number
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_returns_original_invoice_id_fkey"
            columns: ["original_invoice_id"]
            isOneToOne: false
            referencedRelation: "purchase_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_returns_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_invoice_items: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string
          item_description: string
          quantity: number
          total: number
          unit_price: number
          vat_amount: number
          vat_rate: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id: string
          item_description: string
          quantity: number
          total: number
          unit_price: number
          vat_amount: number
          vat_rate?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string
          item_description?: string
          quantity?: number
          total?: number
          unit_price?: number
          vat_amount?: number
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_invoices: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string
          customer_name: string
          customer_vat: string | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          invoice_type: Database["public"]["Enums"]["invoice_type"]
          notes: string | null
          qr_code: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          subtotal: number
          total_amount: number
          updated_at: string | null
          vat_amount: number
          zatca_hash: string | null
          zatca_uuid: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          customer_name: string
          customer_vat?: string | null
          due_date?: string | null
          id?: string
          invoice_date: string
          invoice_number: string
          invoice_type?: Database["public"]["Enums"]["invoice_type"]
          notes?: string | null
          qr_code?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
          zatca_hash?: string | null
          zatca_uuid?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          customer_name?: string
          customer_vat?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          invoice_type?: Database["public"]["Enums"]["invoice_type"]
          notes?: string | null
          qr_code?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
          zatca_hash?: string | null
          zatca_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_return_items: {
        Row: {
          created_at: string | null
          id: string
          item_description: string
          quantity: number
          return_id: string
          total: number
          unit_price: number
          vat_amount: number
          vat_rate: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_description: string
          quantity: number
          return_id: string
          total: number
          unit_price: number
          vat_amount: number
          vat_rate?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_description?: string
          quantity?: number
          return_id?: string
          total?: number
          unit_price?: number
          vat_amount?: number
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "sales_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_returns: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string
          customer_name: string
          id: string
          notes: string | null
          original_invoice_id: string | null
          original_invoice_number: string | null
          reason: string | null
          return_date: string
          return_number: string
          subtotal: number
          total_amount: number
          vat_amount: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          customer_name: string
          id?: string
          notes?: string | null
          original_invoice_id?: string | null
          original_invoice_number?: string | null
          reason?: string | null
          return_date: string
          return_number: string
          subtotal?: number
          total_amount?: number
          vat_amount?: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          customer_name?: string
          id?: string
          notes?: string | null
          original_invoice_id?: string | null
          original_invoice_number?: string | null
          reason?: string | null
          return_date?: string
          return_number?: string
          subtotal?: number
          total_amount?: number
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_returns_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_returns_original_invoice_id_fkey"
            columns: ["original_invoice_id"]
            isOneToOne: false
            referencedRelation: "sales_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          building_number: string | null
          city: string
          commercial_registration: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          current_balance: number | null
          district: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name_arabic: string | null
          name_english: string
          opening_balance: number | null
          payment_term: Database["public"]["Enums"]["payment_term"] | null
          phone: string | null
          postal_code: string | null
          street_name: string | null
          supplier_code: string
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          building_number?: string | null
          city: string
          commercial_registration?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          current_balance?: number | null
          district?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name_arabic?: string | null
          name_english: string
          opening_balance?: number | null
          payment_term?: Database["public"]["Enums"]["payment_term"] | null
          phone?: string | null
          postal_code?: string | null
          street_name?: string | null
          supplier_code: string
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          building_number?: string | null
          city?: string
          commercial_registration?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          current_balance?: number | null
          district?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name_arabic?: string | null
          name_english?: string
          opening_balance?: number | null
          payment_term?: Database["public"]["Enums"]["payment_term"] | null
          phone?: string | null
          postal_code?: string | null
          street_name?: string | null
          supplier_code?: string
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login: string | null
          permissions: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          last_login?: string | null
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          permissions?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: "asset" | "liability" | "equity" | "revenue" | "expense"
      invoice_status: "draft" | "issued" | "paid" | "cancelled"
      invoice_type: "standard" | "simplified"
      payment_term: "cash" | "net15" | "net30" | "net60" | "net90"
      transaction_type: "sale" | "purchase" | "receipt" | "payment" | "journal"
      user_role: "admin" | "accountant" | "sales" | "purchase" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["asset", "liability", "equity", "revenue", "expense"],
      invoice_status: ["draft", "issued", "paid", "cancelled"],
      invoice_type: ["standard", "simplified"],
      payment_term: ["cash", "net15", "net30", "net60", "net90"],
      transaction_type: ["sale", "purchase", "receipt", "payment", "journal"],
      user_role: ["admin", "accountant", "sales", "purchase", "viewer"],
    },
  },
} as const
