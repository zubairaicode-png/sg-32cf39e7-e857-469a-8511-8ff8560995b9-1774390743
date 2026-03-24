export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = "admin" | "accountant" | "sales" | "purchase" | "viewer";

export type Permission = 
  | "manage_users"
  | "view_customers"
  | "manage_customers"
  | "view_suppliers"
  | "manage_suppliers"
  | "create_sales_invoice"
  | "view_sales"
  | "create_purchase_invoice"
  | "view_purchases"
  | "manage_accounting"
  | "view_reports";

export interface Customer {
  id: string;
  code: string;
  nameArabic: string;
  nameEnglish: string;
  vatNumber?: string;
  commercialRegister?: string;
  email?: string;
  phone?: string;
  buildingNumber: string;
  streetName: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
  creditLimit: number;
  paymentTerms: "cash" | "net15" | "net30" | "net60" | "net90" | string;
  balance: number;
  isActive: boolean;
  createdAt: string;
}

export interface Supplier {
  id: string;
  code: string;
  nameArabic: string;
  nameEnglish: string;
  vatNumber?: string;
  commercialRegister?: string;
  email?: string;
  phone?: string;
  buildingNumber: string;
  streetName: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
  paymentTerms: "cash" | "net15" | "net30" | "net60" | "net90" | string;
  balance: number;
  isActive: boolean;
  createdAt: string;
}

export interface ChartOfAccount {
  id: string;
  code: string;
  nameArabic: string;
  nameEnglish: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  parentId?: string;
  isActive: boolean;
  balance: number;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  status: "draft" | "posted";
  totalDebit: number;
  totalCredit: number;
  lines: JournalLine[];
  createdAt: string;
}

export interface JournalLine {
  id: string;
  accountId: string;
  account?: {
    id: string;
    code: string;
    nameEnglish: string;
    nameArabic: string;
  };
  description: string;
  debit: number;
  credit: number;
}

export interface InvoiceItem {
  id: string;
  itemName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export type SalesInvoiceItem = InvoiceItem;
export type PurchaseInvoiceItem = InvoiceItem;

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  invoiceType: "standard" | "simplified";
  customerId: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  status: "draft" | "issued" | "paid" | "cancelled";
  zatcaUUID?: string;
  zatcaHash?: string;
  qrCode?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  status: "draft" | "issued" | "paid" | "cancelled";
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface Account {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: "asset" | "liability" | "equity" | "revenue" | "expense";
  parentAccountId?: string;
  isActive: boolean;
  balance: number;
  debitBalance: number;
  creditBalance: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  referenceType: string;
  referenceNumber: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}