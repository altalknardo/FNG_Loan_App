import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { CreditCard, Building2, Plus, Trash2, Check, Shield, Search, Star, Smartphone } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { getAllBankNames, getBankByName, popularBanks, banksByType } from "../lib/nigerian-banks";

interface PaymentMethod {
  id: number;
  type: "card" | "bank";
  name: string;
  last4: string;
  bankName?: string;
  cardBrand?: string;
  bvn?: string;
  bvnVerified?: boolean;
  isDefault: boolean;
}

export function PaymentMethods() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"card" | "bank">("bank");
  
  // Load payment methods from localStorage
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem("paymentMethods");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: "bank",
        name: "Savings Account",
        last4: "4532",
        bankName: "First Bank",
        isDefault: true,
      },
      {
        id: 2,
        type: "card",
        name: "Verve Card",
        last4: "8901",
        cardBrand: "Verve",
        isDefault: false,
      },
    ];
  });

  // Form state
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [bankCategory, setBankCategory] = useState<"all" | "popular" | "commercial" | "fintech" | "microfinance">("popular");

  // Get filtered bank list based on search and category
  const getFilteredBanks = () => {
    let banks: string[] = [];
    
    switch (bankCategory) {
      case "popular":
        banks = popularBanks;
        break;
      case "commercial":
        banks = banksByType.commercial.map(b => b.name);
        break;
      case "fintech":
        banks = banksByType.fintech.map(b => b.name);
        break;
      case "microfinance":
        banks = banksByType.microfinance.map(b => b.name);
        break;
      default:
        banks = getAllBankNames();
    }
    
    if (bankSearchQuery) {
      banks = banks.filter(bank =>
        bank.toLowerCase().includes(bankSearchQuery.toLowerCase())
      );
    }
    
    return banks;
  };

  const handleAddPaymentMethod = () => {
    if (paymentType === "bank") {
      if (!accountNumber || !accountName || !bankName) {
        toast.error("Please fill in all bank account details");
        return;
      }

      const newMethod: PaymentMethod = {
        id: Date.now(),
        type: "bank",
        name: accountName,
        last4: accountNumber.slice(-4),
        bankName: bankName,
        isDefault: paymentMethods.length === 0,
      };

      const updatedMethods = [...paymentMethods, newMethod];
      setPaymentMethods(updatedMethods);
      localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
      toast.success("Bank account added successfully!");
    } else {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error("Please fill in all card details");
        return;
      }

      const newMethod: PaymentMethod = {
        id: Date.now(),
        type: "card",
        name: cardName,
        last4: cardNumber.slice(-4),
        cardBrand: "Verve",
        isDefault: paymentMethods.length === 0,
      };

      const updatedMethods = [...paymentMethods, newMethod];
      setPaymentMethods(updatedMethods);
      localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
      toast.success("Card added successfully!");
    }

    // Reset form
    setAccountNumber("");
    setAccountName("");
    setBankName("");
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
    setCvv("");
    setBankSearchQuery("");
    setBankCategory("popular");
    setIsDialogOpen(false);
  };

  const handleSetDefault = (id: number) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }));
    setPaymentMethods(updatedMethods);
    localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
    toast.success("Default payment method updated!");
  };

  const handleDelete = (id: number) => {
    const methodToDelete = paymentMethods.find((m) => m.id === id);
    if (methodToDelete?.isDefault && paymentMethods.length > 1) {
      toast.error("Please set another payment method as default before deleting this one");
      return;
    }

    const updatedMethods = paymentMethods.filter((method) => method.id !== id);
    setPaymentMethods(updatedMethods);
    localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
    toast.success("Payment method removed!");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Payment Methods</h2>
          <p className="text-sm text-gray-600">Manage your payment methods for contributions and loan repayments</p>
        </div>
      </div>

      {/* Add Payment Method */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Payment Method
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a bank account or card for payments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Payment Type Selection */}
            <div className="space-y-3">
              <Label>Payment Type</Label>
              <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as "card" | "bank")}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 className="h-4 w-4" />
                    Bank Account
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-4 w-4" />
                    Debit/Credit Card
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Bank Account Form */}
            {paymentType === "bank" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Select Bank</Label>
                  
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search for your bank..."
                      value={bankSearchQuery}
                      onChange={(e) => setBankSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Bank Category Tabs */}
                  <Tabs value={bankCategory} onValueChange={(value) => setBankCategory(value as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                      <TabsTrigger value="popular" className="text-xs px-2 py-1.5">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </TabsTrigger>
                      <TabsTrigger value="commercial" className="text-xs px-2 py-1.5">
                        <Building2 className="h-3 w-3 mr-1" />
                        Banks
                      </TabsTrigger>
                      <TabsTrigger value="fintech" className="text-xs px-2 py-1.5">
                        <Smartphone className="h-3 w-3 mr-1" />
                        Fintech
                      </TabsTrigger>
                      <TabsTrigger value="microfinance" className="text-xs px-2 py-1.5 leading-tight">
                        MFB
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Bank Selection */}
                  <div className="border rounded-lg">
                    <ScrollArea className="h-[200px]">
                      <div className="p-2 space-y-1">
                        {getFilteredBanks().length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-8">
                            No banks found matching "{bankSearchQuery}"
                          </p>
                        ) : (
                          getFilteredBanks().map((bank) => {
                            const bankInfo = getBankByName(bank);
                            const isSelected = bankName === bank;
                            
                            return (
                              <button
                                key={bank}
                                type="button"
                                onClick={() => {
                                  setBankName(bank);
                                  setBankSearchQuery("");
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                                  isSelected
                                    ? "bg-blue-50 border border-blue-200"
                                    : "hover:bg-gray-50 border border-transparent"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{bank}</p>
                                    {bankInfo?.ussdCode && (
                                      <p className="text-xs text-gray-500">{bankInfo.ussdCode}</p>
                                    )}
                                  </div>
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-blue-600" />
                                  )}
                                  {bankInfo?.type === 'fintech' && (
                                    <Badge variant="outline" className="text-xs ml-2">
                                      Digital
                                    </Badge>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  {bankName && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-900">
                        <strong>Selected:</strong> {bankName}
                      </p>
                      {getBankByName(bankName)?.ussdCode && (
                        <p className="text-xs text-blue-700 mt-1">
                          USSD: {getBankByName(bankName)?.ussdCode}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input
                    id="account-number"
                    type="text"
                    placeholder="0123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500">Enter your 10-digit account number</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input
                    id="account-name"
                    type="text"
                    placeholder="John Doe"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">This will be verified with your bank</p>
                </div>
              </div>
            )}

            {/* Card Form */}
            {paymentType === "card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNumber(value.replace(/(.{4})/g, "$1 ").trim());
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    type="text"
                    placeholder="JOHN DOE"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + "/" + value.slice(2, 4);
                        }
                        setExpiryDate(value);
                      }}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleAddPaymentMethod} className="w-full">
              Add Payment Method
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Methods List */}
      <div className="space-y-4">
        <h3>Saved Payment Methods</h3>
        {paymentMethods.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No payment methods added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add a payment method to get started</p>
          </Card>
        ) : (
          paymentMethods.map((method) => (
            <Card key={method.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${method.type === "bank" ? "bg-blue-100" : "bg-purple-100"}`}>
                  {method.type === "bank" ? (
                    <Building2 className={`h-5 w-5 ${method.type === "bank" ? "text-blue-600" : "text-purple-600"}`} />
                  ) : (
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4>{method.name}</h4>
                        {method.isDefault && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {method.type === "bank" && method.bvnVerified && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            <Shield className="h-3 w-3 mr-1" />
                            BVN Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {method.type === "bank" ? method.bankName : method.cardBrand} •••• {method.last4}
                      </p>
                      {method.type === "bank" && method.bvn && (
                        <p className="text-xs text-gray-500">
                          BVN: •••• •••• {method.bvn.slice(-3)}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(method.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="space-y-2">
            <h4 className="text-blue-900">Secure Payments</h4>
            <p className="text-sm text-blue-700">
              Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="space-y-3">
            <h4 className="text-green-900">Supported Banks & Fintech Apps</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-green-700 font-medium">{banksByType.commercial.length}+</p>
                <p className="text-xs text-green-600">Commercial Banks</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-green-700 font-medium">{banksByType.fintech.length}+</p>
                <p className="text-xs text-green-600">Fintech Apps</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-green-700 font-medium">{banksByType.microfinance.length}+</p>
                <p className="text-xs text-green-600">Microfinance Banks</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-green-700 font-medium">{getAllBankNames().length}+</p>
                <p className="text-xs text-green-600">Total Options</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="space-y-2">
            <h4 className="text-purple-900">Popular Options</h4>
            <div className="flex flex-wrap gap-2">
              {popularBanks.slice(0, 6).map((bank) => (
                <Badge key={bank} variant="outline" className="bg-white text-purple-700 border-purple-200">
                  {bank.replace(/\s*\(.*?\)\s*/g, '').length > 15 
                    ? bank.replace(/\s*\(.*?\)\s*/g, '').substring(0, 12) + '...'
                    : bank.replace(/\s*\(.*?\)\s*/g, '')}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-purple-700 mt-2">
              Including OPay, PalmPay, Kuda, Moniepoint, and all major Nigerian banks
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
