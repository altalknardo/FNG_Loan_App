import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { BrandLogo } from "./BrandLogo";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Camera,
  Home,
  Shield,
  Building2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ApiError, updateKYC } from "../lib/auth-api";

interface KYCFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;

  // Address Information
  address: string;
  city: string;
  state: string;

  // ID Verification
  idType: string;
  idNumber: string;
  bvn: string;

  // Payment Method
  paymentType: string; // 'bank' or 'card'
  bankName: string;
  accountNumber: string;
  accountName: string;
  cardNumber: string;
  cardBrand: string;
  cardType: string;

  // Documents (mock file names)
  idDocument: string;
  proofOfAddress: string;
  selfie: string;
}

interface Props {
  onRegistrationComplete: () => void;
  userEmail?: string; // Optional: current user email/phone for data loading
}

export function KYCRegistration({ onRegistrationComplete, userEmail }: Props) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<KYCFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    idType: "",
    idNumber: "",
    bvn: "",
    paymentType: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    cardNumber: "",
    cardType: "",
    cardBrand: "",
    idDocument: "",
    proofOfAddress: "",
    selfie: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof KYCFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBvnVerifying, setIsBvnVerifying] = useState(false);
  const [bvnVerified, setBvnVerified] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Load initial data from localStorage user data on mount
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

    // Find the current authenticated user
    // If userEmail is provided, use it to find the specific user
    // Otherwise, find the most recent user
    let user = null;

    if (userEmail) {
      // Find user by email or phone number
      user =
        users.find(
          (u: any) =>
            u.email === userEmail ||
            u.phoneNumber === userEmail ||
            u.phone === userEmail
        ) ||
        registeredUsers.find(
          (u: any) =>
            u.email === userEmail ||
            u.phoneNumber === userEmail ||
            u.phone === userEmail
        );
    }

    // If no user found by userEmail, try to find by authToken or use most recent
    if (!user) {
      const token = localStorage.getItem("authToken");
      if (token && users.length > 0) {
        // Use the most recent user in users array
        user = users[users.length - 1];
      } else if (users.length > 0) {
        user = users[users.length - 1];
      } else if (registeredUsers.length > 0) {
        user = registeredUsers[registeredUsers.length - 1];
      }
    }

    if (user) {
      // Pre-fill form with user data from signup
      const fullName = user.fullName || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData((prev) => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
        email: user.email || "",
        phone: user.phoneNumber || user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
      }));

      // Also check if there's existing KYC submission for this user
      const kycSubmissions = JSON.parse(
        localStorage.getItem("kycSubmissions") || "[]"
      );
      const existingKyc = kycSubmissions.find(
        (k: any) =>
          k.phone === (user.phoneNumber || user.phone) || k.email === user.email
      );

      if (existingKyc) {
        // Pre-fill with existing KYC data
        setFormData((prev) => ({
          ...prev,
          firstName: existingKyc.firstName || firstName,
          lastName: existingKyc.lastName || lastName,
          email: existingKyc.email || user.email || "",
          phone: existingKyc.phone || user.phoneNumber || user.phone || "",
          dateOfBirth: existingKyc.dateOfBirth || "",
          gender: existingKyc.gender || "",
          address: existingKyc.address || user.address || "",
          city: existingKyc.city || user.city || "",
          state: existingKyc.state || user.state || "",
          idType: existingKyc.idType || "",
          idNumber: existingKyc.idNumber || "",
          bvn: existingKyc.bvn || "",
          paymentType: existingKyc.paymentType || "",
          bankName: existingKyc.bankName || "",
          accountNumber: existingKyc.accountNumber || "",
          accountName: existingKyc.accountName || "",
          cardNumber: existingKyc.cardNumber || "",
          cardBrand: existingKyc.cardBrand || "",
        }));
      }
    }
  }, [userEmail]);

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
  ];

  // Fintech banks that use phone number verification
  const fintechBanks = ["Kuda Bank", "OPay", "PalmPay", "Moniepoint"];

  // Check if selected bank is a fintech
  const isFintech = fintechBanks.includes(formData.bankName);

  const handleInputChange = (field: keyof KYCFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Reset verification when changing relevant fields
    if (field === "bvn") {
      setBvnVerified(false);
    }
    if (field === "accountNumber" || field === "bankName") {
      setAccountVerified(false);
    }
  };

  // Simulate account verification (BVN for traditional banks, Phone for fintech)
  const verifyBvnAndAccount = () => {
    const isFintech = fintechBanks.includes(formData.bankName);

    // Validation for fintech banks (phone number verification)
    if (isFintech) {
      if (!formData.phone || formData.phone.length < 11) {
        toast.error("Please enter a valid phone number");
        return;
      }

      if (
        !formData.bankName ||
        !formData.accountNumber ||
        formData.accountNumber.length !== 10
      ) {
        toast.error("Please enter valid bank name and 10-digit account number");
        return;
      }
    } else {
      // Validation for traditional banks (BVN verification)
      if (!formData.bvn || formData.bvn.length !== 11) {
        toast.error("Please enter a valid 11-digit BVN");
        return;
      }

      if (
        !formData.bankName ||
        !formData.accountNumber ||
        formData.accountNumber.length !== 10
      ) {
        toast.error("Please enter valid bank name and 10-digit account number");
        return;
      }
    }

    setIsBvnVerifying(true);

    // Simulate API call to verify account
    setTimeout(() => {
      // In production, this would call different APIs based on bank type:
      // For traditional banks: BVN verification API
      // For fintech: Phone number + account verification API

      // Simulate retrieving account name from bank records
      const bankAccountName = `${formData.firstName.toUpperCase()} ${formData.lastName.toUpperCase()}`;

      // Auto-populate account name with the verified bank account name
      setFormData((prev) => ({ ...prev, accountName: bankAccountName }));
      setBvnVerified(true);
      setAccountVerified(true);
      setIsBvnVerifying(false);

      if (isFintech) {
        toast.success(
          `Phone number verified! Account name: ${bankAccountName}`
        );
      } else {
        toast.success(`BVN verified! Account name: ${bankAccountName}`);
      }
    }, 2000);
  };

  const handleFileUpload = (
    field: keyof KYCFormData,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and PDF files are allowed");
        return;
      }

      // Read file and convert to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;

        // Store both file name and data URL
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: dataUrl,
        };

        // Store in a separate object for file data
        const existingFiles = localStorage.getItem("kycFileData");
        const filesMap = existingFiles ? JSON.parse(existingFiles) : {};

        // Use timestamp + field as unique key
        const fileKey = `${Date.now()}_${field}`;
        filesMap[fileKey] = fileData;

        localStorage.setItem("kycFileData", JSON.stringify(filesMap));

        // Store the key in form data
        setFormData((prev) => ({ ...prev, [field]: fileKey }));

        toast.success(`${file.name} uploaded successfully`);
      };

      reader.onerror = () => {
        toast.error("Error reading file. Please try again.");
      };

      reader.readAsDataURL(file);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof KYCFormData, string>> = {};

    if (currentStep === 1) {
      // Personal Information
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number";
      }
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    } else if (currentStep === 2) {
      // Address Information
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
    } else if (currentStep === 3) {
      // ID Verification
      if (!formData.idType) newErrors.idType = "ID type is required";
      if (!formData.idNumber.trim())
        newErrors.idNumber = "ID number is required";

      // BVN is optional for fintech banks, but required for traditional banks
      const isFintech = fintechBanks.includes(formData.bankName);
      if (!isFintech) {
        if (!formData.bvn.trim()) {
          newErrors.bvn = "BVN is required";
        } else if (!/^\d{11}$/.test(formData.bvn)) {
          newErrors.bvn = "BVN must be 11 digits";
        }
      } else if (formData.bvn && !/^\d{11}$/.test(formData.bvn)) {
        // If BVN is provided for fintech, validate format
        newErrors.bvn = "BVN must be 11 digits";
      }
    } else if (currentStep === 4) {
      // Payment Method
      if (!formData.paymentType) {
        newErrors.paymentType = "Payment method type is required";
      } else if (formData.paymentType === "bank") {
        if (!formData.bankName.trim())
          newErrors.bankName = "Bank name is required";
        if (!formData.accountNumber.trim()) {
          newErrors.accountNumber = "Account number is required";
        } else if (!/^\d{10}$/.test(formData.accountNumber)) {
          newErrors.accountNumber = "Account number must be 10 digits";
        }
        if (!formData.accountName.trim())
          newErrors.accountName = "Account name is required";

        // Require account verification (BVN for traditional banks, phone for fintech)
        if (!accountVerified) {
          const isFintech = fintechBanks.includes(formData.bankName);
          toast.error(
            isFintech
              ? "Please verify your account with phone number before proceeding"
              : "Please verify your account with BVN before proceeding"
          );
          return false;
        }
      } else if (formData.paymentType === "card") {
        if (!formData.cardNumber.trim()) {
          newErrors.cardNumber = "Card number is required";
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
          newErrors.cardNumber = "Card number must be 16 digits";
        }
        if (!formData.cardBrand.trim())
          newErrors.cardBrand = "Card brand is required";
      }
    } else if (currentStep === 5) {
      // Documents
      if (!formData.idDocument)
        newErrors.idDocument = "ID document is required";
      if (!formData.proofOfAddress)
        newErrors.proofOfAddress = "Proof of address is required";
      if (!formData.selfie) newErrors.selfie = "Selfie is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    try {
      setIsSubmitting(true);

      // ✅ Call API to update KYC
      const response = await updateKYC({
        idInfo: {
          idType: formData.idType || "",
          idNumber: formData.idNumber || "",
          bvn: formData.bvn || "",
        },
        bankInfo: {
          bankName: formData.bankName || "",
          accountNumber: formData.accountNumber || "",
          accountName: formData.accountName || "",
        },
        cardInfo: {
          cardNumber: formData.cardNumber || "",
          cardType: formData.cardType || "",
        },
        dob: formData.dateOfBirth,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        paymentType: formData.paymentType,
        idDocumentUrl: formData.idDocument,
        proofOfAddressUrl: formData.proofOfAddress,
        selfieUrl: formData.selfie,
      });

      if (response.success && response.data) {
        const updatedUser = response.data;

        // ✅ Update user info in localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const registeredUsers = JSON.parse(
          localStorage.getItem("registeredUsers") || "[]"
        );

        const userIndex = users.findIndex(
          (u: any) =>
            u.phone === updatedUser.phone ||
            u.phoneNumber === updatedUser.phone ||
            u.email === updatedUser.email
        );

        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updatedUser, kyc: true };
        } else {
          users.push({ ...updatedUser, kyc: true });
        }

        localStorage.setItem("users", JSON.stringify(users));

        // ✅ Sync with registered users
        const regIndex = registeredUsers.findIndex(
          (u: any) =>
            u.phone === updatedUser.phone ||
            u.phoneNumber === updatedUser.phone ||
            u.email === updatedUser.email
        );

        if (regIndex !== -1) {
          registeredUsers[regIndex] = {
            ...registeredUsers[regIndex],
            ...updatedUser,
            kyc: true,
          };
        } else {
          registeredUsers.push({ ...updatedUser, kyc: true });
        }

        localStorage.setItem(
          "registeredUsers",
          JSON.stringify(registeredUsers)
        );

        // ✅ Save payment methods for quick access
        if (formData.paymentType) {
          const paymentMethods = JSON.parse(
            localStorage.getItem("paymentMethods") || "[]"
          );

          if (formData.paymentType === "bank") {
            const exists = paymentMethods.find(
              (pm: any) =>
                pm.type === "bank" &&
                pm.last4 === formData.accountNumber?.slice(-4)
            );

            if (!exists) {
              paymentMethods.push({
                id: Date.now(),
                type: "bank",
                name: formData.accountName,
                last4: formData.accountNumber?.slice(-4),
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                bvn: formData.bvn,
                bvnVerified: accountVerified,
                isDefault: paymentMethods.length === 0,
                addedFrom: "kyc",
              });
            }
          } else if (formData.paymentType === "card") {
            const cardLast4 = formData.cardNumber?.replace(/\s/g, "").slice(-4);
            const exists = paymentMethods.find(
              (pm: any) => pm.type === "card" && pm.last4 === cardLast4
            );

            if (!exists) {
              paymentMethods.push({
                id: Date.now(),
                type: "card",
                name: `${formData.firstName} ${formData.lastName}`,
                last4: cardLast4,
                cardBrand: formData.cardBrand,
                isDefault: paymentMethods.length === 0,
                addedFrom: "kyc",
              });
            }
          }

          localStorage.setItem(
            "paymentMethods",
            JSON.stringify(paymentMethods)
          );
        }

        // ✅ Success message
        toast.success(response.message || "KYC updated successfully!");
        setIsSubmitting(false);

        // ✅ Redirect or callback
        setTimeout(() => {
          onRegistrationComplete();
        }, 1500);
      } else {
        setIsSubmitting(false);
        toast.error(response.message || "KYC update failed. Please try again.");
      }
    } catch (error: any) {
      const apiError = error as ApiError;

      setIsSubmitting(false);
      setError(apiError.message || "Failed to update KYC. Please try again.");

      toast.error(apiError.message || "Network or server error occurred.");

      // 🔁 Optional fallback to local storage (for offline mode)
      console.warn("KYC API failed, saving locally as fallback...");
      const existingSubmissions = JSON.parse(
        localStorage.getItem("kycSubmissions") || "[]"
      );
      const newSubmission = {
        id: Date.now(),
        ...formData,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "kycSubmissions",
        JSON.stringify([...existingSubmissions, newSubmission])
      );
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Please provide your personal details as they appear on your
                official documents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="John"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Doe"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john.doe@email.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number *
                  {isFintech && (
                    <span className="text-xs text-purple-600 ml-2">
                      (Used for account verification)
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+234 800 000 0000"
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className={`pl-10 ${
                      errors.dateOfBirth ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger
                    className={errors.gender ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500">{errors.gender}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 mb-4">
                <Home className="h-5 w-5 text-blue-600" />
                Address Information
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Provide your current residential address.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter your full address"
                    className={`pl-10 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    rows={3}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="e.g., Lagos"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                  >
                    <SelectTrigger
                      className={errors.state ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
                ID Verification
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Verify your identity with your ID and BVN.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="idType">ID Type *</Label>
                <Select
                  value={formData.idType}
                  onValueChange={(value) => handleInputChange("idType", value)}
                >
                  <SelectTrigger
                    className={errors.idType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nin">
                      National Identity Number (NIN)
                    </SelectItem>
                    <SelectItem value="drivers_license">
                      Driver's License
                    </SelectItem>
                    <SelectItem value="voters_card">Voter's Card</SelectItem>
                    <SelectItem value="passport">
                      International Passport
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.idType && (
                  <p className="text-sm text-red-500">{errors.idType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) =>
                      handleInputChange("idNumber", e.target.value)
                    }
                    placeholder="Enter your ID number"
                    className={`pl-10 ${
                      errors.idNumber ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.idNumber && (
                  <p className="text-sm text-red-500">{errors.idNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bvn">
                  Bank Verification Number (BVN) {!isFintech && "*"}
                  {isFintech && (
                    <span className="text-xs text-gray-500">
                      (Optional for fintech banks)
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="bvn"
                    value={formData.bvn}
                    onChange={(e) => handleInputChange("bvn", e.target.value)}
                    placeholder="11-digit BVN"
                    maxLength={11}
                    className={`pl-10 ${errors.bvn ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.bvn && (
                  <p className="text-sm text-red-500">{errors.bvn}</p>
                )}
                <p className="text-xs text-gray-500">
                  {isFintech
                    ? "For fintech banks, we'll verify using your registered phone number instead"
                    : "Your BVN is used to verify your identity and is kept secure"}
                </p>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All your information is encrypted and stored securely. We comply
                with data protection regulations.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 mb-4">
                <Wallet className="h-5 w-5 text-blue-600" />
                Payment Method
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Add your preferred payment method for contributions and loan
                repayments.
              </p>
            </div>

            <div className="space-y-4">
              {/* Payment Type Selection */}
              <div className="space-y-2">
                <Label>Payment Type *</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange("paymentType", "bank");
                      // Clear card fields
                      handleInputChange("cardNumber", "");
                      handleInputChange("cardBrand", "");
                    }}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      formData.paymentType === "bank"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Building2
                      className={`h-6 w-6 ${
                        formData.paymentType === "bank"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    />
                    <span
                      className={
                        formData.paymentType === "bank"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }
                    >
                      Bank Account
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange("paymentType", "card");
                      // Clear bank fields
                      handleInputChange("bankName", "");
                      handleInputChange("accountNumber", "");
                      handleInputChange("accountName", "");
                    }}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      formData.paymentType === "card"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <CreditCard
                      className={`h-6 w-6 ${
                        formData.paymentType === "card"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    />
                    <span
                      className={
                        formData.paymentType === "card"
                          ? "text-blue-600"
                          : "text-gray-600"
                      }
                    >
                      Debit Card
                    </span>
                  </button>
                </div>
                {errors.paymentType && (
                  <p className="text-sm text-red-500">{errors.paymentType}</p>
                )}
              </div>

              {/* Bank Account Fields */}
              {formData.paymentType === "bank" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Select
                      value={formData.bankName}
                      onValueChange={(value) =>
                        handleInputChange("bankName", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.bankName ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Access Bank">Access Bank</SelectItem>
                        <SelectItem value="GTBank">
                          Guaranty Trust Bank
                        </SelectItem>
                        <SelectItem value="First Bank">
                          First Bank of Nigeria
                        </SelectItem>
                        <SelectItem value="UBA">
                          United Bank for Africa
                        </SelectItem>
                        <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                        <SelectItem value="Stanbic IBTC">
                          Stanbic IBTC Bank
                        </SelectItem>
                        <SelectItem value="Sterling Bank">
                          Sterling Bank
                        </SelectItem>
                        <SelectItem value="Fidelity Bank">
                          Fidelity Bank
                        </SelectItem>
                        <SelectItem value="Union Bank">Union Bank</SelectItem>
                        <SelectItem value="Wema Bank">Wema Bank</SelectItem>
                        <SelectItem value="Kuda Bank">Kuda Bank 📱</SelectItem>
                        <SelectItem value="OPay">OPay 📱</SelectItem>
                        <SelectItem value="PalmPay">PalmPay 📱</SelectItem>
                        <SelectItem value="Moniepoint">
                          Moniepoint 📱
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.bankName && (
                      <p className="text-sm text-red-500">{errors.bankName}</p>
                    )}
                    {isFintech && (
                      <Alert className="bg-purple-50 border-purple-200">
                        <Phone className="h-4 w-4 text-purple-600" />
                        <AlertDescription className="text-purple-800 text-sm">
                          For {formData.bankName}, we'll verify your account
                          using your registered phone number instead of BVN
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "accountNumber",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      placeholder="10-digit account number"
                      maxLength={10}
                      className={errors.accountNumber ? "border-red-500" : ""}
                    />
                    {errors.accountNumber && (
                      <p className="text-sm text-red-500">
                        {errors.accountNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name *</Label>
                    <div className="relative">
                      <Input
                        id="accountName"
                        value={formData.accountName}
                        onChange={(e) =>
                          handleInputChange("accountName", e.target.value)
                        }
                        placeholder={
                          isFintech
                            ? "Auto-filled from bank records after phone verification"
                            : "Auto-filled from bank records after BVN verification"
                        }
                        className={`${
                          errors.accountName ? "border-red-500" : ""
                        } ${
                          accountVerified ? "border-green-500 bg-green-50" : ""
                        }`}
                        readOnly={accountVerified}
                      />
                      {accountVerified && (
                        <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-600" />
                      )}
                    </div>
                    {errors.accountName && (
                      <p className="text-sm text-red-500">
                        {errors.accountName}
                      </p>
                    )}
                    {accountVerified && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Account name verified from bank records
                      </p>
                    )}
                  </div>

                  {/* Account Verification Info */}
                  {!accountVerified &&
                    formData.bankName &&
                    formData.accountNumber &&
                    (isFintech
                      ? // For fintech banks - phone verification
                        formData.phone &&
                        formData.phone.length >= 11 && (
                          <Alert className="bg-purple-50 border-purple-200">
                            <Phone className="h-4 w-4 text-purple-600" />
                            <AlertDescription className="text-purple-800 text-sm">
                              Click verify to confirm your account using your
                              registered phone number
                            </AlertDescription>
                          </Alert>
                        )
                      : // For traditional banks - BVN verification
                        formData.bvn &&
                        formData.bvn.length === 11 && (
                          <Alert className="bg-blue-50 border-blue-200">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800 text-sm">
                              Click verify to fetch your account name directly
                              from your bank records
                            </AlertDescription>
                          </Alert>
                        ))}

                  {/* Account Verification Button */}
                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={verifyBvnAndAccount}
                      disabled={
                        isBvnVerifying ||
                        accountVerified ||
                        !formData.bankName ||
                        !formData.accountNumber ||
                        formData.accountNumber.length !== 10 ||
                        (isFintech
                          ? !formData.phone || formData.phone.length < 11
                          : !formData.bvn || formData.bvn.length !== 11)
                      }
                      className="w-full"
                      variant={accountVerified ? "outline" : "default"}
                    >
                      {isBvnVerifying ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {isFintech
                            ? "Verifying with Phone..."
                            : "Verifying with BVN..."}
                        </>
                      ) : accountVerified ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Account Verified
                        </>
                      ) : (
                        <>
                          {isFintech ? (
                            <Phone className="h-4 w-4 mr-2" />
                          ) : (
                            <Shield className="h-4 w-4 mr-2" />
                          )}
                          {isFintech
                            ? "Verify Account with Phone"
                            : "Verify Account with BVN"}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {accountVerified
                        ? "Account name retrieved from bank records"
                        : isFintech
                        ? "Verify your phone number to auto-fill account name from bank"
                        : "Verify your BVN to auto-fill account name from bank"}
                    </p>
                  </div>
                </div>
              )}

              {/* Card Fields */}
              {formData.paymentType === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        const formatted =
                          value.match(/.{1,4}/g)?.join(" ") || value;
                        handleInputChange("cardNumber", formatted);
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={errors.cardNumber ? "border-red-500" : ""}
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-red-500">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardBrand">Card Type *</Label>
                    <Select
                      value={formData.cardBrand}
                      onValueChange={(value) =>
                        handleInputChange("cardBrand", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.cardBrand ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Visa">Visa</SelectItem>
                        <SelectItem value="Mastercard">Mastercard</SelectItem>
                        <SelectItem value="Verve">Verve</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.cardBrand && (
                      <p className="text-sm text-red-500">{errors.cardBrand}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your payment information is encrypted and stored securely. This
                will be your default payment method.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 mb-4">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload Documents
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Upload clear photos of your documents. Accepted formats: JPG,
                PNG, PDF (max 5MB each)
              </p>
            </div>

            <div className="space-y-4">
              {/* ID Document */}
              <div className="space-y-2">
                <Label htmlFor="idDocument">ID Document (Front & Back) *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    errors.idDocument ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {formData.idDocument ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-sm">
                          {(() => {
                            const filesMap = JSON.parse(
                              localStorage.getItem("kycFileData") || "{}"
                            );
                            return (
                              filesMap[formData.idDocument]?.name ||
                              "Document uploaded"
                            );
                          })()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange("idDocument", "")}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <label htmlFor="idDocument" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700">
                          Click to upload
                        </span>
                        <span className="text-sm text-gray-600">
                          {" "}
                          or drag and drop
                        </span>
                      </label>
                      <input
                        id="idDocument"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload("idDocument", e)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                {errors.idDocument && (
                  <p className="text-sm text-red-500">{errors.idDocument}</p>
                )}
              </div>

              {/* Proof of Address */}
              <div className="space-y-2">
                <Label htmlFor="proofOfAddress">Proof of Address *</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Utility bill, bank statement, or government-issued document
                  (not older than 3 months)
                </p>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    errors.proofOfAddress ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {formData.proofOfAddress ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-sm">
                          {(() => {
                            const filesMap = JSON.parse(
                              localStorage.getItem("kycFileData") || "{}"
                            );
                            return (
                              filesMap[formData.proofOfAddress]?.name ||
                              "Document uploaded"
                            );
                          })()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange("proofOfAddress", "")}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <label
                        htmlFor="proofOfAddress"
                        className="cursor-pointer"
                      >
                        <span className="text-blue-600 hover:text-blue-700">
                          Click to upload
                        </span>
                        <span className="text-sm text-gray-600">
                          {" "}
                          or drag and drop
                        </span>
                      </label>
                      <input
                        id="proofOfAddress"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload("proofOfAddress", e)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                {errors.proofOfAddress && (
                  <p className="text-sm text-red-500">
                    {errors.proofOfAddress}
                  </p>
                )}
              </div>

              {/* Selfie */}
              <div className="space-y-2">
                <Label htmlFor="selfie">Selfie Verification *</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Take a clear photo of yourself holding your ID document
                </p>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    errors.selfie ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {formData.selfie ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-sm">
                          {(() => {
                            const filesMap = JSON.parse(
                              localStorage.getItem("kycFileData") || "{}"
                            );
                            return (
                              filesMap[formData.selfie]?.name ||
                              "Selfie uploaded"
                            );
                          })()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInputChange("selfie", "")}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <label htmlFor="selfie" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700">
                          Click to upload
                        </span>
                        <span className="text-sm text-gray-600">
                          {" "}
                          or drag and drop
                        </span>
                      </label>
                      <input
                        id="selfie"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("selfie", e)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                {errors.selfie && (
                  <p className="text-sm text-red-500">{errors.selfie}</p>
                )}
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ensure all documents are clear and readable. Blurry or
                incomplete documents will be rejected.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-4 sm:py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <BrandLogo size="md" animated />
          </div>
          <h2 className="text-gray-900 mb-1 sm:mb-2">KYC Registration</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Complete your verification to get started
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm">
                Step {step} of {totalSteps}
              </span>
              <Badge variant="outline" className="text-xs">
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-600">
              <span className={step >= 1 ? "text-blue-600" : ""}>Personal</span>
              <span className={step >= 2 ? "text-blue-600" : ""}>Address</span>
              <span className={step >= 3 ? "text-blue-600" : ""}>ID</span>
              <span className={step >= 4 ? "text-blue-600" : ""}>Payment</span>
              <span className={step >= 5 ? "text-blue-600" : ""}>
                Documents
              </span>
            </div>
          </div>
        </Card>

        {/* Form Content */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">{renderStepContent()}</Card>

        {/* Navigation Buttons */}
        <div className="flex gap-2 sm:gap-4 pb-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
            >
              Back
            </Button>
          )}

          {step < totalSteps ? (
            <Button onClick={handleNext} className="flex-1">
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Your information is secure and will only be used for verification
            purposes.
          </p>
          <p className="mt-2">Need help? Contact support@fng.com</p>
        </div>
      </div>
    </div>
  );
}
