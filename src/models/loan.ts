export interface LoanData {
  loanType: string, //jumbo, business
  loanAmount: string,
  repaymentPeriod: string, //12 weeks
  loanPurpose: string,
  gurantorInformation: {
    gNIN: string,
    gFullName: string,
    gPhone: string,
    gAddress: string,
    gRelationship: string,
    gEmployer: string, //can be empty
  },
  upfrontPaymentStatus: string, //pending if payment api failed
};
