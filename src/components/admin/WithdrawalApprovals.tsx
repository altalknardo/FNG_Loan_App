import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency } from "../../lib/utils";

interface WithdrawalRequest {
  id: number;
  userId: string;
  userName: string;
  amount: number;
  accountDetails: string;
  requestDate: string;
  requestTime?: string;
  status: "pending" | "approved" | "rejected";
  availableBalance: number;
  reason?: string;
  paymentMethod?: {
    type: string;
    name: string;
    last4: string;
    bankName?: string;
    cardBrand?: string;
  };
}

export function WithdrawalApprovals() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);

  // Load withdrawal requests from localStorage
  useEffect(() => {
    const loadRequests = () => {
      const saved = localStorage.getItem("withdrawalRequests");
      if (saved) {
        setRequests(JSON.parse(saved));
      }
    };
    
    loadRequests();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadRequests();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleApprove = (request: WithdrawalRequest) => {
    // Check if company has sufficient balance for withdrawal
    const companyBalance = parseFloat(localStorage.getItem("companyBalance") || "0");
    if (companyBalance < request.amount) {
      toast.error(`Insufficient company balance. Available: ${formatCurrency(companyBalance)}, Required: ${formatCurrency(request.amount)}`);
      return;
    }

    const updatedRequests = requests.map(req => 
      req.id === request.id ? { ...req, status: "approved" as const } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("withdrawalRequests", JSON.stringify(updatedRequests));

    // Deduct from contribution balance
    const currentBalance = parseFloat(localStorage.getItem("contributionBalance") || "0");
    const newBalance = currentBalance - request.amount;
    localStorage.setItem("contributionBalance", newBalance.toString());

    // AUTOMATIC DISBURSEMENT: Debit company account
    const updatedCompanyBalance = companyBalance - request.amount;
    localStorage.setItem("companyBalance", updatedCompanyBalance.toString());

    // Update transaction status and add disbursement record
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const updatedTransactions = transactions.map((t: any) => 
      t.type === "withdrawal_request" && t.amount === request.amount && t.date === request.requestDate
        ? { 
            ...t, 
            status: "completed", 
            type: "withdrawal", 
            description: t.description.replace("Request - ", ""),
            fromAccount: "Company Account",
            toAccount: request.paymentMethod ? 
              `${request.paymentMethod.bankName || request.paymentMethod.cardBrand} ****${request.paymentMethod.last4}` : 
              request.accountDetails,
            disbursedAt: new Date().toISOString()
          }
        : t
    );
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    // Record customer credit notification
    const customerNotification = {
      id: Date.now(),
      userId: request.userId,
      type: "withdrawal_credited",
      amount: request.amount,
      message: `Your withdrawal of ${formatCurrency(request.amount)} has been sent to your account`,
      timestamp: new Date().toISOString(),
      read: false
    };
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    notifications.unshift(customerNotification);
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // Trigger balance update
    window.dispatchEvent(new Event("balanceUpdated"));
    
    toast.success(`Withdrawal approved for ${request.userName}. ${formatCurrency(request.amount)} has been disbursed to their account.`);
  };

  const handleReject = (request: WithdrawalRequest) => {
    const updatedRequests = requests.map(req => 
      req.id === request.id ? { ...req, status: "rejected" as const } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("withdrawalRequests", JSON.stringify(updatedRequests));

    // Update transaction status
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const updatedTransactions = transactions.map((t: any) => 
      t.type === "withdrawal_request" && t.amount === request.amount && t.date === request.requestDate
        ? { ...t, status: "failed" }
        : t
    );
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    
    toast.success(`Withdrawal rejected for ${request.userName}`);
  };

  const pendingRequests = requests.filter(req => req.status === "pending");
  const approvedRequests = requests.filter(req => req.status === "approved");
  const rejectedRequests = requests.filter(req => req.status === "rejected");

  const RequestCard = ({ request }: { request: WithdrawalRequest }) => (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{request.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h4>{request.userName}</h4>
              <p className="text-sm text-gray-600">{request.userId}</p>
            </div>
          </div>
          <Badge variant={
            request.status === "approved" ? "default" :
            request.status === "rejected" ? "destructive" :
            "secondary"
          }>
            {request.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Withdrawal Amount</p>
            <p className="text-lg text-red-600">-{formatCurrency(request.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Available Balance</p>
            <p className="text-lg">{formatCurrency(request.availableBalance)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-600">Bank Account</p>
            <p className="text-sm">{request.accountDetails}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Request Date</p>
            <p className="text-sm">{request.requestDate} {request.requestTime && `at ${request.requestTime}`}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Remaining Balance</p>
            <p className="text-sm">{formatCurrency(request.availableBalance - request.amount)}</p>
          </div>
        </div>

        {/* Withdrawal Reason */}
        {request.reason && (
          <Alert className="bg-blue-50 border-blue-200">
            <FileText className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <p className="font-medium text-sm mb-1">Reason:</p>
              <p className="text-sm">{request.reason}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Method Details */}
        {request.paymentMethod && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-2">Payment Method Details</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{request.paymentMethod.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium">{request.paymentMethod.name}</span>
              </div>
              {request.paymentMethod.bankName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank:</span>
                  <span className="font-medium">{request.paymentMethod.bankName}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {request.status === "pending" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleApprove(request)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={() => handleReject(request)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2>Withdrawal Approvals</h2>
        <p className="text-sm text-gray-600">Review and approve withdrawal requests</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl">{pendingRequests.length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl">{approvedRequests.length}</p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl">{rejectedRequests.length}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingRequests.map(req => (
            <RequestCard key={req.id} request={req} />
          ))}
          {pendingRequests.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No pending withdrawal requests</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          {approvedRequests.map(req => (
            <RequestCard key={req.id} request={req} />
          ))}
          {approvedRequests.length === 0 && (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No approved withdrawal requests</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {rejectedRequests.map(req => (
            <RequestCard key={req.id} request={req} />
          ))}
          {rejectedRequests.length === 0 && (
            <Card className="p-8 text-center">
              <XCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No rejected withdrawal requests</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
