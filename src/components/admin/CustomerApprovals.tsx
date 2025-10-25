import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { 
  UserCheck, 
  UserX, 
  Search, 
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Camera,
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  Download
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
  reviewNotes?: string;
}

export function CustomerApprovals() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<KYCSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{ type: string; data: any; name: string } | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, filterStatus]);

  const loadSubmissions = () => {
    const saved = localStorage.getItem("kycSubmissions");
    if (saved) {
      setSubmissions(JSON.parse(saved));
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm)
      );
    }

    setFilteredSubmissions(filtered);
  };

  const handleApprove = (submission: KYCSubmission) => {
    const updated = submissions.map(s =>
      s.id === submission.id
        ? { ...s, status: "approved" as const, reviewedAt: new Date().toISOString() }
        : s
    );
    setSubmissions(updated);
    localStorage.setItem("kycSubmissions", JSON.stringify(updated));
    
    // Log activity
    const activities = JSON.parse(localStorage.getItem("adminActivities") || "[]");
    activities.unshift({
      id: Date.now(),
      type: "customer_approved",
      description: `Approved KYC for ${submission.firstName} ${submission.lastName}`,
      timestamp: new Date().toISOString(),
      user: `${submission.firstName} ${submission.lastName}`,
    });
    localStorage.setItem("adminActivities", JSON.stringify(activities));
    
    toast.success(`${submission.firstName} ${submission.lastName} approved successfully!`);
    setReviewDialogOpen(false);
  };

  const handleReject = (submission: KYCSubmission) => {
    const updated = submissions.map(s =>
      s.id === submission.id
        ? { ...s, status: "rejected" as const, reviewedAt: new Date().toISOString() }
        : s
    );
    setSubmissions(updated);
    localStorage.setItem("kycSubmissions", JSON.stringify(updated));
    
    // Log activity
    const activities = JSON.parse(localStorage.getItem("adminActivities") || "[]");
    activities.unshift({
      id: Date.now(),
      type: "customer_rejected",
      description: `Rejected KYC for ${submission.firstName} ${submission.lastName}`,
      timestamp: new Date().toISOString(),
      user: `${submission.firstName} ${submission.lastName}`,
    });
    localStorage.setItem("adminActivities", JSON.stringify(activities));
    
    toast.error(`${submission.firstName} ${submission.lastName} rejected`);
    setReviewDialogOpen(false);
  };

  const openReviewDialog = (submission: KYCSubmission) => {
    setSelectedSubmission(submission);
    setReviewDialogOpen(true);
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

  const getFileData = (fileKey: string) => {
    const filesMap = JSON.parse(localStorage.getItem("kycFileData") || "{}");
    return filesMap[fileKey] || null;
  };

  const handleDownloadDocument = (fileKey: string, documentType: string) => {
    const fileData = getFileData(fileKey);
    
    if (!fileData) {
      toast.error("Document not found");
      return;
    }

    try {
      // Create a link element
      const link = document.createElement('a');
      link.href = fileData.dataUrl;
      link.download = fileData.name || `${documentType}.${fileData.type.split('/')[1]}`;
      
      // Trigger download
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

  const pendingCount = submissions.filter(s => s.status === "pending").length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Customer Approvals</h2>
          <p className="text-gray-600">Review and approve KYC submissions</p>
        </div>
        <Badge className="bg-orange-100 text-orange-700 border-orange-200">
          {pendingCount} Pending
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All ({submissions.length})
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
          >
            Pending ({submissions.filter(s => s.status === "pending").length})
          </Button>
          <Button
            variant={filterStatus === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("approved")}
          >
            Approved ({submissions.filter(s => s.status === "approved").length})
          </Button>
          <Button
            variant={filterStatus === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("rejected")}
          >
            Rejected ({submissions.filter(s => s.status === "rejected").length})
          </Button>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <Card className="p-12 text-center">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No submissions found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms"
              : filterStatus === "pending"
              ? "No pending KYC submissions at the moment"
              : `No ${filterStatus} submissions`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="bg-blue-100 p-3 rounded-full h-fit">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3>{submission.firstName} {submission.lastName}</h3>
                        <p className="text-sm text-gray-600">{submission.email}</p>
                      </div>
                      <Badge
                        className={
                          submission.status === "approved"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : submission.status === "rejected"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                        }
                      >
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{submission.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{submission.city}, {submission.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CreditCard className="h-4 w-4" />
                        <span>{getIdTypeLabel(submission.idType)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted {formatDateTime(submission.submittedAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openReviewDialog(submission)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review Details
                      </Button>
                      
                      {submission.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(submission)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(submission)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle>KYC Review: {selectedSubmission?.firstName} {selectedSubmission?.lastName}</DialogTitle>
            <DialogDescription>
              Review all submitted information and documents
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <Tabs defaultValue="personal" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">First Name</Label>
                    <p>{selectedSubmission.firstName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Last Name</Label>
                    <p>{selectedSubmission.lastName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Email</Label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedSubmission.email}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Phone</Label>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {selectedSubmission.phone}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Date of Birth</Label>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(selectedSubmission.dateOfBirth)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Gender</Label>
                    <p className="capitalize">{selectedSubmission.gender}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">Street Address</Label>
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      {selectedSubmission.address}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-600">City</Label>
                      <p>{selectedSubmission.city}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-600">State</Label>
                      <p>{selectedSubmission.state}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="verification" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">ID Type</Label>
                    <p className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      {getIdTypeLabel(selectedSubmission.idType)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">ID Number</Label>
                    <p className="font-mono">{selectedSubmission.idNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Bank Verification Number (BVN)</Label>
                    <p className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="font-mono">{selectedSubmission.bvn}</span>
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="space-y-4">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">ID Document</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {getFileData(selectedSubmission.idDocument)?.name || "Document uploaded"}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePreviewDocument(selectedSubmission.idDocument, "ID Document")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadDocument(selectedSubmission.idDocument, "id_document")}
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
                          {getFileData(selectedSubmission.proofOfAddress)?.name || "Document uploaded"}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePreviewDocument(selectedSubmission.proofOfAddress, "Proof of Address")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadDocument(selectedSubmission.proofOfAddress, "proof_of_address")}
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
                      <Camera className="h-5 w-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">Selfie Verification</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {getFileData(selectedSubmission.selfie)?.name || "Selfie uploaded"}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePreviewDocument(selectedSubmission.selfie, "Selfie")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadDocument(selectedSubmission.selfie, "selfie")}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <Separator className="my-4" />

          {selectedSubmission && selectedSubmission.status === "pending" && (
            <div className="flex gap-3">
              <Button
                onClick={() => handleApprove(selectedSubmission)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve Application
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedSubmission)}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Application
              </Button>
            </div>
          )}

          {selectedSubmission && selectedSubmission.status !== "pending" && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Badge
                className={
                  selectedSubmission.status === "approved"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }
              >
                {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
              </Badge>
              {selectedSubmission.reviewedAt && (
                <p className="text-sm text-gray-600 mt-2">
                  Reviewed on {formatDateTime(selectedSubmission.reviewedAt)}
                </p>
              )}
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
