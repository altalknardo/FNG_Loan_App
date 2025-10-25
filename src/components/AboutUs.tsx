import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Building2, Target, Users, Award, Heart, TrendingUp, Shield, Zap } from "lucide-react";
import { BrandLogoCompact } from "./BrandLogo";

interface AboutUsProps {
  onBack: () => void;
  standalone?: boolean;
}

export function AboutUs({ onBack, standalone = false }: AboutUsProps) {
  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We believe in honest, transparent financial services with no hidden fees or surprises."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Our customers are at the heart of everything we do. Your success is our success."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We leverage technology to make financial services accessible, fast, and efficient."
    },
    {
      icon: Heart,
      title: "Financial Inclusion",
      description: "We're committed to bringing quality financial services to all Nigerians."
    }
  ];

  const team = [
    {
      name: "Adewale Johnson",
      role: "Chief Executive Officer",
      bio: "15+ years in fintech and banking"
    },
    {
      name: "Chioma Okonkwo",
      role: "Chief Technology Officer",
      bio: "Former lead engineer at major tech firms"
    },
    {
      name: "Ibrahim Musa",
      role: "Chief Financial Officer",
      bio: "Expert in financial services regulation"
    },
    {
      name: "Ngozi Adekunle",
      role: "Head of Customer Success",
      bio: "Passionate about customer experience"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "₦500M+", label: "Loans Disbursed" },
    { value: "95%", label: "Customer Satisfaction" },
    { value: "24/7", label: "Support Available" }
  ];

  const content = (
    <div className="max-w-4xl mx-auto">
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
          <Building2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h1 className="mb-2">About FNG</h1>
            <p className="text-sm text-gray-600">
              Empowering Nigerians with accessible financial services
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="p-6 sm:p-8 mb-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <h2 className="mb-4">Our Mission</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          FNG is on a mission to democratize access to financial services across Nigeria. We provide simple, transparent loan and savings solutions that help individuals and small businesses achieve their financial goals.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Through innovative technology and customer-centric design, we're breaking down barriers that have traditionally excluded millions of Nigerians from accessing quality financial services.
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-4 text-center">
            <p className="text-blue-600 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Our Story */}
      <Card className="p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-purple-600" />
          <h2>Our Story</h2>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          FNG was founded in 2023 by a team of financial services professionals and technology experts who shared a common vision: to make financial services accessible to every Nigerian, regardless of their location or economic status.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          We recognized that traditional banks and lenders often overlook small businesses and individuals who need financial support the most. By combining cutting-edge technology with deep understanding of the Nigerian market, we created a platform that serves those who have been underserved.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Today, FNG serves thousands of customers across Nigeria, helping them access loans for business growth, emergency expenses, and daily savings goals. We're proud to be part of their financial journey.
        </p>
      </Card>

      {/* Core Values */}
      <div className="mb-8">
        <h2 className="mb-6 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <Card key={idx} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm mb-1">{value.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* What We Offer */}
      <Card className="p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h2>What We Offer</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm mb-2">💰 Flexible Loans</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Choose from SME, Business, or Jumbo loans ranging from ₦10,000 to ₦500,000 with competitive interest rates and flexible repayment terms.
            </p>
          </div>

          <div>
            <h4 className="text-sm mb-2">🏦 Daily Savings</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Build healthy saving habits with our daily contribution feature. Track your streak and watch your savings grow.
            </p>
          </div>

          <div>
            <h4 className="text-sm mb-2">⚡ Fast Processing</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Get loan approvals within 24-48 hours and disbursements in 1-2 business days. No lengthy paperwork or endless waiting.
            </p>
          </div>

          <div>
            <h4 className="text-sm mb-2">🔒 Secure Platform</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your data is protected with bank-level encryption and security. We comply with all Nigerian data protection regulations.
            </p>
          </div>

          <div>
            <h4 className="text-sm mb-2">🎯 Transparent Pricing</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              No hidden fees. All costs are clearly disclosed upfront, including interest rates, insurance fees, and service charges.
            </p>
          </div>
        </div>
      </Card>

      {/* Leadership Team */}
      <div className="mb-8">
        <h2 className="mb-6 text-center">Our Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map((member, idx) => (
            <Card key={idx} className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm mb-0.5">{member.name}</h4>
                  <p className="text-xs text-blue-600 mb-1">{member.role}</p>
                  <p className="text-xs text-gray-600">{member.bio}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Choose FNG */}
      <Card className="p-6 sm:p-8 mb-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-green-600" />
          <h2>Why Choose FNG?</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
            <p className="text-sm text-gray-700">
              <strong>Licensed & Regulated:</strong> We operate in full compliance with Nigerian financial regulations
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
            <p className="text-sm text-gray-700">
              <strong>Customer Support:</strong> Dedicated support team available via phone, email, and live chat
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
            <p className="text-sm text-gray-700">
              <strong>Simple Process:</strong> Easy KYC verification and straightforward loan application
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
            <p className="text-sm text-gray-700">
              <strong>Mobile First:</strong> Designed for mobile users, accessible anywhere, anytime
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
            <p className="text-sm text-gray-700">
              <strong>Fair Terms:</strong> Competitive rates with no predatory lending practices
            </p>
          </div>
        </div>
      </Card>

      {/* Regulatory Information */}
      <Card className="p-6 sm:p-8">
        <h3 className="mb-3">Regulatory Information</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Company Name:</strong> FNG Financial Services Limited
          </p>
          <p>
            <strong>RC Number:</strong> RC 1234567
          </p>
          <p>
            <strong>Registered Address:</strong> 123 Lagos Business District, Victoria Island, Lagos, Nigeria
          </p>
          <p>
            <strong>Regulatory Compliance:</strong> Licensed by Central Bank of Nigeria (CBN)
          </p>
          <p className="text-xs text-gray-600 mt-4">
            FNG is committed to responsible lending practices and operates in accordance with all applicable Nigerian laws and regulations.
          </p>
        </div>
      </Card>
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
