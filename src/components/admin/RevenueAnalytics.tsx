import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Wallet, 
  Percent, 
  Shield, 
  TrendingUp, 
  DollarSign,
  Briefcase,
  Rocket,
  PieChart
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
  ResponsiveContainer 
} from "recharts";

interface RevenueAnalyticsProps {
  onNavigate?: (tab: string) => void;
}

export function RevenueAnalytics({ onNavigate }: RevenueAnalyticsProps) {
  // Revenue balances
  const [serviceChargeBalance, setServiceChargeBalance] = useState(0);
  const [insuranceBalance, setInsuranceBalance] = useState(0);
  const [loanInterestBalance, setLoanInterestBalance] = useState(0);
  const [loanServiceChargeBalance, setLoanServiceChargeBalance] = useState(0);
  
  // Interest breakdown by loan type
  const [smeInterest, setSmeInterest] = useState(0);
  const [businessInterest, setBusinessInterest] = useState(0);
  const [jumboInterest, setJumboInterest] = useState(0);
  
  // Interest transactions for chart
  const [interestTransactions, setInterestTransactions] = useState<any[]>([]);

  // Load all balances
  useEffect(() => {
    const loadBalances = () => {
      setServiceChargeBalance(parseFloat(localStorage.getItem("companyBalance") || "0"));
      setInsuranceBalance(parseFloat(localStorage.getItem("insuranceBalance") || "0"));
      setLoanInterestBalance(parseFloat(localStorage.getItem("loanInterestBalance") || "0"));
      setLoanServiceChargeBalance(parseFloat(localStorage.getItem("loanServiceChargeBalance") || "0"));
      
      setSmeInterest(parseFloat(localStorage.getItem("loanInterest_sme") || "0"));
      setBusinessInterest(parseFloat(localStorage.getItem("loanInterest_business") || "0"));
      setJumboInterest(parseFloat(localStorage.getItem("loanInterest_jumbo") || "0"));
      
      const transactions = JSON.parse(localStorage.getItem("interestTransactions") || "[]");
      setInterestTransactions(transactions);
    };
    
    loadBalances();
    
    // Update every second
    const interval = setInterval(loadBalances, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate totals
  const totalRevenue = serviceChargeBalance + insuranceBalance + loanInterestBalance + loanServiceChargeBalance;
  
  // Calculate percentages
  const serviceChargePercentage = totalRevenue > 0 ? (serviceChargeBalance / totalRevenue) * 100 : 0;
  const insurancePercentage = totalRevenue > 0 ? (insuranceBalance / totalRevenue) * 100 : 0;
  const interestPercentage = totalRevenue > 0 ? (loanInterestBalance / totalRevenue) * 100 : 0;
  const loanServiceChargePercentage = totalRevenue > 0 ? (loanServiceChargeBalance / totalRevenue) * 100 : 0;

  // Prepare data for revenue breakdown pie chart
  const revenueBreakdownData = [
    { name: "Monthly Service Charges", value: serviceChargeBalance, color: "#10b981" },
    { name: "Insurance Fees", value: insuranceBalance, color: "#8b5cf6" },
    { name: "Loan Interest", value: loanInterestBalance, color: "#3b82f6" },
    { name: "Loan Service Charges", value: loanServiceChargeBalance, color: "#f97316" },
  ].filter(item => item.value > 0);

  // Prepare data for loan type breakdown pie chart
  const loanTypeBreakdownData = [
    { name: "SME Loans", value: smeInterest, color: "#3b82f6" },
    { name: "Business Loans", value: businessInterest, color: "#8b5cf6" },
    { name: "Jumbo Loans", value: jumboInterest, color: "#f59e0b" },
  ].filter(item => item.value > 0);

  // Prepare data for interest trend chart (last 30 days)
  const getTrendData = () => {
    const now = new Date();
    const last30Days = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTotal = interestTransactions
        .filter(t => t.date.split('T')[0] === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      
      last30Days.push({
        date: dateStr,
        dateLabel: `${date.getMonth() + 1}/${date.getDate()}`,
        interest: dayTotal,
      });
    }
    
    return last30Days;
  };

  const trendData = getTrendData();

  // Prepare weekly aggregated data
  const getWeeklyData = () => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      
      const weekTotal = interestTransactions
        .filter(t => {
          const transDate = new Date(t.date);
          return transDate >= weekStart && transDate <= weekEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      weeks.push({
        week: `Week ${12 - i}`,
        interest: weekTotal,
      });
    }
    
    return weeks;
  };

  const weeklyData = getWeeklyData();

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2>Revenue Analytics</h2>
        <p className="text-sm text-gray-600">Comprehensive overview of all revenue streams</p>
      </div>

      {/* Total Revenue Summary */}
      <Card className="p-6 bg-gradient-to-br from-green-50 via-purple-50 to-blue-50 border-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-600 to-blue-600 p-4 rounded-full">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">Total Revenue</h3>
              <p className="text-4xl text-gray-800 mt-1">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-gray-600 mt-1">
                Combined from all revenue streams
              </p>
            </div>
          </div>
          <div className="text-right hidden lg:block">
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-end">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Monthly Service</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-600">Insurance</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Interest</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-600">Loan Service</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Service Charges */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-green-600 p-3 rounded-full">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                Monthly
              </Badge>
            </div>
            <div>
              <h4 className="text-green-900">Service Charges</h4>
              <p className="text-2xl text-green-700 mt-1">{formatCurrency(serviceChargeBalance)}</p>
              <p className="text-sm text-green-600 mt-1">
                {serviceChargePercentage.toFixed(1)}% of total revenue
              </p>
            </div>
            <div className="w-full bg-green-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-600 h-full transition-all duration-500"
                style={{ width: `${serviceChargePercentage}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Insurance */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-purple-600 p-3 rounded-full">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                One-time
              </Badge>
            </div>
            <div>
              <h4 className="text-purple-900">Insurance Fees</h4>
              <p className="text-2xl text-purple-700 mt-1">{formatCurrency(insuranceBalance)}</p>
              <p className="text-sm text-purple-600 mt-1">
                {insurancePercentage.toFixed(1)}% of total revenue
              </p>
            </div>
            <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full transition-all duration-500"
                style={{ width: `${insurancePercentage}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Loan Interest */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-blue-600 p-3 rounded-full">
                <Percent className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                20% APR
              </Badge>
            </div>
            <div>
              <h4 className="text-blue-900">Loan Interest</h4>
              <p className="text-2xl text-blue-700 mt-1">{formatCurrency(loanInterestBalance)}</p>
              <p className="text-sm text-blue-600 mt-1">
                {interestPercentage.toFixed(1)}% of total revenue
              </p>
            </div>
            <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: `${interestPercentage}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Loan Service Charges */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-orange-600 p-3 rounded-full">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                One-time
              </Badge>
            </div>
            <div>
              <h4 className="text-orange-900">Loan Service Charges</h4>
              <p className="text-2xl text-orange-700 mt-1">{formatCurrency(loanServiceChargeBalance)}</p>
              <p className="text-sm text-orange-600 mt-1">
                {loanServiceChargePercentage.toFixed(1)}% of total revenue
              </p>
            </div>
            <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-orange-600 h-full transition-all duration-500"
                style={{ width: `${loanServiceChargePercentage}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Loan Interest Breakdown by Type */}
      {loanInterestBalance > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3>Loan Interest by Type</h3>
              <p className="text-sm text-gray-600">Breakdown of interest revenue by loan category</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* SME Loans */}
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SME Loans</p>
                    <p className="text-lg text-blue-700">{formatCurrency(smeInterest)}</p>
                  </div>
                </div>
                <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full"
                    style={{ 
                      width: `${loanInterestBalance > 0 ? (smeInterest / loanInterestBalance) * 100 : 0}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {loanInterestBalance > 0 ? ((smeInterest / loanInterestBalance) * 100).toFixed(1) : 0}% of loan interest
                </p>
              </div>

              {/* Business Loans */}
              <div className="p-4 border rounded-lg bg-purple-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Loans</p>
                    <p className="text-lg text-purple-700">{formatCurrency(businessInterest)}</p>
                  </div>
                </div>
                <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full"
                    style={{ 
                      width: `${loanInterestBalance > 0 ? (businessInterest / loanInterestBalance) * 100 : 0}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {loanInterestBalance > 0 ? ((businessInterest / loanInterestBalance) * 100).toFixed(1) : 0}% of loan interest
                </p>
              </div>

              {/* Jumbo Loans */}
              <div className="p-4 border rounded-lg bg-amber-50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-amber-600 p-2 rounded-lg">
                    <Rocket className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jumbo Loans</p>
                    <p className="text-lg text-amber-700">{formatCurrency(jumboInterest)}</p>
                  </div>
                </div>
                <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full"
                    style={{ 
                      width: `${loanInterestBalance > 0 ? (jumboInterest / loanInterestBalance) * 100 : 0}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {loanInterestBalance > 0 ? ((jumboInterest / loanInterestBalance) * 100).toFixed(1) : 0}% of loan interest
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Charts */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Interest Trends</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Mix</TabsTrigger>
          <TabsTrigger value="loan-types">Loan Types</TabsTrigger>
        </TabsList>

        {/* Interest Trends Chart */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3>Loan Interest Trends</h3>
                <p className="text-sm text-gray-600">Interest revenue over the last 30 days</p>
              </div>
              
              {trendData.some(d => d.interest > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="dateLabel" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="interest" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Interest Revenue"
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No interest data yet</p>
                    <p className="text-sm">Data will appear as loan payments are made</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Weekly Aggregated Chart */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3>Weekly Interest Revenue</h3>
                <p className="text-sm text-gray-600">Interest collected per week (last 12 weeks)</p>
              </div>
              
              {weeklyData.some(d => d.interest > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="week" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="interest" 
                      fill="#3b82f6" 
                      name="Interest Revenue"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No weekly data yet</p>
                    <p className="text-sm">Data will appear as loan payments are made</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Revenue Mix Pie Chart */}
        <TabsContent value="revenue">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3>Revenue Breakdown</h3>
                <p className="text-sm text-gray-600">Distribution across all revenue streams</p>
              </div>
              
              {revenueBreakdownData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={revenueBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {revenueBreakdownData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{formatCurrency(item.value)}</p>
                          <p className="text-xs text-gray-600">
                            {((item.value / totalRevenue) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No revenue data yet</p>
                    <p className="text-sm">Data will appear as revenue is collected</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Loan Type Breakdown Pie Chart */}
        <TabsContent value="loan-types">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3>Interest by Loan Type</h3>
                <p className="text-sm text-gray-600">Distribution of interest across SME, Business, and Jumbo loans</p>
              </div>
              
              {loanTypeBreakdownData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={loanTypeBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {loanTypeBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {loanTypeBreakdownData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{formatCurrency(item.value)}</p>
                          <p className="text-xs text-gray-600">
                            {loanInterestBalance > 0 ? ((item.value / loanInterestBalance) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No loan interest data yet</p>
                    <p className="text-sm">Data will appear as loan payments are made</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
