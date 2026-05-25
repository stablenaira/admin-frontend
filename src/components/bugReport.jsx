import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Bug, Send, CheckCircle, ExternalLink, Clock, AlertCircle, Eye, Link, ArrowUpRight, Plus, Copy } from "lucide-react";
import { toast } from "sonner";

const productOptions = [
  { value: "peniwallet", label: "PeniWallet" },
  { value: "peniremit", label: "PeniRemit" },
  { value: "smc-dao", label: "SMC DAO" },
  { value: "other", label: "Other" }
];

const streamOptions = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "backend", label: "Backend" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" }
];

const severityOptions = [
  { value: "critical-failure", label: "Critical Failure", color: "text-red-600" },
  { value: "blocking-experience", label: "Blocking Experience", color: "text-orange-600" },
  { value: "causing-churn", label: "Causing Churn", color: "text-yellow-600" },
  { value: "annoying-workable", label: "Annoying but Workable", color: "text-blue-600" },
  { value: "cosmetic-minor", label: "Cosmetic / Minor", color: "text-green-600" }
];

const functionalAreaOptions = [
  "Authentication & Security",
  "Payment Processing",
  "User Management",
  "Dashboard & Analytics",
  "API & Integrations",
  "Mobile App",
  "Web Interface",
  "Backend Services",
  "Database",
  "Infrastructure"
];

export function BugReport() {
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);
  const [lastBugSubmissionData, setLastBugSubmissionData] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('open') === 'bug-form') {
      setIsSheetOpen(true);
    }
  }, []);

  const bugForm = useForm({
    defaultValues: {
      title: "",
      summary: "",
      product: "",
      stream: "",
      severity: "",
      stepsToReproduce: "",
      expectedBehavior: "",
      actualBehavior: "",
      occurrence: "",
      clientType: "",
      device: "",
      osVersion: "",
      appBuild: "",
      network: "",
      userId: "",
      userEmail: "",
      accountType: "",
      transactionType: "",
      transactionRef: "",
      amount: "",
      timestamp: "",
      blockchainNetwork: "",
      tokenAsset: "",
      txHash: "",
      walletAddress: "",
      fiatProvider: "",
      maskedCard: "",
      authCode: "",
      functionalArea: "",
      usersAffected: "",
      suspectedCause: "",
      workaroundAvailable: "",
      environment: "",
      attachmentUrl: "",
      additionalNotes: ""
    }
  });

  const onSubmitBugReport = async (data) => {
    setIsSubmittingBug(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const submissionData = {
      linearIssueId: `BUG-${Math.floor(Math.random() * 9000) + 1000}`,
      reporter: "John Doe",
      slackThreadTs: `${Date.now()}.000`,
      dateSubmitted: new Date().toISOString()
    };
    
    setLastBugSubmissionData(submissionData);
    
    toast.success("Bug report submitted successfully!", {
      description: `Linear issue ${submissionData.linearIssueId} created and posted to #bugs channel`,
    });
    
    bugForm.reset();
    setIsSubmittingBug(false);
    setIsSheetOpen(false);
  };

  const copyFormLink = () => {
    const formUrl = `${window.location.origin}${window.location.pathname}?page=bugs&open=bug-form`;
    navigator.clipboard.writeText(formUrl).then(() => {
      toast.success("Form link copied to clipboard!", {
        description: "Share this link to let others submit bug reports directly",
      });
    });
  };

  const mockBugReports = [
    {
      id: 1,
      linearId: "BUG-2341",
      title: "Payment processing fails with card error",
      reporter: "Alice Johnson",
      severity: "Critical Failure",
      status: "in-implementation",
      product: "PeniWallet",
      timeAgo: "10 minutes ago"
    },
    {
      id: 2,
      linearId: "BUG-2338",
      title: "Mobile app crashes on transaction history",
      reporter: "Bob Smith",
      severity: "Blocking Experience",
      status: "categorized",
      product: "PeniWallet",
      timeAgo: "45 minutes ago"
    },
    {
      id: 3,
      linearId: "BUG-2335",
      title: "KYC document upload timeout",
      reporter: "Carol Davis",
      severity: "Causing Churn",
      status: "reported",
      product: "SMC DAO",
      timeAgo: "2 hours ago"
    },
    {
      id: 4,
      linearId: "BUG-2332",
      title: "Dashboard charts not loading on Safari",
      reporter: "David Wilson",
      severity: "Annoying but Workable",
      status: "in-qa-testing",
      product: "PeniRemit",
      timeAgo: "4 hours ago"
    },
    {
      id: 5,
      linearId: "BUG-2329",
      title: "Transaction fees calculation incorrect",
      reporter: "Eva Brown",
      severity: "Critical Failure",
      status: "completed",
      product: "PeniWallet",
      timeAgo: "6 hours ago"
    },
    {
      id: 6,
      linearId: "BUG-2326",
      title: "Email notifications not sending",
      reporter: "Frank Miller",
      severity: "Blocking Experience",
      status: "in-analysis",
      product: "SMC DAO",
      timeAgo: "8 hours ago"
    },
    {
      id: 7,
      linearId: "BUG-2323",
      title: "API rate limiting too aggressive",
      reporter: "Grace Lee",
      severity: "Causing Churn",
      status: "backlog",
      product: "PeniRemit",
      timeAgo: "12 hours ago"
    },
    {
      id: 8,
      linearId: "BUG-2320",
      title: "Dark mode toggle not persisting",
      reporter: "Henry Taylor",
      severity: "Cosmetic / Minor",
      status: "in-design-progress",
      product: "PeniWallet",
      timeAgo: "1 day ago"
    },
    {
      id: 9,
      linearId: "BUG-2317",
      title: "Search functionality returns wrong results",
      reporter: "Ivy Chen",
      severity: "Annoying but Workable",
      status: "blocked",
      product: "SMC DAO",
      timeAgo: "2 days ago"
    },
    {
      id: 10,
      linearId: "BUG-2314",
      title: "Blockchain transaction stuck in pending",
      reporter: "Jack Anderson",
      severity: "Critical Failure",
      status: "ready-for-release",
      product: "PeniWallet",
      timeAgo: "3 days ago"
    }
  ];

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical Failure':
        return <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">Critical Failure</Badge>;
      case 'Blocking Experience':
        return <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">Blocking Experience</Badge>;
      case 'Causing Churn':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">Causing Churn</Badge>;
      case 'Annoying but Workable':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Annoying but Workable</Badge>;
      case 'Cosmetic / Minor':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">Cosmetic / Minor</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Bug Reports</h1>
          <p className="text-muted-foreground">
            View and submit bug reports with automatic Linear and Slack integration
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
            New Bug Report
          </Button>
        </div>
      </div>

      {/* Bug Reports Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-500" />
            <h2>Recent Bug Reports</h2>
            <Badge variant="secondary">23 active</Badge>
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
                <TableHead>Product</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBugReports.map((bug) => (
                <TableRow key={bug.id}>
                  <TableCell className="font-mono text-sm">{bug.linearId}</TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate">{bug.title}</TableCell>
                  <TableCell>{bug.reporter}</TableCell>
                  <TableCell>{bug.product}</TableCell>
                  <TableCell>{getSeverityBadge(bug.severity)}</TableCell>
                  <TableCell>{getStatusBadge(bug.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{bug.timeAgo}</TableCell>
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

      {/* Sheet Modal for Bug Report Form */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[600px] sm:max-w-[50vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-500" />
              Submit New Bug Report
            </SheetTitle>
            <SheetDescription>
              Fill out the comprehensive PL-160 compliant form below to submit a bug report with automatic Linear and Slack integration.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {/* Bug Submission Success Display */}
            {lastBugSubmissionData && (
              <Card className="p-4 border-green-200 bg-green-50 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium">Bug Report Successfully Submitted</h3>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <p><strong>Linear Issue:</strong> {lastBugSubmissionData.linearIssueId}</p>
                  <p><strong>Reporter:</strong> {lastBugSubmissionData.reporter}</p>
                  <p><strong>Slack Thread:</strong> #{lastBugSubmissionData.slackThreadTs.split('.')[0]}</p>
                  <p><strong>Submitted:</strong> {new Date(lastBugSubmissionData.dateSubmitted).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    View in Linear
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Bug className="h-3 w-3" />
                    View #bugs Thread
                  </Button>
                </div>
              </Card>
            )}

            {/* Bug Report Form */}
            <form onSubmit={bugForm.handleSubmit(onSubmitBugReport)} className="space-y-6">
              {/* Core Fields */}
              <div className="space-y-4">
                <h3 className="font-medium text-muted-foreground">Core Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title * <span className="text-xs text-muted-foreground">(≤ 80 characters)</span></label>
                    <Input 
                      placeholder="Short, clear bug title"
                      {...bugForm.register("title", { 
                        required: "Bug title is required",
                        maxLength: { value: 80, message: "Title must be 80 characters or less" },
                        minLength: { value: 5, message: "Title must be at least 5 characters" }
                      })}
                      className={bugForm.formState.errors.title ? "border-red-500" : ""}
                      maxLength={80}
                    />
                    {bugForm.formState.errors.title && (
                      <p className="text-sm text-red-500 mt-1">{bugForm.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Summary * <span className="text-xs text-muted-foreground">(≤ 280 characters)</span></label>
                    <Textarea
                      placeholder="One-liner description"
                      rows={2}
                      {...bugForm.register("summary", { 
                        required: "Summary is required",
                        maxLength: { value: 280, message: "Summary must be 280 characters or less" },
                        minLength: { value: 10, message: "Summary must be at least 10 characters" }
                      })}
                      className={bugForm.formState.errors.summary ? "border-red-500" : ""}
                      maxLength={280}
                    />
                    {bugForm.formState.errors.summary && (
                      <p className="text-sm text-red-500 mt-1">{bugForm.formState.errors.summary.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product / App *</label>
                    <Select onValueChange={(value) => bugForm.setValue("product", value, { shouldValidate: true })}>
                      <SelectTrigger className={bugForm.formState.errors.product ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {productOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bugForm.formState.errors.product && (
                      <p className="text-sm text-red-500 mt-1">Product is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Stream (Team) *</label>
                    <Select onValueChange={(value) => bugForm.setValue("stream", value, { shouldValidate: true })}>
                      <SelectTrigger className={bugForm.formState.errors.stream ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {streamOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bugForm.formState.errors.stream && (
                      <p className="text-sm text-red-500 mt-1">Stream is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Severity *</label>
                    <Select onValueChange={(value) => bugForm.setValue("severity", value, { shouldValidate: true })}>
                      <SelectTrigger className={bugForm.formState.errors.severity ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className={option.color}>{option.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bugForm.formState.errors.severity && (
                      <p className="text-sm text-red-500 mt-1">Severity is required</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bug Details */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-muted-foreground">Bug Details</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Steps to Reproduce *</label>
                  <Textarea 
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                    rows={4}
                    {...bugForm.register("stepsToReproduce", { 
                      required: "Steps to reproduce are required",
                      minLength: { value: 20, message: "Steps must be at least 20 characters" }
                    })}
                    className={bugForm.formState.errors.stepsToReproduce ? "border-red-500" : ""}
                  />
                  {bugForm.formState.errors.stepsToReproduce && (
                    <p className="text-sm text-red-500 mt-1">{bugForm.formState.errors.stepsToReproduce.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expected Behavior *</label>
                    <Textarea 
                      placeholder="What should happen"
                      rows={3}
                      {...bugForm.register("expectedBehavior", { 
                        required: "Expected behavior is required",
                        minLength: { value: 10, message: "Expected behavior must be at least 10 characters" }
                      })}
                      className={bugForm.formState.errors.expectedBehavior ? "border-red-500" : ""}
                    />
                    {bugForm.formState.errors.expectedBehavior && (
                      <p className="text-sm text-red-500 mt-1">{bugForm.formState.errors.expectedBehavior.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Actual Behavior *</label>
                    <Textarea 
                      placeholder="What actually happens"
                      rows={3}
                      {...bugForm.register("actualBehavior", { 
                        required: "Actual behavior is required",
                        minLength: { value: 10, message: "Actual behavior must be at least 10 characters" }
                      })}
                      className={bugForm.formState.errors.actualBehavior ? "border-red-500" : ""}
                    />
                    {bugForm.formState.errors.actualBehavior && (
                      <p className="text-sm text-red-500 mt-1">{bugForm.formState.errors.actualBehavior.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Occurrence *</label>
                  <Select onValueChange={(value) => bugForm.setValue("occurrence", value, { shouldValidate: true })}>
                    <SelectTrigger className={bugForm.formState.errors.occurrence ? "border-red-500" : ""}>
                      <SelectValue placeholder="How often does this happen?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="often">Often</SelectItem>
                      <SelectItem value="sometimes">Sometimes</SelectItem>
                      <SelectItem value="once">Once</SelectItem>
                    </SelectContent>
                  </Select>
                  {bugForm.formState.errors.occurrence && (
                    <p className="text-sm text-red-500 mt-1">Occurrence is required</p>
                  )}
                </div>
              </div>

              {/* Device & Platform */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-muted-foreground">Device & Platform</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Client Type *</label>
                    <Select onValueChange={(value) => bugForm.setValue("clientType", value, { shouldValidate: true })}>
                      <SelectTrigger className={bugForm.formState.errors.clientType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web</SelectItem>
                        <SelectItem value="ios">iOS</SelectItem>
                        <SelectItem value="android">Android</SelectItem>
                        <SelectItem value="backend">Backend Service</SelectItem>
                      </SelectContent>
                    </Select>
                    {bugForm.formState.errors.clientType && (
                      <p className="text-sm text-red-500 mt-1">Client type is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Device *</label>
                    <Input 
                      placeholder="e.g., iPhone 13, Pixel 7, Desktop/Laptop"
                      {...bugForm.register("device", { 
                        required: "Device is required",
                        minLength: { value: 3, message: "Device must be at least 3 characters" }
                      })}
                      className={bugForm.formState.errors.device ? "border-red-500" : ""}
                    />
                    {bugForm.formState.errors.device && (
                      <p className="text-sm text-red-500 mt-1">{bugForm.formState.errors.device.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">OS + Version *</label>
                    <Input 
                      placeholder="e.g., iOS 17.5, Android 14, Windows 11"
                      {...bugForm.register("osVersion", { 
                        required: "OS Version is required",
                        minLength: { value: 3, message: "OS Version must be at least 3 characters" }
                      })}
                      className={bugForm.formState.errors.osVersion ? "border-red-500" : ""}
                    />
                    {bugForm.formState.errors.osVersion && (
                      <p className="text-sm text-red-500 mt-1">{bugForm.formState.errors.osVersion.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">App/Build or Browser *</label>
                    <Input 
                      placeholder="App Version + Build Number or Browser + Version"
                      {...bugForm.register("appBuild", { 
                        required: "App/Build or Browser is required",
                        minLength: { value: 3, message: "Must be at least 3 characters" }
                      })}
                      className={bugForm.formState.errors.appBuild ? "border-red-500" : ""}
                    />
                    {bugForm.formState.errors.appBuild && (
                      <p className="text-sm text-red-500 mt-1">{bugForm.formState.errors.appBuild.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Network *</label>
                    <Select onValueChange={(value) => bugForm.setValue("network", value, { shouldValidate: true })}>
                      <SelectTrigger className={bugForm.formState.errors.network ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wifi">Wi-Fi</SelectItem>
                        <SelectItem value="cellular">Cellular</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    {bugForm.formState.errors.network && (
                      <p className="text-sm text-red-500 mt-1">Network is required</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium text-muted-foreground">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Environment</label>
                    <Select onValueChange={(value) => bugForm.setValue("environment", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Attachment URL</label>
                    <Input 
                      placeholder="Link to screenshots, logs, or recordings"
                      type="file"
                      {...bugForm.register("attachmentUrl")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Additional Notes</label>
                  <Textarea 
                    placeholder="Any other context, logs, or relevant information"
                    rows={3}
                    {...bugForm.register("additionalNotes")}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmittingBug}
              >
                {isSubmittingBug ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Linear Issue & Slack Thread...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Bug Report
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