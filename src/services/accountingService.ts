import { supabase } from "@/integrations/supabase/client";
import type { ChartOfAccount, JournalEntry, JournalLine } from "@/types";

export const accountingService = {
  // Chart of Accounts
  async getAllAccounts(): Promise<ChartOfAccount[]> {
    const { data, error } = await supabase
      .from("chart_of_accounts")
      .select("*")
      .order("account_code", { ascending: true });

    if (error) throw error;

    return (data || []).map(account => ({
      id: account.id,
      code: account.account_code,
      nameArabic: account.account_name,
      nameEnglish: account.account_name,
      type: account.account_type as ChartOfAccount["type"],
      parentId: account.parent_account_id || undefined,
      isActive: account.is_active || true,
      balance: 0, 
      createdAt: account.created_at || new Date().toISOString(),
    }));
  },

  async createAccount(account: Omit<ChartOfAccount, "id" | "createdAt" | "balance">): Promise<ChartOfAccount> {
    const { data, error } = await supabase
      .from("chart_of_accounts")
      .insert({
        account_code: account.code,
        account_name: account.nameEnglish,
        account_type: account.type as any,
        parent_account_id: account.parentId,
        is_active: account.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      code: data.account_code,
      nameArabic: data.account_name,
      nameEnglish: data.account_name,
      type: data.account_type as ChartOfAccount["type"],
      parentId: data.parent_account_id || undefined,
      isActive: data.is_active || true,
      balance: 0,
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  // Journal Entries
  async getAllJournalEntries(): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from("journal_entries")
      .select(`
        *,
        lines:journal_entry_lines(
          *,
          account:chart_of_accounts(id, account_code, account_name)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(entry => ({
      id: entry.id,
      entryNumber: entry.entry_number,
      date: entry.entry_date,
      description: entry.description || "",
      status: "posted" as JournalEntry["status"], 
      totalDebit: entry.total_debit,
      totalCredit: entry.total_credit,
      createdAt: entry.created_at || new Date().toISOString(),
      lines: Array.isArray(entry.lines) ? entry.lines.map((line: any) => ({
        id: line.id,
        accountId: line.account_id,
        account: line.account ? {
          id: line.account.id,
          code: line.account.account_code,
          nameEnglish: line.account.account_name,
          nameArabic: line.account.account_name,
        } : undefined,
        description: line.description || "",
        debit: line.debit || 0,
        credit: line.credit || 0,
      })) : [],
    }));
  },

  async createJournalEntry(entry: Omit<JournalEntry, "id" | "createdAt">, lines: Omit<JournalLine, "id" | "account">[]): Promise<JournalEntry> {
    const { data: entryData, error: entryError } = await supabase
      .from("journal_entries")
      .insert({
        entry_number: entry.entryNumber,
        entry_date: entry.date,
        description: entry.description,
        total_debit: entry.totalDebit,
        total_credit: entry.totalCredit,
        is_balanced: entry.totalDebit === entry.totalCredit,
      })
      .select()
      .single();

    if (entryError) throw entryError;

    // Fetch account details for lines
    const accountIds = lines.map(l => l.accountId);
    const { data: accounts } = await supabase
      .from("chart_of_accounts")
      .select("id, account_code, account_name")
      .in("id", accountIds);

    const linesToInsert = lines.map(line => {
      const acc = accounts?.find(a => a.id === line.accountId);
      return {
        entry_id: entryData.id,
        account_id: line.accountId,
        account_code: acc?.account_code || "",
        account_name: acc?.account_name || "",
        description: line.description,
        debit: line.debit,
        credit: line.credit,
      };
    });

    const { error: linesError } = await supabase
      .from("journal_entry_lines")
      .insert(linesToInsert);

    if (linesError) throw linesError;

    const { data: completeEntry, error: fetchError } = await supabase
      .from("journal_entries")
      .select(`
        *,
        lines:journal_entry_lines(
          *,
          account:chart_of_accounts(id, account_code, account_name)
        )
      `)
      .eq("id", entryData.id)
      .single();

    if (fetchError) throw fetchError;

    return {
      id: completeEntry.id,
      entryNumber: completeEntry.entry_number,
      date: completeEntry.entry_date,
      description: completeEntry.description || "",
      status: "posted" as JournalEntry["status"],
      totalDebit: completeEntry.total_debit,
      totalCredit: completeEntry.total_credit,
      createdAt: completeEntry.created_at || new Date().toISOString(),
      lines: Array.isArray(completeEntry.lines) ? completeEntry.lines.map((line: any) => ({
        id: line.id,
        accountId: line.account_id,
        account: line.account ? {
          id: line.account.id,
          code: line.account.account_code,
          nameEnglish: line.account.account_name,
          nameArabic: line.account.account_name,
        } : undefined,
        description: line.description || "",
        debit: line.debit || 0,
        credit: line.credit || 0,
      })) : [],
    };
  },

  async deleteJournalEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};