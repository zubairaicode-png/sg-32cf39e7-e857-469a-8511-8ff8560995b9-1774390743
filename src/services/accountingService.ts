import { supabase } from "@/integrations/supabase/client";
import type { ChartOfAccount, JournalEntry, JournalLine } from "@/types";

export const accountingService = {
  // Chart of Accounts
  async getAllAccounts(): Promise<ChartOfAccount[]> {
    const { data, error } = await supabase
      .from("chart_of_accounts")
      .select("*")
      .order("code", { ascending: true });

    console.log("Accounts query:", { data, error });
    if (error) throw error;

    return (data || []).map(account => ({
      id: account.id,
      code: account.code,
      nameArabic: account.name_arabic,
      nameEnglish: account.name_english,
      type: account.type as ChartOfAccount["type"],
      parentId: account.parent_id || undefined,
      isActive: account.is_active,
      balance: account.balance,
      createdAt: account.created_at,
    }));
  },

  async createAccount(account: Omit<ChartOfAccount, "id" | "createdAt" | "balance">): Promise<ChartOfAccount> {
    const { data, error } = await supabase
      .from("chart_of_accounts")
      .insert({
        code: account.code,
        name_arabic: account.nameArabic,
        name_english: account.nameEnglish,
        type: account.type,
        parent_id: account.parentId,
        is_active: account.isActive,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      code: data.code,
      nameArabic: data.name_arabic,
      nameEnglish: data.name_english,
      type: data.type as ChartOfAccount["type"],
      parentId: data.parent_id || undefined,
      isActive: data.is_active,
      balance: data.balance,
      createdAt: data.created_at,
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
          account:chart_of_accounts(code, name_english, name_arabic)
        )
      `)
      .order("created_at", { ascending: false });

    console.log("Journal entries query:", { data, error });
    if (error) throw error;

    return (data || []).map(entry => ({
      id: entry.id,
      entryNumber: entry.entry_number,
      date: entry.date,
      description: entry.description,
      status: entry.status as JournalEntry["status"],
      totalDebit: entry.total_debit,
      totalCredit: entry.total_credit,
      lines: Array.isArray(entry.lines) ? entry.lines.map((line: any) => ({
        id: line.id,
        accountId: line.account_id,
        account: line.account ? {
          id: line.account_id,
          code: line.account.code,
          nameEnglish: line.account.name_english,
          nameArabic: line.account.name_arabic,
        } : undefined,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
      })) : [],
      createdAt: entry.created_at,
    }));
  },

  async createJournalEntry(entry: Omit<JournalEntry, "id" | "createdAt">, lines: Omit<JournalLine, "id" | "account">[]): Promise<JournalEntry> {
    // Insert journal entry
    const { data: entryData, error: entryError } = await supabase
      .from("journal_entries")
      .insert({
        entry_number: entry.entryNumber,
        date: entry.date,
        description: entry.description,
        status: entry.status,
        total_debit: entry.totalDebit,
        total_credit: entry.totalCredit,
      })
      .select()
      .single();

    if (entryError) throw entryError;

    // Insert lines
    const linesToInsert = lines.map(line => ({
      entry_id: entryData.id,
      account_id: line.accountId,
      description: line.description,
      debit: line.debit,
      credit: line.credit,
    }));

    const { error: linesError } = await supabase
      .from("journal_entry_lines")
      .insert(linesToInsert);

    if (linesError) throw linesError;

    // Fetch complete entry with lines
    const { data: completeEntry, error: fetchError } = await supabase
      .from("journal_entries")
      .select(`
        *,
        lines:journal_entry_lines(
          *,
          account:chart_of_accounts(code, name_english, name_arabic)
        )
      `)
      .eq("id", entryData.id)
      .single();

    if (fetchError) throw fetchError;

    return {
      id: completeEntry.id,
      entryNumber: completeEntry.entry_number,
      date: completeEntry.date,
      description: completeEntry.description,
      status: completeEntry.status as JournalEntry["status"],
      totalDebit: completeEntry.total_debit,
      totalCredit: completeEntry.total_credit,
      lines: Array.isArray(completeEntry.lines) ? completeEntry.lines.map((line: any) => ({
        id: line.id,
        accountId: line.account_id,
        account: line.account ? {
          id: line.account_id,
          code: line.account.code,
          nameEnglish: line.account.name_english,
          nameArabic: line.account.name_arabic,
        } : undefined,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
      })) : [],
      createdAt: completeEntry.created_at,
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