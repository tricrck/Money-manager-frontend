import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Wallet,
  Handshake,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  CreditCard,
  BarChart2,
  Lock,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Settings,
  FileText,
  Bell,
  DollarSign,
  PieChart,
  Circle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

export default function HowItWorksPage() {
  const [currentWorkflow, setCurrentWorkflow] = useState(0);

  const workflows = [
    {
      title: "Setting Up Your Group",
      steps: [
        {
          icon: UserPlus,
          title: "Invite Members",
          description: "Send invitation codes to group members via SMS or email. Set member roles and permissions."
        },
        {
          icon: Settings,
          title: "Configure Group Rules",
          description: "Define contribution schedules, loan terms, interest rates, and voting requirements."
        },
        {
          icon: ShieldCheck,
          title: "Verify Members",
          description: "Complete member verification with ID documents and set up multi-factor authentication."
        }
      ]
    },
    {
      title: "Managing Daily Operations",
      steps: [
        {
          icon: Calendar,
          title: "Schedule Meetings",
          description: "Set recurring meetings, send automated reminders, and track attendance digitally."
        },
        {
          icon: FileText,
          title: "Record Transactions",
          description: "Log all contributions, withdrawals, and loan payments with automatic receipt generation."
        },
        {
          icon: Bell,
          title: "Send Notifications",
          description: "Automated alerts for due payments, meeting reminders, and important group updates."
        }
      ]
    },
    {
      title: "Accessing Financial Services",
      steps: [
        {
          icon: DollarSign,
          title: "Apply for Loans",
          description: "Submit loan applications with required guarantors and automated approval workflows."
        },
        {
          icon: Handshake,
          title: "Peer-to-Peer Lending",
          description: "Enable direct lending between trusted group members with built-in agreement templates."
        },
        {
          icon: PieChart,
          title: "Investment Tracking",
          description: "Monitor group investments, dividends, and returns with comprehensive portfolio views."
        }
      ]
    }
  ];

  const detailedFeatures = [
    {
      category: "Financial Management",
      items: [
        "Automated contribution tracking and reminders",
        "Flexible payment schedules and late fee management",
        "Multi-currency support for international groups",
        "Real-time balance updates and transaction history"
      ]
    },
    {
      category: "Governance & Compliance",
      items: [
        "Digital voting system for group decisions",
        "Transparent audit trails for all transactions",
        "Customizable group constitutions and bylaws",
        "Member performance and credit scoring"
      ]
    },
    {
      category: "Risk Management",
      items: [
        "Loan default prediction and early warning systems",
        "Member credit assessment tools",
        "Insurance integration for group savings",
        "Fraud detection and prevention measures"
      ]
    }
  ];

  const useCases = [
    {
      title: "Chama Groups",
      description: "Traditional rotating savings groups with modern digital tools for contribution tracking and loan management.",
      benefits: ["Automated merry-go-round cycles", "Digital contribution records", "Group loan facilitation"]
    },
    {
      title: "Investment Clubs",
      description: "Collaborative investment management with portfolio tracking and dividend distribution.",
      benefits: ["Portfolio management tools", "Dividend tracking", "Investment research sharing"]
    },
    {
      title: "Table Banking",
      description: "Structured savings and lending with formal meeting management and transparent records.",
      benefits: ["Meeting minute recording", "Loan committee workflows", "Member credit history"]
    },
    {
      title: "SACCOs",
      description: "Credit union functionality with member shares, dividends, and comprehensive financial services.",
      benefits: ["Share capital management", "Dividend calculations", "Member welfare funds"]
    }
  ];

  const nextWorkflow = () => {
    setCurrentWorkflow((prev) => (prev === workflows.length - 1 ? 0 : prev + 1));
  };

  const prevWorkflow = () => {
    setCurrentWorkflow((prev) => (prev === 0 ? workflows.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
          How It Works
        </Badge>
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Complete Guide to Group Financial Management
        </h1>
        <p className="text-lg text-blue-800 max-w-3xl mx-auto mb-10">
          Discover how Money Manager streamlines every aspect of group finance management, 
          from member onboarding to advanced loan servicing and investment tracking.
        </p>
      </section>

      {/* Detailed Workflows */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Detailed Workflows
          </h2>
          
          {/* Workflow Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-blue-100 rounded-lg p-1">
              {workflows.map((workflow, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentWorkflow(index)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    index === currentWorkflow 
                      ? 'bg-blue-600 text-white' 
                      : 'text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {workflow.title}
                </button>
              ))}
            </div>
          </div>

          {/* Current Workflow Steps */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-center text-blue-900 mb-8">
              {workflows[currentWorkflow].title}
            </h3>
            
            <div className="space-y-6">
              {workflows[currentWorkflow].steps.map((step, index) => (
                <div key={index} className="flex items-start gap-6 p-6 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-blue-900 mb-2">{step.title}</h4>
                    <p className="text-blue-800">{step.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-300 flex-shrink-0">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Tailored for Different Group Types
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-800 mb-4">{useCase.description}</p>
                  <div className="space-y-2">
                    <h5 className="font-semibold text-blue-900">Key Benefits:</h5>
                    <ul className="space-y-1">
                      {useCase.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-blue-800">
                          <Circle className="text-green-600 flex-shrink-0" size={16} />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Advanced Capabilities
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {detailedFeatures.map((category, index) => (
              <Card key={index} className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-blue-800">
                        <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            From Setup to Success
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold">Week 1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Group Setup & Member Onboarding</h3>
                <p className="text-blue-200">Complete group registration, invite members, and establish group rules and contribution schedules.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold">Week 2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">First Contributions & System Training</h3>
                <p className="text-blue-200">Members make initial contributions and learn to use the platform's core features through guided tutorials.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold">Month 1+</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Full Operations & Growth</h3>
                <p className="text-blue-200">Groups operate independently with loan processing, investment tracking, and advanced financial management tools.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="space-y-4 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">How long does group setup take?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Basic group setup can be completed in 5-10 minutes. Full member verification 
                    and rule configuration typically takes 1-2 days depending on group size.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">What documents are required for verification?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Members need a valid government ID. 
                    Group administrators may need additional business registration documents.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Can I migrate existing group records?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, we provide data import tools for existing group records, member lists, 
                    and transaction histories from spreadsheets or other systems.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="operations" className="space-y-4 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">How are contributions tracked?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All contributions are automatically recorded with timestamps, receipt generation, 
                    and real-time balance updates. Members receive instant confirmation notifications.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">What happens if a member misses payments?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The system automatically tracks missed payments, calculates late fees based on group rules, 
                    and sends escalating reminder notifications to both the member and group administrators.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Can groups have sub-committees?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, you can create specialized committees for loans, investments, or welfare with 
                    specific permissions and reporting structures within the main group.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="loans" className="space-y-4 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">How is loan eligibility determined?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Eligibility is based on contribution history, group tenure, credit score within the group, 
                    and availability of required guarantors as defined by group rules.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">What loan types are supported?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We support emergency loans, development loans, business loans, and education loans 
                    with different terms, interest rates, and repayment schedules.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">How are interest rates set?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Interest rates are configured by group administrators based on loan type, 
                    member risk profile, and group financial policies. Rates are transparent and agreed upon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Is there an offline mode?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes, the mobile app works offline for viewing records and preparing transactions. 
                    Data syncs automatically when internet connection is restored.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">What backup and recovery options exist?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All data is backed up daily to multiple secure locations. Group administrators 
                    can export data anytime, and we provide disaster recovery within 24 hours.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Do you provide API access?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    API access is available for enterprise groups wanting to integrate with existing 
                    accounting systems or build custom reporting tools.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Measuring Your Group's Success
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-blue-100">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-green-600" size={32} />
                </div>
                <CardTitle className="text-blue-900">Financial Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track total savings growth, loan performance, and investment returns with detailed analytics.
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Monthly savings rate analysis</li>
                  <li>• Loan default rate monitoring</li>
                  <li>• ROI tracking for investments</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="text-center border-blue-100">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-blue-600" size={32} />
                </div>
                <CardTitle className="text-blue-900">Member Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Monitor member participation, meeting attendance, and contribution consistency.
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Attendance tracking</li>
                  <li>• Contribution consistency scores</li>
                  <li>• Member activity levels</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="text-center border-blue-100">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart2 className="text-purple-600" size={32} />
                </div>
                <CardTitle className="text-blue-900">Financial Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Assess overall group financial stability and identify areas for improvement.
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Liquidity ratio analysis</li>
                  <li>• Risk assessment reports</li>
                  <li>• Predictive financial modeling</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Group's Financial Management?</h2>
          <p className="text-xl mb-8">
            Join the growing community of groups achieving their financial goals with Money Manager.
          </p>
          <LinkContainer to="/register">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            Join
          </Button>
          </LinkContainer>
          <p className="text-sm text-blue-200 mt-4">
            No credit card required • Setup takes less than 15 minutes
          </p>
        </div>
      </section>
    </div>
  );
}