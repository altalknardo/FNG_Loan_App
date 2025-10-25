import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Bell, ArrowLeft, Mail, MessageSquare, DollarSign, Wallet, AlertCircle, CheckCircle2, Smartphone } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface NotificationSettingsProps {
  userEmail: string;
  onBack: () => void;
}

interface NotificationPreferences {
  email: {
    loanUpdates: boolean;
    paymentReminders: boolean;
    contributionUpdates: boolean;
    accountActivity: boolean;
    promotions: boolean;
  };
  push: {
    loanUpdates: boolean;
    paymentReminders: boolean;
    contributionUpdates: boolean;
    accountActivity: boolean;
    promotions: boolean;
  };
  sms: {
    paymentReminders: boolean;
    accountActivity: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
  email: {
    loanUpdates: true,
    paymentReminders: true,
    contributionUpdates: true,
    accountActivity: true,
    promotions: false,
  },
  push: {
    loanUpdates: true,
    paymentReminders: true,
    contributionUpdates: false,
    accountActivity: true,
    promotions: false,
  },
  sms: {
    paymentReminders: true,
    accountActivity: false,
  },
};

export function NotificationSettings({ userEmail, onBack }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, [userEmail]);

  const loadPreferences = () => {
    const saved = localStorage.getItem(`notificationPreferences_${userEmail}`);
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const savePreferences = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem(`notificationPreferences_${userEmail}`, JSON.stringify(preferences));
      toast.success("Notification preferences saved!");
      setSaving(false);
      setHasChanges(false);
    }, 500);
  };

  const updatePreference = (channel: keyof NotificationPreferences, type: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: value
      }
    }));
    setHasChanges(true);
  };

  const enableAll = (channel: keyof NotificationPreferences) => {
    setPreferences(prev => {
      const updated = { ...prev };
      Object.keys(updated[channel]).forEach(key => {
        (updated[channel] as any)[key] = true;
      });
      return updated;
    });
    setHasChanges(true);
  };

  const disableAll = (channel: keyof NotificationPreferences) => {
    setPreferences(prev => {
      const updated = { ...prev };
      Object.keys(updated[channel]).forEach(key => {
        (updated[channel] as any)[key] = false;
      });
      return updated;
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 px-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="flex items-center gap-2 text-lg">
            <Bell className="h-4 w-4 text-blue-600" />
            Notification Settings
          </h2>
          <p className="text-xs text-gray-600">Manage how you receive updates</p>
        </div>
      </div>

      {/* Email Notifications */}
      <Card className="p-3 sm:p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-purple-600 flex-shrink-0" />
              <h3 className="text-sm">Email</h3>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => enableAll("email")}
                className="h-7 px-2 text-xs"
              >
                All On
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disableAll("email")}
                className="h-7 px-2 text-xs"
              >
                All Off
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Loan Updates</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Approvals & disbursements</p>
              </div>
              <Switch
                checked={preferences.email.loanUpdates}
                onCheckedChange={(checked) => updatePreference("email", "loanUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Payment Reminders</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Upcoming & overdue alerts</p>
              </div>
              <Switch
                checked={preferences.email.paymentReminders}
                onCheckedChange={(checked) => updatePreference("email", "paymentReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Contribution Updates</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Daily savings & milestones</p>
              </div>
              <Switch
                checked={preferences.email.contributionUpdates}
                onCheckedChange={(checked) => updatePreference("email", "contributionUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Account Activity</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Login & security alerts</p>
              </div>
              <Switch
                checked={preferences.email.accountActivity}
                onCheckedChange={(checked) => updatePreference("email", "accountActivity", checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Promotions & Tips</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Features & offers</p>
              </div>
              <Switch
                checked={preferences.email.promotions}
                onCheckedChange={(checked) => updatePreference("email", "promotions", checked)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Push Notifications */}
      <Card className="p-3 sm:p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-green-600 flex-shrink-0" />
              <h3 className="text-sm">Push</h3>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => enableAll("push")}
                className="h-7 px-2 text-xs"
              >
                All On
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disableAll("push")}
                className="h-7 px-2 text-xs"
              >
                All Off
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Loan Updates</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Instant status changes</p>
              </div>
              <Switch
                checked={preferences.push.loanUpdates}
                onCheckedChange={(checked) => updatePreference("push", "loanUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Payment Reminders</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Deadline alerts</p>
              </div>
              <Switch
                checked={preferences.push.paymentReminders}
                onCheckedChange={(checked) => updatePreference("push", "paymentReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Contribution Updates</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Daily confirmations</p>
              </div>
              <Switch
                checked={preferences.push.contributionUpdates}
                onCheckedChange={(checked) => updatePreference("push", "contributionUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Account Activity</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Security alerts</p>
              </div>
              <Switch
                checked={preferences.push.accountActivity}
                onCheckedChange={(checked) => updatePreference("push", "accountActivity", checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Promotions & Tips</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Offers & hints</p>
              </div>
              <Switch
                checked={preferences.push.promotions}
                onCheckedChange={(checked) => updatePreference("push", "promotions", checked)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* SMS Notifications */}
      <Card className="p-3 sm:p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <h3 className="text-sm">SMS</h3>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => enableAll("sms")}
                className="h-7 px-2 text-xs"
              >
                All On
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disableAll("sms")}
                className="h-7 px-2 text-xs"
              >
                All Off
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Payment Reminders</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Before due dates</p>
              </div>
              <Switch
                checked={preferences.sms.paymentReminders}
                onCheckedChange={(checked) => updatePreference("sms", "paymentReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 py-1">
              <div className="flex-1 min-w-0">
                <Label className="text-xs">Account Activity</Label>
                <p className="text-[10px] text-gray-500 leading-tight">Critical security alerts</p>
              </div>
              <Switch
                checked={preferences.sms.accountActivity}
                onCheckedChange={(checked) => updatePreference("sms", "accountActivity", checked)}
              />
            </div>
          </div>

          <Alert className="bg-yellow-50 border-yellow-200 mt-2 py-2">
            <AlertCircle className="h-3 w-3 text-yellow-600" />
            <AlertDescription className="text-yellow-800 text-[10px] leading-tight">
              SMS may incur carrier charges
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-3 bg-gray-50">
        <div className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Active Summary
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center">
              <p className="text-[10px] text-gray-600">Email</p>
              <p className="text-xs">
                {Object.values(preferences.email).filter(Boolean).length}/{Object.keys(preferences.email).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-600">Push</p>
              <p className="text-xs">
                {Object.values(preferences.push).filter(Boolean).length}/{Object.keys(preferences.push).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-600">SMS</p>
              <p className="text-xs">
                {Object.values(preferences.sms).filter(Boolean).length}/{Object.keys(preferences.sms).length}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="sticky bottom-0 bg-white border-t p-3 -mx-4 sm:-mx-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                loadPreferences();
                setHasChanges(false);
              }}
              className="flex-1 h-9 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={savePreferences}
              disabled={saving}
              className="flex-1 h-9 text-sm"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
