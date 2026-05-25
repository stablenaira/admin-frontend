import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ArrowRight, FileText, Users, Clock, GitBranch, AlertTriangle, Bot, MessageSquare } from "lucide-react";

export function WorkflowOverview() {
  const workflowSteps = [
    {
      id: 1,
      title: "Issue Discovery & Intake",
      description: "Staff submit forms → Slack channels → Bot creates Linear issues",
      icon: FileText,
      color: "bg-blue-500",
      details: [
        "Feature request forms → Feature Request Slack channel",
        "Bug report forms → Bug Report Slack channel", 
        "Custom Slack Bot processes submissions",
        "Auto-creates draft Linear issues in Intake team"
      ]
    },
    {
      id: 2,
      title: "Triage by Product Managers",
      description: "PMs categorize and assign issues using Slack bot commands",
      icon: Users,
      color: "bg-orange-500",
      details: [
        "PMs monitor Slack channels",
        "Use bot commands: /categorize LIN-123 stream=Payments",
        "Issues move from Intake → Team Backlogs",
        "PM assigns ownership in Linear"
      ]
    },
    {
      id: 3,
      title: "Prioritization & Planning",
      description: "Teams plan cycles and move issues from backlog",
      icon: Clock,
      color: "bg-purple-500",
      details: [
        "Issues organized in Team Backlogs",
        "Cycle Planning pulls issues into active cycles",
        "Weekly digest bot posts planning updates",
        "Clear visibility into upcoming work"
      ]
    },
    {
      id: 4,
      title: "Implementation",
      description: "Development work with GitHub PRs linked to Linear issues",
      icon: GitBranch,
      color: "bg-green-500",
      details: [
        "GitHub PRs linked to Linear issues",
        "Automatic status updates (In Progress → Done)",
        "Bot posts updates to original Slack threads",
        "Full visibility from request to completion"
      ]
    },
    {
      id: 5,
      title: "Emergency Escalations",
      description: "Direct escalation path from Sir Mapy through PMs",
      icon: AlertTriangle,
      color: "bg-red-500",
      details: [
        "Sir Mapy → PM direct contact",
        "PM evaluates severity",
        "/escalate bot command for critical issues",
        "High priority + Emergency tags applied"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Integration Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-medium">Slack</h3>
            <p className="text-sm text-muted-foreground">Communication & Threading</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium">Linear</h3>
            <p className="text-sm text-muted-foreground">Issue Management</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <GitBranch className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-medium">GitHub</h3>
            <p className="text-sm text-muted-foreground">Code & Pull Requests</p>
          </div>
        </div>
      </Card>

      {/* Workflow Steps */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Workflow Steps</h2>
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="relative">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Step {step.id}</Badge>
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            {index < workflowSteps.length - 1 && (
              <div className="flex justify-center my-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div> */}

      {/* Key Features */}
      {/* <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Key Architecture Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Thread-based Tracking
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Every request gets its own Slack thread</li>
              <li>• Updates from Linear & GitHub auto-post to threads</li>
              <li>• Complete audit trail from request to completion</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Centralized Categorization
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• PMs use bot commands to categorize issues</li>
              <li>• Linear reflects changes immediately</li>
              <li>• Proper team assignment and ownership</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Dual Intake Sources
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Staff via structured forms</li>
              <li>• Emergency escalations via direct contact</li>
              <li>• Both paths flow into same system</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              End-to-End Visibility
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Staff see updates in Slack threads</li>
              <li>• PMs manage categorization in Slack</li>
              <li>• Devs work in Linear + GitHub</li>
            </ul>
          </div>
        </div>
      </Card> */}
    </div>
  );
}