import { TrendingUp, Flame, Calendar, Award } from "lucide-react";
import { Card } from "../../../components/ui/card";

interface StreakCardProps {
  streak: string;
}

const getStreakData = (streak: number) => {
    console.log(streak, "streak");
    
  if (streak === 0) {
    return {
      gradient: "from-gray-50 to-slate-50",
      border: "border-gray-200",
      textColor: "text-gray-900",
      accentColor: "text-gray-600",
      bgIcon: "bg-gray-100",
      iconColor: "text-gray-500",
      message: "Start your streak today!",
      icon: Calendar,
    };
  } else if (streak === 1) {
    return {
      gradient: "from-orange-50 to-amber-50",
      border: "border-orange-200",
      textColor: "text-orange-900",
      accentColor: "text-orange-600",
      bgIcon: "bg-orange-100",
      iconColor: "text-orange-600",
      message: "Great start! Come back tomorrow! 🎉",
      icon: Flame,
    };
  } else if (streak < 7) {
    return {
      gradient: "from-orange-50 to-red-50",
      border: "border-orange-200",
      textColor: "text-red-900",
      accentColor: "text-red-600",
      bgIcon: "bg-red-100",
      iconColor: "text-red-600",
      message: "You're on fire! Keep going! 🔥",
      icon: Flame,
    };
  } else if (streak < 30) {
    return {
      gradient: "from-green-50 to-emerald-50",
      border: "border-green-200",
      textColor: "text-green-900",
      accentColor: "text-green-600",
      bgIcon: "bg-green-100",
      iconColor: "text-green-600",
      message: "Impressive streak! Don't stop now! 💪",
      icon: TrendingUp,
    };
  } else {
    return {
      gradient: "from-purple-50 to-pink-50",
      border: "border-purple-200",
      textColor: "text-purple-900",
      accentColor: "text-purple-600",
      bgIcon: "bg-purple-100",
      iconColor: "text-purple-600",
      message: "Legendary! You're unstoppable! 🏆",
      icon: Award,
    };
  }
};

export const StreakCard = ({ streak }: StreakCardProps) => {
    
  const streakData = getStreakData(Number(streak?.split(" ")[0] || 0));
  const IconComponent = streakData.icon;

  return (
    <Card
      className={`p-6 bg-gradient-to-br ${streakData.gradient} ${streakData.border}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className={streakData.textColor}>Daily Contribution Streak</h3>
          <p className={`text-4xl font-bold ${streakData.accentColor}`}>
            {/* {streak} {streak === 1 ? "day" : "days"} */}
            {streak}
          </p>
          <p className={`text-sm ${streakData.accentColor}`}>
            {streakData.message}
          </p>
        </div>
        <div className={`${streakData.bgIcon} p-4 rounded-full shadow-sm`}>
          <IconComponent className={`h-7 w-7 ${streakData.iconColor}`} />
        </div>
      </div>
    </Card>
  );
};

// Usage example:
// import { StreakCard } from '@/components/StreakCard';
//
// <StreakCard streak={userDashboardData?.dailyContributionStreak || 0} />
