/**
 * NPA Classification Service
 *
 * Backend integration will be added here.
 */

export const classifyNpa = async (loanData) => {

  /*
   * TODO:
   * Replace this mock logic with the actual backend API
   * once the NPA backend endpoint is available.
   */

  const overdueDays = Number(loanData.overdueDays);

  let classification;
  let status;
  let riskLevel;
  let message;

  if (overdueDays <= 0) {

    classification = "Standard Asset";
    status = "STANDARD";
    riskLevel = "Low";

    message =
      "The account is currently performing normally and does not fall under NPA classification.";

  } else if (overdueDays <= 90) {

    classification = "Standard Asset";
    status = "STANDARD";
    riskLevel = "Low";

    message =
      "The payment is overdue, but the account has not crossed the NPA threshold.";

  } else if (overdueDays <= 180) {

    classification = "Substandard Asset";
    status = "SUBSTANDARD";
    riskLevel = "Medium";

    message =
      "The account has remained overdue beyond the NPA threshold and requires monitoring.";

  } else if (overdueDays <= 365) {

    classification = "Doubtful Asset";
    status = "DOUBTFUL";
    riskLevel = "High";

    message =
      "The account indicates a significant repayment risk and requires closer review.";

  } else {

    classification = "Loss Asset";
    status = "LOSS";
    riskLevel = "Critical";

    message =
      "The account is considered highly impaired and requires immediate recovery action.";

  }

  return {
    classification,
    status,
    riskLevel,
    overdueDays,
    outstandingAmount: `₹${Number(
      loanData.outstandingAmount || 0
    ).toLocaleString("en-IN")}`,
    message,
  };
};