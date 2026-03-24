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
import { supabase } from "@/integrations/supabase/client";

export default function NewCustomerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerCode: "",
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
    creditLimit: "",
    paymentTerms: "net30",
    isActive: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerCode.trim()) {
      toast({ title: "Validation Error", description: "Customer Code is required.", variant: "destructive" });
      return;
    }
    if (!formData.nameEnglish.trim()) {
      toast({ title: "Validation Error", description: "English Name is required.", variant: "destructive" });
      return;
    }
    if (!formData.city.trim()) {
      toast({ title: "Validation Error", description: "City is required.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const insertData = {
        customer_code: formData.customerCode.trim(),
        name_english: formData.nameEnglish.trim(),
        name_arabic: formData.nameArabic.trim() || null,
        vat_number: formData.vatNumber.trim() || null,
        commercial_registration: formData.crNumber.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        building_number: formData.buildingNumber.trim() || null,
        street_name: formData.streetName.trim() || null,
        district: formData.district.trim() || null,
        city: formData.city.trim(),
        postal_code: formData.postalCode.trim() || null,
        country: "Saudi Arabia",
        credit_limit: parseFloat(formData.creditLimit) || 0,
        payment_term: formData.paymentTerms,
        is_active: formData.isActive,
        current_balance: 0,
        opening_balance: 0,
      };

      const { data, error } = await supabase
        .from("customers")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        toast({
          title: "Database Error",
          description: error.message || "Failed to save customer.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Customer Created",
        description: `${formData.nameEnglish} has been successfully added.`,
      });

      router.push("/customers");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Unexpected error:", err);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Add Customer - Maka ERP" />
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/customers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add New Customer</h1>
              <p className="text-muted-foreground mt-1">Register a new customer in the system</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerCode">Customer Code *</Label>
                    <Input
                      id="customerCode"
                      name="customerCode"
                      placeholder="CUST-001"
                      value={formData.customerCode}
                      onChange={(e) => handleChange("customerCode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT Number</Label>
                    <Input
                      id="vatNumber"
                      name="vatNumber"
                      placeholder="300075588900003"
                      value={formData.vatNumber}
                      onChange={(e) => handleChange("vatNumber", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nameEnglish">Name (English) *</Label>
                    <Input
                      id="nameEnglish"
                      name="nameEnglish"
                      placeholder="Company Name Ltd."
                      value={formData.nameEnglish}
                      onChange={(e) => handleChange("nameEnglish", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameArabic">Name (Arabic)</Label>
                    <Input
                      id="nameArabic"
                      name="nameArabic"
                      placeholder="اسم الشركة"
                      value={formData.nameArabic}
                      onChange={(e) => handleChange("nameArabic", e.target.value)}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crNumber">CR Number (Commercial Registration)</Label>
                  <Input
                    id="crNumber"
                    name="crNumber"
                    placeholder="1010123456"
                    value={formData.crNumber}
                    onChange={(e) => handleChange("crNumber", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information (As per Saudi Arabia ZATCA Requirements)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="buildingNumber">Building Number</Label>
                    <Input
                      id="buildingNumber"
                      name="buildingNumber"
                      placeholder="1234"
                      value={formData.buildingNumber}
                      onChange={(e) => handleChange("buildingNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalNumber">Additional Number</Label>
                    <Input
                      id="additionalNumber"
                      name="additionalNumber"
                      placeholder="5678"
                      value={formData.additionalNumber}
                      onChange={(e) => handleChange("additionalNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="12345"
                      value={formData.postalCode}
                      onChange={(e) => handleChange("postalCode", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetName">Street Name</Label>
                  <Input
                    id="streetName"
                    name="streetName"
                    placeholder="King Fahd Road"
                    value={formData.streetName}
                    onChange={(e) => handleChange("streetName", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      name="district"
                      placeholder="Al Olaya"
                      value={formData.district}
                      onChange={(e) => handleChange("district", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Riyadh"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value="Saudi Arabia" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="info@company.sa"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+966501234567"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    placeholder="Ahmed Mohammed"
                    value={formData.contactPerson}
                    onChange={(e) => handleChange("contactPerson", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="creditLimit">Credit Limit (SAR)</Label>
                    <Input
                      id="creditLimit"
                      name="creditLimit"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.creditLimit}
                      onChange={(e) => handleChange("creditLimit", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms *</Label>
                    <select
                      id="paymentTerms"
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={(e) => handleChange("paymentTerms", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="cash">Cash</option>
                      <option value="net15">Net 15 Days</option>
                      <option value="net30">Net 30 Days</option>
                      <option value="net60">Net 60 Days</option>
                      <option value="net90">Net 90 Days</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="isActive" className="text-base">Active Status</Label>
                    <p className="text-sm text-muted-foreground">Enable this customer for transactions</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange("isActive", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4 pb-8">
              <Button type="submit" disabled={isLoading} className="gap-2 min-w-[140px]">
                <Save className="w-4 h-4" />
                {isLoading ? "Saving..." : "Save Customer"}
              </Button>
              <Link href="/customers">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
}