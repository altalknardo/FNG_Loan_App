import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MessageCircle, Send, Clock, CheckCircle2, XCircle, AlertCircle, Search, Filter, Phone } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { formatCurrency } from "../lib/utils";

interface Enquiry {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  category: "loan" | "payment" | "account" | "contribution" | "general";
  subject: string;
  message: string;
  status: "pending" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
}

interface CustomerServiceProps {
  userEmail?: string;
}

export function CustomerService({ userEmail }: CustomerServiceProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [showNewEnquiry, setShowNewEnquiry] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Form states
  const [category, setCategory] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadEnquiries();
    
    // Listen for updates
    const handleUpdate = () => {
      loadEnquiries();
    };
    
    window.addEventListener("enquiriesUpdated", handleUpdate);
    return () => window.removeEventListener("enquiriesUpdated", handleUpdate);
  }, [userEmail]);

  const loadEnquiries = () => {
    const allEnquiries = JSON.parse(localStorage.getItem("customerEnquiries") || "[]");
    // Filter to show only current user's enquiries
    const userEnquiries = allEnquiries.filter((enq: Enquiry) => enq.userEmail === userEmail);
    setEnquiries(userEnquiries);
  };

  const handleSubmitEnquiry = () => {
    if (!category || !phoneNumber.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate phone number (Nigerian format)
    const phoneRegex = /^(\+234|234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      toast.error("Please enter a valid Nigerian phone number");
      return;
    }

    // Get user info
    const kycData = JSON.parse(localStorage.getItem("kycData") || "{}");
    const userName = kycData.fullName || "User";

    const newEnquiry: Enquiry = {
      id: Date.now(),
      userId: `USR${Date.now().toString().slice(-6)}`,
      userName,
      userEmail: userEmail || "",
      userPhone: phoneNumber,
      category: category as any,
      subject,
      message,
      status: "pending",
      priority: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const allEnquiries = JSON.parse(localStorage.getItem("customerEnquiries") || "[]");
    allEnquiries.push(newEnquiry);
    localStorage.setItem("customerEnquiries", JSON.stringify(allEnquiries));

    // Trigger update event
    window.dispatchEvent(new Event("enquiriesUpdated"));

    toast.success("Enquiry submitted successfully! We'll respond within 24 hours.");
    
    // Reset form
    setCategory("");
    setPhoneNumber("");
    setSubject("");
    setMessage("");
    setShowNewEnquiry(false);
    loadEnquiries();
  };

  const getCategoryBadge = (category: string) => {
    const configs = {
      loan: { label: "Loan", className: "bg-purple-100 text-purple-700 border-purple-200" },
      payment: { label: "Payment", className: "bg-blue-100 text-blue-700 border-blue-200" },
      account: { label: "Account", className: "bg-green-100 text-green-700 border-green-200" },
      contribution: { label: "Contribution", className: "bg-orange-100 text-orange-700 border-orange-200" },
      general: { label: "General", className: "bg-gray-100 text-gray-700 border-gray-200" },
    };
    const config = configs[category as keyof typeof configs];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      "in-progress": { label: "In Progress", icon: AlertCircle, className: "bg-blue-100 text-blue-700 border-blue-200" },
      resolved: { label: "Resolved", icon: CheckCircle2, className: "bg-green-100 text-green-700 border-green-200" },
      closed: { label: "Closed", icon: XCircle, className: "bg-gray-100 text-gray-700 border-gray-200" },
    };
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = 
      enq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || enq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = enquiries.filter(e => e.status === "pending").length;
  const inProgressCount = enquiries.filter(e => e.status === "in-progress").length;
  const resolvedCount = enquiries.filter(e => e.status === "resolved").length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Customer Service</h1>
          <p className="text-sm text-gray-600 mt-1">Get help with your account</p>
        </div>
        <Button 
          onClick={() => setShowNewEnquiry(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          New Enquiry
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100">
          <p className="text-xs text-yellow-700">Pending</p>
          <p className="text-2xl text-yellow-900 mt-1">{pendingCount}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <p className="text-xs text-blue-700">In Progress</p>
          <p className="text-2xl text-blue-900 mt-1">{inProgressCount}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <p className="text-xs text-green-700">Resolved</p>
          <p className="text-2xl text-green-900 mt-1">{resolvedCount}</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search enquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Enquiries List */}
      <div className="space-y-3">
        {filteredEnquiries.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-1">No Enquiries Yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchQuery || filterStatus !== "all" 
                ? "No enquiries match your search criteria"
                : "Submit your first enquiry to get help"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button 
                onClick={() => setShowNewEnquiry(true)}
                variant="outline"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Submit Enquiry
              </Button>
            )}
          </Card>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <Card 
              key={enquiry.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedEnquiry(enquiry)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 truncate">{enquiry.subject}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(enquiry.createdAt).toLocaleDateString()} at {new Date(enquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {getStatusBadge(enquiry.status)}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {enquiry.message}
                </p>

                <div className="flex items-center gap-2">
                  {getCategoryBadge(enquiry.category)}
                  {enquiry.response && (
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Response Available
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* New Enquiry Dialog */}
      <Dialog open={showNewEnquiry} onOpenChange={setShowNewEnquiry}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit New Enquiry</DialogTitle>
            <DialogDescription>
              Fill in the details below and we'll get back to you within 24 hours
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category <span className="text-red-600">*</span></Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select enquiry category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loan">Loan Issues</SelectItem>
                  <SelectItem value="payment">Payment Issues</SelectItem>
                  <SelectItem value="account">Account Issues</SelectItem>
                  <SelectItem value="contribution">Contribution Issues</SelectItem>
                  <SelectItem value="general">General Enquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Phone Number <span className="text-red-600">*</span></Label>
              <Input
                type="tel"
                placeholder="e.g., 08012345678 or +2348012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={20}
              />
              <p className="text-xs text-gray-500">We'll use this to contact you if needed</p>
            </div>

            <div className="space-y-2">
              <Label>Subject <span className="text-red-600">*</span></Label>
              <Input
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-gray-500">{subject.length}/100 characters</p>
            </div>

            <div className="space-y-2">
              <Label>Message <span className="text-red-600">*</span></Label>
              <Textarea
                placeholder="Provide detailed information about your enquiry..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                maxLength={500}
              />
              <p className="text-xs text-gray-500">{message.length}/500 characters</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 <span className="font-medium">Tip:</span> The more details you provide, the faster we can help resolve your issue.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowNewEnquiry(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitEnquiry}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Enquiry
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Enquiry Details Dialog */}
      <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedEnquiry && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <DialogTitle>{selectedEnquiry.subject}</DialogTitle>
                    <DialogDescription>
                      Enquiry ID: #{selectedEnquiry.id}
                    </DialogDescription>
                  </div>
                  {getStatusBadge(selectedEnquiry.status)}
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Enquiry Details */}
                <Card className="p-4 bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category</span>
                      {getCategoryBadge(selectedEnquiry.category)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Submitted</span>
                      <span className="text-gray-900">
                        {new Date(selectedEnquiry.createdAt).toLocaleDateString()} at {new Date(selectedEnquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {selectedEnquiry.updatedAt !== selectedEnquiry.createdAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="text-gray-900">
                          {new Date(selectedEnquiry.updatedAt).toLocaleDateString()} at {new Date(selectedEnquiry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Original Message */}
                <div className="space-y-2">
                  <Label>Your Message</Label>
                  <Card className="p-4 bg-white">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedEnquiry.message}
                    </p>
                  </Card>
                </div>

                {/* Response */}
                {selectedEnquiry.response ? (
                  <div className="space-y-2">
                    <Label>Our Response</Label>
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedEnquiry.response}
                      </p>
                      {selectedEnquiry.respondedBy && selectedEnquiry.respondedAt && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-xs text-blue-700">
                            Responded by {selectedEnquiry.respondedBy} on{" "}
                            {new Date(selectedEnquiry.respondedAt).toLocaleDateString()} at{" "}
                            {new Date(selectedEnquiry.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}
                    </Card>
                  </div>
                ) : (
                  <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-900">
                          Waiting for Response
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Our team is reviewing your enquiry and will respond within 24 hours.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
