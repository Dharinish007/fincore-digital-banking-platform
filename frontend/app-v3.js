// ===============================
// FinCore Nexus
// script.js  (v2 - validation-locked + native required backup)
// ===============================
console.log("FinCore Nexus app-v3.js loaded - if you dont see this exact line in your console, you are NOT running this file");

const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const milestoneText = document.getElementById("milestoneText");

const milestones = {
  dashboard: "Account & Customer Services",
  accounts: "Account & Customer Services \u2014 Create Account",
  newAccount: "Account & Customer Services \u2014 New Account",
  newTicket: "Account & Customer Services \u2014 Service Request",
  loans: "Lending Services \u2014 Loans",
  payments: "Payment Services \u2014 Transactions",
  kyc: "Account & Customer Services \u2014 KYC",
  audit: "Platform Operations \u2014 Audit Log",
  settings: "Platform Operations \u2014 Settings",
};

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    if (item.classList.contains("disabled")) return;

    navItems.forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
    switchToView(item.dataset.view);
  });
});

// Switch the visible page. Works for sidebar destinations (dashboard, accounts, ...)
// as well as the standalone "New Account" / "New Service Request" pages, which
// aren't in the sidebar but reuse the same .view show/hide mechanism.
function switchToView(target, options) {
  views.forEach((v) => v.classList.remove("active"));
  const targetEl = document.getElementById("view-" + target);
  if (targetEl) targetEl.classList.add("active");

  if (milestoneText && milestones[target]) {
    milestoneText.textContent = milestones[target];
  }

  if (!options || options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: "auto" });
    const main = document.querySelector("main.content");
    if (main) main.scrollTop = 0;
  }
}

// -------------------------------
// Account type cards
// -------------------------------
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  const select = () => {
    cards.forEach((c) => { c.classList.remove("active"); c.setAttribute("aria-checked", "false"); });
    card.classList.add("active");
    card.setAttribute("aria-checked", "true");
    document.getElementById("accountType").value = card.dataset.value;
    setFieldError("accountType", "");
  };
  card.addEventListener("click", select);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); }
  });
});

// -------------------------------
// Accounts overview: existing accounts table
// -------------------------------
let accountsData = [
  { number: "3312-7765-4420", name: "Ananya Rao", type: "Savings", balance: "$15,420.30", status: "active" },
  { number: "6647-2201-9983", name: "Wei Zhang", type: "Current", balance: "$72,105.60", status: "active" },
  { number: "8823-5510-3347", name: "Carlos Mendoza", type: "Savings", balance: "$2,340.15", status: "frozen" },
  { number: "1190-4482-7765", name: "Layla Hassan", type: "Current", balance: "$48,930.75", status: "active" },
  { number: "5502-9931-1128", name: "Kwame Boateng", type: "Savings", balance: "$980.40", status: "dormant" },
  { number: "7761-3345-2209", name: "Sofia Rossi", type: "Savings", balance: "$33,215.90", status: "active" },
];

function statusLabel(status) {
  if (status === "active") return "Active";
  if (status === "frozen") return "Frozen";
  return "Dormant";
}

function renderAccountsTable(filterText) {
  const tbody = document.getElementById("acctTableBody");
  const noResults = document.getElementById("acctNoResults");
  if (!tbody) return;

  const query = (filterText || "").trim().toLowerCase();
  const filtered = accountsData.filter((a) =>
    a.name.toLowerCase().includes(query) || a.number.toLowerCase().includes(query)
  );

  tbody.innerHTML = filtered.map((a) => `
    <tr>
      <td class="mono">${a.number}</td>
      <td>${a.name}</td>
      <td>${a.type}</td>
      <td>${a.balance}</td>
      <td><span class="statusPill ${a.status}">${statusLabel(a.status)}</span></td>
      <td>
        <button type="button" class="linkAction">View</button>
        <button type="button" class="linkAction">${a.status === "frozen" ? "Unfreeze" : "Freeze"}</button>
      </td>
    </tr>
  `).join("");

  noResults.hidden = filtered.length > 0;
  tbody.parentElement.style.display = filtered.length > 0 ? "" : "none";

  updateAccountStats();
}

function updateAccountStats() {
  const total = accountsData.length;
  const savings = accountsData.filter((a) => a.type === "Savings").length;
  const current = accountsData.filter((a) => a.type === "Current").length;
  const frozen = accountsData.filter((a) => a.status === "frozen" || a.status === "dormant").length;

  const totalEl = document.getElementById("acctStatTotal");
  const savingsEl = document.getElementById("acctStatSavings");
  const currentEl = document.getElementById("acctStatCurrent");
  const frozenEl = document.getElementById("acctStatFrozen");
  if (totalEl) totalEl.textContent = total;
  if (savingsEl) savingsEl.textContent = savings;
  if (currentEl) currentEl.textContent = current;
  if (frozenEl) frozenEl.textContent = frozen;
}

const acctSearchInput = document.getElementById("acctSearch");
if (acctSearchInput) {
  acctSearchInput.addEventListener("input", () => renderAccountsTable(acctSearchInput.value));
}

renderAccountsTable("");

// -------------------------------
// New Account button: reveal the creation form on demand
// -------------------------------
const newAccountBtn = document.getElementById("newAccountBtn");
const cancelNewAccountBtn = document.getElementById("cancelNewAccountBtn");

function resetAccountForm() {
  const formEl = document.getElementById("accountForm");
  formEl.reset();
  Array.from(formEl.elements).forEach((el) => (el.disabled = false));
  cards.forEach((c) => { c.classList.remove("active"); c.setAttribute("aria-checked", "false"); });
  document.getElementById("accountType").value = "";
  document.querySelectorAll("#accountForm .field-error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("#accountForm .invalid").forEach((el) => el.classList.remove("invalid"));
  document.getElementById("successBanner").hidden = true;
  document.getElementById("submitBtn").hidden = false;
  const anotherBtn = document.getElementById("createAnotherBtn");
  if (anotherBtn) anotherBtn.hidden = true;
  const backBtn = document.getElementById("backToAccountsBtn");
  if (backBtn) backBtn.hidden = true;
}

if (newAccountBtn) {
  newAccountBtn.addEventListener("click", () => {
    resetAccountForm();
    switchToView("newAccount");
  });
}

if (cancelNewAccountBtn) {
  cancelNewAccountBtn.addEventListener("click", () => {
    resetAccountForm();
    switchToView("accounts");
  });
}

// Delegate clicks on table action buttons (View / Freeze / Unfreeze) as a demo toggle
document.addEventListener("click", (e) => {
  if (!e.target.matches("#acctTableBody .linkAction")) return;
  const row = e.target.closest("tr");
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const visibleRows = accountsData.filter((a) =>
    (a.name + a.number).toLowerCase().includes((acctSearchInput ? acctSearchInput.value : "").toLowerCase())
  );
  const account = visibleRows[rowIndex];
  if (!account) return;

  if (e.target.textContent === "Freeze") {
    account.status = "frozen";
    renderAccountsTable(acctSearchInput ? acctSearchInput.value : "");
  } else if (e.target.textContent === "Unfreeze") {
    account.status = "active";
    renderAccountsTable(acctSearchInput ? acctSearchInput.value : "");
  }
});

// -------------------------------
function setFieldError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + "Error");
  const inputEl = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = message || "";
  if (inputEl) inputEl.classList.toggle("invalid", Boolean(message));
}

// -------------------------------
// Validators
// -------------------------------
const NAME_RE = /^[A-Za-z][A-Za-z\s.'-]{2,49}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const AADHAAR_RE = /^\d{12}$/;
const PAN_RE = /^[A-Z]{5}\d{4}[A-Z]$/;

function getAadhaarDigits() {
  return document.getElementById("aadhaar").value.replace(/\D/g, "");
}

const validators = {
  fullname: () => {
    const v = document.getElementById("fullname").value.trim();
    if (v === "") return "Full name is required.";
    if (!NAME_RE.test(v)) return "Enter a valid full name.";
    return "";
  },
  email: () => {
    const v = document.getElementById("email").value.trim();
    if (v === "") return "Email is required.";
    if (!EMAIL_RE.test(v)) return "Enter a valid email address.";
    return "";
  },
  mobile: () => {
    const v = document.getElementById("mobile").value.trim();
    if (v === "") return "Mobile number is required.";
    if (!MOBILE_RE.test(v)) return "Enter a valid 10-digit mobile number.";
    if (/^(\d)\1{9}$/.test(v)) return "Enter a real mobile number.";
    return "";
  },
  dob: () => {
    const v = document.getElementById("dob").value;
    if (v === "") return "Date of birth is required.";
    const dobDate = new Date(v + "T00:00:00");
    if (isNaN(dobDate.getTime())) return "Enter a valid date of birth.";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dobDate > today) return "Date of birth cannot be in the future.";
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) age--;
    if (age < 18) return "Customer must be at least 18 years old to open an account.";
    if (age > 120) return "Enter a valid date of birth.";
    return "";
  },
  pan: () => {
    const v = document.getElementById("pan").value.trim().toUpperCase();
    if (v === "") return "PAN number is required.";
    if (!PAN_RE.test(v)) return "PAN format should be like ABCDE1234F.";
    return "";
  },
  aadhaar: () => {
    const v = getAadhaarDigits();
    if (v === "") return "Aadhaar number is required.";
    if (!AADHAAR_RE.test(v)) return "Aadhaar must be exactly 12 digits.";
    if (/^(\d)\1{11}$/.test(v)) return "Enter a real Aadhaar number.";
    return "";
  },
  address: () => {
    const v = document.getElementById("address").value.trim();
    if (v === "") return "Address is required.";
    return "";
  },
  accountType: () => {
    const v = document.getElementById("accountType").value;
    if (v === "") return "Please select an account type.";
    return "";
  },
  occupation: () => {
    const v = document.getElementById("occupation").value.trim();
    if (v === "") return "Occupation is required.";
    return "";
  },
  income: () => {
    const v = document.getElementById("income").value.trim();
    if (v === "") return "Annual income is required.";
    if (!/^\d+$/.test(v)) return "Enter a valid numeric income.";
    if (Number(v) <= 0) return "Annual income must be greater than zero.";
    if (Number(v) > 100000000) return "Enter a realistic annual income.";
    return "";
  },
  nomineeName: () => {
    const v = document.getElementById("nomineeName").value.trim();
    if (v === "") return "Nominee name is required.";
    if (!NAME_RE.test(v)) return "Enter a valid nominee name.";
    const fullname = document.getElementById("fullname").value.trim();
    if (fullname && v.toLowerCase() === fullname.toLowerCase()) return "Nominee cannot be the same as the account holder.";
    return "";
  },
  nomineeRelation: () => {
    const v = document.getElementById("nomineeRelation").value.trim();
    if (v === "") return "Relationship with nominee is required.";
    return "";
  },
  branch: () => {
    const v = document.getElementById("branch").value.trim();
    if (v === "") return "Home branch is required.";
    return "";
  },
  password: () => {
    const v = document.getElementById("password").value;
    if (v === "") return "Password is required.";
    if (v.length < 8) return "Password must be at least 8 characters.";
    return "";
  },
  confirm: () => {
    const v = document.getElementById("confirm").value;
    const pass = document.getElementById("password").value;
    if (v === "") return "Please confirm your password.";
    if (v !== pass) return "Passwords do not match.";
    return "";
  },
  terms: () => {
    if (!document.getElementById("terms").checked) return "You must accept the terms.";
    return "";
  },
};

// Live validation
Object.keys(validators).forEach((fieldId) => {
  const el = document.getElementById(fieldId);
  if (!el) return;
  const eventType = el.type === "checkbox" ? "change" : "input";
  el.addEventListener(eventType, () => {
    if (el.type === "checkbox" || el.value.trim() !== "") {
      setFieldError(fieldId, validators[fieldId]());
    } else {
      setFieldError(fieldId, "");
    }
  });
});

// Numeric-only / formatting
document.getElementById("mobile").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
});
document.getElementById("pan").addEventListener("input", (e) => {
  e.target.value = e.target.value.toUpperCase().slice(0, 10);
});
document.getElementById("aadhaar").addEventListener("input", (e) => {
  const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
  e.target.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
});

// -------------------------------
// Fill sample data (so anyone can demo instantly)
// -------------------------------
document.getElementById("fillSampleBtn").addEventListener("click", () => {
  document.getElementById("fullname").value = "Aditi Verma";
  document.getElementById("email").value = "aditi.verma@example.com";
  document.getElementById("mobile").value = "9876543210";
  document.getElementById("dob").value = "1996-04-12";
  document.getElementById("pan").value = "ABCDE1234F";
  document.getElementById("aadhaar").value = "1234 5678 9012";
  document.getElementById("address").value = "204, Lotus Apartments, MG Road, Pune, Maharashtra, 411001";
  document.getElementById("occupation").value = "Salaried";
  document.getElementById("income").value = "850000";
  document.getElementById("nomineeName").value = "Rohan Verma";
  document.getElementById("nomineeRelation").value = "Spouse";
  document.getElementById("branch").value = "MG Road, Pune";
  document.getElementById("password").value = "Sample@123";
  document.getElementById("confirm").value = "Sample@123";
  document.getElementById("terms").checked = true;

  cards.forEach((c) => { c.classList.remove("active"); c.setAttribute("aria-checked", "false"); });
  cards[0].classList.add("active");
  cards[0].setAttribute("aria-checked", "true");
  document.getElementById("accountType").value = "Savings";

  document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
});

document.getElementById("clearFormBtn").addEventListener("click", resetAccountForm);

// -------------------------------
// Submit: validate, generate a fake account record, log it to the dashboard
// -------------------------------
let accountsCreatedCount = 0;

function generateAccountNumber() {
  const rand = () => Math.floor(1000 + Math.random() * 9000);
  return `${rand()}-${rand()}-${rand()}`;
}

document.getElementById("accountForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;
  Object.keys(validators).forEach((fieldId) => {
    const message = validators[fieldId]();
    setFieldError(fieldId, message);
    if (message) valid = false;
  });
  if (!valid) return;

  // Cross-field check: reject if this PAN / Aadhaar / email / mobile is already
  // on file for another customer (duplicate KYC record).
  const panVal = document.getElementById("pan").value.trim().toUpperCase();
  const aadhaarVal = getAadhaarDigits();
  const emailVal = document.getElementById("email").value.trim().toLowerCase();
  const mobileVal = document.getElementById("mobile").value.trim();

  const duplicate = findDuplicateAccountHolder({ pan: panVal, aadhaar: aadhaarVal, email: emailVal, mobile: mobileVal });
  if (duplicate) {
    if (duplicate.pan === panVal) setFieldError("pan", `This PAN is already registered to ${duplicate.name}.`);
    if (duplicate.aadhaar === aadhaarVal) setFieldError("aadhaar", `This Aadhaar is already registered to ${duplicate.name}.`);
    if (duplicate.email === emailVal) setFieldError("email", `This email is already registered to ${duplicate.name}.`);
    if (duplicate.mobile === mobileVal) setFieldError("mobile", `This mobile number is already registered to ${duplicate.name}.`);
    return;
  }

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  const formEl = this;

  // DEMO: replace this with a real fetch() to the backend account-creation API.
  setTimeout(() => {
    submitBtn.classList.remove("loading");

    const name = document.getElementById("fullname").value.trim();
    const accountType = document.getElementById("accountType").value;
    const accountNumber = generateAccountNumber();

    // Record this customer's identifiers so a second attempt with the same
    // PAN / Aadhaar / email / mobile is caught as a duplicate.
    registeredCustomers.push({ name, pan: panVal, aadhaar: aadhaarVal, email: emailVal, mobile: mobileVal });

    // Show a persistent success state WITHOUT clearing the form yet, so the
    // submitted details stay visible and it's clear what was actually created.
    const banner = document.getElementById("successBanner");
    document.getElementById("successMsg").textContent =
      `Account created for ${name} \u2014 A/C ${accountNumber} (${accountType})`;
    banner.hidden = false;

    // Lock the form so it visibly reads as "submitted", not editable/empty
    Array.from(formEl.elements).forEach((el) => (el.disabled = true));
    submitBtn.hidden = true;

    // Show a "create another" button in place of the submit button
    let newBtn = document.getElementById("createAnotherBtn");
    if (!newBtn) {
      newBtn = document.createElement("button");
      newBtn.type = "button";
      newBtn.id = "createAnotherBtn";
      newBtn.className = "btn primary submitBtn";
      newBtn.innerHTML = '<span class="btn-text"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Create another account</span>';
      banner.insertAdjacentElement("afterend", newBtn);
      newBtn.addEventListener("click", resetAccountForm);
    }
    newBtn.hidden = false;

    let backToAccountsBtn = document.getElementById("backToAccountsBtn");
    if (!backToAccountsBtn) {
      backToAccountsBtn = document.createElement("button");
      backToAccountsBtn.type = "button";
      backToAccountsBtn.id = "backToAccountsBtn";
      backToAccountsBtn.className = "btn ghost submitBtn";
      backToAccountsBtn.style.marginTop = "10px";
      backToAccountsBtn.innerHTML = '<span class="btn-text"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to accounts list</span>';
      newBtn.insertAdjacentElement("afterend", backToAccountsBtn);
      backToAccountsBtn.addEventListener("click", () => {
        resetAccountForm();
        switchToView("accounts");
      });
    }
    backToAccountsBtn.hidden = false;

    // Add to the Accounts table (Existing Accounts) so the new account is visible there too
    accountsData.unshift({
      number: accountNumber,
      name: name,
      type: accountType,
      balance: "$0.00",
      status: "active",
    });
    renderAccountsTable(acctSearchInput ? acctSearchInput.value : "");

    // Add to the dashboard's "Recently Created Accounts" panel
    const recentPanel = document.getElementById("recentAccountsPanel");
    const recentList = document.getElementById("recentAccountsList");
    recentPanel.hidden = false;

    const line = document.createElement("p");
    line.textContent = `Account: ${accountNumber} | Customer: ${name} | Type: ${accountType} | KYC: Verified | Status: Active`;
    recentList.prepend(line);

    // Bump the dashboard stat so it visibly reflects the new account
    accountsCreatedCount++;
    const statEl = document.getElementById("statActiveAccounts");
    statEl.textContent = "2.4M+" + accountsCreatedCount;
  }, 900);
});

// Demo-only action buttons on the dashboard log panel
document.querySelectorAll(".linkAction").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.textContent = "\u2713 " + btn.textContent;
    setTimeout(() => {
      btn.textContent = btn.textContent.replace("\u2713 ", "");
    }, 1200);
  });
});

// -------------------------------
// Customer Service: customer profile lookup + service request tickets
// -------------------------------
let customersData = [
  { name: "Ananya Rao", accounts: ["3312-7765-4420"], email: "ananya.rao@example.com", mobile: "9876512001", kyc: "Verified", risk: "Low", pan: "AAAPR1234A", aadhaar: "233344556677" },
  { name: "Wei Zhang", accounts: ["6647-2201-9983"], email: "wei.zhang@example.com", mobile: "9876512002", kyc: "Verified", risk: "Low", pan: "BBBPZ5678B", aadhaar: "344455667788" },
  { name: "Carlos Mendoza", accounts: ["8823-5510-3347"], email: "carlos.mendoza@example.com", mobile: "9876512003", kyc: "Pending Review", risk: "Medium", pan: "CCCPM4321C", aadhaar: "455566778899" },
  { name: "Layla Hassan", accounts: ["1190-4482-7765"], email: "layla.hassan@example.com", mobile: "9876512004", kyc: "Verified", risk: "Low", pan: "DDDPH8765D", aadhaar: "566677889900" },
  { name: "Kwame Boateng", accounts: ["5502-9931-1128"], email: "kwame.boateng@example.com", mobile: "9876512005", kyc: "Verified", risk: "Medium", pan: "EEEPB2468E", aadhaar: "677788990011" },
  { name: "Sofia Rossi", accounts: ["7761-3345-2209"], email: "sofia.rossi@example.com", mobile: "9876512006", kyc: "Verified", risk: "Low", pan: "FFFPR1357F", aadhaar: "788899001122" },
];

// Registry of identifiers already on file, used to catch duplicate submissions
// (same PAN / Aadhaar / email / mobile applying for a second account).
let registeredCustomers = customersData.map((c) => ({
  name: c.name,
  pan: c.pan,
  aadhaar: c.aadhaar,
  email: c.email.toLowerCase(),
  mobile: c.mobile,
}));

function findDuplicateAccountHolder({ pan, aadhaar, email, mobile }) {
  const panNorm = (pan || "").trim().toUpperCase();
  const aadhaarNorm = (aadhaar || "").replace(/\D/g, "");
  const emailNorm = (email || "").trim().toLowerCase();
  const mobileNorm = (mobile || "").trim();

  return registeredCustomers.find((c) =>
    (panNorm && c.pan === panNorm) ||
    (aadhaarNorm && c.aadhaar === aadhaarNorm) ||
    (emailNorm && c.email === emailNorm) ||
    (mobileNorm && c.mobile === mobileNorm)
  );
}

let serviceTickets = [
  { id: "SR-10231", customer: "Ananya Rao", type: "Cheque Book Request", status: "open", date: "2026-08-02" },
  { id: "SR-10198", customer: "Wei Zhang", type: "Address Update", status: "resolved", date: "2026-07-29" },
];

function findCustomer(query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return null;
  return customersData.find((c) =>
    c.name.toLowerCase().includes(q) || c.accounts.some((acc) => acc.toLowerCase().includes(q))
  );
}

function renderCustomerProfile(query) {
  const card = document.getElementById("customerProfileCard");
  const noResults = document.getElementById("custNoResults");
  const q = (query || "").trim();

  if (!card || !noResults) return;

  if (!q) {
    card.hidden = true;
    noResults.hidden = true;
    return;
  }

  const customer = findCustomer(q);
  if (!customer) {
    card.hidden = true;
    noResults.hidden = false;
    return;
  }

  document.getElementById("profileName").textContent = customer.name;
  document.getElementById("profileKyc").textContent = customer.kyc;
  document.getElementById("profileEmail").textContent = customer.email;
  document.getElementById("profileMobile").textContent = customer.mobile;
  document.getElementById("profileAccounts").textContent = customer.accounts.join(", ");
  document.getElementById("profileRisk").textContent = customer.risk;

  card.hidden = false;
  noResults.hidden = true;
}

const custSearchInput = document.getElementById("custSearch");
if (custSearchInput) {
  custSearchInput.addEventListener("input", () => renderCustomerProfile(custSearchInput.value));
}

// -------------------------------
// Service request ticket table
// -------------------------------
function ticketStatusLabel(status) {
  return status === "resolved" ? "Resolved" : "Open";
}

function renderTicketsTable() {
  const tbody = document.getElementById("ticketsTableBody");
  const noResults = document.getElementById("ticketsNoResults");
  if (!tbody) return;

  tbody.innerHTML = serviceTickets.map((t) => `
    <tr>
      <td class="mono">${t.id}</td>
      <td>${t.customer}</td>
      <td>${t.type}</td>
      <td><span class="statusPill ${t.status}">${ticketStatusLabel(t.status)}</span></td>
      <td>${t.date}</td>
      <td>
        <button type="button" class="linkAction">${t.status === "resolved" ? "Reopen" : "Resolve"}</button>
      </td>
    </tr>
  `).join("");

  noResults.hidden = serviceTickets.length > 0;
  tbody.parentElement.style.display = serviceTickets.length > 0 ? "" : "none";
}

renderTicketsTable();

// Delegate clicks on ticket table action buttons (Resolve / Reopen)
document.addEventListener("click", (e) => {
  if (!e.target.matches("#ticketsTableBody .linkAction")) return;
  const row = e.target.closest("tr");
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const ticket = serviceTickets[rowIndex];
  if (!ticket) return;

  ticket.status = ticket.status === "resolved" ? "open" : "resolved";
  renderTicketsTable();
});

// -------------------------------
// New Service Request button: reveal the ticket form on demand
// -------------------------------
const newTicketBtn = document.getElementById("newTicketBtn");
const cancelNewTicketBtn = document.getElementById("cancelNewTicketBtn");

function resetTicketForm() {
  const formEl = document.getElementById("ticketForm");
  Array.from(formEl.elements).forEach((el) => (el.disabled = false));
  formEl.reset();
  document.querySelectorAll("#ticketForm .field-error").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("#ticketForm .invalid").forEach((el) => el.classList.remove("invalid"));
  document.getElementById("ticketSuccessBanner").hidden = true;
  document.getElementById("ticketSubmitBtn").hidden = false;
  const anotherBtn = document.getElementById("ticketAnotherBtn");
  if (anotherBtn) anotherBtn.hidden = true;
  const backBtn = document.getElementById("backToServiceBtn");
  if (backBtn) backBtn.hidden = true;
}

if (newTicketBtn) {
  newTicketBtn.addEventListener("click", () => {
    resetTicketForm();
    switchToView("newTicket");
  });
}

if (cancelNewTicketBtn) {
  cancelNewTicketBtn.addEventListener("click", () => {
    resetTicketForm();
    switchToView("accounts");
  });
}

// -------------------------------
// Ticket submit: validate, generate a ticket record, log it to the table
// -------------------------------
function ticketGenerateId() {
  return "SR-" + Math.floor(10000 + Math.random() * 89999);
}

document.getElementById("ticketForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;
  const customerVal = document.getElementById("ticketCustomer").value.trim();
  const typeVal = document.getElementById("ticketType").value;
  const descVal = document.getElementById("ticketDescription").value.trim();

  if (!customerVal) {
    setFieldError("ticketCustomer", "Enter a customer name or account number.");
    valid = false;
  } else if (customerVal.length < 3) {
    setFieldError("ticketCustomer", "Enter a full customer name or account number.");
    valid = false;
  } else {
    setFieldError("ticketCustomer", "");
  }

  if (!typeVal) {
    setFieldError("ticketType", "Select a request type.");
    valid = false;
  } else {
    setFieldError("ticketType", "");
  }

  if (!descVal) {
    setFieldError("ticketDescription", "Please describe the request.");
    valid = false;
  } else if (descVal.length < 10) {
    setFieldError("ticketDescription", "Description is too short \u2014 add a bit more detail.");
    valid = false;
  } else {
    setFieldError("ticketDescription", "");
  }

  // Duplicate check: don't let the same open request get logged twice for the same customer.
  if (valid) {
    const matchedCustomer = findCustomer(customerVal);
    const customerKey = (matchedCustomer ? matchedCustomer.name : customerVal).toLowerCase();
    const alreadyOpen = serviceTickets.some(
      (t) => t.status === "open" && t.customer.toLowerCase() === customerKey && t.type === typeVal
    );
    if (alreadyOpen) {
      setFieldError("ticketType", "This customer already has an open request of this type.");
      valid = false;
    }
  }

  if (!valid) return;

  const submitBtn = document.getElementById("ticketSubmitBtn");
  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  const formEl = this;

  // DEMO: replace this with a real fetch() to the backend service-request API.
  setTimeout(() => {
    submitBtn.classList.remove("loading");

    const matchedCustomer = findCustomer(customerVal);
    const displayName = matchedCustomer ? matchedCustomer.name : customerVal;
    const ticketId = ticketGenerateId();

    serviceTickets.unshift({
      id: ticketId,
      customer: displayName,
      type: typeVal,
      status: "open",
      date: new Date().toISOString().slice(0, 10),
    });
    renderTicketsTable();

    const banner = document.getElementById("ticketSuccessBanner");
    document.getElementById("ticketSuccessMsg").textContent =
      `Service request ${ticketId} logged for ${displayName} (${typeVal})`;
    banner.hidden = false;

    // Lock the form so it visibly reads as "submitted"
    Array.from(formEl.elements).forEach((el) => (el.disabled = true));
    submitBtn.hidden = true;

    let anotherBtn = document.getElementById("ticketAnotherBtn");
    if (!anotherBtn) {
      anotherBtn = document.createElement("button");
      anotherBtn.type = "button";
      anotherBtn.id = "ticketAnotherBtn";
      anotherBtn.className = "btn primary submitBtn";
      anotherBtn.innerHTML = '<span class="btn-text"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Log another request</span>';
      banner.insertAdjacentElement("afterend", anotherBtn);
      anotherBtn.addEventListener("click", resetTicketForm);
    }
    anotherBtn.hidden = false;

    let backBtn = document.getElementById("backToServiceBtn");
    if (!backBtn) {
      backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.id = "backToServiceBtn";
      backBtn.className = "btn ghost submitBtn";
      backBtn.style.marginTop = "10px";
      backBtn.innerHTML = '<span class="btn-text"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to service requests</span>';
      anotherBtn.insertAdjacentElement("afterend", backBtn);
      backBtn.addEventListener("click", () => {
        resetTicketForm();
        switchToView("accounts");
      });
    }
    backBtn.hidden = false;
  }, 700);
});

// -------------------------------
// Safety net: force both forms into a clean, un-submitted state as soon as the
// script runs, regardless of whatever the last page state happened to be
// (covers stale success banners from a cached page or an interrupted session).
// -------------------------------
resetAccountForm();
resetTicketForm();
