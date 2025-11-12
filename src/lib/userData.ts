export interface UserData {
  name: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  phoneVerified: boolean;
  kyc: boolean;
  idDocumentUrl: string;
  proofOfAddressUrl: string;
  selfieUrl: string;

  idInfo: {
    idType: string;
    idNumber: string;
    bvn: string;
  };

  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };

  cardInfo: {
    cardNumber: string;
    cardType: string;
  };

  firstName: string;
  lastName: string;
  dob: string; // ISO date string, e.g. "1998-02-11"
  gender: string;
  paymentType: "bank" | "card" | ""; // use a union for known values
}
