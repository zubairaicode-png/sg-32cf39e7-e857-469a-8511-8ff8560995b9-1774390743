ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_created_by_fkey;
ALTER TABLE suppliers DROP CONSTRAINT IF EXISTS suppliers_created_by_fkey;
ALTER TABLE sales_invoices DROP CONSTRAINT IF EXISTS sales_invoices_created_by_fkey;
ALTER TABLE purchase_invoices DROP CONSTRAINT IF EXISTS purchase_invoices_created_by_fkey;
ALTER TABLE sales_returns DROP CONSTRAINT IF EXISTS sales_returns_created_by_fkey;
ALTER TABLE purchase_returns DROP CONSTRAINT IF EXISTS purchase_returns_created_by_fkey;
ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS journal_entries_created_by_fkey;