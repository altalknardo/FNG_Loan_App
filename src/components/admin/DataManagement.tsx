import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { 
  Download, 
  Archive, 
  FileText, 
  CalendarIcon,
  Database,
  Trash2
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function DataManagement() {
  const [reportType, setReportType] = useState("contributions");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleGenerateReport = () => {
    if (!dateFrom || !dateTo) {
      toast.error("Please select date range");
      return;
    }
    toast.success(`Generating ${reportType} report...`);
    // Simulate report generation
    setTimeout(() => {
      toast.success("Report generated successfully!");
    }, 2000);
  };

  const handleArchiveData = (period: string) => {
    toast.success(`Archiving data older than ${period}...`);
    setTimeout(() => {
      toast.success("Data archived successfully!");
    }, 2000);
  };

  const handleExportDatabase = () => {
    toast.success("Exporting database backup...");
    setTimeout(() => {
      toast.success("Database backup completed!");
    }, 2000);
  };

  const reportTypes = [
    { value: "contributions", label: "Contributions Report" },
    { value: "loans", label: "Loans Report" },
    { value: "withdrawals", label: "Withdrawals Report" },
    { value: "users", label: "Users Report" },
    { value: "transactions", label: "All Transactions" },
    { value: "financial", label: "Financial Summary" },
  ];

  const archivePeriods = [
    { value: "3months", label: "3 Months" },
    { value: "6months", label: "6 Months" },
    { value: "1year", label: "1 Year" },
    { value: "2years", label: "2 Years" },
  ];

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2>Data Management</h2>
        <p className="text-sm text-gray-600">Generate reports, archive data, and manage backups</p>
      </div>

      {/* Report Generation */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3>Generate Reports</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? dateFrom.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? dateTo.toLocaleDateString() : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button onClick={handleGenerateReport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate & Download Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Reports */}
      <Card className="p-6">
        <h3 className="mb-4">Quick Reports</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => toast.success("Generating daily report...")}>
            <FileText className="h-4 w-4 mr-2" />
            Daily Report
          </Button>
          <Button variant="outline" onClick={() => toast.success("Generating weekly report...")}>
            <FileText className="h-4 w-4 mr-2" />
            Weekly Report
          </Button>
          <Button variant="outline" onClick={() => toast.success("Generating monthly report...")}>
            <FileText className="h-4 w-4 mr-2" />
            Monthly Report
          </Button>
          <Button variant="outline" onClick={() => toast.success("Generating annual report...")}>
            <FileText className="h-4 w-4 mr-2" />
            Annual Report
          </Button>
        </div>
      </Card>

      {/* Data Archiving */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-purple-600" />
            <h3>Archive Old Data</h3>
          </div>
          <p className="text-sm text-gray-600">
            Archive old data to improve system performance. Archived data can be restored if needed.
          </p>

          <div className="space-y-3">
            {archivePeriods.map((period) => (
              <div key={period.value} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm">Data older than {period.label}</p>
                  <p className="text-xs text-gray-500">Move to archive storage</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleArchiveData(period.label)}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Database Backup */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-green-600" />
            <h3>Database Backup</h3>
          </div>
          <p className="text-sm text-gray-600">
            Export complete database backup for disaster recovery and data protection.
          </p>

          <div className="space-y-3">
            <Button onClick={handleExportDatabase} className="w-full bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export Full Database Backup
            </Button>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Last Backup:</strong> October 14, 2025 at 3:00 AM
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Automatic backups run daily at 3:00 AM
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Storage Info */}
      <Card className="p-6">
        <h3 className="mb-4">Storage Information</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Database Size</span>
              <span>2.4 GB / 10 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: "24%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Archive Storage</span>
              <span>5.8 GB / 50 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-purple-600 h-3 rounded-full" style={{ width: "11.6%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Backup Storage</span>
              <span>12.1 GB / 100 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full" style={{ width: "12.1%" }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            <h3 className="text-red-600">Danger Zone</h3>
          </div>
          <p className="text-sm text-gray-600">
            Permanently delete old data. This action cannot be undone.
          </p>
          <Button variant="destructive" className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Archived Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
