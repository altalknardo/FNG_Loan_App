# Personal Information Management

## Overview
FNG now includes a comprehensive Personal Information management system that allows customers to manage their next of kin details, contact information, and residential address all from one convenient location.

## 🎯 Features

### **Three Main Sections**

1. **Next of Kin** 👨‍👩‍👧‍👦
   - Full name
   - Relationship (Spouse, Parent, Child, Sibling, etc.)
   - Phone number
   - Email (optional)
   - Address (optional)

2. **Contact Information** 📞
   - Primary phone number
   - Alternate phone number (optional)
   - Alternate email address (optional)

3. **Residential Address** 🏠
   - Street address
   - City
   - State (Nigerian states dropdown)
   - Postal code (optional)
   - Country (fixed to Nigeria)

## 📍 How to Access

### For Customers
1. Log in to your account
2. Navigate to **Profile** (bottom navigation)
3. Click **Personal Information** in the menu
4. View and edit your details

## 🎨 User Interface

### Main View
- **Clean card-based layout** for each section
- **Quick edit buttons** on each card
- **Read-only display** of current information
- **Visual indicators** when information is not set
- **Color-coded icons** for easy identification:
  - 🟣 Purple - Next of Kin
  - 🟢 Green - Contact Information
  - 🟠 Orange - Residential Address

### Edit Dialogs
- **Modal dialogs** for editing each section
- **Validation in real-time** with error messages
- **Required field indicators** (marked with *)
- **Dropdown selectors** for relationships and states
- **Auto-saving** with confirmation toasts

## ✅ Validation Rules

### Next of Kin
- ✔️ **Full Name**: Required
- ✔️ **Relationship**: Required (selected from list)
- ✔️ **Phone Number**: Required, must be valid Nigerian format
- ✔️ **Email**: Optional, but must be valid if provided
- ✔️ **Address**: Optional

### Contact Information
- ✔️ **Primary Phone**: Required, must be valid Nigerian format
- ✔️ **Alternate Phone**: Optional, but must be valid if provided
- ✔️ **Alternate Email**: Optional, but must be valid if provided

### Residential Address
- ✔️ **Street Address**: Required
- ✔️ **City**: Required
- ✔️ **State**: Required (selected from Nigerian states)
- ✔️ **Postal Code**: Optional
- ✔️ **Country**: Fixed to Nigeria

## 📱 Phone Number Validation

Accepts multiple Nigerian phone formats:
- ✅ `08012345678` (standard)
- ✅ `+2348012345678` (international)
- ✅ `2348012345678` (without +)
- ✅ `0801 234 5678` (with spaces)

Valid prefixes: 070, 080, 081, 090, 091, etc.

## 🏷️ Relationship Options

Pre-defined list of relationships:
- Spouse
- Parent
- Child
- Sibling
- Uncle
- Aunt
- Cousin
- Friend
- Other

## 🗺️ Nigerian States

Complete list of all 36 states + FCT:
- Abia, Adamawa, Akwa Ibom, Anambra, Bauchi, Bayelsa, Benue, Borno
- Cross River, Delta, Ebonyi, Edo, Ekiti, Enugu, FCT, Gombe
- Imo, Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi, Kwara
- Lagos, Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau
- Rivers, Sokoto, Taraba, Yobe, Zamfara

## 💾 Data Storage

### Per-User Storage
- Information is stored per user email in localStorage
- Key format: `personalData_{userEmail}`
- Persists across sessions
- Syncs with user profile data

### Data Structure
```json
{
  "nextOfKin": {
    "fullName": "John Doe",
    "relationship": "Sibling",
    "phoneNumber": "08012345678",
    "email": "john@example.com",
    "address": "123 Main St, Lagos"
  },
  "contact": {
    "primaryPhone": "08012345678",
    "alternatePhone": "08087654321",
    "alternateEmail": "alternate@email.com"
  },
  "address": {
    "street": "123 Main Street",
    "city": "Lagos",
    "state": "Lagos",
    "postalCode": "100001",
    "country": "Nigeria"
  }
}
```

## 🔄 How to Update Information

### Edit Next of Kin
1. Click **Edit** button on Next of Kin card
2. Fill in the required fields (Name, Relationship, Phone)
3. Optionally add email and address
4. Click **Save Changes**
5. Success toast appears!

### Edit Contact Information
1. Click **Edit** button on Contact Information card
2. Update your primary phone (required)
3. Optionally add alternate phone and email
4. Click **Save Changes**
5. Success toast appears!

### Edit Residential Address
1. Click **Edit** button on Residential Address card
2. Enter street address, city, and select state
3. Optionally add postal code
4. Click **Save Changes**
5. Success toast appears!

## 🎯 Use Cases

### Why Keep This Information Updated?

1. **Emergency Contact** 🚨
   - Next of kin can be contacted in emergencies
   - Important for account recovery

2. **Communication** 📧
   - Multiple contact methods ensure you receive important updates
   - Alternate contacts for when primary is unavailable

3. **Verification** ✅
   - Address verification for loan applications
   - KYC compliance requirements

4. **Security** 🔒
   - Additional verification layer for account security
   - Helps prevent unauthorized access

## 🔔 Future Enhancements

Coming Soon:
- ✨ Email verification for changes
- ✨ SMS verification for phone updates
- ✨ Address verification via postal code
- ✨ Document upload for proof of address
- ✨ Next of kin notification system
- ✨ Multiple next of kin support
- ✨ Emergency contact alerts

## 📱 Mobile Responsive

Fully responsive design works on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1920px+)

## 💡 Tips & Best Practices

### Next of Kin Tips
- ✅ Choose someone who is easily reachable
- ✅ Use their most reliable phone number
- ✅ Keep their information updated
- ✅ Inform them that they're listed as next of kin

### Contact Information Tips
- ✅ Use an active phone number you check regularly
- ✅ Add an alternate phone in case primary is unavailable
- ✅ Alternate email useful for password recovery

### Address Tips
- ✅ Use your current residential address
- ✅ Include landmarks in street address if helpful
- ✅ Update when you move to a new location
- ✅ Ensure spelling is correct for verification

## 🛡️ Privacy & Security

### Data Protection
- ✅ Information stored locally on your device
- ✅ Not shared with third parties
- ✅ Used only for account management
- ✅ Can be updated anytime by you

### Access Control
- ✅ Only you can view your personal information
- ✅ Requires login to access
- ✅ Protected by your account password

## 🐛 Troubleshooting

### "Please fill in all required fields"
- Make sure all fields marked with * are filled
- Check that phone numbers are in valid format

### "Please enter a valid phone number"
- Use Nigerian phone format (08012345678)
- Remove any special characters except spaces
- Must start with 0, 234, or +234

### "Please enter a valid email address"
- Check email format (user@domain.com)
- No spaces allowed in email
- Must include @ and domain extension

### Changes Not Saving
- Check your internet connection
- Ensure browser allows localStorage
- Try refreshing and attempting again

## 📊 Information Completeness

### Recommended Completion
For best account security and service:
- ✅ **Must Have**: Next of Kin (name, relationship, phone)
- ✅ **Highly Recommended**: Complete contact information
- ✅ **Important**: Residential address (for loan applications)
- ✅ **Optional**: Secondary contact methods

### Completion Benefits
- 🌟 Better account security
- 🌟 Faster loan processing
- 🌟 Easier account recovery
- 🌟 Enhanced customer support

## 🎨 Visual Indicators

### Icons Used
- 👤 **User**: Personal Information section
- 👨‍👩‍👧‍👦 **Users**: Next of Kin
- 📞 **Phone**: Contact Information
- 🏠 **Home**: Residential Address
- ✏️ **Edit**: Edit button
- ✅ **Check**: Success indicator
- ⚠️ **Alert**: Information or warning

### Status Display
- **Filled**: Shows current information
- **Empty**: "Not set" or "No information added yet" message
- **Required**: Fields marked with red asterisk (*)
- **Optional**: Fields without asterisk

## 🔗 Related Features

- **Account Security**: Change email, phone, password
- **Profile Management**: View profile statistics
- **KYC Verification**: Uses address for verification
- **Loan Applications**: Requires next of kin and address

## 📝 Quick Reference

### Minimum Required Information
```
Next of Kin:
✓ Full Name
✓ Relationship
✓ Phone Number

Contact:
✓ Primary Phone

Address:
✓ Street Address
✓ City
✓ State
```

### Optional Information
```
Next of Kin:
○ Email
○ Address

Contact:
○ Alternate Phone
○ Alternate Email

Address:
○ Postal Code
```

---

## Quick Start Guide

### Add Next of Kin
```
1. Profile → Personal Information
2. Next of Kin → Edit
3. Enter name, select relationship
4. Add phone number
5. Save Changes
```

### Add Contact Info
```
1. Profile → Personal Information
2. Contact Information → Edit
3. Enter primary phone
4. Add alternates (optional)
5. Save Changes
```

### Add Address
```
1. Profile → Personal Information
2. Residential Address → Edit
3. Enter street, city
4. Select state from dropdown
5. Save Changes
```

---

**Keep your personal information current for a secure and seamless FNG experience!** 🎉
