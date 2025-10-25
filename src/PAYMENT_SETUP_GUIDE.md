# Payment Gateway Setup Guide
## OPay + Paystack Integration

This guide will help you set up both OPay and Paystack payment gateways for your FNG application.

---

## 🚀 Quick Start

### Step 1: Get Your API Keys

#### OPay (Primary - 90% of users)
1. Visit [OPay Business Portal](https://business.opayweb.com)
2. Create business account
3. Complete KYC verification
4. Get your keys from Developer → API Keys

#### Paystack (Alternative)
1. Visit [Paystack](https://paystack.com)
2. Sign up for account
3. Complete business verification
4. Get keys from Settings → API Keys

### Step 2: Configure Environment

Create `.env` file in your project root:

```env
# ===== OPAY CONFIGURATION (PRIMARY) =====
# Get these from: https://business.opayweb.com/developer
VITE_OPAY_PUBLIC_KEY=OPAYPRV_16xxxxxxxxxxxxxxxxxxxxx
VITE_OPAY_MERCHANT_ID=256xxxxxxxxx
VITE_OPAY_SECRET_KEY=OPAYPRV_SKxxxxxxxxxxxxxxxxxxxxx

# ===== PAYSTACK CONFIGURATION (ALTERNATIVE) =====
# Get these from: https://dashboard.paystack.com/#/settings/developers
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
VITE_PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Test Payment

1. Start your application
2. Navigate to Contributions
3. Click "Contribute"
4. Select payment method
5. Click "Pay Now (Instant)"
6. Choose gateway:
   - **OPay** (recommended if you have OPay wallet)
   - **Paystack** (if you prefer card payment)
7. Complete test payment
8. Verify balance updated

---

## 📋 Detailed Setup

### OPay Account Setup

#### 1. Create Business Account

**Requirements:**
- Business name
- Business registration number
- Business address
- Bank account details
- Director/Owner ID
- Business documents

**Process:**
1. Go to [business.opayweb.com](https://business.opayweb.com)
2. Click "Sign Up"
3. Enter business email
4. Verify email
5. Fill business information
6. Submit documents
7. Wait for approval (1-3 business days)

#### 2. Complete KYC Verification

**Required Documents:**
- CAC Certificate (for registered businesses)
- Valid ID (Director/Owner)
- Utility bill (Business address)
- Bank statement (Recent 3 months)
- Business plan (optional)

**Upload Process:**
1. Log in to business portal
2. Go to Settings → KYC
3. Upload documents
4. Submit for review
5. Await verification email

#### 3. Get API Credentials

**Steps:**
1. Log in to OPay Business Dashboard
2. Navigate to **Developer** section
3. Click **API Keys**
4. You'll see:
   ```
   Public Key:    OPAYPRV_16xxxxxxxxxxxxx
   Merchant ID:   256xxxxxxxxx
   Secret Key:    OPAYPRV_SKxxxxxxxxxxxxx (click to reveal)
   ```
5. Copy these keys
6. Store securely

**Key Types:**
- **Test Keys**: Start with `OPAYPRV_16...` (for development)
- **Live Keys**: Start with `OPAYPRV_17...` (for production)

### Paystack Account Setup

#### 1. Create Account

**Requirements:**
- Business email
- Phone number
- Business name
- Business type

**Process:**
1. Go to [paystack.com](https://paystack.com)
2. Click "Get Started"
3. Enter email and create password
4. Verify email
5. Complete profile

#### 2. Business Verification

**Required Information:**
- Business registration details
- Bank account (for settlements)
- Business address
- Director information

**Process:**
1. Log in to Paystack Dashboard
2. Go to Settings → Business
3. Fill all required fields
4. Submit for verification
5. Wait for approval (1-2 business days)

#### 3. Get API Keys

**Steps:**
1. Log in to Paystack Dashboard
2. Go to Settings → API Keys & Webhooks
3. You'll see:
   ```
   Test Public Key:   pk_test_xxxxxxxxxxxxx
   Test Secret Key:   sk_test_xxxxxxxxxxxxx (click to reveal)
   
   Live Public Key:   pk_live_xxxxxxxxxxxxx
   Live Secret Key:   sk_live_xxxxxxxxxxxxx (click to reveal)
   ```
4. Copy the keys
5. Store securely

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in project root:

```env
# ========================================
#  PAYMENT GATEWAY CONFIGURATION
# ========================================

# ===== OPAY (PRIMARY GATEWAY) =====
# OPay is used by 90% of FNG customers
# Get credentials from: https://business.opayweb.com

# Test Environment (Development)
VITE_OPAY_PUBLIC_KEY=OPAYPRV_16001234567890123456789
VITE_OPAY_MERCHANT_ID=256100012345
VITE_OPAY_SECRET_KEY=OPAYPRV_SK16001234567890123456789

# Live Environment (Production - Uncomment when ready)
# VITE_OPAY_PUBLIC_KEY=OPAYPRV_17001234567890123456789
# VITE_OPAY_MERCHANT_ID=256200012345
# VITE_OPAY_SECRET_KEY=OPAYPRV_SK17001234567890123456789


# ===== PAYSTACK (ALTERNATIVE GATEWAY) =====
# Paystack for users who prefer card payments
# Get credentials from: https://dashboard.paystack.com

# Test Environment (Development)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_1234567890abcdefghijklmnopqrs
VITE_PAYSTACK_SECRET_KEY=sk_test_1234567890abcdefghijklmnopqrs

# Live Environment (Production - Uncomment when ready)
# VITE_PAYSTACK_PUBLIC_KEY=pk_live_1234567890abcdefghijklmnopqrs
# VITE_PAYSTACK_SECRET_KEY=sk_live_1234567890abcdefghijklmnopqrs
```

### .env.example Template

Create `.env.example` for version control:

```env
# ========================================
#  PAYMENT GATEWAY CONFIGURATION
# ========================================

# OPay Configuration
VITE_OPAY_PUBLIC_KEY=OPAYPRV_YOUR_PUBLIC_KEY
VITE_OPAY_MERCHANT_ID=YOUR_MERCHANT_ID
VITE_OPAY_SECRET_KEY=OPAYPRV_SK_YOUR_SECRET_KEY

# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY
VITE_PAYSTACK_SECRET_KEY=sk_test_YOUR_SECRET_KEY
```

### .gitignore

Ensure `.env` is in `.gitignore`:

```gitignore
# Environment Variables (NEVER COMMIT)
.env
.env.local
.env.production
.env.development

# API Keys
*.key
*.pem
secrets/
```

---

## 🧪 Testing

### Test Mode Setup

#### OPay Test Credentials

**Get Test Account:**
1. Contact OPay support: support@opayweb.com
2. Request test account credentials
3. Use test public key (starts with `OPAYPRV_16`)

**Test Payment Flow:**
```javascript
// Test amounts in Naira
const testAmounts = {
  success: 500,      // Will succeed
  failure: 1,        // Will fail
  pending: 100,      // Will be pending
};
```

#### Paystack Test Cards

**Success Scenarios:**
```
Card: 4084 0840 8408 4081
CVV: 408
Expiry: 12/30
PIN: 0000
OTP: 123456
```

**Insufficient Funds:**
```
Card: 5060 6666 6666 6666 4
```

**Declined:**
```
Card: 5061 0161 0161 0161 6
```

### Testing Checklist

#### OPay Testing
- [ ] Payment initiation
- [ ] Wallet payment (simulated)
- [ ] Card payment
- [ ] Bank transfer
- [ ] Payment cancellation
- [ ] Balance update verification
- [ ] Transaction recording
- [ ] Receipt generation

#### Paystack Testing
- [ ] Card payment success
- [ ] Card payment failure
- [ ] Bank transfer
- [ ] USSD payment
- [ ] Payment cancellation
- [ ] Webhook handling (if backend)

#### Integration Testing
- [ ] Switch between gateways
- [ ] Multiple payment methods
- [ ] Concurrent payments
- [ ] Network error handling
- [ ] Timeout handling

---

## 🚀 Production Deployment

### Pre-Launch Checklist

#### OPay Production
- [ ] Business account fully verified
- [ ] Live API keys obtained
- [ ] Test payments successful (small amounts)
- [ ] Settlement account configured
- [ ] Webhook URL set (if using backend)
- [ ] Contact information updated
- [ ] Support email configured

#### Paystack Production
- [ ] Business verification complete
- [ ] Live API keys obtained
- [ ] Test payments successful
- [ ] Bank account verified for settlements
- [ ] Webhook URL set (if backend)
- [ ] Email notifications configured

#### Environment
- [ ] Live keys added to production `.env`
- [ ] Test keys removed from production
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Domain verified
- [ ] SSL certificate valid

#### Security
- [ ] Secret keys not in frontend code
- [ ] Payment verification on backend (if implemented)
- [ ] Rate limiting enabled
- [ ] Transaction logging active
- [ ] Error monitoring setup
- [ ] Fraud detection configured

### Go-Live Steps

1. **Switch to Live Keys**
   ```env
   # Change from test to live keys
   VITE_OPAY_PUBLIC_KEY=OPAYPRV_17...  # Live key (17 not 16)
   VITE_PAYSTACK_PUBLIC_KEY=pk_live_...  # Live key
   ```

2. **Deploy to Production**
   ```bash
   # Build with production environment
   npm run build
   
   # Deploy to hosting
   # (Your deployment command)
   ```

3. **Test with Real Money**
   - Make small test payment (₦10)
   - Verify balance updates
   - Check transaction record
   - Confirm settlement

4. **Monitor First Hour**
   - Watch for errors
   - Check success rates
   - Monitor user feedback
   - Verify settlements

---

## 📊 Monitoring & Analytics

### Track Payment Performance

```javascript
// Get gateway usage statistics
const transactions = JSON.parse(
  localStorage.getItem("transactions") || "[]"
);

// OPay statistics
const opayTxs = transactions.filter(t => t.gateway === "opay");
const opaySuccess = opayTxs.filter(t => t.status === "completed");
const opaySuccessRate = (opaySuccess.length / opayTxs.length) * 100;

console.log(`OPay Usage: ${opayTxs.length} transactions`);
console.log(`OPay Success Rate: ${opaySuccessRate.toFixed(2)}%`);

// Paystack statistics
const paystackTxs = transactions.filter(t => t.gateway === "paystack");
const paystackSuccess = paystackTxs.filter(t => t.status === "completed");
const paystackSuccessRate = (paystackSuccess.length / paystackTxs.length) * 100;

console.log(`Paystack Usage: ${paystackTxs.length} transactions`);
console.log(`Paystack Success Rate: ${paystackSuccessRate.toFixed(2)}%`);
```

### Key Metrics to Monitor

1. **Success Rates**
   - OPay success rate
   - Paystack success rate
   - Overall success rate

2. **Gateway Usage**
   - % of users choosing OPay
   - % of users choosing Paystack
   - Total transaction volume

3. **Transaction Values**
   - Average transaction amount
   - Total processed (OPay)
   - Total processed (Paystack)

4. **Performance**
   - Payment completion time
   - Error rates
   - User drop-off points

---

## 🔒 Security Best Practices

### API Key Management

✅ **DO:**
- Store keys in `.env` file
- Use different keys for test/live
- Rotate keys periodically
- Use environment variables
- Keep secret keys on backend (when implemented)

❌ **DON'T:**
- Commit keys to git
- Hardcode keys in source
- Share keys in screenshots
- Use live keys in development
- Expose secret keys in frontend

### Payment Verification

✅ **DO:**
- Verify all payments
- Log all transactions
- Monitor for duplicates
- Check transaction status
- Implement timeout handling

❌ **DON'T:**
- Trust client-side only
- Skip verification
- Ignore failed payments
- Allow unlimited retries

---

## 🆘 Troubleshooting

### Common Issues

#### Issue: "Invalid API Key"

**Cause:** Wrong or expired API key

**Solution:**
1. Check `.env` file exists
2. Verify key format (OPAYPRV_ or pk_)
3. Ensure test key for development
4. Regenerate keys if needed

#### Issue: Payment window doesn't open

**Cause:** Script not loaded or popup blocked

**Solution:**
1. Check browser console for errors
2. Disable popup blocker
3. Verify internet connection
4. Try different browser

#### Issue: Balance not updating

**Cause:** Verification failed or localStorage issue

**Solution:**
1. Check browser console
2. Verify transaction on gateway dashboard
3. Check localStorage in DevTools
4. Clear cache and retry

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('DEBUG_PAYMENTS', 'true');

// View payment logs
console.log(localStorage.getItem('transactions'));
```

---

## 📞 Support Contacts

### OPay Support
- **Email:** support@opayweb.com
- **Phone:** +234 700 OPAY HELP
- **Business Portal:** [business.opayweb.com](https://business.opayweb.com)
- **Developer Docs:** [documentation.opayweb.com](https://documentation.opayweb.com)

### Paystack Support
- **Email:** support@paystack.com
- **Phone:** +234 1 888 7652
- **Dashboard:** [dashboard.paystack.com](https://dashboard.paystack.com)
- **Documentation:** [paystack.com/docs](https://paystack.com/docs)

### FNG Support
- **Email:** support@fng.ng
- **Phone:** +234 800 123 4567
- **In-App:** Support tab

---

## 📚 Additional Resources

### Documentation
- [OPay Integration Guide](/OPAY_INTEGRATION_GUIDE.md)
- [Paystack Integration Guide](/REALTIME_PAYMENT_INTEGRATION.md)
- [API Reference](/lib/opay-service.ts)
- [Component Documentation](/components/PaymentDialog.tsx)

### Guides
- Quick Start Guide
- Testing Guide
- Production Deployment Guide
- Security Best Practices
- Troubleshooting Guide

---

**Last Updated:** October 20, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
