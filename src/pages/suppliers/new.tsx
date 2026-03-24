import { useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewSupplierPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    supplierCode: "",
    nameEnglish: "",
    nameArabic: "",
    vatNumber: "",
    crNumber: "",
    buildingNumber: "",
    streetName: "",
    district: "",
    city: "",
    postalCode: "",
    additionalNumber: "",
    countryCode: "SA",
    email: "",
    phone: "",
    contactPerson: "",
    paymentTerms: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      toast({
        title: "Supplier Created",
        description: `${formData.nameEnglish} has been successfully added.`,
      });
      router.push("/suppliers");
    }, 1000);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SEO title="Add Supplier - Maka ERP System" />
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/suppliers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add New Supplier</h1>
              <p className="text-muted-foreground mt-1">Register a new supplier in the system</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supplierCode">Supplier Code *</Label>
                    <Input id="supplierCode" value={formData.supplierCode} onChange={(e) => handleChange("supplierCode", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT Number *</Label>
                    <Input id="vatNumber" value={formData.vatNumber} onChange={(e) => handleChange("vatNumber", e.target.value)} required />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nameEnglish">Name (English) *</Label>
                    <Input id="nameEnglish" value={formData.nameEnglish} onChange={(e) => handleChange("nameEnglish", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameArabic">Name (Arabic) *</Label>
                    <Input id="nameArabic" value={formData.nameArabic} onChange={(e) => handleChange("nameArabic", e.target.value)} dir="rtl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crNumber">CR Number *</Label>
                  <Input id="crNumber" value={formData.crNumber} onChange={(e) => handleChange("crNumber", e.target.value)} required />
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Building Number *</Label>
                    <Input value={formData.buildingNumber} onChange={(e) => handleChange("buildingNumber", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Number *</Label>
                    <Input value={formData.additionalNumber} onChange={(e) => handleChange("additionalNumber", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Postal Code *</Label>
                    <Input value={formData.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} required />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Street Name *</Label>
                    <Input value={formData.streetName} onChange={(e) => handleChange("streetName", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>District *</Label>
                    <Input value={formData.district} onChange={(e) => handleChange("district", e.target.value)} required />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input value={formData.city} onChange={(e) => handleChange("city", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Country Code</Label>
                    <Input value={formData.countryCode} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Contact Person *</Label>
                    <Input value={formData.contactPerson} onChange={(e) => handleChange("contactPerson", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Terms (Days) *</Label>
                    <Input type="number" value={formData.paymentTerms} onChange={(e) => handleChange("paymentTerms", e.target.value)} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save className="w-4 h-4" />
                {isLoading ? "Saving..." : "Save Supplier"}
              </Button>
              <Link href="/suppliers">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
}