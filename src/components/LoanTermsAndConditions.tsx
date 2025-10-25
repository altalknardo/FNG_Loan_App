import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, FileText, Shield, Scale } from "lucide-react";

interface LoanTermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  loanAmount: number;
  loanType: string;
}

export function LoanTermsAndConditions({
  isOpen,
  onClose,
  onAccept,
  loanAmount,
  loanType
}: LoanTermsAndConditionsProps) {
  const [hasRead, setHasRead] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  const handleAccept = () => {
    if (hasRead && hasAccepted) {
      onAccept();
      setHasRead(false);
      setHasAccepted(false);
    }
  };

  const handleClose = () => {
    onClose();
    setHasRead(false);
    setHasAccepted(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Loan Terms & Conditions</DialogTitle>
              <DialogDescription>
                Please read carefully before proceeding with your loan application
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="h-[450px] px-6">
          <div className="space-y-6 py-4">
            {/* Loan Details Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-blue-600" />
                <h4 className="text-blue-900">Loan Application Summary</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-blue-700">Loan Type:</p>
                  <p className="text-blue-900">{loanType}</p>
                </div>
                <div>
                  <p className="text-blue-700">Loan Amount:</p>
                  <p className="text-blue-900">₦{loanAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900 text-sm">
                <strong>Legal Agreement:</strong> This is a legally binding agreement. By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by all conditions stated herein.
              </AlertDescription>
            </Alert>

            {/* Terms and Conditions Content */}
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Scale className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="mb-2">TERMS AND CONDITIONS OF LOAN AGREEMENT</h4>
                  <p className="text-gray-600 leading-relaxed">
                    This Loan Agreement is entered into between <strong>Fresh Noble Grand (FNG) Financial Services</strong> (hereinafter referred to as "the Lender") and the applicant (hereinafter referred to as "the Borrower").
                  </p>
                </div>
              </div>

              <Separator />

              {/* Section 1: Asset Control */}
              <div className="space-y-3">
                <h4>1. ASSET CONTROL AND SECURITY</h4>
                <div className="bg-gray-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-gray-700 leading-relaxed">
                    By accepting this loan, I hereby acknowledge and agree that <strong>Fresh Noble Grand (FNG) Financial Services</strong> will have <strong>total control of all my assets</strong> as security for this loan until full repayment is completed.
                  </p>
                </div>
              </div>

              {/* Section 2: Compliance and Repayment */}
              <div className="space-y-3">
                <h4>2. COMPLIANCE AND REPAYMENT OBLIGATIONS</h4>
                <div className="space-y-2 text-gray-700">
                  <p className="leading-relaxed">
                    I solemnly declare and agree to the following:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>I will <strong>abide by all conditions</strong> herein stated without exception</li>
                    <li>I will <strong>repay the entire loan</strong> according to the agreed schedule</li>
                    <li>My repayment obligation remains valid <strong>regardless of the physical condition of any assets</strong> acquired or secured by this loan</li>
                    <li>I understand that asset depreciation, damage, or loss does not absolve me of my repayment obligations</li>
                  </ul>
                </div>
              </div>

              {/* Section 3: Default and Recovery Rights */}
              <div className="space-y-3">
                <h4>3. DEFAULT AND RECOVERY PROVISIONS</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-900 mb-3">
                    <strong>Important Notice:</strong> In the event of failure to repay the loan on or before the due date, I acknowledge and agree that:
                  </p>
                  <div className="space-y-3 text-gray-800">
                    <div className="pl-4 border-l-2 border-red-300">
                      <p className="mb-2"><strong>A. Asset Seizure and Sale Rights</strong></p>
                      <p className="text-sm leading-relaxed">
                        Fresh Noble Grand (FNG) is hereby authorized and entitled to recover the outstanding loan amount and all associated charges through:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1 mt-2 pl-2">
                        <li>Seizure and sale of my <strong>moveable assets</strong> (vehicles, equipment, inventory, etc.)</li>
                        <li>Seizure and sale of my <strong>immovable assets</strong> (land, buildings, property, etc.)</li>
                        <li>Any combination of the above as deemed necessary to recover the debt</li>
                      </ul>
                    </div>

                    <div className="pl-4 border-l-2 border-red-300">
                      <p className="mb-2"><strong>B. Savings Balance Offset</strong></p>
                      <p className="text-sm leading-relaxed">
                        FNG is authorized to use my <strong>entire savings balance</strong> in my passbook/account to recover any outstanding loan amount, including:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1 mt-2 pl-2">
                        <li>Principal loan amount outstanding</li>
                        <li>Accrued interest charges</li>
                        <li>Late payment penalties</li>
                        <li>Administrative and recovery costs</li>
                      </ul>
                    </div>

                    <div className="pl-4 border-l-2 border-red-300">
                      <p className="mb-2"><strong>C. Legal Action</strong></p>
                      <p className="text-sm leading-relaxed">
                        FNG reserves the right to take <strong>legal action</strong> against:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1 mt-2 pl-2">
                        <li>The Borrower (myself)</li>
                        <li>My heirs, executors, and administrators</li>
                        <li>Any guarantor(s) of this loan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: No Objection Clause */}
              <div className="space-y-3">
                <h4>4. NO OBJECTION AND WAIVER OF RIGHTS</h4>
                <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
                  <p className="text-gray-700 leading-relaxed mb-2">
                    I hereby declare and warrant that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
                    <li>I will have <strong>no objection</strong> to any recovery action taken by FNG as outlined in Section 3</li>
                    <li>Any objection raised by me, my representatives, or my heirs shall be <strong>deemed invalid</strong></li>
                    <li>Such objections will <strong>not be considered valid</strong> in any court of law</li>
                    <li>I waive any right to contest FNG's recovery actions undertaken in accordance with this agreement</li>
                  </ul>
                </div>
              </div>

              {/* Section 5: Late Payment Penalties */}
              <div className="space-y-3">
                <h4>5. LATE PAYMENT INTEREST AND PENALTIES</h4>
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-amber-900 mb-2">
                        <strong>Grace Period:</strong>
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        A grace period of <strong>seven (7) calendar days</strong> is provided after each installment due date during which no additional interest will be charged.
                      </p>
                    </div>

                    <Separator className="bg-amber-200" />

                    <div>
                      <p className="text-amber-900 mb-2">
                        <strong>Penalty Interest Rate:</strong>
                      </p>
                      <div className="bg-white border border-amber-200 rounded p-3">
                        <p className="text-center mb-2">
                          <span className="text-3xl text-red-600">10%</span>
                        </p>
                        <p className="text-center text-sm text-gray-700">
                          <strong>per week</strong> on unpaid installment amounts
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        After the expiration of the 7-day grace period, any unpaid installment due shall be subject to an additional interest rate of <strong>10% per week</strong> until the outstanding amount is fully paid.
                      </p>
                    </div>

                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 text-xs">
                        <strong>Example:</strong> If an installment of ₦10,000 is unpaid 14 days after the due date (7 days grace + 7 days late), you will owe ₦10,000 + ₦1,000 (10% penalty) = ₦11,000. This penalty continues to accrue weekly.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>

              {/* Section 6: Governing Law */}
              <div className="space-y-3">
                <h4>6. GOVERNING LAW AND JURISDICTION</h4>
                <p className="text-gray-700 leading-relaxed text-sm">
                  This Agreement shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any dispute arising from this Agreement shall be subject to the exclusive jurisdiction of the Nigerian courts.
                </p>
              </div>

              {/* Section 7: Acknowledgment */}
              <div className="space-y-3">
                <h4>7. ACKNOWLEDGMENT OF UNDERSTANDING</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 leading-relaxed text-sm">
                    By accepting these terms, I confirm that:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-4 text-sm text-blue-800 mt-2">
                    <li>I have read and fully understood all terms and conditions</li>
                    <li>I have had the opportunity to seek independent legal advice</li>
                    <li>I am entering into this agreement voluntarily and without coercion</li>
                    <li>I am of legal age and sound mind to enter into this binding contract</li>
                    <li>All information provided in my loan application is true and accurate</li>
                  </ul>
                </div>
              </div>

              {/* Final Notice */}
              <div className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-300 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-900 mb-2">
                      <strong>FINAL IMPORTANT NOTICE</strong>
                    </p>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      This is a serious financial commitment. Ensure you fully understand your obligations before accepting. If you have any questions or concerns, please contact our customer service before proceeding. Non-payment of loans can result in serious financial and legal consequences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        {/* Acceptance Section */}
        <div className="p-6 pt-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="read-terms"
                checked={hasRead}
                onCheckedChange={(checked) => setHasRead(checked as boolean)}
              />
              <label
                htmlFor="read-terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I confirm that I have <strong>read and understood</strong> all the terms and conditions stated above
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="accept-terms"
                checked={hasAccepted}
                onCheckedChange={(checked) => setHasAccepted(checked as boolean)}
                disabled={!hasRead}
              />
              <label
                htmlFor="accept-terms"
                className={`text-sm leading-relaxed ${hasRead ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                I <strong>accept and agree</strong> to be legally bound by these terms and conditions, including all recovery rights and penalty provisions
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel Application
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!hasRead || !hasAccepted}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
