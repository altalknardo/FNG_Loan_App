import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, FileText, Shield, AlertCircle } from "lucide-react";
import { BrandLogoCompact } from "./BrandLogo";
import { Alert, AlertDescription } from "./ui/alert";

interface TermsOfServiceProps {
  onBack: () => void;
  standalone?: boolean;
}

export function TermsOfService({ onBack, standalone = false }: TermsOfServiceProps) {
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
          <FileText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h1 className="mb-2">Terms of Service</h1>
            <p className="text-sm text-gray-600">
              Last Updated: October 20, 2025
            </p>
          </div>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 mb-6">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-xs sm:text-sm">
          Please read these terms carefully before using FNG services. By accessing or using our platform, you agree to be bound by these terms.
        </AlertDescription>
      </Alert>

      {/* Content Sections */}
      <div className="space-y-6">
        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">1. Acceptance of Terms</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            By creating an account and using FNG ("the Platform"), you agree to comply with and be legally bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            FNG is a financial technology platform operating in Nigeria, providing loan and savings services to eligible customers. We reserve the right to modify these terms at any time, and continued use of the Platform constitutes acceptance of such modifications.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">2. Eligibility</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            To use FNG services, you must:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li>Be at least 18 years of age</li>
            <li>Be a Nigerian citizen or legal resident</li>
            <li>Have a valid Bank Verification Number (BVN)</li>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain an active Nigerian bank account</li>
            <li>Complete our KYC (Know Your Customer) verification process</li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">3. Loan Services</h3>
          <h4 className="text-sm mb-2">3.1 Loan Products</h4>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            FNG offers three loan types:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li><strong>SME Loan:</strong> ₦10,000 - ₦50,000</li>
            <li><strong>Business Loan:</strong> ₦51,000 - ₦100,000</li>
            <li><strong>Jumbo Loan:</strong> ₦101,000 - ₦500,000</li>
          </ul>
          
          <h4 className="text-sm mb-2">3.2 Interest Rates and Fees</h4>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 mb-3">
            <li>All loans carry a 20% Annual Percentage Rate (APR)</li>
            <li>Upfront costs include: 10% refundable deposit, insurance fee (1.5%-3%), and service charge (₦500-₦2,000)</li>
            <li>The deposit is refundable only after full loan repayment</li>
            <li>Insurance fees and service charges are non-refundable</li>
            <li>Late payment may incur additional charges</li>
          </ul>

          <h4 className="text-sm mb-2">3.3 Repayment Terms</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            Loans must be repaid through weekly installments over the agreed loan period (12, 24, 36, or 48 weeks). Early repayment is permitted and will reduce total interest charges. Failure to make timely payments may result in account suspension and negative impact on your credit standing with FNG.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">4. Savings and Contributions</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            FNG provides daily contribution services to help you save money. By using this service:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li>You can make voluntary daily contributions to your savings balance</li>
            <li>Withdrawal requests are processed within 1-3 business days</li>
            <li>Your contribution balance is separate from loan deposits</li>
            <li>Maintaining a contribution streak may improve loan eligibility</li>
            <li>A monthly service charge of ₦200 applies to active accounts</li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">5. KYC and Account Verification</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            All users must complete KYC verification to access full platform features. This includes:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li>Valid government-issued ID (National ID, Driver's License, or International Passport)</li>
            <li>Passport photograph meeting our specifications</li>
            <li>Verified bank account details with BVN</li>
            <li>Proof of address (utility bill or bank statement)</li>
            <li>Guarantor information with valid NIN</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            FNG reserves the right to approve or reject KYC applications at our discretion. Providing false information will result in immediate account termination.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">6. User Responsibilities</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            As a FNG user, you agree to:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized account access</li>
            <li>Use the Platform only for lawful purposes</li>
            <li>Not attempt to manipulate, hack, or disrupt our services</li>
            <li>Repay loans according to agreed terms</li>
            <li>Update your contact information promptly</li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">7. Privacy and Data Protection</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            FNG is committed to protecting your personal information in accordance with the Nigeria Data Protection Regulation (NDPR) 2019. By using our services:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li>You consent to our collection and use of your personal data as described in our Privacy Policy</li>
            <li>We may share your information with credit bureaus and regulatory authorities as required</li>
            <li>We implement industry-standard security measures to protect your data</li>
            <li>You have the right to access, correct, or delete your personal information</li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">8. Limitation of Liability</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            To the maximum extent permitted by law:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li>FNG is not liable for any indirect, incidental, or consequential damages</li>
            <li>We do not guarantee uninterrupted or error-free service</li>
            <li>Your use of the Platform is at your own risk</li>
            <li>We are not responsible for delays caused by third-party service providers (banks, payment processors)</li>
            <li>Our total liability shall not exceed the amount of fees you paid to FNG in the preceding 12 months</li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">9. Account Suspension and Termination</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            FNG reserves the right to suspend or terminate your account if:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li>You violate these Terms of Service</li>
            <li>You fail to make loan payments as agreed</li>
            <li>You provide false or misleading information</li>
            <li>Your account shows suspicious or fraudulent activity</li>
            <li>We are required to do so by law or regulatory authorities</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            Upon termination, all outstanding loan balances become immediately due and payable.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">10. Dispute Resolution</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            In the event of any dispute:
          </p>
          <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
            <li>First contact our customer support team at support@fng.ng</li>
            <li>We will attempt to resolve disputes through good-faith negotiation</li>
            <li>If unresolved, disputes shall be settled through arbitration in Lagos, Nigeria</li>
            <li>These Terms are governed by the laws of the Federal Republic of Nigeria</li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">11. Changes to Terms</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            FNG may modify these Terms of Service at any time. We will notify users of material changes via email or in-app notification. Continued use of the Platform after such changes constitutes acceptance of the new terms. If you do not agree to the modified terms, you must discontinue use of our services.
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3">12. Contact Information</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            For questions about these Terms of Service, please contact us:
          </p>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Email:</strong> legal@fng.ng</p>
            <p><strong>Phone:</strong> +234 800 123 4567</p>
            <p><strong>Address:</strong> 123 Lagos Business District, Victoria Island, Lagos, Nigeria</p>
          </div>
        </Card>

        <Alert className="bg-green-50 border-green-200">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-xs sm:text-sm">
            By clicking "I Accept" or using FNG services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      {content}
    </div>
  );
}
