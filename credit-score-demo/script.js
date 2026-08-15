const form = document.getElementById('credit-form');
const scoreValue = document.getElementById('scoreValue');
const scoreBand = document.getElementById('scoreBand');
const decision = document.getElementById('decision');
const loanAmount = document.getElementById('loanAmount');
const interestRate = document.getElementById('interestRate');
const riskLevel = document.getElementById('riskLevel');
const summary = document.getElementById('summary');

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getEmploymentWeight(type) {
  const weights = {
    fulltime: 24,
    selfemployed: 16,
    contract: 12,
    unemployed: 0,
  };

  return weights[type] ?? 0;
}

function calculateCredit(data) {
  let score = 0;

  score += clamp(data.income / 2000, 0, 28);
  score += clamp((data.age - 18) * 1.1, 0, 18);
  score += getEmploymentWeight(data.employment);
  score += clamp(data.creditHistory * 7, 0, 22);
  score += clamp(data.savingsRatio * 0.45, 0, 18);
  score -= clamp(data.debtRatio * 0.75, 0, 35);
  score -= clamp(data.existingLoans * 9, 0, 20);

  if (data.defaultHistory === 'yes') {
    score -= 22;
  }

  if (data.income < 25000) {
    score -= 10;
  }

  score = clamp(Math.round(score), 0, 100);

  let band = 'Very Low';
  let result = 'Rejected';
  let eligible = 0;
  let rateText = 'N/A';
  let risk = 'High';

  if (score >= 80) {
    band = 'Excellent';
    result = 'Approved';
    eligible = Math.round(data.income * 5.5);
    rateText = '8.25%';
    risk = 'Low';
  } else if (score >= 70) {
    band = 'Good';
    result = 'Approved';
    eligible = Math.round(data.income * 4.2);
    rateText = '9.50%';
    risk = 'Moderate';
  } else if (score >= 60) {
    band = 'Fair';
    result = 'Conditional';
    eligible = Math.round(data.income * 2.8);
    rateText = '11.00%';
    risk = 'Medium';
  } else if (score >= 45) {
    band = 'Weak';
    result = 'Review Required';
    eligible = Math.round(data.income * 1.4);
    rateText = '13.25%';
    risk = 'Elevated';
  }

  return {
    score,
    band,
    result,
    eligible,
    rateText,
    risk,
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function renderResult(data) {
  const result = calculateCredit(data);

  scoreValue.textContent = result.score;
  scoreBand.textContent = result.band;
  decision.textContent = result.result;
  loanAmount.textContent = formatCurrency(result.eligible);
  interestRate.textContent = result.rateText;
  riskLevel.textContent = result.risk;

  scoreBand.style.color =
    result.score >= 80
      ? '#1f9d61'
      : result.score >= 60
        ? '#d98c22'
        : '#d94a4a';

  summary.innerHTML = `
    <strong>Assessment summary:</strong><br />
    Income: ${formatCurrency(data.income)} / month<br />
    Debt burden: ${data.debtRatio}%<br />
    Savings ratio: ${data.savingsRatio}%<br />
    Credit history: ${data.creditHistory} years<br />
    Existing loans: ${data.existingLoans}<br />
    Default history: ${data.defaultHistory === 'yes' ? 'Yes' : 'No'}<br /><br />
    <strong>Recommendation:</strong> ${result.result} for a maximum loan amount of ${formatCurrency(result.eligible)} at ${result.rateText}.
  `;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const applicant = {
    income: Number(document.getElementById('income').value || 0),
    age: Number(document.getElementById('age').value || 0),
    employment: document.getElementById('employment').value,
    debtRatio: Number(document.getElementById('debtRatio').value || 0),
    creditHistory: Number(document.getElementById('creditHistory').value || 0),
    savingsRatio: Number(document.getElementById('savingsRatio').value || 0),
    existingLoans: Number(document.getElementById('existingLoans').value || 0),
    defaultHistory: document.getElementById('defaultHistory').value,
  };

  renderResult(applicant);
});

renderResult({
  income: 75000,
  age: 32,
  employment: 'fulltime',
  debtRatio: 22,
  creditHistory: 5,
  savingsRatio: 28,
  existingLoans: 1,
  defaultHistory: 'no',
});
