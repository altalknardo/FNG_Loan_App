import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  CheckCircle2,
  XCircle,
  Search,
  DollarSign,
  User,
  Calendar,
  Shield,
  TrendingDown,
  AlertCircle,
  Coins
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { formatCurrency } from "../../lib/utils";

interface DepositOffsetRequest {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  loanId: number;
  loanAmount: number;
  currentBalance: number;
  depositAmount?: number;
  contributionBalance?: number;
  offsetAmount: number;
  offsetType: "deposit" | "contribution" | "bank";
  loanType: string;
  paymentMethod?: {
    type: string;
    name: string;
    last4: string;
    bankName?: string;
  };
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewedAt?: string;
  reviewNote?: string;
}

export function DepositOffsetApprovals() {
  const [requests, setRequests] = useState<DepositOffsetRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DepositOffsetRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedRequest, setSelectedRequest] = useState<DepositOffsetRequest | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    loadDepositOffsetRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, filterStatus]);

  const loadDepositOffsetRequests = () => {
    const saved = localStorage.getItem("depositOffsetRequests");
    if (saved) {
      setRequests(JSON.parse(saved));
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(req => req.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toString().includes(searchTerm)
      );
    }

    // Sort by requestedAt (most recent first)
    filtered.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    setFilteredRequests(filtered);
  };

  const handleApprove = (request: DepositOffsetRequest) => {
    // Update request status
    const updatedRequests = requests.map(req =>
      req.id === request.id
        ? { ...req, status: "approved" as const, reviewedAt: new Date().toISOString() }
        : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("depositOffsetRequests", JSON.stringify(updatedRequests));

    // Update customer's loan balance
    const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    const updatedLoans = loans.map((loan: any) => {
      if (loan.id === request.loanId) {
        const newRepaid = loan.repaid + request.offsetAmount;
        return {
          ...loan,
          repaid: newRepaid,
          status: newRepaid >= loan.amount ? "completed" : loan.status
        };
      }
      return loan;
    });
    localStorage.setItem("activeLoans", JSON.stringify(updatedLoans));

    // Deduct from the appropriate balance
    if (request.offsetType === "deposit") {
      const currentDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
      const newDeposits = currentDeposits - request.offsetAmount;
      localStorage.setItem("loanDeposits", newDeposits.toString());
    } else if (request.offsetType === "contribution") {
      const currentContributions = parseFloat(localStorage.getItem("contributionBalance") || "0");
      const newContributions = currentContributions - request.offsetAmount;
      localStorage.setItem("contributionBalance", newContributions.toString());
    }

    // Trigger storage update
    window.dispatchEvent(new Event("storage"));

    const offsetTypeLabel = request.offsetType === "deposit" ? "Deposit" : "Savings";
    toast.success(`${offsetTypeLabel} offset approved! ${formatCurrency(request.offsetAmount)} applied to loan balance.`);
    setReviewDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleReject = (request: DepositOffsetRequest) => {
    const updatedRequests = requests.map(req =>
      req.id === request.id
        ? { ...req, status: "rejected" as const, reviewedAt: new Date().toISOString() }
        : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("depositOffsetRequests", JSON.stringify(updatedRequests));

    const offsetTypeLabel = request.offsetType === "deposit" ? "Deposit" : "Savings";
    toast.success(`${offsetTypeLabel} offset request rejected`);
    setReviewDialogOpen(false);
    setSelectedRequest(null);
  };

  const openReviewDialog = (request: DepositOffsetRequest) => {
    setSelectedRequest(request);
    setReviewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return null;
    }
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const rejectedCount = requests.filter(r => r.status === "rejected").length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-2xl">Balance Offset Approvals</h2>
        <p className="text-gray-600">
          Review and approve customer requests to use deposits or savings balance for loan repayment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Coins className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl">{requests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Shield className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl">{approvedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl">{rejectedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or request ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "approved" ? "default" : "outline"}
              onClick={() => setFilterStatus("approved")}
              size="sm"
            >
              Approved
            </Button>
            <Button
              variant={filterStatus === "rejected" ? "default" : "outline"}
              onClick={() => setFilterStatus("rejected")}
              size="sm"
            >
              Rejected
            </Button>
          </div>
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <TrendingDown className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No balance offset requests found</p>
              <p className="text-sm mt-1">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Requests will appear here when customers request to offset loans with deposits or savings"}
              </p>
            </div>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3>Request #{request.id}</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{request.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(request.requestedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Loan Type</p>
                  <p className="font-medium">{request.loanType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Offset Type</p>
                  <p className="font-medium">
                    {request.offsetType === "deposit" ? (
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        <Coins className="h-3 w-3 mr-1" />
                        Deposit
                      </Badge>
                    ) : request.offsetType === "contribution" ? (
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Savings
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Bank Account
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Loan Balance</p>
                  <p className="font-medium">{formatCurrency(request.currentBalance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Offset Amount</p>
                  <p className="font-medium text-green-600">{formatCurrency(request.offsetAmount)}</p>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  {request.offsetType === "bank" ? (
                    <>
                      <strong>Payment Method:</strong> {request.paymentMethod?.bankName} ****{request.paymentMethod?.last4} | 
                      <strong className="ml-2">Amount to Debit:</strong> {formatCurrency(request.offsetAmount)} | 
                      <strong className="ml-2">Loan Balance After:</strong> {formatCurrency(request.currentBalance - request.offsetAmount)}
                    </>
                  ) : (
                    <>
                      <strong>{request.offsetType === "deposit" ? "Available Deposit" : "Savings Balance"}:</strong> {formatCurrency(request.offsetType === "deposit" ? (request.depositAmount || 0) : (request.contributionBalance || 0))} | 
                      <strong className="ml-2">Loan Balance After Offset:</strong> {formatCurrency(request.currentBalance - request.offsetAmount)}
                    </>
                  )}
                </AlertDescription>
              </Alert>

              {request.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => openReviewDialog(request)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Review & Approve
                  </Button>
                  <Button
                    onClick={() => openReviewDialog(request)}
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {request.reviewedAt && (
                <p className="text-xs text-gray-500 mt-4">
                  Reviewed on {new Date(request.reviewedAt).toLocaleString()}
                </p>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Balance Offset Request</DialogTitle>
            <DialogDescription>
              Review the request details and approve or reject the application
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="font-medium">{selectedRequest.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm">{selectedRequest.customerEmail}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Offset Type:</span>
                  <span className="font-medium">
                    {selectedRequest.offsetType === "deposit" ? (
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        <Coins className="h-3 w-3 mr-1" />
                        Deposit
                      </Badge>
                    ) : selectedRequest.offsetType === "contribution" ? (
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Savings
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Bank Account
                      </Badge>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loan Type:</span>
                  <span className="font-medium">{selectedRequest.loanType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Loan Balance:</span>
                  <span className="font-medium">{formatCurrency(selectedRequest.currentBalance)}</span>
                </div>
                <Separator />
                {selectedRequest.offsetType === "bank" ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Payment Method:</span>
                      <span className="font-medium text-blue-600">
                        {selectedRequest.paymentMethod?.bankName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account:</span>
                      <span className="font-medium">****{selectedRequest.paymentMethod?.last4}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {selectedRequest.offsetType === "deposit" ? "Available Deposit:" : "Savings Balance:"}
                    </span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(selectedRequest.offsetType === "deposit" ? (selectedRequest.depositAmount || 0) : (selectedRequest.contributionBalance || 0))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedRequest.offsetType === "bank" ? "Payment Amount:" : "Offset Amount:"}
                  </span>
                  <span className="font-medium text-green-600">{formatCurrency(selectedRequest.offsetAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Loan Balance:</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(selectedRequest.currentBalance - selectedRequest.offsetAmount)}
                  </span>
                </div>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-sm">
                  {selectedRequest.offsetType === "bank" ? (
                    <>
                      Approving this request will debit {formatCurrency(selectedRequest.offsetAmount)} from the customer's bank account ({selectedRequest.paymentMethod?.bankName} ****{selectedRequest.paymentMethod?.last4}) and reduce their loan balance accordingly.
                    </>
                  ) : (
                    <>
                      Approving this request will deduct {formatCurrency(selectedRequest.offsetAmount)} from the customer's 
                      {selectedRequest.offsetType === "deposit" ? " loan deposit" : " savings balance"} and reduce their loan balance accordingly.
                    </>
                  )}
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleApprove(selectedRequest)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(selectedRequest)}
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
