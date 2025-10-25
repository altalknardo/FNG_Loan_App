import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Shield, Lock, AlertCircle, Eye } from "lucide-react";
import { BrandLogoCompact } from "./BrandLogo";
import { Alert, AlertDescription } from "./ui/alert";

interface PrivacyPolicyProps {
  onBack: () => void;
  standalone?: boolean;
}

export function PrivacyPolicy({ onBack, standalone = false }: PrivacyPolicyProps) {
  const content = (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
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
        
        <BrandLogoCompact className="mb-4" />
        
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h1 className="mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-600">
              Last Updated: October 20, 2025
            </p>
          </div>
        </div>
      </div>

      <Alert className="bg-green-50 border-green-200 mb-6">
        <Lock className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 text-xs sm:text-sm">
          FNG is committed to protecting your privacy and personal information in compliance with the Nigeria Data Protection Regulation (NDPR) 2019.
        </AlertDescription>
      </Alert>

      {/* Content Sections */}
      <div className="space-y-6">
        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">1. Introduction</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            This Privacy Policy explains how FNG ("we," "us," or "our") collects, uses, discloses, and protects your personal information when you use our loan and savings platform.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            By using FNG services, you consent to the data practices described in this policy. We are committed to transparency about our data collection and usage practices, and we comply with all applicable Nigerian data protection laws.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">2. Information We Collect</h3>
          
          <h4 className="text-sm mb-2">2.1 Personal Information</h4>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            We collect the following personal information:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>Full name, date of birth, and gender</li>
            <li>Email address and phone number</li>
            <li>Residential address and proof of address</li>
            <li>Government-issued ID (National ID, Driver's License, or Passport)</li>
            <li>Bank Verification Number (BVN)</li>
            <li>Bank account details</li>
            <li>Passport photograph</li>
            <li>Employment and income information</li>
            <li>Guarantor details and contact information</li>
          </ul>

          <h4 className="text-sm mb-2">2.2 Financial Information</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>Loan application and repayment history</li>
            <li>Contribution and withdrawal records</li>
            <li>Transaction history and payment methods</li>
            <li>Credit score and financial behavior patterns</li>
          </ul>

          <h4 className="text-sm mb-2">2.3 Technical Information</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>Device information (type, model, operating system)</li>
            <li>IP address and browser type</li>
            <li>Usage data and app interactions</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Location data (with your permission)</li>
          </ul>

          <h4 className="text-sm mb-2">2.4 Communications</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
            <li>Customer support inquiries and responses</li>
            <li>Survey responses and feedback</li>
            <li>Email and SMS correspondence</li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">3. How We Use Your Information</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            We use your personal information for the following purposes:
          </p>
          
          <h4 className="text-sm mb-2">3.1 Service Provision</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>Process loan applications and disbursements</li>
            <li>Manage savings contributions and withdrawals</li>
            <li>Verify your identity and prevent fraud</li>
            <li>Process payments and maintain transaction records</li>
            <li>Provide customer support</li>
          </ul>

          <h4 className="text-sm mb-2">3.2 Communication</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>Send loan status updates and payment reminders</li>
            <li>Provide account notifications and alerts</li>
            <li>Respond to your inquiries</li>
            <li>Send promotional offers (with your consent)</li>
          </ul>

          <h4 className="text-sm mb-2">3.3 Business Operations</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>Conduct credit assessments and risk analysis</li>
            <li>Improve our services and user experience</li>
            <li>Detect and prevent fraud or illegal activities</li>
            <li>Generate analytics and insights</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">4. Information Sharing and Disclosure</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            We do not sell your personal information. We may share your data with:
          </p>

          <h4 className="text-sm mb-2">4.1 Service Providers</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>Payment processors and financial institutions</li>
            <li>Identity verification services</li>
            <li>Cloud storage and hosting providers</li>
            <li>SMS and email service providers</li>
            <li>Analytics and marketing platforms</li>
          </ul>

          <h4 className="text-sm mb-2">4.2 Credit Bureaus</h4>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            We report your loan and repayment information to licensed credit bureaus in Nigeria to help build your credit history and assess creditworthiness.
          </p>

          <h4 className="text-sm mb-2">4.3 Legal Requirements</h4>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            We may disclose your information when required by:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>Nigerian law or regulation</li>
            <li>Court orders or legal processes</li>
            <li>Government or regulatory authorities</li>
            <li>Law enforcement agencies investigating crimes</li>
          </ul>

          <h4 className="text-sm mb-2">4.4 Business Transfers</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity, subject to the same privacy protections.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">5. Data Security</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using SSL/TLS</li>
            <li><strong>Secure Storage:</strong> Personal data is stored in encrypted databases with restricted access</li>
            <li><strong>Access Controls:</strong> Only authorized personnel can access your information on a need-to-know basis</li>
            <li><strong>Regular Audits:</strong> We conduct security audits and vulnerability assessments</li>
            <li><strong>Monitoring:</strong> Continuous monitoring for suspicious activities and potential breaches</li>
            <li><strong>Incident Response:</strong> We have procedures to respond to and mitigate security incidents</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            While we strive to protect your information, no method of transmission over the internet is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">6. Your Rights</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Under the NDPR, you have the following rights:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li><strong>Access:</strong> Request a copy of your personal information we hold</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
            <li><strong>Objection:</strong> Object to certain data processing activities</li>
            <li><strong>Portability:</strong> Request your data in a portable format</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
            <li><strong>Lodge Complaint:</strong> File a complaint with the Nigeria Data Protection Commission (NDPC)</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            To exercise these rights, contact us at privacy@fng.ng. We will respond within 30 days.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">7. Data Retention</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            We retain your personal information for as long as necessary to:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
            <li>Provide our services to you</li>
            <li>Comply with legal, tax, and accounting obligations</li>
            <li>Resolve disputes and enforce our agreements</li>
            <li>Maintain business records (minimum 7 years for financial records)</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            After you close your account, we will delete or anonymize your information within 90 days, except where required by law to retain it longer.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">8. Cookies and Tracking</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>Remember your preferences and settings</li>
            <li>Analyze usage patterns and improve our services</li>
            <li>Provide personalized content and recommendations</li>
            <li>Measure the effectiveness of our marketing campaigns</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed">
            You can control cookies through your browser settings. However, disabling cookies may limit certain features of our platform.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">9. Third-Party Links</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">10. Children's Privacy</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            FNG services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware that we have collected data from a child, we will delete it immediately.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">11. International Data Transfers</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Your information is primarily stored and processed in Nigeria. If we transfer data internationally, we ensure adequate safeguards are in place to protect your information in accordance with NDPR requirements.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">12. Updates to This Policy</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of material changes via email or in-app notification. The "Last Updated" date at the top indicates when changes were last made.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">13. Contact Us</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            For questions or concerns about this Privacy Policy or our data practices, please contact:
          </p>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Data Protection Officer</strong></p>
            <p><strong>Email:</strong> privacy@fng.ng</p>
            <p><strong>Phone:</strong> +234 800 123 4567</p>
            <p><strong>Address:</strong> 123 Lagos Business District, Victoria Island, Lagos, Nigeria</p>
          </div>
        </Card>

        <Alert className="bg-blue-50 border-blue-200">
          <Eye className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-xs sm:text-sm">
            Your privacy matters to us. We are committed to transparent data practices and protecting your personal information at all times.
          </AlertDescription>
        </Alert>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      {content}
    </div>
  );
}
