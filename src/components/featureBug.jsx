import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { MessageSquare, Bot, FileText, Send, CheckCircle, ExternalLink, Clock, AlertCircle, Link, Eye, ArrowUpRight, Plus, Copy } from "lucide-react";
import { toast } from "sonner";

export function IssueIntake() {
  const [isSubmittingFeature, setIsSubmittingFeature] = useState(false);
  const [lastSubmissionData, setLastSubmissionData] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('open') === 'feature-form') {
      setIsSheetOpen(true);
    }
  }, []);

  const featureForm = useForm({
    defaultValues: {
      title: "",
      summary: "",
      problem: "",
      impact: "",
      priority: "",
      additionalNotes: "",
      attachmentUrl: "",
    },
    mode: "onChange",
  });

  // Register the priority field for validation
  featureForm.register("priority", { required: "Priority is required" });

  const priorityOptions = [
    { value: "critical-failure", label: "Critical Failure", color: "text-red-600" },
    { value: "blocking-smooth-experience", label: "Blocking Smooth Customer Experience", color: "text-orange-600" },
    { value: "causing-churn", label: "Causing Churn", color: "text-red-500" },
    { value: "serious-revenue", label: "Could Generate Some Serious Revenue", color: "text-green-600" },
    { value: "increase-satisfaction", label: "Could Really Increase Customer Satisfaction", color: "text-blue-600" },
    { value: "nice-to-have", label: "Nice To Have", color: "text-gray-600" },
    { value: "finesse", label: "Finesse", color: "text-purple-600" }
  ];

  const onSubmitFeatureRequest = async (data) => {
    setIsSubmittingFeature(true);
    
    // Generate mock system data
    const linearIssueId = `LIN-${Math.floor(Math.random() * 9000) + 1000}`;
    const slackThreadTs = `${Date.now()}.${Math.floor(Math.random() * 1000000)}`;
    const submissionTime = new Date().toISOString();
    
    const submissionData = {
      ...data,
      reporter: "keith@smc.dev", // Mock current user
      dateSubmitted: submissionTime,
      linearIssueId,
      slackThreadTs,
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    console.log("Feature Request Submitted:", submissionData);
    setLastSubmissionData(submissionData);
    
    toast.success("Feature request submitted successfully!", {
      description: `Linear issue ${linearIssueId} created and posted to #feature-requests`,
      duration: 6000,
    });
    
    featureForm.reset();
    setIsSubmittingFeature(false);
    setIsSheetOpen(false);
  };

  const copyFormLink = () => {
    const formUrl = `${window.location.origin}${window.location.pathname}?page=intake&open=feature-form`;
    navigator.clipboard.writeText(formUrl).then(() => {
      toast.success("Form link copied to clipboard!", {
        description: "Share this link to let others submit feature requests directly",
      });
    });
  };

  const mockFeatureRequests = [
    {
      id: 1,
      linearId: "LIN-1234",
      title: "Mobile app dark mode support",
      reporter: "Sarah Chen",
      priority: "Could Really Increase Customer Satisfaction",
      status: "reported",
      thread: "12 replies",
      timeAgo: "2 minutes ago"
    },
    {
      id: 2,
      linearId: "LIN-1198",
      title: "Export data to CSV functionality",
      reporter: "Emily Watson",
      priority: "Nice To Have",
      status: "in-implementation",
      thread: "5 replies",
      timeAgo: "1 hour ago"
    },
    {
      id: 3,
      linearId: "LIN-1156",
      title: "Payment processing optimization",
      reporter: "Mike Rodriguez",
      priority: "Could Generate Some Serious Revenue",
      status: "categorized",
      thread: "8 replies",
      timeAgo: "3 hours ago"
    },
    {
      id: 4,
      linearId: "LIN-1145",
      title: "Two-factor authentication setup",
      reporter: "Alex Thompson",
      priority: "Blocking Smooth Customer Experience",
      status: "completed",
      thread: "23 replies",
      timeAgo: "6 hours ago"
    },
    {
      id: 5,
      linearId: "LIN-1132",
      title: "Advanced search filters",
      reporter: "Jessica Lee",
      priority: "Nice To Have",
      status: "backlog",
      thread: "3 replies",
      timeAgo: "1 day ago"
    },
    {
      id: 6,
      linearId: "LIN-1121",
      title: "Real-time notifications",
      reporter: "David Park",
      priority: "Could Really Increase Customer Satisfaction",
      status: "in-analysis",
      thread: "15 replies",
      timeAgo: "2 days ago"
    },
    {
      id: 7,
      linearId: "LIN-1109",
      title: "Bulk actions for data management",
      reporter: "Maria Garcia",
      priority: "Could Generate Some Serious Revenue",
      status: "in-documentation",
      thread: "7 replies",
      timeAgo: "3 days ago"
    },
    {
      id: 8,
      linearId: "LIN-1098",
      title: "Mobile app performance improvements",
      reporter: "Kevin Zhang",
      priority: "Causing Churn",
      status: "in-design-progress",
      thread: "19 replies",
      timeAgo: "4 days ago"
    },
    {
      id: 9,
      linearId: "LIN-1087",
      title: "Custom dashboard widgets",
      reporter: "Rachel Kim",
      priority: "Finesse",
      status: "blocked",
      thread: "2 replies",
      timeAgo: "5 days ago"
    },
    {
      id: 10,
      linearId: "LIN-1076",
      title: "Integration with third-party APIs",
      reporter: "Tom Wilson",
      priority: "Could Generate Some Serious Revenue",
      status: "ready-for-release",
      thread: "31 replies",
      timeAgo: "1 week ago"
    }
  ];

  const keithUpdates = [
    {
      id: 1,
      type: "status-update",
      time: "5 minutes ago",
      linearId: "LIN-1234",
      message: "📋 Status updated: Backlog → In Progress",
      details: "Assigned to Frontend Team"
    },
    {
      id: 2,
      type: "github-activity",
      time: "15 minutes ago",
      linearId: "LIN-1198",
      message: "🔀 Branch created: feature/csv-export",
      details: "Development started by @dev-alex"
    },
    {
      id: 3,
      type: "linear-comment",
      time: "1 hour ago",
      linearId: "LIN-1156",
      message: "💬 New comment from Product Manager",
      details: "Priority increased - aligns with Q1 revenue goals"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      // Backlog statuses
      case 'reported':
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">Reported</Badge>;
      case 'categorized':
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">Categorized</Badge>;
      case 'backlog':
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">Backlog</Badge>;
      
      // Planned statuses
      case 'in-analysis':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">In Analysis</Badge>;
      case 'in-documentation':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">In Documentation</Badge>;
      case 'in-qa':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">In QA</Badge>;
      
      // In Progress statuses
      case 'in-design-progress':
        return <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">In Design Progress</Badge>;
      case 'design-completed':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">Design Completed</Badge>;
      case 'in-implementation':
        return <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">In Implementation</Badge>;
      case 'in-qa-testing':
        return <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">In QA / testing</Badge>;
      case 'in-uat-review':
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">In UAT Review</Badge>;
      case 'blocked':
        return <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">Blocked</Badge>;
      
      // Completed statuses
      case 'completed':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'ready-for-release':
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">Ready for Release</Badge>;
      
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = priorityOptions.find(p => p.label === priority);
    if (priorityConfig) {
      return <span className={`text-xs ${priorityConfig.color}`}>{priority}</span>;
    }
    return <span className="text-xs text-gray-600">{priority}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Feature Requests</h1>
          <p className="text-muted-foreground">
            View and submit feature requests with automatic Linear and Slack integration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyFormLink}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Form Link
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Feature Request
          </Button>
        </div>
      </div>

      {/* Feature Requests Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h2>Recent Feature Requests</h2>
            <Badge variant="secondary">18 active</Badge>
          </div>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" />
            View in Slack
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Linear ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFeatureRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">{request.linearId}</TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate">{request.title}</TableCell>
                  <TableCell>{request.reporter}</TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{request.thread}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{request.timeAgo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Link className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>



      {/* Keith Bot Integration Flow */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="h-5 w-5 text-purple-500" />
          <h2>Keith Bot Integration Flow</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
              <h3 className="font-medium">Submit Request</h3>
            </div>
            <p className="text-sm text-muted-foreground">User fills feature form in webapp</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <h3 className="font-medium">Create & Post</h3>
            </div>
            <p className="text-sm text-muted-foreground">Linear issue created, Slack message posted</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <h3 className="font-medium">Link & Track</h3>
            </div>
            <p className="text-sm text-muted-foreground">System maintains relationships between tools</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
              <h3 className="font-medium">Auto Updates</h3>
            </div>
            <p className="text-sm text-muted-foreground">Keith posts Linear & GitHub updates to Slack</p>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Recent Keith Activity</h4>
          <div className="space-y-2">
            {keithUpdates.map((update) => (
              <div key={update.id} className="flex items-start gap-3 text-sm">
                <Bot className="h-4 w-4 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>{update.message}</span>
                    <span className="text-xs text-muted-foreground">{update.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{update.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Sheet Modal for Feature Request Form */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} className="w-[100px] bg-amber-600">
        <SheetContent className="w-[600px] sm:max-w-[50vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Submit New Feature Request
            </SheetTitle>
            <SheetDescription>
              Fill out the form below to submit a feature request with automatic Linear and Slack integration.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {/* Feature Submission Success Display */}
            {lastSubmissionData && (
              <Card className="p-4 border-green-200 bg-green-50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Feature Request Successfully Submitted</h3>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p><strong>Linear Issue:</strong> {lastSubmissionData.linearIssueId}</p>
                  <p><strong>Reporter:</strong> {lastSubmissionData.reporter}</p>
                  <p><strong>Slack Thread:</strong> #{lastSubmissionData.slackThreadTs.split('.')[0]}</p>
                  <p><strong>Submitted:</strong> {new Date(lastSubmissionData.dateSubmitted).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    View in Linear
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    View Slack Thread
                  </Button>
                </div>
              </Card>
            )}

            {/* Feature Request Form */}
            <form onSubmit={featureForm.handleSubmit(onSubmitFeatureRequest)} className="space-y-6">
              {/* Core Fields */}
              <div className="space-y-4">
                <h3 className="font-medium text-muted-foreground">Core Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title * <span className="text-xs text-muted-foreground">(≤ 80 characters)</span></label>
                  <Input 
                    placeholder="Short, clear feature name"
                    {...featureForm.register("title", { 
                      required: "Feature title is required",
                      maxLength: { value: 80, message: "Title must be 80 characters or less" },
                      minLength: { value: 5, message: "Title must be at least 5 characters" }
                    })}
                    className={featureForm.formState.errors.title ? "border-red-500" : ""}
                    maxLength={80}
                  />
                  {featureForm.formState.errors.title && (
                    <p className="text-sm text-red-500 mt-1">{featureForm.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Summary * <span className="text-xs text-muted-foreground">(≤ 280 characters)</span></label>
                  <Textarea
                    placeholder="One-line description of what this feature does"
                    rows={2}
                    {...featureForm.register("summary", { 
                      required: "Summary is required",
                      maxLength: { value: 280, message: "Summary must be 280 characters or less" },
                      minLength: { value: 10, message: "Summary must be at least 10 characters" }
                    })}
                    className={featureForm.formState.errors.summary ? "border-red-500" : ""}
                    maxLength={280}
                  />
                  {featureForm.formState.errors.summary && (
                    <p className="text-sm text-red-500 mt-1">{featureForm.formState.errors.summary.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Problem *</label>
                  <Textarea 
                    placeholder="What issue or pain point does this solve? What's the current challenge users face?"
                    rows={3}
                    {...featureForm.register("problem", { 
                      required: "Problem description is required",
                      minLength: { value: 20, message: "Problem description must be at least 20 characters" }
                    })}
                    className={featureForm.formState.errors.problem ? "border-red-500" : ""}
                  />
                  {featureForm.formState.errors.problem && (
                    <p className="text-sm text-red-500 mt-1">{featureForm.formState.errors.problem.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Impact *</label>
                  <Textarea 
                    placeholder="Why it matters - who benefits and how? What's the expected outcome?"
                    rows={3}
                    {...featureForm.register("impact", { 
                      required: "Impact description is required",
                      minLength: { value: 20, message: "Impact description must be at least 20 characters" }
                    })}
                    className={featureForm.formState.errors.impact ? "border-red-500" : ""}
                  />
                  {featureForm.formState.errors.impact && (
                    <p className="text-sm text-red-500 mt-1">{featureForm.formState.errors.impact.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority *</label>
                  <Select onValueChange={(value) => featureForm.setValue("priority", value, { shouldValidate: true })}>
                    <SelectTrigger className={featureForm.formState.errors.priority ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className={option.color}>{option.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {featureForm.formState.errors.priority && (
                    <p className="text-sm text-red-500 mt-1">Priority is required</p>
                  )}
                </div>
              </div>

              {/* Optional Fields */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-muted-foreground">Optional Information</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Attachment URL</label>
                  <Input 
                    placeholder="Link to screenshots, docs, or related materials"
                    type="url"
                    {...featureForm.register("attachmentUrl")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Additional Notes</label>
                  <Textarea 
                    placeholder="Any extra context, technical considerations, or related information"
                    rows={3}
                    {...featureForm.register("additionalNotes")}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmittingFeature}
              >
                {isSubmittingFeature ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Linear Issue & Slack Thread...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feature Request
                  </>
                )}
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}