-- Add RLS policies for CUSTOMERS table
CREATE POLICY "Users can view all customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Users can insert customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update customers" ON customers FOR UPDATE USING (true);
CREATE POLICY "Users can delete customers" ON customers FOR DELETE USING (true);

-- Add RLS policies for SUPPLIERS table
CREATE POLICY "Users can view all suppliers" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Users can insert suppliers" ON suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update suppliers" ON suppliers FOR UPDATE USING (true);
CREATE POLICY "Users can delete suppliers" ON suppliers FOR DELETE USING (true);

-- Add RLS policies for USERS table
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Users can delete users" ON users FOR DELETE USING (true);

-- Add RLS policies for CHART OF ACCOUNTS table
CREATE POLICY "Users can view all accounts" ON chart_of_accounts FOR SELECT USING (true);
CREATE POLICY "Users can insert accounts" ON chart_of_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update accounts" ON chart_of_accounts FOR UPDATE USING (true);
CREATE POLICY "Users can delete accounts" ON chart_of_accounts FOR DELETE USING (true);

-- Add RLS policies for SALES INVOICES table
CREATE POLICY "Users can view all sales invoices" ON sales_invoices FOR SELECT USING (true);
CREATE POLICY "Users can insert sales invoices" ON sales_invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update sales invoices" ON sales_invoices FOR UPDATE USING (true);
CREATE POLICY "Users can delete sales invoices" ON sales_invoices FOR DELETE USING (true);

-- Add RLS policies for SALES INVOICE ITEMS table
CREATE POLICY "Users can view all sales invoice items" ON sales_invoice_items FOR SELECT USING (true);
CREATE POLICY "Users can insert sales invoice items" ON sales_invoice_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update sales invoice items" ON sales_invoice_items FOR UPDATE USING (true);
CREATE POLICY "Users can delete sales invoice items" ON sales_invoice_items FOR DELETE USING (true);

-- Add RLS policies for PURCHASE INVOICES table
CREATE POLICY "Users can view all purchase invoices" ON purchase_invoices FOR SELECT USING (true);
CREATE POLICY "Users can insert purchase invoices" ON purchase_invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update purchase invoices" ON purchase_invoices FOR UPDATE USING (true);
CREATE POLICY "Users can delete purchase invoices" ON purchase_invoices FOR DELETE USING (true);

-- Add RLS policies for PURCHASE INVOICE ITEMS table
CREATE POLICY "Users can view all purchase invoice items" ON purchase_invoice_items FOR SELECT USING (true);
CREATE POLICY "Users can insert purchase invoice items" ON purchase_invoice_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update purchase invoice items" ON purchase_invoice_items FOR UPDATE USING (true);
CREATE POLICY "Users can delete purchase invoice items" ON purchase_invoice_items FOR DELETE USING (true);

-- Add RLS policies for SALES RETURNS table
CREATE POLICY "Users can view all sales returns" ON sales_returns FOR SELECT USING (true);
CREATE POLICY "Users can insert sales returns" ON sales_returns FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update sales returns" ON sales_returns FOR UPDATE USING (true);
CREATE POLICY "Users can delete sales returns" ON sales_returns FOR DELETE USING (true);

-- Add RLS policies for SALES RETURN ITEMS table
CREATE POLICY "Users can view all sales return items" ON sales_return_items FOR SELECT USING (true);
CREATE POLICY "Users can insert sales return items" ON sales_return_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update sales return items" ON sales_return_items FOR UPDATE USING (true);
CREATE POLICY "Users can delete sales return items" ON sales_return_items FOR DELETE USING (true);

-- Add RLS policies for PURCHASE RETURNS table
CREATE POLICY "Users can view all purchase returns" ON purchase_returns FOR SELECT USING (true);
CREATE POLICY "Users can insert purchase returns" ON purchase_returns FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update purchase returns" ON purchase_returns FOR UPDATE USING (true);
CREATE POLICY "Users can delete purchase returns" ON purchase_returns FOR DELETE USING (true);

-- Add RLS policies for PURCHASE RETURN ITEMS table
CREATE POLICY "Users can view all purchase return items" ON purchase_return_items FOR SELECT USING (true);
CREATE POLICY "Users can insert purchase return items" ON purchase_return_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update purchase return items" ON purchase_return_items FOR UPDATE USING (true);
CREATE POLICY "Users can delete purchase return items" ON purchase_return_items FOR DELETE USING (true);

-- Add RLS policies for JOURNAL ENTRIES table
CREATE POLICY "Users can view all journal entries" ON journal_entries FOR SELECT USING (true);
CREATE POLICY "Users can insert journal entries" ON journal_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update journal entries" ON journal_entries FOR UPDATE USING (true);
CREATE POLICY "Users can delete journal entries" ON journal_entries FOR DELETE USING (true);

-- Add RLS policies for JOURNAL ENTRY LINES table
CREATE POLICY "Users can view all journal entry lines" ON journal_entry_lines FOR SELECT USING (true);
CREATE POLICY "Users can insert journal entry lines" ON journal_entry_lines FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update journal entry lines" ON journal_entry_lines FOR UPDATE USING (true);
CREATE POLICY "Users can delete journal entry lines" ON journal_entry_lines FOR DELETE USING (true);

-- Add RLS policies for LEDGER ENTRIES table
CREATE POLICY "Users can view all ledger entries" ON ledger_entries FOR SELECT USING (true);
CREATE POLICY "Users can insert ledger entries" ON ledger_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update ledger entries" ON ledger_entries FOR UPDATE USING (true);
CREATE POLICY "Users can delete ledger entries" ON ledger_entries FOR DELETE USING (true);