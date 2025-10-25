import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { MessageCircle, Send, Clock, CheckCircle2, XCircle, AlertCircle, Search, Filter, User, Mail, Calendar, Tag, Phone } from "lucide-react";
import { toast } from "sonner@2.0.3";

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

export function CustomerEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [responseText, setResponseText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadEnquiries();
    
    // Listen for updates
    const handleUpdate = () => {
      loadEnquiries();
    };
    
    window.addEventListener("enquiriesUpdated", handleUpdate);
    return () => window.removeEventListener("enquiriesUpdated", handleUpdate);
  }, []);

  const loadEnquiries = () => {
    const allEnquiries = JSON.parse(localStorage.getItem("customerEnquiries") || "[]");
    setEnquiries(allEnquiries);
  };

  const handleUpdateStatus = (enquiryId: number, newStatus: Enquiry["status"]) => {
    const updatedEnquiries = enquiries.map(enq =>
      enq.id === enquiryId
        ? { ...enq, status: newStatus, updatedAt: new Date().toISOString() }
        : enq
    );
    
    setEnquiries(updatedEnquiries);
    localStorage.setItem("customerEnquiries", JSON.stringify(updatedEnquiries));
    window.dispatchEvent(new Event("enquiriesUpdated"));
    
    toast.success(`Enquiry status updated to ${newStatus}`);
  };

  const handleUpdatePriority = (enquiryId: number, newPriority: Enquiry["priority"]) => {
    const updatedEnquiries = enquiries.map(enq =>
      enq.id === enquiryId
        ? { ...enq, priority: newPriority, updatedAt: new Date().toISOString() }
        : enq
    );
    
    setEnquiries(updatedEnquiries);
    localStorage.setItem("customerEnquiries", JSON.stringify(updatedEnquiries));
    window.dispatchEvent(new Event("enquiriesUpdated"));
    
    toast.success(`Priority updated to ${newPriority}`);
  };

  const handleSubmitResponse = () => {
    if (!selectedEnquiry || !responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    // Get admin info
    const adminEmail = localStorage.getItem("currentAdminEmail") || "Admin";

    const updatedEnquiries = enquiries.map(enq =>
      enq.id === selectedEnquiry.id
        ? {
            ...enq,
            response: responseText,
            respondedBy: adminEmail,
            respondedAt: new Date().toISOString(),
            status: "resolved" as const,
            updatedAt: new Date().toISOString(),
          }
        : enq
    );
    
    setEnquiries(updatedEnquiries);
    localStorage.setItem("customerEnquiries", JSON.stringify(updatedEnquiries));
    window.dispatchEvent(new Event("enquiriesUpdated"));
    
    toast.success("Response sent successfully!");
    setResponseText("");
    setSelectedEnquiry(null);
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

  const getPriorityBadge = (priority: string) => {
    const configs = {
      low: { label: "Low", className: "bg-gray-100 text-gray-700 border-gray-200" },
      medium: { label: "Medium", className: "bg-orange-100 text-orange-700 border-orange-200" },
      high: { label: "High", className: "bg-red-100 text-red-700 border-red-200" },
    };
    const config = configs[priority as keyof typeof configs];
    return config ? <Badge className={config.className}>{config.label}</Badge> : null;
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesSearch = 
      enq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enq.userPhone && enq.userPhone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      enq.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" ||
      enq.status === activeTab;
    
    const matchesCategory = 
      filterCategory === "all" || 
      enq.category === filterCategory;
    
    const matchesPriority = 
      filterPriority === "all" || 
      enq.priority === filterPriority;
    
    return matchesSearch && matchesTab && matchesCategory && matchesPriority;
  });

  const pendingCount = enquiries.filter(e => e.status === "pending").length;
  const inProgressCount = enquiries.filter(e => e.status === "in-progress").length;
  const resolvedCount = enquiries.filter(e => e.status === "resolved").length;
  const totalCount = enquiries.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900">Customer Enquiries</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and respond to customer support tickets</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-700">Total Enquiries</p>
              <p className="text-2xl text-indigo-900 mt-1">{totalCount}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <MessageCircle className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-700">Pending</p>
              <p className="text-2xl text-yellow-900 mt-1">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-700">In Progress</p>
              <p className="text-2xl text-blue-900 mt-1">{inProgressCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700">Resolved</p>
              <p className="text-2xl text-green-900 mt-1">{resolvedCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search enquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="loan">Loan</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="account">Account</SelectItem>
              <SelectItem value="contribution">Contribution</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgressCount})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredEnquiries.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No Enquiries Found</h3>
                <p className="text-sm text-gray-600">
                  {searchQuery || filterCategory !== "all" || filterPriority !== "all"
                    ? "No enquiries match your search criteria"
                    : "No customer enquiries yet"}
                </p>
              </Card>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <Card key={enquiry.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Avatar>
                          <AvatarFallback>
                            {enquiry.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 truncate">{enquiry.subject}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {enquiry.userName}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {enquiry.userEmail}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(enquiry.status)}
                        {getPriorityBadge(enquiry.priority)}
                      </div>
                    </div>

                    {/* Message Preview */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {enquiry.message}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {getCategoryBadge(enquiry.category)}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(enquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {enquiry.userPhone && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Phone className="h-3 w-3" />
                          {enquiry.userPhone}
                        </span>
                      )}
                      {enquiry.response && (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Responded
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedEnquiry(enquiry)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        View & Respond
                      </Button>
                      
                      {enquiry.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(enquiry.id, "in-progress")}
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Start Progress
                        </Button>
                      )}
                      
                      {enquiry.status === "resolved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(enquiry.id, "closed")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Close
                        </Button>
                      )}

                      <Select 
                        value={enquiry.priority} 
                        onValueChange={(value) => handleUpdatePriority(enquiry.id, value as any)}
                      >
                        <SelectTrigger className="h-8 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* View & Respond Dialog */}
      <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEnquiry && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <DialogTitle>{selectedEnquiry.subject}</DialogTitle>
                    <DialogDescription className="mt-1">
                      Enquiry ID: #{selectedEnquiry.id}
                    </DialogDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(selectedEnquiry.status)}
                    {getPriorityBadge(selectedEnquiry.priority)}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Customer Info */}
                <Card className="p-4 bg-gray-50">
                  <h4 className="text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="text-gray-900 mt-1">{selectedEnquiry.userName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="text-gray-900 mt-1">{selectedEnquiry.userEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone Number:</span>
                      <p className="text-gray-900 mt-1">
                        {selectedEnquiry.userPhone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">User ID:</span>
                      <p className="text-gray-900 mt-1">{selectedEnquiry.userId}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <div className="mt-1">{getCategoryBadge(selectedEnquiry.category)}</div>
                    </div>
                  </div>
                </Card>

                {/* Enquiry Details */}
                <div className="space-y-4">
                  <div>
                    <Label>Submitted On</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(selectedEnquiry.createdAt).toLocaleDateString()} at {new Date(selectedEnquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div>
                    <Label>Customer Message</Label>
                    <Card className="p-4 bg-white mt-2">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedEnquiry.message}
                      </p>
                    </Card>
                  </div>

                  {/* Existing Response */}
                  {selectedEnquiry.response && (
                    <div>
                      <Label>Your Response</Label>
                      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 mt-2">
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
                  )}

                  {/* Response Form */}
                  {!selectedEnquiry.response && (
                    <div className="space-y-2">
                      <Label>Your Response</Label>
                      <Textarea
                        placeholder="Type your response to the customer..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={6}
                        maxLength={1000}
                      />
                      <p className="text-xs text-gray-500">{responseText.length}/1000 characters</p>
                    </div>
                  )}
                </div>

                {/* Status Management */}
                <Card className="p-4 bg-indigo-50 border-indigo-200">
                  <Label className="text-indigo-900">Update Status</Label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button
                      size="sm"
                      variant={selectedEnquiry.status === "pending" ? "default" : "outline"}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, "pending")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedEnquiry.status === "in-progress" ? "default" : "outline"}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, "in-progress")}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedEnquiry.status === "resolved" ? "default" : "outline"}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, "resolved")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Resolved
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedEnquiry.status === "closed" ? "default" : "outline"}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, "closed")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Closed
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedEnquiry(null);
                    setResponseText("");
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
                {!selectedEnquiry.response && (
                  <Button
                    onClick={handleSubmitResponse}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
