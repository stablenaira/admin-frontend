import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/seperator";
import { Badge } from "./ui/badge";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Monitor,
  Save,
  Key,
  Trash2,
  Plus
} from "lucide-react";

export function SettingsPage() {
  const integrations = [
    {
      name: "Slack",
      status: "connected",
      description: "Slack workspace integration for notifications",
      lastSync: "2 minutes ago"
    },
    {
      name: "Linear",
      status: "connected", 
      description: "Issue tracking and project management",
      lastSync: "5 minutes ago"
    },
    {
      name: "GitHub",
      status: "connected",
      description: "Repository integration for PR tracking",
      lastSync: "1 hour ago"
    },
    {
      name: "Jira",
      status: "disconnected",
      description: "Alternative issue tracking system",
      lastSync: "Never"
    }
  ];

  const notificationSettings = [
    {
      id: "escalations",
      title: "Emergency Escalations",
      description: "Get notified when critical issues are escalated",
      enabled: true
    },
    {
      id: "assignments",
      title: "Issue Assignments",
      description: "Notifications when issues are assigned to your team",
      enabled: true
    },
    {
      id: "statusUpdates",
      title: "Status Updates",
      description: "Updates when issue status changes",
      enabled: false
    },
    {
      id: "weeklyReports",
      title: "Weekly Reports",
      description: "Summary of team performance and metrics",
      enabled: true
    },
    {
      id: "maintenance",
      title: "Maintenance Alerts",
      description: "System maintenance and downtime notifications",
      enabled: true
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and system integrations
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Profile Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input placeholder="John Doe" defaultValue="Sarah Chen" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input placeholder="john@example.com" defaultValue="sarah.chen@smc.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Select defaultValue="pm">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pm">Product Manager</SelectItem>
                <SelectItem value="dev">Developer</SelectItem>
                <SelectItem value="qa">QA Engineer</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Team</label>
            <Select defaultValue="product">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product Team</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="qa">Quality Assurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <Textarea 
            placeholder="Tell us about yourself..." 
            defaultValue="Product Manager with 5+ years experience in workflow optimization and team coordination."
            rows={3}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{setting.title}</h4>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
              <Switch defaultChecked={setting.enabled} />
            </div>
          ))}
        </div>
      </Card>

      {/* System Integrations */}
      {/* <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5" />
          <h2 className="text-lg font-semibold">System Integrations</h2>
        </div>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{integration.name}</h4>
                  <Badge 
                    variant={integration.status === "connected" ? "default" : "secondary"}
                  >
                    {integration.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{integration.description}</p>
                <p className="text-xs text-muted-foreground">
                  Last sync: {integration.lastSync}
                </p>
              </div>
              <div className="flex gap-2">
                {integration.status === "connected" ? (
                  <>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card> */}

      {/* Security Settings */}
      {/* <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Security & Privacy</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">API Keys</h4>
              <p className="text-sm text-muted-foreground">Manage API keys for integrations</p>
            </div>
            <Button variant="outline" size="sm">
              <Key className="h-4 w-4 mr-2" />
              Manage Keys
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Session Management</h4>
              <p className="text-sm text-muted-foreground">View and manage active sessions</p>
            </div>
            <Button variant="outline" size="sm">
              View Sessions
            </Button>
          </div>
        </div>
      </Card> */}

      {/* Appearance Settings */}
      {/* <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <Select defaultValue="system">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Dashboard Layout</label>
            <Select defaultValue="default">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="expanded">Expanded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card> */}

      {/* Danger Zone */}
      {/* <Card className="p-6 border-destructive">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-destructive rounded-lg">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </Card> */}
    </div>
  );
}