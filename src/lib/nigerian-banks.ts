// Comprehensive list of Nigerian Banks and Fintech Apps

export interface BankInfo {
  name: string;
  code: string;
  type: 'commercial' | 'microfinance' | 'fintech';
  ussdCode?: string;
}

export const nigerianBanks: BankInfo[] = [
  // Commercial Banks (Traditional)
  { name: "Access Bank", code: "044", type: "commercial", ussdCode: "*901#" },
  { name: "Access Bank (Diamond)", code: "063", type: "commercial", ussdCode: "*426#" },
  { name: "Citibank Nigeria", code: "023", type: "commercial" },
  { name: "Ecobank Nigeria", code: "050", type: "commercial", ussdCode: "*326#" },
  { name: "Fidelity Bank", code: "070", type: "commercial", ussdCode: "*770#" },
  { name: "First Bank of Nigeria", code: "011", type: "commercial", ussdCode: "*894#" },
  { name: "First City Monument Bank (FCMB)", code: "214", type: "commercial", ussdCode: "*329#" },
  { name: "Guaranty Trust Bank (GTBank)", code: "058", type: "commercial", ussdCode: "*737#" },
  { name: "Heritage Bank", code: "030", type: "commercial", ussdCode: "*322#" },
  { name: "Keystone Bank", code: "082", type: "commercial", ussdCode: "*7111#" },
  { name: "Polaris Bank", code: "076", type: "commercial", ussdCode: "*833#" },
  { name: "Providus Bank", code: "101", type: "commercial" },
  { name: "Stanbic IBTC Bank", code: "221", type: "commercial", ussdCode: "*909#" },
  { name: "Standard Chartered Bank", code: "068", type: "commercial" },
  { name: "Sterling Bank", code: "232", type: "commercial", ussdCode: "*822#" },
  { name: "SunTrust Bank", code: "100", type: "commercial" },
  { name: "Titan Trust Bank", code: "102", type: "commercial" },
  { name: "Union Bank of Nigeria", code: "032", type: "commercial", ussdCode: "*826#" },
  { name: "United Bank for Africa (UBA)", code: "033", type: "commercial", ussdCode: "*919#" },
  { name: "Unity Bank", code: "215", type: "commercial", ussdCode: "*7799#" },
  { name: "Wema Bank", code: "035", type: "commercial", ussdCode: "*945#" },
  { name: "Zenith Bank", code: "057", type: "commercial", ussdCode: "*966#" },
  { name: "Jaiz Bank", code: "301", type: "commercial", ussdCode: "*389*301#" },
  { name: "Lotus Bank", code: "303", type: "commercial" },
  { name: "Parallex Bank", code: "526", type: "commercial" },
  { name: "Premium Trust Bank", code: "105", type: "commercial" },
  { name: "Signature Bank", code: "106", type: "commercial" },
  { name: "Globus Bank", code: "00103", type: "commercial", ussdCode: "*989#" },
  
  // Microfinance Banks
  { name: "AB Microfinance Bank", code: "51204", type: "microfinance" },
  { name: "Accion Microfinance Bank", code: "602", type: "microfinance" },
  { name: "Addosser Microfinance Bank", code: "50036", type: "microfinance" },
  { name: "Advans La Fayette Microfinance Bank", code: "50001", type: "microfinance" },
  { name: "Alert Microfinance Bank", code: "50926", type: "microfinance" },
  { name: "Amju Unique Microfinance Bank", code: "50926", type: "microfinance" },
  { name: "Bowen Microfinance Bank", code: "50931", type: "microfinance" },
  { name: "Carbon Microfinance Bank", code: "565", type: "microfinance" },
  { name: "CEMCS Microfinance Bank", code: "50823", type: "microfinance" },
  { name: "Covenant Microfinance Bank", code: "50126", type: "microfinance" },
  { name: "Empire Trust Microfinance Bank", code: "50658", type: "microfinance" },
  { name: "Fina Trust Microfinance Bank", code: "608", type: "microfinance" },
  { name: "Fudge Microfinance Bank", code: "50304", type: "microfinance" },
  { name: "Fullrange Microfinance Bank", code: "50415", type: "microfinance" },
  { name: "Hackman Microfinance Bank", code: "51251", type: "microfinance" },
  { name: "Hasal Microfinance Bank", code: "50383", type: "microfinance" },
  { name: "Ibile Microfinance Bank", code: "51244", type: "microfinance" },
  { name: "Infinity Microfinance Bank", code: "50457", type: "microfinance" },
  { name: "LapoMicrofinance Bank", code: "50549", type: "microfinance" },
  { name: "Mainstreet Microfinance Bank", code: "50710", type: "microfinance" },
  { name: "Mutual Trust Microfinance Bank", code: "50840", type: "microfinance" },
  { name: "NPF Microfinance Bank", code: "552", type: "microfinance" },
  { name: "Parkway Microfinance Bank", code: "50743", type: "microfinance" },
  { name: "Petra Microfinance Bank", code: "50746", type: "microfinance" },
  { name: "Rephidim Microfinance Bank", code: "50823", type: "microfinance" },
  { name: "Rockshield Microfinance Bank", code: "50767", type: "microfinance" },
  { name: "Sparkle Microfinance Bank", code: "51310", type: "microfinance" },
  { name: "Stellas Microfinance Bank", code: "51253", type: "microfinance" },
  { name: "Trustfund Microfinance Bank", code: "51297", type: "microfinance" },
  { name: "Visa Microfinance Bank", code: "51315", type: "microfinance" },
  { name: "VFD Microfinance Bank", code: "566", type: "microfinance" },
  
  // Digital/Fintech Banks
  { name: "9mobile 9Payment Service Bank", code: "120001", type: "fintech" },
  { name: "Airtel Smartcash PSB", code: "120004", type: "fintech" },
  { name: "Boom Pay", code: "50299", type: "fintech" },
  { name: "Coronation Merchant Bank", code: "559", type: "fintech" },
  { name: "Eyowo", code: "50126", type: "fintech" },
  { name: "FSDH Merchant Bank", code: "501", type: "fintech" },
  { name: "GoMoney", code: "100022", type: "fintech" },
  { name: "Kuda Microfinance Bank", code: "50211", type: "fintech", ussdCode: "*5573#" },
  { name: "Monie Point Microfinance Bank", code: "50515", type: "fintech" },
  { name: "MTN Momo PSB", code: "120003", type: "fintech" },
  { name: "Paga", code: "100002", type: "fintech" },
  { name: "PalmPay", code: "999991", type: "fintech" },
  { name: "Paycom (Opay)", code: "999992", type: "fintech", ussdCode: "*955#" },
  { name: "Rand Merchant Bank", code: "502", type: "fintech" },
  { name: "Rubies Microfinance Bank", code: "125", type: "fintech" },
  { name: "Safe Haven Microfinance Bank", code: "51113", type: "fintech" },
  { name: "Sui Microfinance Bank", code: "51062", type: "fintech" },
  { name: "TagPay", code: "100023", type: "fintech" },
  { name: "TCF Microfinance Bank", code: "51211", type: "fintech" },
];

// Group banks by type for easier filtering
export const banksByType = {
  commercial: nigerianBanks.filter(bank => bank.type === 'commercial'),
  microfinance: nigerianBanks.filter(bank => bank.type === 'microfinance'),
  fintech: nigerianBanks.filter(bank => bank.type === 'fintech'),
};

// Get all bank names sorted alphabetically
export const getAllBankNames = (): string[] => {
  return nigerianBanks
    .map(bank => bank.name)
    .sort((a, b) => a.localeCompare(b));
};

// Get bank by name
export const getBankByName = (name: string): BankInfo | undefined => {
  return nigerianBanks.find(bank => bank.name === name);
};

// Get bank by code
export const getBankByCode = (code: string): BankInfo | undefined => {
  return nigerianBanks.find(bank => bank.code === code);
};

// Popular banks for quick access
export const popularBanks = [
  "Access Bank",
  "First Bank of Nigeria",
  "Guaranty Trust Bank (GTBank)",
  "United Bank for Africa (UBA)",
  "Zenith Bank",
  "Kuda Microfinance Bank",
  "Paycom (Opay)",
  "PalmPay",
  "Monie Point Microfinance Bank",
];

// Get USSD code for bank
export const getUSSDCode = (bankName: string): string | undefined => {
  const bank = getBankByName(bankName);
  return bank?.ussdCode;
};
