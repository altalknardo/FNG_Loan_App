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
  CreditCard,
  Shield,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { formatCurrency } from "../../lib/utils";

interface UpfrontRefundRequest {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  loanId: number;
  loanAmount: number;
  depositAmount: number;
  loanType: string;
  completedDate: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewedAt?: string;
  paymentMethod?: {
    type: string;
    name: string;
    last4: string;
    bankName?: string;
  };
}

export function UpfrontRefunds() {
  const [requests, setRequests] = useState<UpfrontRefundRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<UpfrontRefundRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedRequest, setSelectedRequest] = useState<UpfrontRefundRequest | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    loadRefundRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, filterStatus]);

  const loadRefundRequests = () => {
    const saved = localStorage.getItem("upfrontRefundRequests");
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

  const handleApprove = (request: UpfrontRefundRequest) => {
    // Update request status
    const updatedRequests = requests.map(req =>
      req.id === request.id
        ? { ...req, status: "approved" as const, reviewedAt: new Date().toISOString() }
        : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("upfrontRefundRequests", JSON.stringify(updatedRequests));

    // Process refund - add to customer's contribution balance
    const contributionBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
    const newBalance = contributionBalance + request.depositAmount;
    localStorage.setItem("contributionBalance", newBalance.toString());

    // Deduct from loan deposits
    const loanDeposits = parseFloat(localStorage.getItem("loanDeposits") || "0");
    const newLoanDeposits = Math.max(0, loanDeposits - request.depositAmount);
    localStorage.setItem("loanDeposits", newLoanDeposits.toString());

    // Add transaction record
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.unshift({
      id: Date.now(),
      type: "deposit_refund",
      amount: request.depositAmount,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      description: `Loan Deposit Refund (10%) - Loan #${request.loanId}`,
      status: "completed"
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Trigger balance update
    window.dispatchEvent(new Event("balanceUpdated"));

    toast.success(`Loan deposit refund of ${formatCurrency(request.depositAmount)} approved for ${request.customerName}`);
    setReviewDialogOpen(false);
  };

  const handleReject = (request: UpfrontRefundRequest) => {
    const updatedRequests = requests.map(req =>
      req.id === request.id
        ? { ...req, status: "rejected" as const, reviewedAt: new Date().toISOString() }
        : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("upfrontRefundRequests", JSON.stringify(updatedRequests));

    toast.error(`Loan deposit refund request rejected for ${request.customerName}`);
    setReviewDialogOpen(false);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Pending</Badge>;
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    totalRefunded: requests
      .filter(r => r.status === "approved")
      .reduce((sum, r) => sum + r.depositAmount, 0)
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2>Loan Deposit Refunds</h2>
        <p className="text-sm text-gray-600">
          Review and approve loan deposit (10%) refund requests from customers who have completed their loan repayments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl">{stats.pending}</p>
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
              <p className="text-2xl">{stats.approved}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Refunded</p>
              <p className="text-2xl">{formatCurrency(stats.totalRefunded)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("approved")}
            >
              Approved
            </Button>
            <Button
              variant={filterStatus === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("rejected")}
            >
              Rejected
            </Button>
          </div>
        </div>
      </Card>

      {/* Refund Requests List */}
      {filteredRequests.length === 0 ? (
        <Card className="p-12 text-center">
          <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3>No Loan Deposit Refund Requests</h3>
          <p className="text-sm text-gray-600 mt-2">
            {searchTerm || filterStatus !== "all"
              ? "No requests match your filters"
              : "Loan deposit refund requests will appear here when customers with completed loans request their 10% loan deposit back"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="bg-blue-100 p-3 rounded-full h-fit">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3>{request.customerName}</h3>
                        <p className="text-sm text-gray-600">{request.customerEmail}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CreditCard className="h-4 w-4" />
                        <span>Loan #{request.loanId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>{request.loanType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(request.depositAmount)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(request.requestedAt)}</span>
                      </div>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setReviewDialogOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Review Request
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {request.status !== "pending" && request.reviewedAt && (
                      <p className="text-xs text-gray-500">
                        {request.status === "approved" ? "Approved" : "Rejected"} on{" "}
                        {formatDateTime(request.reviewedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Loan Deposit Refund Request</DialogTitle>
            <DialogDescription>
              Review the details before approving or rejecting this loan deposit refund request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3>{selectedRequest.customerName}</h3>
                    <p className="text-sm text-gray-600">{selectedRequest.customerEmail}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Loan ID</p>
                    <p className="font-medium">#{selectedRequest.loanId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Loan Type</p>
                    <p className="font-medium">{selectedRequest.loanType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Original Loan Amount</p>
                    <p className="font-medium">{formatCurrency(selectedRequest.loanAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Loan Deposit (10%)</p>
                    <p className="text-xl text-green-600">{formatCurrency(selectedRequest.depositAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Loan Completed</p>
                    <p className="font-medium">{formatDateTime(selectedRequest.completedDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Refund Requested</p>
                    <p className="font-medium">{formatDateTime(selectedRequest.requestedAt)}</p>
                  </div>
                </div>

                {selectedRequest.paymentMethod && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Refund Destination</p>
                      <Card className="p-4 bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{selectedRequest.paymentMethod.name}</p>
                            <p className="text-sm text-gray-600">
                              {selectedRequest.paymentMethod.type === "bank"
                                ? selectedRequest.paymentMethod.bankName
                                : "Card"} •••• {selectedRequest.paymentMethod.last4}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </>
                )}

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Approving this request will refund the loan deposit of {formatCurrency(selectedRequest.depositAmount)} to the customer's contribution balance.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedRequest)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedRequest)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Refund
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
