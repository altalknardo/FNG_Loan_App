import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { 
  HelpCircle, 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText,
  Search,
  BookOpen,
  Video,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Globe
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface HelpAndSupportProps {
  userEmail: string;
  onBack: () => void;
}

const faqs = [
  {
    category: "Loans",
    icon: "💰",
    questions: [
      {
        question: "What types of loans are available?",
        answer: "FNG offers three loan types: SME Loan (₦10,000 - ₦50,000), Business Loan (₦51,000 - ₦100,000), and Jumbo Loan (₦101,000 - ₦500,000). Each has a 20% annual interest rate with different upfront costs and requirements."
      },
      {
        question: "How long does loan approval take?",
        answer: "Loan applications are typically reviewed within 24-48 hours. Once approved, funds are disbursed within 1-2 business days to your registered bank account."
      },
      {
        question: "What are the upfront costs for loans?",
        answer: "Upfront costs include: 10% deposit (refundable after full repayment), insurance fee (1.5%-3% based on loan type), and service charge (₦500-₦2,000). These are deducted from your loan amount before disbursement."
      },
      {
        question: "Can I repay my loan early?",
        answer: "Yes! You can make early repayments anytime. Early payment reduces your interest charges since interest is calculated on outstanding balance."
      },
      {
        question: "What happens if I miss a payment?",
        answer: "We send reminders before due dates. If you anticipate difficulty, contact support immediately to discuss options. Late payments may affect your credit standing with FNG."
      }
    ]
  },
  {
    category: "Savings & Contributions",
    icon: "🏦",
    questions: [
      {
        question: "How do daily contributions work?",
        answer: "Daily contributions help you save consistently. Set your amount, and contribute daily to build your savings. Track your streak and earn rewards for consistent saving!"
      },
      {
        question: "Can I withdraw my savings anytime?",
        answer: "Yes, you can request withdrawals from your contribution balance. Withdrawal requests are processed within 1-3 business days depending on your bank."
      },
      {
        question: "What is the contribution streak?",
        answer: "Your streak tracks consecutive days of contributions. Maintaining a streak can unlock benefits and shows your commitment to saving."
      },
      {
        question: "Is there a minimum contribution amount?",
        answer: "While there's no strict minimum, we recommend at least ₦100 per contribution to make meaningful progress toward your savings goals."
      }
    ]
  },
  {
    category: "Account & Security",
    icon: "🔐",
    questions: [
      {
        question: "How do I change my password?",
        answer: "Go to Profile → Account Security → Change Password. You'll need your current password to set a new one. Choose a strong password with at least 8 characters."
      },
      {
        question: "How can I update my email or phone number?",
        answer: "Visit Profile → Account Security. You can update both your email address and phone number. You'll need to verify changes with your current password."
      },
      {
        question: "What is KYC and why is it required?",
        answer: "KYC (Know Your Customer) verification helps us comply with regulations and secure your account. You'll need to provide ID, photo, and bank details. Approval typically takes 24-48 hours."
      },
      {
        question: "How do I add a payment method?",
        answer: "Go to Profile → Payment Methods → Add New Method. You can add bank accounts (traditional or fintech) with BVN verification."
      }
    ]
  },
  {
    category: "Payments & Transactions",
    icon: "💳",
    questions: [
      {
        question: "What payment methods are supported?",
        answer: "We support Nigerian bank accounts from 90+ banks including GTBank, Access Bank, First Bank, and fintech platforms like OPay, PalmPay, and Kuda."
      },
      {
        question: "How long do transactions take?",
        answer: "Contributions and loan payments are instant. Withdrawals take 1-3 business days. Loan disbursements take 1-2 business days after approval."
      },
      {
        question: "Are there transaction fees?",
        answer: "We don't charge transaction fees for contributions or loan payments. Your bank may charge standard transfer fees. Check with your bank for details."
      },
      {
        question: "Can I view my transaction history?",
        answer: "Yes! Go to History tab to view all your transactions including contributions, loan payments, withdrawals, and deposits. You can filter by type and date."
      }
    ]
  }
];

const contactMethods = [
  {
    icon: Phone,
    title: "Phone Support",
    value: "+234 800 123 4567",
    description: "Mon-Fri: 8:00 AM - 6:00 PM WAT",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: Mail,
    title: "Email Support",
    value: "support@fng.ng",
    description: "Response within 24 hours",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    value: "Available Now",
    description: "Chat with our support team",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  }
];

const resources = [
  {
    icon: BookOpen,
    title: "User Guide",
    description: "Complete guide to using FNG",
    link: "#"
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Step-by-step video guides",
    link: "#"
  },
  {
    icon: FileText,
    title: "Terms & Conditions",
    description: "Legal terms and policies",
    link: "#"
  },
  {
    icon: Globe,
    title: "Blog & Tips",
    description: "Financial tips and updates",
    link: "#"
  }
];

export function HelpAndSupport({ userEmail, onBack }: HelpAndSupportProps) {
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "resources">("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      searchQuery === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleSubmitTicket = () => {
    if (!contactForm.subject || !contactForm.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      // Save to customer enquiries
      const enquiries = JSON.parse(localStorage.getItem("customerEnquiries") || "[]");
      const newEnquiry = {
        id: Date.now().toString(),
        userId: userEmail,
        subject: contactForm.subject,
        message: contactForm.message,
        status: "open",
        priority: "medium",
        category: "general",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: []
      };
      enquiries.push(newEnquiry);
      localStorage.setItem("customerEnquiries", JSON.stringify(enquiries));

      toast.success("Support ticket submitted! We'll respond within 24 hours.");
      setContactForm({ subject: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-9 px-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Help & Support
          </h2>
          <p className="text-sm text-gray-600">Get help with your FNG account</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("faq")}
          className={`px-4 py-2 text-sm transition-colors border-b-2 ${
            activeTab === "faq"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          FAQs
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-2 text-sm transition-colors border-b-2 ${
            activeTab === "contact"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Contact Us
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 text-sm transition-colors border-b-2 ${
            activeTab === "resources"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Resources
        </button>
      </div>

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* FAQ Categories */}
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((category, idx) => (
                <Card key={idx} className="p-4 sm:p-6">
                  <h3 className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{category.icon}</span>
                    {category.category}
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left text-sm hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-500 mt-2">Try different keywords or contact support</p>
            </Card>
          )}

          {/* Quick Help Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-xs sm:text-sm">
              Can't find what you're looking for? Contact our support team for personalized assistance.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          {/* Contact Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <Card key={idx} className="p-4 text-center">
                  <div className={`h-12 w-12 rounded-full ${method.bgColor} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`h-6 w-6 ${method.color}`} />
                  </div>
                  <h4 className="text-sm mb-1">{method.title}</h4>
                  <p className={`text-sm ${method.color} mb-2`}>{method.value}</p>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </Card>
              );
            })}
          </div>

          {/* Office Location */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="mb-2">Visit Our Office</h3>
                <p className="text-sm text-gray-600 mb-1">123 Lagos Business District</p>
                <p className="text-sm text-gray-600 mb-1">Victoria Island, Lagos</p>
                <p className="text-sm text-gray-600 mb-3">Nigeria</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Mon-Fri: 8:00 AM - 6:00 PM WAT</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Ticket Form */}
          <Card className="p-4 sm:p-6">
            <h3 className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              Submit a Support Ticket
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-subject">Subject</Label>
                <Input
                  id="ticket-subject"
                  placeholder="Brief description of your issue"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket-message">Message</Label>
                <Textarea
                  id="ticket-message"
                  placeholder="Provide details about your issue or question..."
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-xs sm:text-sm">
                  We typically respond to support tickets within 24 hours during business days.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSubmitTicket}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-xs sm:text-sm">
              Access helpful resources, guides, and tutorials to make the most of FNG.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <Card key={idx} className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm mb-1 flex items-center gap-2">
                        {resource.title}
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </h4>
                      <p className="text-xs text-gray-600">{resource.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Download App Section */}
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="text-center">
              <h3 className="mb-2">Download FNG Mobile App</h3>
              <p className="text-sm text-gray-600 mb-4">
                Access your account on the go with our mobile app
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button variant="outline" size="sm">
                  <span className="mr-2">📱</span>
                  Coming Soon
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Tips */}
          <Card className="p-4 sm:p-6">
            <h3 className="mb-4">💡 Quick Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Complete your KYC verification to unlock all features
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Set up payment reminders to never miss a loan payment
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Maintain a daily contribution streak for better loan terms
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Add multiple payment methods for flexible transactions
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
