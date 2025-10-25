import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle2,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { BrandLogoCompact } from "./BrandLogo";
import { toast } from "sonner@2.0.3";

interface ContactPageProps {
  onBack: () => void;
  standalone?: boolean;
}

export function ContactPage({ onBack, standalone = false }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Save to customer enquiries
      const enquiries = JSON.parse(localStorage.getItem("customerEnquiries") || "[]");
      const newEnquiry = {
        id: Date.now().toString(),
        userId: formData.email,
        name: formData.name,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        status: "open",
        priority: "medium",
        category: "general",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: []
      };
      enquiries.push(newEnquiry);
      localStorage.setItem("customerEnquiries", JSON.stringify(enquiries));

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
    }, 1500);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      primary: "+234 800 123 4567",
      secondary: "Mon-Fri: 8:00 AM - 6:00 PM WAT",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: Mail,
      title: "Email Us",
      primary: "support@fng.ng",
      secondary: "Response within 24 hours",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      primary: "Available Now",
      secondary: "Instant support via app",
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  const offices = [
    {
      city: "Lagos (Headquarters)",
      address: "123 Lagos Business District",
      area: "Victoria Island, Lagos",
      phone: "+234 800 123 4567"
    },
    {
      city: "Abuja Office",
      address: "456 Central Business District",
      area: "Abuja FCT",
      phone: "+234 800 123 4568"
    },
    {
      city: "Port Harcourt Office",
      address: "789 Trans Amadi Industrial Layout",
      area: "Port Harcourt, Rivers State",
      phone: "+234 800 123 4569"
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", url: "#" },
    { icon: Twitter, label: "Twitter", url: "#" },
    { icon: Instagram, label: "Instagram", url: "#" },
    { icon: Linkedin, label: "LinkedIn", url: "#" }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="mb-2">Message Sent Successfully!</h2>
            <p className="text-sm text-gray-600 mb-6">
              Thank you for contacting us. Our team will review your message and respond within 24 hours.
            </p>

            <div className="flex gap-3 justify-center">
              <Button onClick={onBack}>
                Back to App
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                  });
                }}
              >
                Send Another Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const content = (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {!standalone && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        <BrandLogoCompact className="mb-6" />
        
        <div className="flex items-start gap-3 mb-4">
          <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h1 className="mb-2">Contact Us</h1>
            <p className="text-sm text-gray-600">
              We're here to help. Reach out to us through any of these channels.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {contactMethods.map((method, idx) => {
          const Icon = method.icon;
          return (
            <Card key={idx} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-full ${method.bg} flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`h-7 w-7 ${method.color}`} />
              </div>
              <h3 className="text-sm mb-2">{method.title}</h3>
              <p className={`text-sm ${method.color} mb-1`}>{method.primary}</p>
              <p className="text-xs text-gray-500">{method.secondary}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="p-6 sm:p-8">
          <h2 className="mb-6">Send Us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Full Name *</Label>
              <Input
                id="contact-name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Email Address *</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone Number (Optional)</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="080XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-subject">Subject *</Label>
              <Input
                id="contact-subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message">Message *</Label>
              <Textarea
                id="contact-message"
                placeholder="Tell us more about your inquiry..."
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={isSubmitting}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              We typically respond within 24 hours during business days
            </p>
          </form>
        </Card>

        {/* Office Locations & Info */}
        <div className="space-y-6">
          {/* Office Hours */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-orange-600" />
              <h3>Office Hours</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-red-600">Closed</span>
              </div>
              <div className="flex justify-between">
                <span>Public Holidays:</span>
                <span className="text-red-600">Closed</span>
              </div>
            </div>
          </Card>

          {/* Offices */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-red-600" />
              <h3>Our Offices</h3>
            </div>
            <div className="space-y-4">
              {offices.map((office, idx) => (
                <div key={idx} className={idx !== offices.length - 1 ? "pb-4 border-b" : ""}>
                  <p className="text-sm mb-1">{office.city}</p>
                  <p className="text-xs text-gray-600">{office.address}</p>
                  <p className="text-xs text-gray-600">{office.area}</p>
                  <p className="text-xs text-blue-600 mt-1">{office.phone}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Social Media */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-purple-600" />
              <h3>Follow Us</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Stay connected and get the latest updates on our social channels
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition-colors"
                    title={social.label}
                  >
                    <Icon className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                  </a>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ Redirect */}
      <Alert className="bg-blue-50 border-blue-200 mt-8">
        <MessageSquare className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-xs sm:text-sm">
          Looking for quick answers? Check our{" "}
          <button className="underline hover:no-underline">
            Frequently Asked Questions
          </button>
          {" "}section for instant help.
        </AlertDescription>
      </Alert>
    </div>
  );

  if (standalone) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      {content}
    </div>
  );
}
