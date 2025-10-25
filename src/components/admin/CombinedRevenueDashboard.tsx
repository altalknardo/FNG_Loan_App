import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Wallet,
  Percent,
  Shield,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  Rocket
} from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

interface CombinedRevenueDashboardProps {
  onNavigate: (tab: string) => void;
}

export function CombinedRevenueDashboard({ onNavigate }: CombinedRevenueDashboardProps) {
  const [serviceChargeBalance, setServiceChargeBalance] = useState(0);
  const [insuranceBalance, setInsuranceBalance] = useState(0);
  const [loanInterestBalance, setLoanInterestBalance] = useState(0);
  
  // Interest by loan type
  const [smeInterest, setSmeInterest] = useState(0);
  const [businessInterest, setBusinessInterest] = useState(0);
  const [jumboInterest, setJumboInterest] = useState(0);
  
  // Reload balances periodically
  useEffect(() => {
    const loadBalances = () => {
      setServiceChargeBalance(parseFloat(localStorage.getItem("companyBalance") || "0"));
      setInsuranceBalance(parseFloat(localStorage.getItem("insuranceBalance") || "0"));
      setLoanInterestBalance(parseFloat(localStorage.getItem("loanInterestBalance") || "0"));
      
      setSmeInterest(parseFloat(localStorage.getItem("loanInterest_sme") || "0"));
      setBusinessInterest(parseFloat(localStorage.getItem("loanInterest_business") || "0"));
      setJumboInterest(parseFloat(localStorage.getItem("loanInterest_jumbo") || "0"));
    };
    
    loadBalances();
    const interval = setInterval(loadBalances, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const totalRevenue = serviceChargeBalance + insuranceBalance + loanInterestBalance;
  
  // Revenue breakdown for pie chart
  const revenueBreakdown = [
    { name: "Service Charges", value: serviceChargeBalance, color: "#10b981" },
    { name: "Insurance Fees", value: insuranceBalance, color: "#8b5cf6" },
    { name: "Loan Interest", value: loanInterestBalance, color: "#3b82f6" }
  ].filter(item => item.value > 0);
  
  // Interest by loan type for pie chart
  const interestByType = [
    { name: "SME Loans", value: smeInterest, color: "#3b82f6" },
    { name: "Business Loans", value: businessInterest, color: "#8b5cf6" },
    { name: "Jumbo Loans", value: jumboInterest, color: "#f59e0b" }
  ].filter(item => item.value > 0);
  
  // Get historical interest data
  const getInterestTrendData = () => {
    const history = JSON.parse(localStorage.getItem("interestRevenueHistory") || "[]");
    
    // Group by date
    const groupedByDate: Record<string, number> = {};
    history.forEach((entry: any) => {
      const date = entry.date;
      groupedByDate[date] = (groupedByDate[date] || 0) + entry.amount;
    });
    
    // Convert to array and sort by date
    const trendData = Object.entries(groupedByDate)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
    
    return trendData;
  };
  
  // Get daily trend with cumulative
  const getDailyTrendData = () => {
    const history = JSON.parse(localStorage.getItem("interestRevenueHistory") || "[]");
    
    // Group by date with loan types
    const groupedByDate: Record<string, { sme: number; business: number; jumbo: number; total: number }> = {};
    history.forEach((entry: any) => {
      const date = entry.date;
      if (!groupedByDate[date]) {
        groupedByDate[date] = { sme: 0, business: 0, jumbo: 0, total: 0 };
      }
      const loanType = entry.loanType || 'sme';
      groupedByDate[date][loanType] += entry.amount;
      groupedByDate[date].total += entry.amount;
    });
    
    // Convert to array and sort by date
    const trendData = Object.entries(groupedByDate)
      .map(([date, data]) => ({ 
        date, 
        SME: data.sme,
        Business: data.business,
        Jumbo: data.jumbo,
        Total: data.total
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
    
    return trendData;
  };
  
  const interestTrendData = getInterestTrendData();
  const dailyTrendData = getDailyTrendData();
  
  // Calculate percentage of total revenue
  const calculatePercentage = (amount: number) => {
    if (totalRevenue === 0) return 0;
    return ((amount / totalRevenue) * 100).toFixed(1);
  };
  
  // Calculate growth (mock data for now)
  const calculateGrowth = () => {
    // In production, compare with previous period
    return "+12.5%";
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Revenue Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive view of all revenue streams
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          Live Data
        </Badge>
      </div>
      
      {/* Total Revenue Card */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-emerald-400" />
              <p className="text-sm text-slate-300">Total Revenue</p>
            </div>
            <p className="text-4xl mb-2">{formatCurrency(totalRevenue)}</p>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">{calculateGrowth()} from last period</span>
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <DollarSign className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
      </Card>
      
      {/* Revenue Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Service Charges */}
        <Card className="p-6 border-l-4 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Monthly
            </Badge>
          </div>
          <h3 className="text-green-900 mb-1">Service Charges</h3>
          <p className="text-2xl text-green-700 mb-2">{formatCurrency(serviceChargeBalance)}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600">From contributions</span>
            <span className="text-green-700">{calculatePercentage(serviceChargeBalance)}%</span>
          </div>
        </Card>
        
        {/* Insurance Fees */}
        <Card className="p-6 border-l-4 border-purple-500 bg-gradient-to-br from-purple-50 to-fuchsia-50">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-purple-700 border-purple-300">
              One-time
            </Badge>
          </div>
          <h3 className="text-purple-900 mb-1">Insurance Fees</h3>
          <p className="text-2xl text-purple-700 mb-2">{formatCurrency(insuranceBalance)}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-600">From loan upfront</span>
            <span className="text-purple-700">{calculatePercentage(insuranceBalance)}%</span>
          </div>
        </Card>
        
        {/* Loan Interest */}
        <Card className="p-6 border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Percent className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Recurring
            </Badge>
          </div>
          <h3 className="text-blue-900 mb-1">Loan Interest</h3>
          <p className="text-2xl text-blue-700 mb-2">{formatCurrency(loanInterestBalance)}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-600">20% APR</span>
            <span className="text-blue-700">{calculatePercentage(loanInterestBalance)}%</span>
          </div>
        </Card>
      </div>
      
      {/* Tabs for different views */}
      <Tabs defaultValue="breakdown" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="interest">Interest Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        {/* Revenue Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Distribution Pie Chart */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="h-5 w-5 text-gray-600" />
                <h3>Revenue Distribution</h3>
              </div>
              {revenueBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No revenue data yet
                </div>
              )}
            </Card>
            
            {/* Revenue Summary Table */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <h3>Revenue Summary</h3>
              </div>
              <div className="space-y-4">
                {/* Service Charges Row */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm">Service Charges</p>
                      <p className="text-xs text-gray-600">Monthly deductions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(serviceChargeBalance)}</p>
                    <p className="text-xs text-gray-600">{calculatePercentage(serviceChargeBalance)}%</p>
                  </div>
                </div>
                
                {/* Insurance Row */}
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <div>
                      <p className="text-sm">Insurance Fees</p>
                      <p className="text-xs text-gray-600">Loan upfront costs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(insuranceBalance)}</p>
                    <p className="text-xs text-gray-600">{calculatePercentage(insuranceBalance)}%</p>
                  </div>
                </div>
                
                {/* Interest Row */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm">Loan Interest</p>
                      <p className="text-xs text-gray-600">Repayment interest</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(loanInterestBalance)}</p>
                    <p className="text-xs text-gray-600">{calculatePercentage(loanInterestBalance)}%</p>
                  </div>
                </div>
                
                {/* Total Row */}
                <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg border-2 border-slate-300">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-slate-700" />
                    <div>
                      <p>Total Revenue</p>
                      <p className="text-xs text-gray-600">All streams combined</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl">{formatCurrency(totalRevenue)}</p>
                    <p className="text-xs text-gray-600">100%</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        {/* Interest Analysis Tab */}
        <TabsContent value="interest" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interest by Loan Type Pie Chart */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="h-5 w-5 text-blue-600" />
                <h3>Interest by Loan Type</h3>
              </div>
              {interestByType.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={interestByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {interestByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No interest data yet
                </div>
              )}
            </Card>
            
            {/* Interest Breakdown Cards */}
            <div className="space-y-4">
              <h3 className="mb-4">Interest Revenue by Product</h3>
              
              {/* SME Loans */}
              <Card className="p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">SME Loans</p>
                      <p className="text-xs text-gray-500">₦50k - ₦1.5M</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(smeInterest)}</p>
                    <p className="text-xs text-gray-600">
                      {loanInterestBalance > 0 ? ((smeInterest / loanInterestBalance) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Business Loans */}
              <Card className="p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Business Loans</p>
                      <p className="text-xs text-gray-500">₦1.5M - ₦5M</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(businessInterest)}</p>
                    <p className="text-xs text-gray-600">
                      {loanInterestBalance > 0 ? ((businessInterest / loanInterestBalance) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Jumbo Loans */}
              <Card className="p-4 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Rocket className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jumbo Loans</p>
                      <p className="text-xs text-gray-500">₦5M+</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(jumboInterest)}</p>
                    <p className="text-xs text-gray-600">
                      {loanInterestBalance > 0 ? ((jumboInterest / loanInterestBalance) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* Total Interest */}
              <Card className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Percent className="h-6 w-6" />
                    <div>
                      <p>Total Interest Revenue</p>
                      <p className="text-xs opacity-90">20% APR on all loans</p>
                    </div>
                  </div>
                  <p className="text-2xl">{formatCurrency(loanInterestBalance)}</p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          {/* Interest Revenue Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h3>Interest Revenue Trend (Last 30 Days)</h3>
              </div>
              <Badge variant="outline">Daily</Badge>
            </div>
            {interestTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={interestTrendData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No trend data available yet. Interest will appear as customers make loan repayments.
              </div>
            )}
          </Card>
          
          {/* Interest by Loan Type Stacked */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <h3>Interest by Loan Type (Daily)</h3>
              </div>
              <Badge variant="outline">Stacked</Badge>
            </div>
            {dailyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  />
                  <Legend />
                  <Bar dataKey="SME" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Business" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="Jumbo" stackId="a" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No daily trend data yet. Data will appear as payments are processed.
              </div>
            )}
          </Card>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Avg. Daily Interest</p>
              <p className="text-xl">
                {interestTrendData.length > 0 
                  ? formatCurrency(interestTrendData.reduce((acc, curr) => acc + curr.amount, 0) / interestTrendData.length)
                  : formatCurrency(0)
                }
              </p>
            </Card>
            
            <Card className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Days Tracked</p>
              <p className="text-xl">{interestTrendData.length}</p>
            </Card>
            
            <Card className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Peak Daily Revenue</p>
              <p className="text-xl">
                {interestTrendData.length > 0 
                  ? formatCurrency(Math.max(...interestTrendData.map(d => d.amount)))
                  : formatCurrency(0)
                }
              </p>
            </Card>
            
            <Card className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
              <p className="text-xl text-green-600">+12.5%</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Quick Links */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-gray-50">
        <h3 className="mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate("company-settings")}
            className="p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm">Service Charges</p>
                <p className="text-xs text-gray-600">View details</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onNavigate("company-settings")}
            className="p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm">Insurance Fees</p>
                <p className="text-xs text-gray-600">View details</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onNavigate("loan-approvals")}
            className="p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Percent className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm">Loan Management</p>
                <p className="text-xs text-gray-600">Manage loans</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}
