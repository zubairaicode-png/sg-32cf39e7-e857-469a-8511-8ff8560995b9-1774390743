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
import { customerService } from "@/services/customerService";
import { useAuth } from "@/contexts/AuthContext";

export default function NewCustomerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
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
    paymentTerms: "net30" as "cash" | "net15" | "net30" | "net60" | "net90",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== FORM SUBMIT STARTED ===");
    console.log("Form event:", e);
    console.log("Current user:", user);
    
    if (!user) {
      console.error("ERROR: No user found!");
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create customers.",
        variant: "destructive",
      });
      return;
    }

    console.log("User is authenticated, proceeding with save...");
    setIsLoading(true);

    try {
      console.log("=== CREATING CUSTOMER ===");
      console.log("Form data:", formData);
      
      const customerData = {
        code: formData.customerCode,
        nameEnglish: formData.nameEnglish,
        nameArabic: formData.nameArabic,
        vatNumber: formData.vatNumber || undefined,
        commercialRegister: formData.crNumber || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        buildingNumber: formData.buildingNumber,
        streetName: formData.streetName,
        district: formData.district,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.countryCode,
        creditLimit: parseFloat(formData.creditLimit) || 0,
        paymentTerms: formData.paymentTerms,
        isActive: formData.isActive,
      };
      
      console.log("Calling customerService.create with:", customerData);

      const result = await customerService.create(customerData);
      
      console.log("Customer created successfully! Result:", result);

      toast({
        title: "Customer Created",
        description: `${formData.nameEnglish} has been successfully added.`,
      });
      
      console.log("Redirecting to /customers...");
      router.push("/customers");
    } catch (error) {
      console.error("=== ERROR CREATING CUSTOMER ===");
      console.error("Error object:", error);
      console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log("=== FORM SUBMIT COMPLETED ===");
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SEO title="Add Customer - Maka ERP System" />
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
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
                      placeholder="CUST-001"
                      value={formData.customerCode}
                      onChange={(e) => handleChange("customerCode", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT Number</Label>
                    <Input
                      id="vatNumber"
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
                      placeholder="Company Name Ltd."
                      value={formData.nameEnglish}
                      onChange={(e) => handleChange("nameEnglish", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameArabic">Name (Arabic) *</Label>
                    <Input
                      id="nameArabic"
                      placeholder="اسم الشركة"
                      value={formData.nameArabic}
                      onChange={(e) => handleChange("nameArabic", e.target.value)}
                      dir="rtl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crNumber">CR Number</Label>
                  <Input
                    id="crNumber"
                    placeholder="1010123456"
                    value={formData.crNumber}
                    onChange={(e) => handleChange("crNumber", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information (Saudi Arabia Format) */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="buildingNumber">Building Number</Label>
                    <Input
                      id="buildingNumber"
                      placeholder="1234"
                      value={formData.buildingNumber}
                      onChange={(e) => handleChange("buildingNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalNumber">Additional Number</Label>
                    <Input
                      id="additionalNumber"
                      placeholder="5678"
                      value={formData.additionalNumber}
                      onChange={(e) => handleChange("additionalNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
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
                      placeholder="Al Olaya"
                      value={formData.district}
                      onChange={(e) => handleChange("district", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Riyadh"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryCode">Country Code *</Label>
                    <Input
                      id="countryCode"
                      value={formData.countryCode}
                      disabled
                    />
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
                      type="number"
                      placeholder="0"
                      value={formData.creditLimit}
                      onChange={(e) => handleChange("creditLimit", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms *</Label>
                    <select
                      id="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={(e) => handleChange("paymentTerms", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
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

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isLoading} className="gap-2">
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