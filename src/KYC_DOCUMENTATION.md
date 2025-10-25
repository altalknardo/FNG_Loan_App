# KYC (Know Your Customer) System Documentation

## Overview
The FNG app now includes a comprehensive KYC (Know Your Customer) registration and verification system to ensure regulatory compliance and secure customer onboarding.

## Table of Contents
1. [Features](#features)
2. [Customer Registration Flow](#customer-registration-flow)
3. [Admin Approval Process](#admin-approval-process)
4. [Data Collected](#data-collected)
5. [Status States](#status-states)
6. [Usage Guide](#usage-guide)
7. [Technical Implementation](#technical-implementation)

## Features

### Customer-Facing Features
✅ **Multi-Step Registration Form**
- 4-step progressive form with progress tracking
- Real-time validation at each step
- Clear error messages and guidance
- Auto-save capability

✅ **Comprehensive Data Collection**
- Personal information
- Address details
- Government ID verification
- Bank Verification Number (BVN)
- Document uploads

✅ **Document Upload System**
- ID document (front & back)
- Proof of address
- Selfie verification
- Supported formats: JPG, PNG, PDF
- File size limit: 5MB per document

✅ **Status Tracking**
- Real-time application status
- Pending/Approved/Rejected states
- Banner notifications

### Admin Features
✅ **Comprehensive Review Dashboard**
- Filter by status (All, Pending, Approved, Rejected)
- Search by name, email, or phone
- Statistics overview
- Bulk operations support

✅ **Detailed Application Review**
- Tabbed interface for organized review
- Personal, Address, Verification, Documents tabs
- Document preview and download
- One-click approve/reject

✅ **Activity Logging**
- All approval/rejection actions logged
- Timestamp tracking
- Admin accountability

## Customer Registration Flow

### Step 1: Personal Information
Required fields:
- **First Name** - As shown on official documents
- **Last Name** - As shown on official documents
- **Email Address** - Valid email format
- **Phone Number** - Nigerian format (+234...)
- **Date of Birth** - Must be 18+ years old
- **Gender** - Male/Female/Other

Validation:
- All fields required
- Email format validation
- Phone number format validation
- Age verification (18+)

### Step 2: Address Information
Required fields:
- **Street Address** - Full residential address
- **City** - Current city of residence
- **State** - One of 36 Nigerian states + FCT

Validation:
- All fields required
- Address must be complete
- State must be selected from dropdown

### Step 3: ID Verification
Required fields:
- **ID Type** - Select from:
  - National Identity Number (NIN)
  - Driver's License
  - Voter's Card
  - International Passport
- **ID Number** - As shown on document
- **BVN (Bank Verification Number)** - 11 digits

Validation:
- All fields required
- BVN must be exactly 11 digits
- ID number format checking

### Step 4: Document Upload
Required uploads:
1. **ID Document**
   - Front and back of selected ID
   - Must be clear and readable
   - Recent photo (not expired)

2. **Proof of Address**
   - Utility bill (not older than 3 months)
   - Bank statement (not older than 3 months)
   - Government-issued document with address
   
3. **Selfie Verification**
   - Clear photo of face
   - Holding ID document
   - Good lighting
   - Face clearly visible

File Requirements:
- Format: JPG, PNG, or PDF
- Size: Maximum 5MB per file
- Quality: Clear and legible

## Admin Approval Process

### Accessing KYC Approvals
1. Switch to Admin Mode
2. Navigate to "Customers" (UserCheck icon)
3. View all KYC submissions

### Review Dashboard

#### Statistics Cards
- **Pending**: Applications awaiting review
- **Approved**: Successfully verified customers
- **Rejected**: Applications that didn't meet requirements

#### Filter Options
- **All**: View all submissions
- **Pending**: Only pending applications
- **Approved**: Only approved customers
- **Rejected**: Only rejected applications

#### Search Function
Search by:
- Customer name (first or last)
- Email address
- Phone number

### Reviewing an Application

#### Quick Review (List View)
Each card shows:
- Customer name and email
- Phone number and location
- ID type
- Submission date
- Current status
- Quick action buttons

#### Detailed Review
Click "Review Details" to open full application:

**Personal Tab:**
- Full name
- Email address
- Phone number
- Date of birth
- Gender

**Address Tab:**
- Complete street address
- City
- State

**Verification Tab:**
- ID type (with full label)
- ID number
- BVN (masked for security)

**Documents Tab:**
- ID document card with download button
- Proof of address card with download button
- Selfie card with download button

### Making a Decision

#### To Approve:
1. Review all information thoroughly
2. Verify documents are clear and valid
3. Check BVN matches customer details
4. Click "Approve Application"
5. Customer gains full access

#### To Reject:
1. Identify issues with application
2. Click "Reject Application"
3. Customer is notified
4. Customer can resubmit

## Data Collected

### Personal Data
```
- First Name
- Last Name  
- Email
- Phone Number
- Date of Birth
- Gender
```

### Address Data
```
- Street Address
- City
- State
```

### Verification Data
```
- ID Type (NIN/License/Voter/Passport)
- ID Number
- BVN (11-digit)
```

### Documents (File Names)
```
- ID Document (front & back)
- Proof of Address
- Selfie with ID
```

### Metadata
```
- Submission Timestamp
- Review Timestamp
- Status
- Reviewer Notes (optional)
```

## Status States

### not_submitted
- **Meaning**: User hasn't started KYC
- **User Experience**: Shows registration form
- **Access Level**: None - must complete KYC

### pending
- **Meaning**: Application submitted, awaiting admin review
- **User Experience**: Orange banner notification
- **Access Level**: Limited - can view app but not transact

### approved
- **Meaning**: Admin approved the application
- **User Experience**: Full access, no restrictions
- **Access Level**: Complete - all features available

### rejected
- **Meaning**: Admin rejected the application
- **User Experience**: Red banner with contact info
- **Access Level**: Limited - must contact support or resubmit

## Usage Guide

### For New Customers

#### First Time Access:
1. Open FNG app
2. Automatically redirected to KYC registration
3. See welcome message and instructions

#### Completing Registration:
1. **Start with Step 1 (Personal)**
   - Fill all personal details
   - Click "Next"

2. **Continue to Step 2 (Address)**
   - Enter complete address
   - Select state from dropdown
   - Click "Next"

3. **Complete Step 3 (Verification)**
   - Choose ID type
   - Enter ID number
   - Enter BVN carefully
   - Read security notice
   - Click "Next"

4. **Finish with Step 4 (Documents)**
   - Upload ID document (clear photo)
   - Upload proof of address
   - Upload selfie with ID
   - Review all documents
   - Click "Submit Application"

5. **Wait for Approval**
   - See success message
   - Application goes to pending
   - Orange banner shows pending status
   - Wait for admin to review

#### After Submission:
- Can browse the app
- Limited functionality until approved
- Banner shows current status
- Notified when status changes

### For Administrators

#### Daily Workflow:
1. **Check Pending Count**
   - Badge shows pending applications
   - Navigate to Customer Approvals

2. **Review Applications**
   - Filter to show "Pending"
   - Review in order of submission
   - Click "Review Details" for each

3. **Verify Information**
   - Check all four tabs
   - Verify documents are valid
   - Confirm BVN is correct
   - Look for any red flags

4. **Make Decisions**
   - Approve if everything checks out
   - Reject if documents invalid or incomplete
   - Log notes for rejected applications

5. **Monitor Activity**
   - Check Activity feed for logged actions
   - Review approved/rejected counts
   - Track processing times

## Technical Implementation

### Components

#### KYCRegistration.tsx
- Multi-step form component
- Progressive validation
- Mock file upload handling
- LocalStorage integration

**Key Features:**
- 4-step wizard
- Progress indicator
- Per-step validation
- Error handling
- Auto-scrolling between steps

#### CustomerApprovals.tsx (Enhanced)
- Complete rewrite for KYC
- Tabbed review interface
- Search and filter functionality
- Document management
- Status badges

**Key Features:**
- Real-time filtering
- Detailed review modal
- One-click approval/rejection
- Activity logging
- Statistics dashboard

#### App.tsx (Updated)
- KYC status checking
- Conditional rendering
- Status banners
- Auto-redirect logic

### Data Storage

#### LocalStorage Key: `kycSubmissions`

**Structure:**
```json
[
  {
    "id": 1234567890,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "phone": "+234 800 000 0000",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "address": "123 Main Street",
    "city": "Lagos",
    "state": "Lagos",
    "idType": "nin",
    "idNumber": "12345678901",
    "bvn": "12345678901",
    "idDocument": "id_front_back.jpg",
    "proofOfAddress": "utility_bill.pdf",
    "selfie": "selfie_with_id.jpg",
    "status": "pending",
    "submittedAt": "2025-10-16T10:30:00.000Z",
    "reviewedAt": null,
    "reviewNotes": null
  }
]
```

### Status Checking Logic

```typescript
// Check KYC status
const submissions = JSON.parse(
  localStorage.getItem("kycSubmissions") || "[]"
);

if (submissions.length > 0) {
  const latestSubmission = submissions[submissions.length - 1];
  setKycStatus(latestSubmission.status);
} else {
  setKycStatus("not_submitted");
}
```

### Validation Rules

#### Email Validation:
```regex
^[^\s@]+@[^\s@]+\.[^\s@]+$
```

#### Phone Validation:
```regex
^[\d\s\-+()]{10,}$
```

#### BVN Validation:
```regex
^\d{11}$
```

### File Upload (Mock)

**Current Implementation:**
- Stores file name only
- No actual file storage
- Uses HTML file input
- Success toast on "upload"

**Production Requirements:**
- Implement actual file upload to server
- Store files securely (S3, Cloud Storage)
- Generate unique file URLs
- Implement file size checking
- Validate file types
- Scan for malware

## Security Considerations

### Data Protection
✅ All data stored locally (demo purposes)
✅ BVN partially masked in some views
✅ Secure document storage needed (production)
✅ HTTPS required (production)
✅ Encryption at rest (production)

### Privacy
✅ Data used only for verification
✅ Compliance with data protection laws
✅ User consent required
✅ Right to data deletion
✅ Minimal data retention

### Access Control
✅ Admin-only access to submissions
✅ Role-based access (future)
✅ Audit trail of all actions
✅ Secure document download (future)

## Nigerian Compliance

### Regulatory Requirements
- **CBN Guidelines**: Know Your Customer requirements
- **NIMC**: National ID verification
- **BVN**: Bank Verification Number mandatory
- **Data Protection**: NDPR compliance
- **Anti-Money Laundering**: AML/CFT regulations

### Supported ID Types
1. **National Identity Number (NIN)** - NIMC issued
2. **Driver's License** - FRSC issued
3. **Voter's Card** - INEC issued
4. **International Passport** - Immigration Service

### States Coverage
All 36 states + FCT:
- Abia through Zamfara
- Federal Capital Territory (FCT)

## Testing

### Test Scenario 1: New Customer Registration

1. **Start Application**
   - Open app in user mode
   - Verify KYC form appears
   - Check progress bar shows Step 1 of 4

2. **Complete Step 1**
   - Fill all personal fields
   - Try clicking Next with errors
   - Verify validation works
   - Fill correctly and proceed

3. **Complete Step 2**
   - Enter address details
   - Select state from dropdown
   - Test back button
   - Proceed to next step

4. **Complete Step 3**
   - Select ID type
   - Enter ID number
   - Enter 11-digit BVN
   - Test BVN validation
   - Proceed to documents

5. **Complete Step 4**
   - Upload all three documents
   - Verify success messages
   - Test remove button
   - Submit application

6. **Verify Submission**
   - See success toast
   - Redirected to main app
   - See pending banner
   - Check localStorage

### Test Scenario 2: Admin Review Process

1. **Access Admin Mode**
   - Click Admin Mode button
   - Navigate to Customers
   - See pending count badge

2. **Review Dashboard**
   - Check statistics cards
   - Test search functionality
   - Test filter buttons
   - Verify list display

3. **Detailed Review**
   - Click "Review Details"
   - Switch between tabs
   - Verify all data shown
   - Check document cards

4. **Approve Application**
   - Click "Approve Application"
   - Verify success toast
   - Check status updated
   - Verify activity logged

5. **Verify User Access**
   - Switch to User Mode
   - Verify no banner shown
   - Confirm full access
   - Test all features

### Test Scenario 3: Rejection Flow

1. **Reject Application**
   - Admin reviews application
   - Click "Reject Application"
   - Verify success message

2. **Check User View**
   - Switch to User Mode
   - Verify red banner shown
   - Check message content
   - Limited access enforced

### Test Scenario 4: Multiple Submissions

1. **Create Multiple**
   - Submit several KYC forms
   - Use different data
   - Verify all saved

2. **Filter and Search**
   - Test "All" filter
   - Test "Pending" filter
   - Search by name
   - Search by email

3. **Bulk Review**
   - Approve some applications
   - Reject others
   - Check statistics update
   - Verify counts correct

## Troubleshooting

### Issue: KYC form not appearing
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Refresh browser
- Check console for errors
- Ensure not in Admin Mode

### Issue: Documents not uploading
**Solution:**
- Check file size < 5MB
- Verify file format (JPG/PNG/PDF)
- Try different file
- Check browser console

### Issue: Validation errors persist
**Solution:**
- Double-check field format
- Ensure all fields filled
- Check BVN is 11 digits
- Verify email format

### Issue: Status not updating
**Solution:**
- Switch modes to refresh
- Check localStorage data
- Clear cache
- Reload page

### Issue: Can't approve in Admin
**Solution:**
- Verify in Admin Mode
- Check customer is "pending"
- Look for console errors
- Try detailed review dialog

## Future Enhancements

### Planned Features

1. **Enhanced Document Management**
   - Real file upload and storage
   - Document preview in modal
   - PDF viewer integration
   - Image zoom functionality

2. **Advanced Verification**
   - BVN verification API
   - NIN verification API
   - Address verification service
   - Facial recognition for selfie

3. **Automated Workflows**
   - Auto-approval for verified BVN
   - Risk scoring system
   - Fraud detection
   - Duplicate checking

4. **Notifications**
   - Email notifications for status changes
   - SMS alerts
   - Push notifications
   - Admin alert dashboard

5. **Reporting**
   - KYC completion rates
   - Average approval time
   - Rejection reasons analytics
   - Compliance reports

6. **User Experience**
   - Save as draft
   - Resume incomplete applications
   - Edit submitted application
   - Resubmit after rejection

7. **Admin Features**
   - Bulk approve/reject
   - Assignment to reviewers
   - Review notes and comments
   - Second-level approval
   - Audit log export

8. **Security**
   - Two-factor authentication
   - Biometric verification
   - Document watermarking
   - Encrypted storage

9. **Compliance**
   - NDPR compliance tools
   - Data retention policies
   - Right to be forgotten
   - Consent management

10. **Integration**
    - Third-party verification APIs
    - Banking system integration
    - Credit bureau checks
    - Government database lookups

## API Integration (Future)

### Endpoints Needed

```typescript
// Customer endpoints
POST   /api/kyc/submit           // Submit KYC application
GET    /api/kyc/status           // Check status
PUT    /api/kyc/update           // Update application
POST   /api/kyc/resubmit         // Resubmit after rejection

// Admin endpoints
GET    /api/admin/kyc/list       // Get all submissions
GET    /api/admin/kyc/:id        // Get specific submission
PUT    /api/admin/kyc/:id/approve // Approve application
PUT    /api/admin/kyc/:id/reject  // Reject application
GET    /api/admin/kyc/stats      // Get statistics

// Document endpoints
POST   /api/kyc/upload           // Upload document
GET    /api/kyc/document/:id     // Download document
DELETE /api/kyc/document/:id     // Delete document

// Verification endpoints
POST   /api/verify/bvn           // Verify BVN
POST   /api/verify/nin           // Verify NIN
POST   /api/verify/address       // Verify address
```

## Support

### For Customers
- **Email**: support@fng.com
- **Phone**: +234 XXX XXX XXXX
- **Hours**: Mon-Fri, 9AM-5PM WAT

### For Administrators
- **Technical Support**: admin@fng.com
- **Training**: training@fng.com
- **Documentation**: This file

---

**Version**: 1.0  
**Last Updated**: October 16, 2025  
**Feature**: KYC Registration & Verification System  
**Compliance**: CBN KYC Guidelines, NDPR
