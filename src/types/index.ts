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

export enum UserRole {
  ADMIN = "admin",
  ACCOUNTANT = "accountant",
  SALES_MANAGER = "sales_manager",
  PURCHASE_MANAGER = "purchase_manager",
  VIEWER = "viewer",
}

export enum Permission {
  MANAGE_USERS = "manage_users",
  VIEW_CUSTOMERS = "view_customers",
  MANAGE_CUSTOMERS = "manage_customers",
  VIEW_SUPPLIERS = "view_suppliers",
  MANAGE_SUPPLIERS = "manage_suppliers",
  CREATE_SALES_INVOICE = "create_sales_invoice",
  VIEW_SALES = "view_sales",
  CREATE_PURCHASE_INVOICE = "create_purchase_invoice",
  VIEW_PURCHASES = "view_purchases",
  MANAGE_ACCOUNTING = "manage_accounting",
  VIEW_REPORTS = "view_reports",
}

export interface Customer {
  id: string;
  customerCode: string;
  nameArabic: string;
  nameEnglish: string;
  vatNumber: string;
  crNumber: string;
  buildingNumber: string;
  streetName: string;
  district: string;
  city: string;
  postalCode: string;
  additionalNumber: string;
  countryCode: string;
  email: string;
  phone: string;
  contactPerson: string;
  creditLimit: number;
  paymentTerms: number;
  isActive: boolean;
  createdAt: string;
  balance: number;
}

export interface Supplier {
  id: string;
  supplierCode: string;
  nameArabic: string;
  nameEnglish: string;
  vatNumber: string;
  crNumber: string;
  buildingNumber: string;
  streetName: string;
  district: string;
  city: string;
  postalCode: string;
  additionalNumber: string;
  countryCode: string;
  email: string;
  phone: string;
  contactPerson: string;
  paymentTerms: number;
  isActive: boolean;
  createdAt: string;
  balance: number;
}

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
  zatcaStatus?: "not_submitted" | "submitted" | "approved" | "rejected";
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
  status: "draft" | "received" | "paid" | "cancelled";
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  referenceType: "sales_invoice" | "purchase_invoice" | "payment" | "receipt" | "manual";
  referenceNumber?: string;
  description: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: "draft" | "posted";
  createdBy: string;
  createdAt: string;
  postedAt?: string;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
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