import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  User,
  Search,
  Edit,
  Save,
  X,
  DollarSign,
  Wallet,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { formatCurrency } from "../../lib/utils";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  contributionAmount?: number;
  loanRepaymentAmount?: number;
  contributionBalance?: number;
  activeLoans?: number;
  totalLoans?: number;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    contributionAmount: "",
    loanRepaymentAmount: ""
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const loadCustomers = () => {
    // Load from KYC submissions (approved customers)
    const kycSubmissions = JSON.parse(localStorage.getItem("kycSubmissions") || "[]");
    const approvedCustomers = kycSubmissions.filter((submission: any) => submission.status === "approved");

    // Load active loans
    const activeLoans = JSON.parse(localStorage.getItem("activeLoans") || "[]");
    
    // Load loan applications for counting
    const loanApplications = JSON.parse(localStorage.getItem("loanApplications") || "[]");

    // Combine data
    const customersData = approvedCustomers.map((customer: any, index: number) => {
      const customerLoans = loanApplications.filter((loan: any) => 
        loan.status === "approved" && 
        // In production, match by actual customer ID
        true
      );

      return {
        id: customer.id || index + 1,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        city: customer.city,
        state: customer.state,
        contributionAmount: 100, // Default contribution amount
        loanRepaymentAmount: 0, // Default loan repayment amount
        contributionBalance: parseFloat(localStorage.getItem("contributionBalance") || "0"),
        activeLoans: activeLoans.length,
        totalLoans: customerLoans.length
      };
    });

    setCustomers(customersData);
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }

    setFilteredCustomers(filtered);
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      contributionAmount: (customer.contributionAmount || 100).toString(),
      loanRepaymentAmount: (customer.loanRepaymentAmount || 0).toString()
    });
    setEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedCustomer) return;

    // Validate inputs
    if (!editForm.firstName || !editForm.lastName || !editForm.email || !editForm.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const contributionAmount = parseFloat(editForm.contributionAmount);
    const loanRepaymentAmount = parseFloat(editForm.loanRepaymentAmount);

    if (isNaN(contributionAmount) || contributionAmount < 0) {
      toast.error("Please enter a valid contribution amount");
      return;
    }

    if (isNaN(loanRepaymentAmount) || loanRepaymentAmount < 0) {
      toast.error("Please enter a valid loan repayment amount");
      return;
    }

    // Update customer
    const updatedCustomers = customers.map(customer =>
      customer.id === selectedCustomer.id
        ? {
            ...customer,
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            email: editForm.email,
            phone: editForm.phone,
            contributionAmount,
            loanRepaymentAmount
          }
        : customer
    );

    setCustomers(updatedCustomers);

    // Update in KYC submissions
    const kycSubmissions = JSON.parse(localStorage.getItem("kycSubmissions") || "[]");
    const updatedSubmissions = kycSubmissions.map((submission: any) =>
      submission.id === selectedCustomer.id
        ? {
            ...submission,
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            email: editForm.email,
            phone: editForm.phone
          }
        : submission
    );
    localStorage.setItem("kycSubmissions", JSON.stringify(updatedSubmissions));

    toast.success(`Updated information for ${editForm.firstName} ${editForm.lastName}`);
    setEditDialogOpen(false);
    setSelectedCustomer(null);
  };

  const stats = {
    totalCustomers: customers.length,
    totalContributionAmount: customers.reduce((sum, c) => sum + (c.contributionAmount || 0), 0),
    averageContribution: customers.length > 0 
      ? customers.reduce((sum, c) => sum + (c.contributionAmount || 0), 0) / customers.length 
      : 0
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2>Customer Management</h2>
        <p className="text-sm text-gray-600">
          Update customer information, contribution amounts, and loan repayment settings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl">{stats.totalCustomers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Contributions</p>
              <p className="text-2xl">{formatCurrency(stats.totalContributionAmount)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Contribution</p>
              <p className="text-2xl">{formatCurrency(stats.averageContribution)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <Card className="p-12 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3>No Customers Found</h3>
          <p className="text-sm text-gray-600 mt-2">
            {searchTerm
              ? "No customers match your search"
              : "Approved customers will appear here"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="bg-blue-100 p-3 rounded-full h-fit">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3>{customer.firstName} {customer.lastName}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(customer)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{customer.phone}</span>
                      </div>
                      {customer.city && customer.state && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{customer.city}, {customer.state}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Wallet className="h-4 w-4" />
                        <span>Daily: {formatCurrency(customer.contributionAmount || 0)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>Balance: {formatCurrency(customer.contributionBalance || 0)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {customer.activeLoans || 0} Active Loans
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        {customer.totalLoans || 0} Total Loans
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Customer Information</DialogTitle>
            <DialogDescription>
              Update customer details, contribution amount, and loan settings
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h4>Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4>Financial Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contributionAmount">Daily Contribution Amount (₦) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                      <Input
                        id="contributionAmount"
                        type="number"
                        value={editForm.contributionAmount}
                        onChange={(e) => setEditForm({ ...editForm, contributionAmount: e.target.value })}
                        className="pl-8"
                        min="0"
                        step="50"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Customer's daily contribution amount
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanRepaymentAmount">Loan Repayment Override (₦)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                      <Input
                        id="loanRepaymentAmount"
                        type="number"
                        value={editForm.loanRepaymentAmount}
                        onChange={(e) => setEditForm({ ...editForm, loanRepaymentAmount: e.target.value })}
                        className="pl-8"
                        min="0"
                        step="100"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Override weekly loan repayment (0 = use calculated amount)
                    </p>
                  </div>
                </div>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Current Balance</p>
                      <p>{formatCurrency(selectedCustomer.contributionBalance || 0)}</p>
                      <p className="text-xs mt-2">
                        Active Loans: {selectedCustomer.activeLoans || 0} | Total Loans: {selectedCustomer.totalLoans || 0}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setSelectedCustomer(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
