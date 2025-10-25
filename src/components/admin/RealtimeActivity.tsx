import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { 
  Activity, 
  UserPlus, 
  DollarSign, 
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

interface ActivityLog {
  id: number;
  type: "contribution" | "loan_application" | "withdrawal" | "user_registered" | "loan_approved" | "loan_rejected";
  user: string;
  description: string;
  amount?: number;
  timestamp: string;
  status?: "success" | "pending" | "rejected";
}

export function RealtimeActivity() {
  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: 1,
      type: "contribution",
      user: "Sarah Johnson",
      description: "Made daily contribution",
      amount: 50,
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      status: "success",
    },
    {
      id: 2,
      type: "loan_application",
      user: "Michael Adeyemi",
      description: "Applied for loan",
      amount: 50000,
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      status: "pending",
    },
    {
      id: 3,
      type: "loan_approved",
      user: "John Doe",
      description: "Loan approved",
      amount: 30000,
      timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
      status: "success",
    },
    {
      id: 4,
      type: "withdrawal",
      user: "Jane Smith",
      description: "Requested withdrawal",
      amount: 25000,
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      status: "pending",
    },
    {
      id: 5,
      type: "user_registered",
      user: "Amina Ibrahim",
      description: "New user registered",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      status: "pending",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: ActivityLog = {
        id: Date.now(),
        type: ["contribution", "loan_application", "withdrawal"][Math.floor(Math.random() * 3)] as any,
        user: ["User " + Math.floor(Math.random() * 100)][0],
        description: "New activity",
        amount: Math.floor(Math.random() * 100000),
        timestamp: new Date().toISOString(),
        status: "success",
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 50));
    }, 10000); // New activity every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "contribution":
        return <TrendingUp className="h-4 w-4" />;
      case "loan_application":
      case "loan_approved":
      case "loan_rejected":
        return <DollarSign className="h-4 w-4" />;
      case "withdrawal":
        return <TrendingUp className="h-4 w-4 rotate-180" />;
      case "user_registered":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityLog["type"]) => {
    switch (type) {
      case "contribution":
        return "bg-green-100 text-green-600";
      case "loan_application":
        return "bg-blue-100 text-blue-600";
      case "loan_approved":
        return "bg-green-100 text-green-600";
      case "loan_rejected":
        return "bg-red-100 text-red-600";
      case "withdrawal":
        return "bg-orange-100 text-orange-600";
      case "user_registered":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status?: ActivityLog["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const activityStats = {
    total: activities.length,
    contributions: activities.filter(a => a.type === "contribution").length,
    loanApplications: activities.filter(a => a.type === "loan_application").length,
    withdrawals: activities.filter(a => a.type === "withdrawal").length,
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2>Real-time Activity Monitor</h2>
        <p className="text-sm text-gray-600">Live stream of all platform activities</p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl">{activityStats.total}</p>
              <p className="text-xs text-gray-600">Total Events</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl">{activityStats.contributions}</p>
              <p className="text-xs text-gray-600">Contributions</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl">{activityStats.loanApplications}</p>
              <p className="text-xs text-gray-600">Loan Apps</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 rotate-180" />
            </div>
            <div>
              <p className="text-2xl">{activityStats.withdrawals}</p>
              <p className="text-xs text-gray-600">Withdrawals</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Activity Feed</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600">Live</span>
          </div>
        </div>

        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {" - "}
                        {activity.description}
                      </p>
                      {activity.amount && (
                        <p className="text-sm text-gray-600">
                          Amount: ₦{activity.amount.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                    {activity.status && (
                      <div className="flex items-center gap-1">
                        {getStatusIcon(activity.status)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
