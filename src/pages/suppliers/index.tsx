import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, FileText, Loader2 } from "lucide-react";
import type { Supplier } from "@/types";
import { supplierService } from "@/services/supplierService";

export default function SuppliersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchSuppliers = async () => {
      try {
        const data = await supplierService.getAll();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (supplier.vatNumber && supplier.vatNumber.includes(searchQuery))
  );

  return (
    <>
      <SEO title="Suppliers - Maka ERP System" />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
              <p className="text-muted-foreground mt-1">Manage your supplier database</p>
            </div>
            <Link href="/suppliers/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, code, or VAT number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Supplier Name</TableHead>
                      <TableHead>VAT Number</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.code}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{supplier.nameEnglish}</p>
                            <p className="text-sm text-muted-foreground">{supplier.nameArabic}</p>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.vatNumber}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{supplier.phone}</p>
                            <p className="text-muted-foreground">{supplier.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          SAR {Math.abs(supplier.balance).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={supplier.isActive ? "default" : "secondary"}>
                            {supplier.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/suppliers/${supplier.id}/ledger`}>
                              <Button variant="ghost" size="icon" title="View Ledger">
                                <FileText className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}