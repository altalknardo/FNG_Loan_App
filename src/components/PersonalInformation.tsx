import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { User, MapPin, Phone, Mail, Users, ArrowLeft, AlertCircle, CheckCircle2, Edit, Save, Home } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PersonalInformationProps {
  userEmail: string;
  onBack: () => void;
}

interface NextOfKinData {
  fullName: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface ContactData {
  primaryPhone: string;
  alternatePhone: string;
  alternateEmail: string;
}

interface AddressData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PersonalData {
  nextOfKin: NextOfKinData;
  contact: ContactData;
  address: AddressData;
}

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara"
];

const RELATIONSHIPS = [
  "Spouse", "Parent", "Child", "Sibling", "Uncle", "Aunt", "Cousin", "Friend", "Other"
];

export function PersonalInformation({ userEmail, onBack }: PersonalInformationProps) {
  const [editingSection, setEditingSection] = useState<"nextOfKin" | "contact" | "address" | null>(null);
  const [personalData, setPersonalData] = useState<PersonalData>({
    nextOfKin: {
      fullName: "",
      relationship: "",
      phoneNumber: "",
      email: "",
      address: ""
    },
    contact: {
      primaryPhone: "",
      alternatePhone: "",
      alternateEmail: ""
    },
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria"
    }
  });

  // Form states for editing
  const [editedData, setEditedData] = useState<Partial<PersonalData>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Load personal data on mount
  useEffect(() => {
    loadPersonalData();
  }, [userEmail]);

  const loadPersonalData = () => {
    const savedData = localStorage.getItem(`personalData_${userEmail}`);
    if (savedData) {
      setPersonalData(JSON.parse(savedData));
    } else {
      // Try to load from user registration data
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const user = registeredUsers.find((u: any) => u.email === userEmail || u.phone === userEmail);
      
      if (user) {
        setPersonalData(prev => ({
          ...prev,
          contact: {
            ...prev.contact,
            primaryPhone: user.phone || ""
          }
        }));
      }
    }
  };

  const savePersonalData = (data: PersonalData) => {
    localStorage.setItem(`personalData_${userEmail}`, JSON.stringify(data));
  };

  const isValidPhone = (phone: string) => {
    // Nigerian phone numbers
    return /^(\+?234|0)?[789]\d{9}$/.test(phone.replace(/\s/g, ''));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEditNextOfKin = () => {
    setEditedData({ nextOfKin: { ...personalData.nextOfKin } });
    setEditingSection("nextOfKin");
    setError("");
  };

  const handleEditContact = () => {
    setEditedData({ contact: { ...personalData.contact } });
    setEditingSection("contact");
    setError("");
  };

  const handleEditAddress = () => {
    setEditedData({ address: { ...personalData.address } });
    setEditingSection("address");
    setError("");
  };

  const handleSaveNextOfKin = () => {
    setError("");
    const data = editedData.nextOfKin;

    if (!data) return;

    if (!data.fullName || !data.relationship || !data.phoneNumber) {
      setError("Please fill in all required fields (Name, Relationship, Phone)");
      return;
    }

    if (!isValidPhone(data.phoneNumber)) {
      setError("Please enter a valid Nigerian phone number");
      return;
    }

    if (data.email && !isValidEmail(data.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      const updatedData = { ...personalData, nextOfKin: data };
      setPersonalData(updatedData);
      savePersonalData(updatedData);
      toast.success("Next of Kin information updated successfully!");
      setEditingSection(null);
      setSaving(false);
    }, 500);
  };

  const handleSaveContact = () => {
    setError("");
    const data = editedData.contact;

    if (!data) return;

    if (!data.primaryPhone) {
      setError("Primary phone number is required");
      return;
    }

    if (!isValidPhone(data.primaryPhone)) {
      setError("Please enter a valid primary phone number");
      return;
    }

    if (data.alternatePhone && !isValidPhone(data.alternatePhone)) {
      setError("Please enter a valid alternate phone number");
      return;
    }

    if (data.alternateEmail && !isValidEmail(data.alternateEmail)) {
      setError("Please enter a valid alternate email address");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      const updatedData = { ...personalData, contact: data };
      setPersonalData(updatedData);
      savePersonalData(updatedData);
      toast.success("Contact information updated successfully!");
      setEditingSection(null);
      setSaving(false);
    }, 500);
  };

  const handleSaveAddress = () => {
    setError("");
    const data = editedData.address;

    if (!data) return;

    if (!data.street || !data.city || !data.state) {
      setError("Please fill in Street Address, City, and State");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      const updatedData = { ...personalData, address: data };
      setPersonalData(updatedData);
      savePersonalData(updatedData);
      toast.success("Address information updated successfully!");
      setEditingSection(null);
      setSaving(false);
    }, 500);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditedData({});
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-9 px-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </h2>
          <p className="text-sm text-gray-600">Manage your personal details</p>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-xs sm:text-sm">
          Keep your information up to date for account security and communication purposes.
        </AlertDescription>
      </Alert>

      {/* Next of Kin Section */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <h3>Next of Kin</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditNextOfKin}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          <div className="space-y-3">
            {personalData.nextOfKin.fullName ? (
              <>
                <div>
                  <Label className="text-xs text-gray-600">Full Name</Label>
                  <p className="text-sm mt-1">{personalData.nextOfKin.fullName}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600">Relationship</Label>
                    <p className="text-sm mt-1">{personalData.nextOfKin.relationship}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Phone Number</Label>
                    <p className="text-sm mt-1">{personalData.nextOfKin.phoneNumber}</p>
                  </div>
                </div>
                {personalData.nextOfKin.email && (
                  <div>
                    <Label className="text-xs text-gray-600">Email</Label>
                    <p className="text-sm mt-1">{personalData.nextOfKin.email}</p>
                  </div>
                )}
                {personalData.nextOfKin.address && (
                  <div>
                    <Label className="text-xs text-gray-600">Address</Label>
                    <p className="text-sm mt-1">{personalData.nextOfKin.address}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">No next of kin information added yet</p>
            )}
          </div>
        </div>
      </Card>

      {/* Contact Information Section */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              <h3>Contact Information</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditContact}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">Primary Phone</Label>
              <p className="text-sm mt-1">
                {personalData.contact.primaryPhone || <span className="text-gray-500 italic">Not set</span>}
              </p>
            </div>
            {personalData.contact.alternatePhone && (
              <div>
                <Label className="text-xs text-gray-600">Alternate Phone</Label>
                <p className="text-sm mt-1">{personalData.contact.alternatePhone}</p>
              </div>
            )}
            {personalData.contact.alternateEmail && (
              <div>
                <Label className="text-xs text-gray-600">Alternate Email</Label>
                <p className="text-sm mt-1">{personalData.contact.alternateEmail}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Address Section */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-orange-600" />
              <h3>Residential Address</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditAddress}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          <div className="space-y-3">
            {personalData.address.street ? (
              <>
                <div>
                  <Label className="text-xs text-gray-600">Street Address</Label>
                  <p className="text-sm mt-1">{personalData.address.street}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600">City</Label>
                    <p className="text-sm mt-1">{personalData.address.city}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">State</Label>
                    <p className="text-sm mt-1">{personalData.address.state}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {personalData.address.postalCode && (
                    <div>
                      <Label className="text-xs text-gray-600">Postal Code</Label>
                      <p className="text-sm mt-1">{personalData.address.postalCode}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-gray-600">Country</Label>
                    <p className="text-sm mt-1">{personalData.address.country}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">No address information added yet</p>
            )}
          </div>
        </div>
      </Card>

      {/* Edit Next of Kin Dialog */}
      <Dialog open={editingSection === "nextOfKin"} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Next of Kin</DialogTitle>
            <DialogDescription>
              Update your next of kin information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="nok-name">Full Name *</Label>
              <Input
                id="nok-name"
                placeholder="Enter full name"
                value={editedData.nextOfKin?.fullName || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  nextOfKin: { ...editedData.nextOfKin!, fullName: e.target.value }
                })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nok-relationship">Relationship *</Label>
              <Select
                value={editedData.nextOfKin?.relationship || ""}
                onValueChange={(value) => setEditedData({
                  ...editedData,
                  nextOfKin: { ...editedData.nextOfKin!, relationship: value }
                })}
                disabled={saving}
              >
                <SelectTrigger id="nok-relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map(rel => (
                    <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nok-phone">Phone Number *</Label>
              <Input
                id="nok-phone"
                type="tel"
                placeholder="e.g., 08012345678"
                value={editedData.nextOfKin?.phoneNumber || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  nextOfKin: { ...editedData.nextOfKin!, phoneNumber: e.target.value }
                })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nok-email">Email (Optional)</Label>
              <Input
                id="nok-email"
                type="email"
                placeholder="email@example.com"
                value={editedData.nextOfKin?.email || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  nextOfKin: { ...editedData.nextOfKin!, email: e.target.value }
                })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nok-address">Address (Optional)</Label>
              <Textarea
                id="nok-address"
                placeholder="Enter address"
                rows={3}
                value={editedData.nextOfKin?.address || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  nextOfKin: { ...editedData.nextOfKin!, address: e.target.value }
                })}
                disabled={saving}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveNextOfKin} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={editingSection === "contact"} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
            <DialogDescription>
              Update your contact details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="primary-phone">Primary Phone *</Label>
              <Input
                id="primary-phone"
                type="tel"
                placeholder="e.g., 08012345678"
                value={editedData.contact?.primaryPhone || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  contact: { ...editedData.contact!, primaryPhone: e.target.value }
                })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternate-phone">Alternate Phone (Optional)</Label>
              <Input
                id="alternate-phone"
                type="tel"
                placeholder="e.g., 08087654321"
                value={editedData.contact?.alternatePhone || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  contact: { ...editedData.contact!, alternatePhone: e.target.value }
                })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternate-email">Alternate Email (Optional)</Label>
              <Input
                id="alternate-email"
                type="email"
                placeholder="alternate@email.com"
                value={editedData.contact?.alternateEmail || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  contact: { ...editedData.contact!, alternateEmail: e.target.value }
                })}
                disabled={saving}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveContact} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={editingSection === "address"} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Residential Address</DialogTitle>
            <DialogDescription>
              Update your home address
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                placeholder="e.g., 123 Main Street"
                value={editedData.address?.street || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  address: { ...editedData.address!, street: e.target.value }
                })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="e.g., Lagos"
                value={editedData.address?.city || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  address: { ...editedData.address!, city: e.target.value }
                })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={editedData.address?.state || ""}
                onValueChange={(value) => setEditedData({
                  ...editedData,
                  address: { ...editedData.address!, state: value }
                })}
                disabled={saving}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal-code">Postal Code (Optional)</Label>
              <Input
                id="postal-code"
                placeholder="e.g., 100001"
                value={editedData.address?.postalCode || ""}
                onChange={(e) => setEditedData({
                  ...editedData,
                  address: { ...editedData.address!, postalCode: e.target.value }
                })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value="Nigeria"
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddress} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
