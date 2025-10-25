import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { 
  AlertTriangle, 
  Phone, 
  Mail, 
  User, 
  DollarSign, 
  Calendar, 
  Clock,
  Eye,
  MessageSquare,
  Ban,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  TrendingDown,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency } from "../../lib/utils";

interface Loan {
  id: number;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  amount: number;
  balance: number;
  weeklyPayment: number;
  nextPayment: string;
  status: "active" | "completed" | "defaulted" | "suspended";
  disbursedDate: string;
  period: number;
  loanType?: "sme" | "business" | "jumbo";
  missedPayments?: number;
  daysOverdue?: number;
  lastPaymentDate?: string;
  totalPaid?: number;
}

interface DefaulterDetails {
  loan: Loan;
  overdueAmount: number;
  daysOverdue: number;
  missedPayments: number;
  nextScheduledPayment: string;
  contactAttempts?: number;
  lastContactDate?: string;
  notes?: string;
}

export function LoanDefaulters() {
  const [defaulters, setDefaulters] = useState<DefaulterDetails[]>([]);
  const [selectedDefaulter, setSelectedDefaulter] = useState<DefaulterDetails | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "mild" | "moderate" | "severe">("all");
  const [contactMessage, setContactMessage] = useState("");
  const [actionNotes, setActionNotes] = useState("");

  useEffect(() => {
    loadDefaulters();
    
    // Refresh every minute
    const interval = setInterval(loadDefaulters, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadDefaulters = () => {
    const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    const today = new Date();
    
    const defaultersList: DefaulterDetails[] = [];
    
    loans.forEach((loan: Loan) => {
      if (loan.status === "active" || loan.status === "defaulted") {
        const nextPaymentDate = new Date(loan.nextPayment);
        const daysOverdue = Math.floor((today.getTime() - nextPaymentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Consider overdue if payment date has passed
        if (daysOverdue > 0) {
          // Calculate missed payments based on weekly schedule
          const weeksMissed = Math.ceil(daysOverdue / 7);
          const overdueAmount = loan.weeklyPayment * weeksMissed;
          
          // Get saved defaulter data
          const defaulterData = JSON.parse(localStorage.getItem("defaulterData") || "{}");
          const savedData = defaulterData[loan.id] || {};
          
          defaultersList.push({
            loan: {
              ...loan,
              missedPayments: weeksMissed,
              daysOverdue: daysOverdue,
            },
            overdueAmount: overdueAmount,
            daysOverdue: daysOverdue,
            missedPayments: weeksMissed,
            nextScheduledPayment: loan.nextPayment,
            contactAttempts: savedData.contactAttempts || 0,
            lastContactDate: savedData.lastContactDate || null,
            notes: savedData.notes || "",
          });
        }
      }
    });
    
    // Sort by days overdue (most severe first)
    defaultersList.sort((a, b) => b.daysOverdue - a.daysOverdue);
    
    setDefaulters(defaultersList);
  };

  const getSeverityLevel = (daysOverdue: number): "mild" | "moderate" | "severe" => {
    if (daysOverdue <= 7) return "mild";
    if (daysOverdue <= 30) return "moderate";
    return "severe";
  };

  const getSeverityBadge = (daysOverdue: number) => {
    const severity = getSeverityLevel(daysOverdue);
    
    if (severity === "mild") {
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">1 Week Overdue</Badge>;
    } else if (severity === "moderate") {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">2-4 Weeks Overdue</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Severely Overdue</Badge>;
    }
  };

  const handleViewDetails = (defaulter: DefaulterDetails) => {
    setSelectedDefaulter(defaulter);
    setViewDialogOpen(true);
  };

  const handleContactDefaulter = (defaulter: DefaulterDetails) => {
    setSelectedDefaulter(defaulter);
    setContactMessage(`Dear ${defaulter.loan.userName},\n\nThis is a reminder that your loan payment of ${formatCurrency(defaulter.loan.weeklyPayment)} was due on ${new Date(defaulter.nextScheduledPayment).toLocaleDateString()}.\n\nYou are currently ${defaulter.daysOverdue} days overdue with ${defaulter.missedPayments} missed payment(s).\n\nTotal overdue amount: ${formatCurrency(defaulter.overdueAmount)}\n\nPlease make payment immediately to avoid suspension of your account.\n\nThank you.`);
    setActionDialogOpen(true);
  };

  const handleSendContact = () => {
    if (!selectedDefaulter) return;
    
    // Save contact attempt
    const defaulterData = JSON.parse(localStorage.getItem("defaulterData") || "{}");
    defaulterData[selectedDefaulter.loan.id] = {
      ...defaulterData[selectedDefaulter.loan.id],
      contactAttempts: (defaulterData[selectedDefaulter.loan.id]?.contactAttempts || 0) + 1,
      lastContactDate: new Date().toISOString(),
      notes: actionNotes || defaulterData[selectedDefaulter.loan.id]?.notes || "",
    };
    localStorage.setItem("defaulterData", JSON.stringify(defaulterData));
    
    // Log activity
    const activities = JSON.parse(localStorage.getItem("realtimeActivities") || "[]");
    activities.unshift({
      id: Date.now(),
      type: "defaulter_contact",
      description: `Contacted defaulter: ${selectedDefaulter.loan.userName} (Loan #${selectedDefaulter.loan.id})`,
      timestamp: new Date().toISOString(),
      user: "Admin",
      status: "completed",
    });
    localStorage.setItem("realtimeActivities", JSON.stringify(activities.slice(0, 100)));
    
    toast.success(`Contact message sent to ${selectedDefaulter.loan.userName}`);
    setActionDialogOpen(false);
    setContactMessage("");
    setActionNotes("");
    loadDefaulters();
  };

  const handleSuspendAccount = (defaulter: DefaulterDetails) => {
    if (!confirm(`Are you sure you want to suspend ${defaulter.loan.userName}'s account? This will prevent them from accessing services.`)) {
      return;
    }
    
    // Update loan status
    const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    const updatedLoans = loans.map((loan: Loan) => {
      if (loan.id === defaulter.loan.id) {
        return { ...loan, status: "suspended" };
      }
      return loan;
    });
    localStorage.setItem("activeLoans", JSON.stringify(updatedLoans));
    
    // Log activity
    const activities = JSON.parse(localStorage.getItem("realtimeActivities") || "[]");
    activities.unshift({
      id: Date.now(),
      type: "account_suspension",
      description: `Suspended account: ${defaulter.loan.userName} (Loan #${defaulter.loan.id}) - ${defaulter.daysOverdue} days overdue`,
      timestamp: new Date().toISOString(),
      user: "Admin",
      status: "completed",
    });
    localStorage.setItem("realtimeActivities", JSON.stringify(activities.slice(0, 100)));
    
    toast.success(`Account suspended for ${defaulter.loan.userName}`);
    loadDefaulters();
  };

  const handleMarkAsPaid = (defaulter: DefaulterDetails) => {
    if (!confirm(`Mark overdue payment as received for ${defaulter.loan.userName}?`)) {
      return;
    }
    
    // Update loan next payment date
    const loans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    const updatedLoans = loans.map((loan: Loan) => {
      if (loan.id === defaulter.loan.id) {
        const nextPayment = new Date();
        nextPayment.setDate(nextPayment.getDate() + 7); // Next week
        return { 
          ...loan, 
          nextPayment: nextPayment.toISOString(),
          balance: Math.max(0, loan.balance - defaulter.overdueAmount),
          totalPaid: (loan.totalPaid || 0) + defaulter.overdueAmount,
        };
      }
      return loan;
    });
    localStorage.setItem("activeLoans", JSON.stringify(updatedLoans));
    
    // Clear defaulter data
    const defaulterData = JSON.parse(localStorage.getItem("defaulterData") || "{}");
    delete defaulterData[defaulter.loan.id];
    localStorage.setItem("defaulterData", JSON.stringify(defaulterData));
    
    // Log activity
    const activities = JSON.parse(localStorage.getItem("realtimeActivities") || "[]");
    activities.unshift({
      id: Date.now(),
      type: "payment_received",
      description: `Overdue payment received: ${defaulter.loan.userName} - ${formatCurrency(defaulter.overdueAmount)}`,
      timestamp: new Date().toISOString(),
      user: "Admin",
      status: "completed",
    });
    localStorage.setItem("realtimeActivities", JSON.stringify(activities.slice(0, 100)));
    
    toast.success(`Payment marked as received for ${defaulter.loan.userName}`);
    loadDefaulters();
  };

  const exportDefaultersReport = () => {
    const csvContent = [
      ["Loan ID", "Customer Name", "Phone", "Email", "Loan Amount", "Overdue Amount", "Days Overdue", "Missed Payments", "Severity", "Contact Attempts", "Last Contact"],
      ...defaulters.map(d => [
        d.loan.id,
        d.loan.userName,
        d.loan.userPhone || "N/A",
        d.loan.userEmail || "N/A",
        d.loan.amount,
        d.overdueAmount,
        d.daysOverdue,
        d.missedPayments,
        getSeverityLevel(d.daysOverdue),
        d.contactAttempts || 0,
        d.lastContactDate ? new Date(d.lastContactDate).toLocaleDateString() : "Never",
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loan-defaulters-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast.success("Defaulters report exported successfully");
  };

  const filteredDefaulters = defaulters.filter(d => {
    const matchesSearch = 
      d.loan.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.loan.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.loan.userPhone?.includes(searchQuery) ||
      d.loan.id.toString().includes(searchQuery);
    
    const severity = getSeverityLevel(d.daysOverdue);
    const matchesFilter = filterStatus === "all" || severity === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: defaulters.length,
    mild: defaulters.filter(d => getSeverityLevel(d.daysOverdue) === "mild").length,
    moderate: defaulters.filter(d => getSeverityLevel(d.daysOverdue) === "moderate").length,
    severe: defaulters.filter(d => getSeverityLevel(d.daysOverdue) === "severe").length,
    totalOverdue: defaulters.reduce((sum, d) => sum + d.overdueAmount, 0),
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl mb-2">Loan Defaulters</h1>
        <p className="text-sm text-gray-600">
          Monitor and manage customers with overdue loan payments
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Total Defaulters</p>
              <p className="text-lg sm:text-xl text-red-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Mild (≤1 Week)</p>
              <p className="text-lg sm:text-xl">{stats.mild}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Moderate (2-4w)</p>
              <p className="text-lg sm:text-xl">{stats.moderate}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Severe (&gt;4w)</p>
              <p className="text-lg sm:text-xl">{stats.severe}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600">Total Overdue</p>
              <p className="text-base sm:text-lg text-purple-900">{formatCurrency(stats.totalOverdue)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or loan ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 sm:h-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border rounded-lg text-sm bg-white h-9 sm:h-10"
            >
              <option value="all">All Severity</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
            <Button
              onClick={exportDefaultersReport}
              variant="outline"
              size="sm"
              className="h-9 sm:h-10"
              disabled={defaulters.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Defaulters List */}
      {filteredDefaulters.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          {defaulters.length === 0 ? (
            <>
              <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg mb-2">No Loan Defaulters!</h3>
              <p className="text-sm text-gray-600">
                All customers are up to date with their loan payments.
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg mb-2">No Results Found</h3>
              <p className="text-sm text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDefaulters.map((defaulter) => (
            <Card key={defaulter.loan.id} className="p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarFallback className="bg-red-100 text-red-700">
                      {defaulter.loan.userName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base truncate">{defaulter.loan.userName}</h3>
                      {getSeverityBadge(defaulter.daysOverdue)}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                      <p className="text-xs text-gray-600">Loan #{defaulter.loan.id}</p>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <p className="text-xs text-gray-600">{defaulter.daysOverdue} days overdue</p>
                      <span className="hidden sm:inline text-gray-300">•</span>
                      <p className="text-xs text-gray-600">{defaulter.missedPayments} payment(s) missed</p>
                    </div>
                  </div>
                </div>

                {/* Amount Info */}
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Overdue Amount</p>
                    <p className="text-base sm:text-lg text-red-600">{formatCurrency(defaulter.overdueAmount)}</p>
                    {defaulter.contactAttempts ? (
                      <p className="text-xs text-gray-500">
                        Contacted {defaulter.contactAttempts}x
                      </p>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewDetails(defaulter)}
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 sm:px-3"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">View</span>
                    </Button>
                    <Button
                      onClick={() => handleContactDefaulter(defaulter)}
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 sm:px-3"
                      title="Contact Customer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Contact</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Defaulter Details</DialogTitle>
            <DialogDescription>
              Complete information about the overdue loan
            </DialogDescription>
          </DialogHeader>

          {selectedDefaulter && (
            <div className="space-y-4">
              {/* Customer Information */}
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p>{selectedDefaulter.loan.userName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">User ID</p>
                    <p>{selectedDefaulter.loan.userId}</p>
                  </div>
                  {selectedDefaulter.loan.userPhone && (
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p>{selectedDefaulter.loan.userPhone}</p>
                    </div>
                  )}
                  {selectedDefaulter.loan.userEmail && (
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="truncate">{selectedDefaulter.loan.userEmail}</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Loan Information */}
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Loan Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Loan ID</p>
                    <p>#{selectedDefaulter.loan.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Loan Type</p>
                    <p className="capitalize">{selectedDefaulter.loan.loanType || "Standard"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Original Amount</p>
                    <p>{formatCurrency(selectedDefaulter.loan.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Balance</p>
                    <p>{formatCurrency(selectedDefaulter.loan.balance)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Weekly Payment</p>
                    <p>{formatCurrency(selectedDefaulter.loan.weeklyPayment)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Disbursed Date</p>
                    <p>{new Date(selectedDefaulter.loan.disbursedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>

              {/* Overdue Information */}
              <Card className="p-4 bg-red-50 border-red-200">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Overdue Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Days Overdue</p>
                    <p className="text-red-600 font-medium">{selectedDefaulter.daysOverdue} days</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Missed Payments</p>
                    <p className="text-red-600 font-medium">{selectedDefaulter.missedPayments}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Overdue Amount</p>
                    <p className="text-red-600 font-medium">{formatCurrency(selectedDefaulter.overdueAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Severity Level</p>
                    <p className="font-medium capitalize">{getSeverityLevel(selectedDefaulter.daysOverdue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expected Payment Date</p>
                    <p>{new Date(selectedDefaulter.nextScheduledPayment).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact Attempts</p>
                    <p>{selectedDefaulter.contactAttempts || 0}</p>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              {selectedDefaulter.notes && (
                <Card className="p-4">
                  <h3 className="text-sm font-medium mb-2">Admin Notes</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedDefaulter.notes}</p>
                </Card>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleContactDefaulter(selectedDefaulter);
                  }}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Customer
                </Button>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleMarkAsPaid(selectedDefaulter);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleSuspendAccount(selectedDefaulter);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend Account
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact/Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Defaulter</DialogTitle>
            <DialogDescription>
              Send a reminder message to {selectedDefaulter?.loan.userName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Contact Methods */}
            <div className="flex gap-2 flex-wrap">
              {selectedDefaulter?.loan.userPhone && (
                <Badge variant="outline" className="text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  {selectedDefaulter.loan.userPhone}
                </Badge>
              )}
              {selectedDefaulter?.loan.userEmail && (
                <Badge variant="outline" className="text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  {selectedDefaulter.loan.userEmail}
                </Badge>
              )}
            </div>

            {/* Message Template */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={8}
                className="text-sm"
              />
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <Label>Admin Notes (Internal)</Label>
              <Textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Add internal notes about this contact attempt..."
                rows={3}
                className="text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSendContact} className="flex-1">
                Send Message
              </Button>
              <Button
                onClick={() => {
                  setActionDialogOpen(false);
                  setContactMessage("");
                  setActionNotes("");
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
