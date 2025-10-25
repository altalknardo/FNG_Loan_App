import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  User, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Shield,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { toast } from "sonner@2.0.3";

interface KYCSubmission {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  idType: string;
  idNumber: string;
  bvn: string;
  idDocument: string;
  proofOfAddress: string;
  selfie: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
}

export function CustomerProfiles() {
  const [customers, setCustomers] = useState<KYCSubmission[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<KYCSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<KYCSubmission | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{ type: string; data: any; name: string } | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const loadCustomers = () => {
    const saved = localStorage.getItem("kycSubmissions");
    if (saved) {
      // Only show approved customers
      const allSubmissions = JSON.parse(saved);
      const approvedCustomers = allSubmissions.filter((s: KYCSubmission) => s.status === "approved");
      setCustomers(approvedCustomers);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
      );
    }

    setFilteredCustomers(filtered);
  };

  const getFileData = (fileKey: string) => {
    const filesMap = JSON.parse(localStorage.getItem("kycFileData") || "{}");
    return filesMap[fileKey] || null;
  };

  const getSelfieUrl = (selfieKey: string) => {
    const fileData = getFileData(selfieKey);
    return fileData?.dataUrl || "";
  };

  const handleViewProfile = (customer: KYCSubmission) => {
    setSelectedCustomer(customer);
    setProfileDialogOpen(true);
  };

  const handleDownloadDocument = (fileKey: string, documentType: string) => {
    const fileData = getFileData(fileKey);
    
    if (!fileData) {
      toast.error("Document not found");
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = fileData.dataUrl;
      link.download = fileData.name || `${documentType}.${fileData.type.split('/')[1]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${fileData.name} downloaded successfully`);
    } catch (error) {
      toast.error("Error downloading document");
      console.error(error);
    }
  };

  const handlePreviewDocument = (fileKey: string, documentType: string) => {
    const fileData = getFileData(fileKey);
    
    if (!fileData) {
      toast.error("Document not found");
      return;
    }

    setPreviewDocument({
      type: fileData.type,
      data: fileData.dataUrl,
      name: fileData.name || documentType
    });
    setPreviewDialogOpen(true);
  };

  const getIdTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      nin: "National Identity Number",
      drivers_license: "Driver's License",
      voters_card: "Voter's Card",
      passport: "International Passport"
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getGuarantorInfo = (customer: KYCSubmission) => {
    const guarantorRecords = JSON.parse(localStorage.getItem("guarantorRecords") || "[]");
    const records = guarantorRecords.filter((record: any) => 
      record.guarantorCustomerId === customer.id && record.status === "active"
    );
    return {
      isGuarantor: records.length > 0,
      count: records.length,
      records: records
    };
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Customer Profiles</h2>
          <p className="text-gray-600">View all verified customer profiles</p>
        </div>
        <Badge className="bg-green-100 text-green-700 border-green-200">
          {customers.length} Customers
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length === 0 ? (
        <Card className="p-12 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms"
              : "No approved customers yet"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => {
            const guarantorInfo = getGuarantorInfo(customer);
            return (
              <Card key={customer.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Avatar and Name */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={getSelfieUrl(customer.selfie)} alt={`${customer.firstName} ${customer.lastName}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {getInitials(customer.firstName, customer.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="mb-1">{customer.firstName} {customer.lastName}</h3>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          Verified
                        </Badge>
                        {guarantorInfo.isGuarantor && (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                            Guarantor ({guarantorInfo.count})
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{customer.city}, {customer.state}</span>
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Member Since</p>
                    <p>{new Date(customer.submittedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">ID Type</p>
                    <p>{customer.idType.toUpperCase()}</p>
                  </div>
                </div>

                {/* Actions */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewProfile(customer)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </div>
            </Card>
            );
          })}
        </div>
      )}

      {/* Profile Details Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              Complete customer information and documents
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              {/* Header with Photo */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={getSelfieUrl(selectedCustomer.selfie)} alt={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                      {getInitials(selectedCustomer.firstName, selectedCustomer.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl mb-2">{selectedCustomer.firstName} {selectedCustomer.lastName}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified Customer
                      </Badge>
                      <Badge variant="outline">
                        ID: #{selectedCustomer.id}
                      </Badge>
                      {(() => {
                        const guarantorInfo = getGuarantorInfo(selectedCustomer);
                        if (guarantorInfo.isGuarantor) {
                          return (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                              <Shield className="h-3 w-3 mr-1" />
                              Guarantor for {guarantorInfo.count} loan{guarantorInfo.count > 1 ? 's' : ''}
                            </Badge>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </div>
              </Card>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="address">Address</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="guarantor">
                    Guarantor
                    {(() => {
                      const guarantorInfo = getGuarantorInfo(selectedCustomer);
                      if (guarantorInfo.isGuarantor) {
                        return (
                          <Badge className="ml-1 bg-purple-600 text-white text-xs h-4 px-1">
                            {guarantorInfo.count}
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <Card className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-600">First Name</Label>
                        <p>{selectedCustomer.firstName}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Last Name</Label>
                        <p>{selectedCustomer.lastName}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Email</Label>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {selectedCustomer.email}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Phone</Label>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {selectedCustomer.phone}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Date of Birth</Label>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(selectedCustomer.dateOfBirth)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Gender</Label>
                        <p className="capitalize">{selectedCustomer.gender}</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="address" className="space-y-4">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-600">Street Address</Label>
                        <p className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                          {selectedCustomer.address}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-600">City</Label>
                          <p>{selectedCustomer.city}</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-600">State</Label>
                          <p>{selectedCustomer.state}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="verification" className="space-y-4">
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-600">ID Type</Label>
                        <p className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          {getIdTypeLabel(selectedCustomer.idType)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">ID Number</Label>
                        <p className="font-mono">{selectedCustomer.idNumber}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Bank Verification Number (BVN)</Label>
                        <p className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <span className="font-mono">{selectedCustomer.bvn}</span>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-600">Verified On</Label>
                        <p className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          {selectedCustomer.reviewedAt ? formatDateTime(selectedCustomer.reviewedAt) : "Verified"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-4">
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-sm mb-1">ID Document</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {getFileData(selectedCustomer.idDocument)?.name || "Document uploaded"}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePreviewDocument(selectedCustomer.idDocument, "ID Document")}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadDocument(selectedCustomer.idDocument, "id_document")}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-green-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-sm mb-1">Proof of Address</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {getFileData(selectedCustomer.proofOfAddress)?.name || "Document uploaded"}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handlePreviewDocument(selectedCustomer.proofOfAddress, "Proof of Address")}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadDocument(selectedCustomer.proofOfAddress, "proof_of_address")}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-purple-50 border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h4 className="text-sm mb-3">Selfie Verification</h4>
                          <div className="flex gap-4 items-start">
                            <Avatar className="h-32 w-32 border-2 border-purple-200">
                              <AvatarImage src={getSelfieUrl(selectedCustomer.selfie)} alt="Customer selfie" />
                              <AvatarFallback className="bg-purple-100 text-purple-600 text-3xl">
                                {getInitials(selectedCustomer.firstName, selectedCustomer.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 mb-3">
                                {getFileData(selectedCustomer.selfie)?.name || "Selfie uploaded"}
                              </p>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handlePreviewDocument(selectedCustomer.selfie, "Selfie")}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDownloadDocument(selectedCustomer.selfie, "selfie")}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="guarantor" className="space-y-4">
                  {(() => {
                    const guarantorInfo = getGuarantorInfo(selectedCustomer);
                    
                    if (!guarantorInfo.isGuarantor) {
                      return (
                        <Card className="p-12 text-center">
                          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-gray-900 mb-2">Not a Guarantor</h3>
                          <p className="text-gray-600">
                            This customer has not served as a guarantor for any loans
                          </p>
                        </Card>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        <Card className="p-4 bg-purple-50 border-purple-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <Shield className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="text-purple-900">Guarantor Summary</h4>
                              <p className="text-sm text-purple-700">
                                This customer is guaranteeing {guarantorInfo.count} active loan{guarantorInfo.count > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </Card>

                        {guarantorInfo.records.map((record: any) => (
                          <Card key={record.id} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="mb-1">Loan for {record.borrowerName}</h4>
                                  <p className="text-sm text-gray-600">{record.loanType}</p>
                                </div>
                                <Badge className={
                                  record.status === "active" ? "bg-green-100 text-green-700 border-green-200" :
                                  record.status === "completed" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                  "bg-red-100 text-red-700 border-red-200"
                                }>
                                  {record.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Loan Amount</p>
                                  <p>₦{record.loanAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Guaranteed On</p>
                                  <p className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    {new Date(record.guaranteedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-gray-50 rounded p-3 text-xs text-gray-700">
                                <p className="mb-1">
                                  <strong>Guarantor Responsibility:</strong>
                                </p>
                                <p>
                                  As a guarantor, this customer is liable for loan repayment if the borrower defaults. 
                                  Their assets and savings may be used for recovery in case of non-payment.
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    );
                  })()}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-4xl md:max-w-5xl lg:max-w-6xl">
          <DialogHeader>
            <DialogTitle>{previewDocument?.name}</DialogTitle>
            <DialogDescription>
              Document preview
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 max-h-[70vh] overflow-auto bg-gray-100 rounded-lg p-4">
            {previewDocument && (
              <>
                {previewDocument.type.startsWith('image/') ? (
                  <div className="flex justify-center">
                    <img 
                      src={previewDocument.data} 
                      alt={previewDocument.name}
                      className="max-w-full h-auto rounded shadow-lg"
                      style={{ maxHeight: '65vh' }}
                    />
                  </div>
                ) : previewDocument.type === 'application/pdf' ? (
                  <div className="w-full h-full min-h-[65vh]">
                    <iframe
                      src={previewDocument.data}
                      className="w-full h-full min-h-[65vh] border-0 rounded"
                      title={previewDocument.name}
                    />
                  </div>
                ) : (
                  <div className="text-center p-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Preview not available for this file type</p>
                    <p className="text-sm text-gray-500 mt-2">Please download to view</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setPreviewDialogOpen(false)}
            >
              Close
            </Button>
            {previewDocument && (
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = previewDocument.data;
                  link.download = previewDocument.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success("Document downloaded");
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm ${className}`}>{children}</label>;
}
