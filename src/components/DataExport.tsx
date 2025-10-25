import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { 
  Download, 
  FileJson, 
  FileText, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Info
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface DataExportProps {
  userEmail: string;
  onClose?: () => void;
}

export function DataExport({ userEmail, onClose }: DataExportProps) {
  const [selectedData, setSelectedData] = useState({
    profile: true,
    kyc: true,
    loans: true,
    contributions: true,
    transactions: true,
    payments: true,
    enquiries: true,
  });
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [isExporting, setIsExporting] = useState(false);

  const dataTypes = [
    { 
      key: "profile", 
      label: "Personal Information", 
      description: "Name, email, phone, address" 
    },
    { 
      key: "kyc", 
      label: "KYC Documents", 
      description: "ID verification, photos, guarantor info" 
    },
    { 
      key: "loans", 
      label: "Loan History", 
      description: "Applications, approvals, repayments" 
    },
    { 
      key: "contributions", 
      label: "Contribution Records", 
      description: "Daily contributions, withdrawals, balance" 
    },
    { 
      key: "transactions", 
      label: "Transaction History", 
      description: "All financial transactions" 
    },
    { 
      key: "payments", 
      label: "Payment Methods", 
      description: "Linked bank accounts and cards" 
    },
    { 
      key: "enquiries", 
      label: "Support Tickets", 
      description: "Customer service inquiries" 
    },
  ];

  const handleToggle = (key: string) => {
    setSelectedData(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedData).every(v => v);
    const newState = Object.keys(selectedData).reduce((acc, key) => ({
      ...acc,
      [key]: !allSelected
    }), {});
    setSelectedData(newState as typeof selectedData);
  };

  const collectUserData = () => {
    const data: any = {
      exportDate: new Date().toISOString(),
      userEmail,
      dataTypes: [],
    };

    // Profile data
    if (selectedData.profile) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === userEmail);
      data.profile = user || {};
      data.dataTypes.push("profile");
    }

    // KYC data
    if (selectedData.kyc) {
      const kycSubmissions = JSON.parse(localStorage.getItem("kycSubmissions") || "[]");
      data.kyc = kycSubmissions.filter((k: any) => k.email === userEmail);
      data.dataTypes.push("kyc");
    }

    // Loan data
    if (selectedData.loans) {
      const loans = JSON.parse(localStorage.getItem("loans") || "[]");
      data.loans = loans.filter((l: any) => l.userEmail === userEmail);
      data.dataTypes.push("loans");
    }

    // Contribution data
    if (selectedData.contributions) {
      const contributions = JSON.parse(localStorage.getItem("contributions") || "[]");
      const withdrawals = JSON.parse(localStorage.getItem("withdrawalRequests") || "[]");
      data.contributions = {
        deposits: contributions.filter((c: any) => c.userEmail === userEmail),
        withdrawals: withdrawals.filter((w: any) => w.userEmail === userEmail),
        totalContributions: localStorage.getItem("totalContributions"),
        contributionBalance: localStorage.getItem("contributionBalance"),
        currentStreak: localStorage.getItem("currentStreak"),
      };
      data.dataTypes.push("contributions");
    }

    // Transaction data
    if (selectedData.transactions) {
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
      data.transactions = transactions.filter((t: any) => t.userEmail === userEmail);
      data.dataTypes.push("transactions");
    }

    // Payment methods
    if (selectedData.payments) {
      const paymentMethods = JSON.parse(localStorage.getItem("paymentMethods") || "[]");
      data.paymentMethods = paymentMethods.filter((p: any) => p.userEmail === userEmail);
      data.dataTypes.push("payments");
    }

    // Support enquiries
    if (selectedData.enquiries) {
      const enquiries = JSON.parse(localStorage.getItem("customerEnquiries") || "[]");
      data.enquiries = enquiries.filter((e: any) => e.userId === userEmail);
      data.dataTypes.push("enquiries");
    }

    return data;
  };

  const convertToCSV = (data: any) => {
    let csv = "";

    // Add metadata
    csv += "FNG Data Export\n";
    csv += `Export Date,${data.exportDate}\n`;
    csv += `User Email,${data.userEmail}\n\n`;

    // Helper to flatten objects
    const flatten = (obj: any, prefix = ""): any => {
      return Object.keys(obj).reduce((acc: any, key) => {
        const pre = prefix.length ? prefix + "." : "";
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(acc, flatten(obj[key], pre + key));
        } else {
          acc[pre + key] = obj[key];
        }
        return acc;
      }, {});
    };

    // Convert each data type to CSV section
    data.dataTypes.forEach((type: string) => {
      const sectionData = data[type];
      
      if (!sectionData) return;

      csv += `\n=== ${type.toUpperCase()} ===\n`;

      if (Array.isArray(sectionData) && sectionData.length > 0) {
        // Get headers from first item
        const flattened = flatten(sectionData[0]);
        const headers = Object.keys(flattened);
        
        csv += headers.join(",") + "\n";
        
        // Add rows
        sectionData.forEach((item: any) => {
          const flatItem = flatten(item);
          const row = headers.map(h => {
            const value = flatItem[h];
            // Escape commas and quotes
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || "";
          });
          csv += row.join(",") + "\n";
        });
      } else if (typeof sectionData === "object") {
        // Single object
        const flattened = flatten(sectionData);
        Object.entries(flattened).forEach(([key, value]) => {
          csv += `${key},${value}\n`;
        });
      }
    });

    return csv;
  };

  const handleExport = () => {
    const hasSelection = Object.values(selectedData).some(v => v);
    
    if (!hasSelection) {
      toast.error("Please select at least one data type to export");
      return;
    }

    setIsExporting(true);

    setTimeout(() => {
      try {
        const data = collectUserData();
        let blob: Blob;
        let filename: string;

        if (format === "json") {
          // JSON export
          const jsonString = JSON.stringify(data, null, 2);
          blob = new Blob([jsonString], { type: "application/json" });
          filename = `fng-data-export-${Date.now()}.json`;
        } else {
          // CSV export
          const csvString = convertToCSV(data);
          blob = new Blob([csvString], { type: "text/csv" });
          filename = `fng-data-export-${Date.now()}.csv`;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Log export activity
        const exportLog = JSON.parse(localStorage.getItem("dataExportLog") || "[]");
        exportLog.push({
          userEmail,
          exportDate: new Date().toISOString(),
          format,
          dataTypes: Object.entries(selectedData)
            .filter(([_, selected]) => selected)
            .map(([key]) => key),
        });
        localStorage.setItem("dataExportLog", JSON.stringify(exportLog));

        toast.success(`Data exported successfully as ${format.toUpperCase()}`);
        setIsExporting(false);
        
        if (onClose) {
          setTimeout(onClose, 1000);
        }
      } catch (error) {
        console.error("Export error:", error);
        toast.error("Failed to export data");
        setIsExporting(false);
      }
    }, 1500);
  };

  const selectedCount = Object.values(selectedData).filter(v => v).length;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-2">
          <Database className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="mb-1">Export Your Data</h2>
            <p className="text-sm text-gray-600">
              Download a copy of your personal data from FNG
            </p>
          </div>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 mb-6">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-xs sm:text-sm">
          <strong>GDPR & NDPR Compliance:</strong> You have the right to access and download your personal data at any time. This export includes all data associated with your account.
        </AlertDescription>
      </Alert>

      {/* Data Type Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm">Select Data to Export</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs"
          >
            {Object.values(selectedData).every(v => v) ? "Deselect All" : "Select All"}
          </Button>
        </div>

        <div className="space-y-3">
          {dataTypes.map((type) => (
            <div
              key={type.key}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                id={type.key}
                checked={selectedData[type.key as keyof typeof selectedData]}
                onCheckedChange={() => handleToggle(type.key)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label
                  htmlFor={type.key}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <span className="text-sm">{type.label}</span>
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {selectedCount} of {dataTypes.length} data types selected
        </p>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <h3 className="text-sm mb-3">Export Format</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setFormat("json")}
            className={`p-4 rounded-lg border-2 transition-all ${
              format === "json"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FileJson className={`h-6 w-6 mx-auto mb-2 ${
              format === "json" ? "text-blue-600" : "text-gray-400"
            }`} />
            <p className="text-sm mb-1">JSON</p>
            <p className="text-xs text-gray-500">
              Structured data format
            </p>
          </button>

          <button
            onClick={() => setFormat("csv")}
            className={`p-4 rounded-lg border-2 transition-all ${
              format === "csv"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <FileText className={`h-6 w-6 mx-auto mb-2 ${
              format === "csv" ? "text-blue-600" : "text-gray-400"
            }`} />
            <p className="text-sm mb-1">CSV</p>
            <p className="text-xs text-gray-500">
              Spreadsheet compatible
            </p>
          </button>
        </div>
      </div>

      {/* Export Info */}
      <Alert className="bg-gray-50 border-gray-200 mb-6">
        <AlertCircle className="h-4 w-4 text-gray-600" />
        <AlertDescription className="text-gray-700 text-xs">
          <ul className="list-disc ml-4 space-y-1">
            <li>Your data will be downloaded to your device</li>
            <li>Files may contain sensitive information - store securely</li>
            <li>Export includes all data up to the current date</li>
            <li>This action is logged for security purposes</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleExport}
          disabled={isExporting || selectedCount === 0}
          className="flex-1"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Preparing Export...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Data ({format.toUpperCase()})
            </>
          )}
        </Button>

        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Success State */}
      {selectedCount > 0 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Ready to export {selectedCount} data type{selectedCount !== 1 ? 's' : ''}</span>
        </div>
      )}
    </Card>
  );
}
