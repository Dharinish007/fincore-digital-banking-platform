import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  Building2,
  TrendingUp,
  Lock,
  ChevronRight,
  CheckCircle2,
  Users,
  Percent,
  Clock,
  Award,
  PhoneCall,
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  ChevronDown,
  Calculator,
  DollarSign,
  HelpCircle,
  FileText,
  BadgeCheck,
  Shield,
  Search,
  ExternalLink,
  ChevronUp,
} from 'lucide-react';
import { CreateCustomerModal } from '../components/modals/CreateCustomerModal';

export const HomeView = ({ onGoToLogin }) => {
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [heroWidgetTab, setHeroWidgetTab] = useState('emi'); // 'account', 'emi', 'fd', 'forex'

  // EMI Calculator State
  const [loanType, setLoanType] = useState('PERSONAL'); // 'PERSONAL', 'HOME', 'AUTO'
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenureYears, setTenureYears] = useState(3);

  // FD Calculator State
  const [fdAmount, setFdAmount] = useState(200000);
  const [fdTenureMonths, setFdTenureMonths] = useState(24);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);

  // Forex Calculator State
  const [forexAmount, setForexAmount] = useState(1000);
  const [forexCurrency, setForexCurrency] = useState('USD');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Quick Account Opening Inline Form
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickAccountType, setQuickAccountType] = useState('SAVINGS');
  const [quickFormSubmitted, setQuickFormSubmitted] = useState(false);

  // EMI Calculation Logic
  const calculateEmi = () => {
    const monthlyRate = rate / 12 / 100;
    const months = tenureYears * 12;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  const { emi, totalInterest, totalPayment } = calculateEmi();

  // FD Calculation Logic
  const calculateFd = () => {
    let annualRate = 7.25;
    if (fdTenureMonths >= 12 && fdTenureMonths < 24) annualRate = 7.5;
    if (fdTenureMonths >= 24 && fdTenureMonths < 36) annualRate = 7.75;
    if (fdTenureMonths >= 36) annualRate = 7.4;
    if (isSeniorCitizen) annualRate += 0.5;

    // Compound quarterly
    const n = 4;
    const t = fdTenureMonths / 12;
    const r = annualRate / 100;
    const maturityAmount = Math.round(fdAmount * Math.pow(1 + r / n, n * t));
    const interestEarned = maturityAmount - fdAmount;
    return { maturityAmount, interestEarned, annualRate };
  };

  const { maturityAmount, interestEarned, annualRate } = calculateFd();

  // Forex conversion rates against INR
  const forexRates = {
    USD: { buy: 83.42, sell: 83.95, symbol: '$' },
    EUR: { buy: 90.15, sell: 90.85, symbol: '€' },
    GBP: { buy: 105.80, sell: 106.65, symbol: '£' },
    AED: { buy: 22.71, sell: 22.95, symbol: 'AED' },
    SGD: { buy: 62.40, sell: 62.90, symbol: 'S$' },
    JPY: { buy: 0.55, sell: 0.58, symbol: '¥' },
  };

  const convertedInr = Math.round(forexAmount * (forexRates[forexCurrency]?.buy || 83.42));

  const handleLoanTypeSelect = (type) => {
    setLoanType(type);
    if (type === 'HOME') {
      setPrincipal(3500000);
      setRate(8.4);
      setTenureYears(20);
    } else if (type === 'PERSONAL') {
      setPrincipal(500000);
      setRate(10.5);
      setTenureYears(3);
    } else if (type === 'AUTO') {
      setPrincipal(800000);
      setRate(9.2);
      setTenureYears(5);
    }
  };

  const faqs = [
    {
      q: 'How quickly can I open a digital savings account with FinCore Bank?',
      a: 'You can open a full-featured FinCore Digital Savings Account in under 3 minutes using your Aadhaar and PAN. Complete instant Video-KYC from your phone or laptop with zero branch visits required.',
    },
    {
      q: 'Are my deposits at FinCore Bank insured and safe?',
      a: 'Yes. FinCore Bank is a Scheduled Commercial Bank regulated by the Reserve Bank of India (RBI). All customer deposits (savings, current, and fixed deposits) are insured up to ₹5,00,000 per depositor under DICGC.',
    },
    {
      q: 'What are the charges for interbank IMPS, NEFT, and RTGS transfers?',
      a: 'All online fund transfers via FinCore NetBanking and Mobile Banking — including 24x7 IMPS, NEFT, RTGS, and UPI — are completely free of charge with zero transaction fees.',
    },
    {
      q: 'How soon is a personal loan disbursed after approval?',
      a: 'Pre-approved personal loans are credited to your account within 10 minutes through our automated Saga Disbursement Engine. For standard applications, documentation is verified within 4 working hours.',
    },
    {
      q: 'What is the Senior Citizen benefit on Fixed Deposits?',
      a: 'Senior Citizens (age 60 and above) enjoy an additional 0.50% p.a. interest over standard fixed deposit rates across all tenures from 1 year to 10 years.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP UTILITY BAR */}
      <div style={{ backgroundColor: '#090d16', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', padding: '0.4rem 1.5rem', color: 'var(--text-muted)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Personal Banking</span>
            <span style={{ cursor: 'pointer' }}>NRI Services</span>
            <span style={{ cursor: 'pointer' }}>Commercial & Corporate</span>
            <span style={{ cursor: 'pointer' }}>Treasury & Forex</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span className="flex items-center gap-1">
              <PhoneCall size={12} style={{ color: 'var(--accent-primary)' }} />
              24x7 Helpline: <strong>1800-209-4400</strong>
            </span>
            <span style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
              RBI Regulated Scheduled Commercial Bank
            </span>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY NAVIGATION HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'rgba(16, 22, 34, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-color)',
        height: '72px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}>
                <Landmark size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>FinCore</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bank</span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1 }}>National Digital Core</div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
              <a href="#accounts" style={{ color: 'var(--text-primary)' }}>Accounts</a>
              <a href="#loans" style={{ color: 'var(--text-secondary)' }}>Loans & Mortgages</a>
              <a href="#calculators" style={{ color: 'var(--text-secondary)' }}>Calculators</a>
              <a href="#security" style={{ color: 'var(--text-secondary)' }}>Security</a>
              <a href="#faqs" style={{ color: 'var(--text-secondary)' }}>Help</a>
            </nav>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setShowOpenModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 600 }}
            >
              + Open Account
            </button>
            <button
              onClick={onGoToLogin}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 8px rgba(37,99,235,0.4)' }}
            >
              <Lock size={14} />
              <span>Internet Banking Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION WITH FINANCIAL WIDGET */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at top, #1e3a8a 0%, #0f172a 70%, #090d16 100%)',
        padding: '4rem 1.5rem 5rem',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Hero Pitch */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', backgroundColor: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '9999px', fontSize: '0.8125rem', color: '#93c5fd', marginBottom: '1.25rem' }}>
              <ShieldCheck size={14} />
              <span>India&apos;s High-Yield Digital Savings &bull; 7.25% p.a.</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '1.25rem' }}>
              Banking Built for Your Ambitions.
            </h1>

            <p style={{ fontSize: '1.125rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '540px' }}>
              Experience paperless digital banking with zero account fees, instant 24x7 transfers via UPI &amp; IMPS, and loans disbursed in 10 minutes.
            </p>

            {/* Quick Proof Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem', maxWidth: '520px' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>7.25%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Savings Interest</div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>₹0 Fee</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IMPS, NEFT &amp; UPI</div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24' }}>10 Mins</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loan Disbursal</div>
              </div>
            </div>

            {/* Hero CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowOpenModal(true)}
                className="btn btn-primary btn-lg"
                style={{ fontWeight: 700, padding: '0.85rem 1.75rem' }}
              >
                <span>Open Digital Account Now</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={onGoToLogin}
                className="btn btn-secondary btn-lg"
                style={{ fontWeight: 600, padding: '0.85rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Sign In to NetBanking
              </button>
            </div>
          </div>

          {/* Right Interactive Financial Center Widget */}
          <div className="card" style={{
            backgroundColor: '#131b2c',
            border: '1px solid rgba(59,130,246,0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            padding: '1.5rem'
          }}>
            {/* Widget Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <button
                onClick={() => setHeroWidgetTab('emi')}
                className={`btn btn-sm ${heroWidgetTab === 'emi' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.8125rem' }}
              >
                Loan EMI
              </button>
              <button
                onClick={() => setHeroWidgetTab('fd')}
                className={`btn btn-sm ${heroWidgetTab === 'fd' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.8125rem' }}
              >
                FD Returns
              </button>
              <button
                onClick={() => setHeroWidgetTab('forex')}
                className={`btn btn-sm ${heroWidgetTab === 'forex' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.8125rem' }}
              >
                Forex Rates
              </button>
              <button
                onClick={() => setHeroWidgetTab('account')}
                className={`btn btn-sm ${heroWidgetTab === 'account' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.8125rem' }}
              >
                Fast Open
              </button>
            </div>

            {/* TAB 1: LOAN EMI CALCULATOR */}
            {heroWidgetTab === 'emi' && (
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {['PERSONAL', 'HOME', 'AUTO'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleLoanTypeSelect(t)}
                      style={{
                        flex: 1,
                        padding: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: loanType === t ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: loanType === t ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {t === 'PERSONAL' ? 'Personal' : t === 'HOME' ? 'Home' : 'Auto'}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div className="flex justify-between" style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                    <span className="text-muted">Loan Amount:</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>₹{principal.toLocaleString('en-IN')}</strong>
                  </div>
                  <input
                    type="range"
                    min={loanType === 'HOME' ? 500000 : 50000}
                    max={loanType === 'HOME' ? 15000000 : 2500000}
                    step={25000}
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <div className="flex justify-between" style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                      <span className="text-muted">Interest:</span>
                      <strong>{rate}%</strong>
                    </div>
                    <input
                      type="range"
                      min={7.5}
                      max={18.0}
                      step={0.1}
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between" style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                      <span className="text-muted">Tenure:</span>
                      <strong>{tenureYears} Yrs</strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={loanType === 'HOME' ? 30 : 7}
                      step={1}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* EMI Result Card */}
                <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Monthly EMI</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38bdf8' }}>₹{emi.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)' }}>Total Interest: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{totalInterest.toLocaleString('en-IN')}</span></div>
                      <div style={{ color: 'var(--text-muted)' }}>Total Payable: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{totalPayment.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOpenModal(true)}
                  className="btn btn-primary w-full"
                  style={{ fontWeight: 600 }}
                >
                  Apply For {loanType === 'HOME' ? 'Home' : loanType === 'PERSONAL' ? 'Personal' : 'Car'} Loan Online
                </button>
              </div>
            )}

            {/* TAB 2: FIXED DEPOSIT RETURNS */}
            {heroWidgetTab === 'fd' && (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="flex justify-between" style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                    <span className="text-muted">Deposit Amount:</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>₹{fdAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={2000000}
                    step={10000}
                    value={fdAmount}
                    onChange={(e) => setFdAmount(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div className="flex justify-between" style={{ fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                    <span className="text-muted">Tenure:</span>
                    <strong>{fdTenureMonths} Months ({ (fdTenureMonths / 12).toFixed(1) } Yrs)</strong>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={60}
                    step={6}
                    value={fdTenureMonths}
                    onChange={(e) => setFdTenureMonths(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                  />
                </div>

                <label className="flex items-center gap-2 mb-3" style={{ fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isSeniorCitizen}
                    onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                  />
                  <span>Senior Citizen (+0.50% extra interest)</span>
                </label>

                <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Maturity Payout ({annualRate}% p.a.)</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399' }}>₹{maturityAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)' }}>Interest Earned:</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>+₹{interestEarned.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOpenModal(true)}
                  className="btn btn-primary w-full"
                  style={{ fontWeight: 600 }}
                >
                  Book High-Yield Fixed Deposit
                </button>
              </div>
            )}

            {/* TAB 3: FOREX & CURRENCY CONVERTER */}
            {heroWidgetTab === 'forex' && (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Select Foreign Currency</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
                    {Object.keys(forexRates).map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setForexCurrency(curr)}
                        style={{
                          padding: '0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: forexCurrency === curr ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: forexCurrency === curr ? '#fff' : 'var(--text-secondary)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        {curr} ({forexRates[curr].symbol})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label" style={{ fontSize: '0.8125rem' }}>Amount in {forexCurrency}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={forexAmount}
                    onChange={(e) => setForexAmount(Math.max(1, Number(e.target.value)))}
                  />
                </div>

                <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Value in INR</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>₹{convertedInr.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <div>Buy: ₹{forexRates[forexCurrency].buy}</div>
                      <div>Sell: ₹{forexRates[forexCurrency].sell}</div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="btn btn-primary w-full"
                  style={{ fontWeight: 600 }}
                >
                  Order Forex Card / Wire Remittance
                </button>
              </div>
            )}

            {/* TAB 4: FAST DIGITAL ONBOARDING */}
            {heroWidgetTab === 'account' && (
              <div>
                {quickFormSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                    <h4 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>Application Initiated!</h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      We sent a Video-KYC authentication link to your mobile number.
                    </p>
                    <button
                      onClick={() => setQuickFormSubmitted(false)}
                      className="btn btn-secondary btn-sm"
                    >
                      New Application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setQuickFormSubmitted(true); }}>
                    <div className="form-group mb-2">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Legal Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="As per PAN card"
                        value={quickName}
                        onChange={(e) => setQuickName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Mobile Number (Aadhaar linked)</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+91 98200 XXXXX"
                        value={quickPhone}
                        onChange={(e) => setQuickPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Account Type</label>
                      <select
                        className="form-control"
                        value={quickAccountType}
                        onChange={(e) => setQuickAccountType(e.target.value)}
                      >
                        <option value="SAVINGS">Premier Digital Savings (7.25% p.a.)</option>
                        <option value="CURRENT">Commercial Business Current A/c</option>
                        <option value="SALARY">Corporate Salary Premium A/c</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{ fontWeight: 600 }}>
                      Start 3-Minute Video KYC
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 4. LIVE RATES TICKER BAR */}
      <div style={{ backgroundColor: '#090d16', borderBottom: '1px solid var(--border-color)', padding: '0.65rem 1.5rem', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <TrendingUp size={14} /> LIVE RATES:
          </span>
          <span>Savings Deposit: <strong style={{ color: '#38bdf8' }}>7.25% p.a.</strong></span>
          <span>&bull;</span>
          <span>1-Year Term Deposit: <strong style={{ color: '#38bdf8' }}>7.75% p.a.</strong> (Senior: 8.25%)</span>
          <span>&bull;</span>
          <span>Home Loans: <strong style={{ color: '#34d399' }}>8.35% p.a.</strong></span>
          <span>&bull;</span>
          <span>Personal Loans: <strong style={{ color: '#34d399' }}>10.40% p.a.</strong></span>
          <span>&bull;</span>
          <span>USD/INR: <strong>₹83.42</strong></span>
          <span>&bull;</span>
          <span>EUR/INR: <strong>₹90.15</strong></span>
          <span>&bull;</span>
          <span>Gold Sovereign Loan: <strong>8.75% p.a.</strong></span>
        </div>
      </div>

      {/* 5. CORE BANKING PRODUCTS SHOWCASE */}
      <section id="accounts" style={{ padding: '4.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tailored Financial Solutions
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.02em' }}>
            Everything You Need to Save, Borrow &amp; Grow
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
            Engineered with bank-grade security, instant digital settlement, and dedicated relationship management.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          {/* Card 1: Premier Savings */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-color)', transition: 'transform 0.2s', padding: '1.75rem' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
                <Landmark size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Premier Savings Account</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                High-yield daily interest accrual credited monthly. Zero balance digital variant with complimentary platinum card.
              </p>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <li>✓ Up to <strong>7.25% p.a.</strong> compound returns</li>
                <li>✓ Unlimited Free ATM withdrawals</li>
                <li>✓ Airport lounge access worldwide</li>
              </ul>
            </div>
            <button onClick={() => setShowOpenModal(true)} className="btn btn-secondary w-full">
              Open Savings Account
            </button>
          </div>

          {/* Card 2: Home Loans */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-color)', padding: '1.75rem' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '1.25rem' }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dream Home Loan</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Own your dream house with minimal documentation, lowest market rates, and flexible tenure up to 30 years.
              </p>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <li>✓ Starting at <strong>8.35% p.a.</strong></li>
                <li>✓ Zero prepayment &amp; foreclosure fees</li>
                <li>✓ Pre-approved sanction in 24 hours</li>
              </ul>
            </div>
            <button onClick={() => setShowOpenModal(true)} className="btn btn-secondary w-full">
              Check Home Loan Eligibility
            </button>
          </div>

          {/* Card 3: Business Current */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-color)', padding: '1.75rem' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', marginBottom: '1.25rem' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Business Current Account</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Dynamic working capital limits, bulk vendor payments via host-to-host API, and automated GST reconciliation.
              </p>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <li>✓ 500 Free RTGS &amp; NEFT batches / month</li>
                <li>✓ Instant POS and Payment Gateway suite</li>
                <li>✓ Dedicated Treasury Relationship Manager</li>
              </ul>
            </div>
            <button onClick={() => setShowOpenModal(true)} className="btn btn-secondary w-full">
              Open Corporate Account
            </button>
          </div>

          {/* Card 4: Metal Credit Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-color)', padding: '1.75rem' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', marginBottom: '1.25rem' }}>
                <CreditCard size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>FinCore Platinum Metal</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Premium contactless credit card offering unlimited accelerated reward points, low forex markup, and lifestyle concierge.
              </p>
              <ul style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <li>✓ 5X Rewards on Dining &amp; International Travel</li>
                <li>✓ Lowest Forex Markup: 1.5%</li>
                <li>✓ ₹1 Crore Complimentary Air Accident Cover</li>
              </ul>
            </div>
            <button onClick={onGoToLogin} className="btn btn-secondary w-full">
              Apply For Credit Card
            </button>
          </div>

        </div>
      </section>

      {/* 6. SECURITY & REGULATORY TRUST */}
      <section id="security" style={{ backgroundColor: '#090d16', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '4.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Security &amp; Regulatory Assurance
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '1rem' }}>
              Institutional-Grade Protection for Every Rupee.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your financial safety is our highest priority. FinCore Bank combines regulatory compliance with real-time biometric safeguards to ensure zero unauthorized transactions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <ShieldCheck size={24} style={{ color: '#10b981', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ fontWeight: 700, color: '#fff' }}>DICGC Deposit Insurance Guarantee</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Deposits with FinCore Bank are insured up to ₹5,00,000 under the Deposit Insurance and Credit Guarantee Corporation (DICGC), a wholly owned subsidiary of RBI.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Lock size={24} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ fontWeight: 700, color: '#fff' }}>256-Bit TLS &amp; HSM Cryptographic Ledger</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    All communications are encrypted end-to-end with Hardware Security Module (HSM) key custody and tamper-evident SHA-256 transaction journals.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Zap size={24} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ fontWeight: 700, color: '#fff' }}>Real-Time Automated Fraud Prevention</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    24x7 automated fraud anomaly detection engine blocks unauthorized device logins, SIM-swap attacks, and suspicious high-frequency transfers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Trust Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            <div className="card" style={{ backgroundColor: '#131b2c', border: '1px solid var(--border-color)', textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>2.4M+</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Active Customers</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Across Retail &amp; MSME</div>
            </div>

            <div className="card" style={{ backgroundColor: '#131b2c', border: '1px solid var(--border-color)', textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', marginBottom: '0.25rem' }}>₹48,000 Cr</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Customer Deposits</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>100% Capital Solvency</div>
            </div>

            <div className="card" style={{ backgroundColor: '#131b2c', border: '1px solid var(--border-color)', textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', marginBottom: '0.25rem' }}>450+</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Branches &amp; Hubs</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Nationwide Presence</div>
            </div>

            <div className="card" style={{ backgroundColor: '#131b2c', border: '1px solid var(--border-color)', textAlign: 'center', padding: '2rem 1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fbbf24', marginBottom: '0.25rem' }}>99.98%</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Core System Uptime</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>NPCI &amp; RBI Interconnected</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DIGITAL BANKING (NETBANKING & MOBILE) */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #172554 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2.5rem',
          color: '#ffffff',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#93c5fd' }}>
              FinCore Anywhere &bull; Digital Banking
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginTop: '0.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
              Bank from Your Couch or On the Move.
            </h2>
            <p style={{ fontSize: '1rem', color: '#bfdbfe', lineHeight: 1.6, marginBottom: '2rem' }}>
              Execute NEFT, IMPS, RTGS, generate e-statements, book term deposits, manage credit card limits, and pay utility bills seamlessly in seconds.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={onGoToLogin}
                className="btn btn-lg"
                style={{ backgroundColor: '#ffffff', color: '#1e3a8a', fontWeight: 800, padding: '0.85rem 1.75rem' }}
              >
                Log In to NetBanking
              </button>
              <button
                onClick={() => setShowOpenModal(true)}
                className="btn btn-secondary btn-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', fontWeight: 600 }}
              >
                Open Digital Account
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <Smartphone size={24} style={{ color: '#38bdf8', marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Biometric Login</h4>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Instant authentication with fingerprint and facial recognition.</p>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <Zap size={24} style={{ color: '#34d399', marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Instant QR &amp; UPI</h4>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Scan any merchant QR code or pay phone contacts directly.</p>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <Lock size={24} style={{ color: '#fbbf24', marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>1-Tap Card Freeze</h4>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Instantly lock debit and credit cards in case of loss or theft.</p>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <FileText size={24} style={{ color: '#a855f7', marginBottom: '0.5rem' }} />
              <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Instant e-Statement</h4>
              <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>Download certified PDF &amp; CSV statements with 1-click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" style={{ padding: '4.5rem 1.5rem', maxWidth: '880px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Got Questions?
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
            Clear answers to help you make informed decisions about your money.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="card"
              style={{ padding: '1.25rem', cursor: 'pointer', transition: 'border-color 0.2s', border: openFaq === index ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)' }}
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: openFaq === index ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                  {faq.q}
                </span>
                {openFaq === index ? <ChevronUp size={18} color="var(--accent-primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
              </div>
              {openFaq === index && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. STATUTORY BANK FOOTER */}
      <footer style={{ backgroundColor: '#090d16', borderTop: '1px solid var(--border-color)', padding: '4rem 1.5rem 2rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
            
            {/* Col 1: Brand & Headquarters */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Landmark size={18} />
                </div>
                <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#fff' }}>FinCore Bank</span>
              </div>
              <p style={{ lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Registered Office: FinCore Financial Towers, Plot C-22, G Block, Bandra Kurla Complex (BKC), Mumbai - 400051.
              </p>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                CIN: L65110MH1984PLC032481 &bull; RBI Reg: 04/1984
              </div>
            </div>

            {/* Col 2: Retail Banking */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Retail Banking</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowOpenModal(true)}>Savings Accounts</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowOpenModal(true)}>Fixed Deposits</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowOpenModal(true)}>Recurring Deposits</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={onGoToLogin}>Debit &amp; Credit Cards</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={onGoToLogin}>Mutual Funds &amp; SIP</span></li>
              </ul>
            </div>

            {/* Col 3: Lending & Loans */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Lending Solutions</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowOpenModal(true)}>Personal Loans (10.40%)</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowOpenModal(true)}>Home Loans (8.35%)</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowOpenModal(true)}>Vehicle &amp; Auto Loans</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowOpenModal(true)}>Loan Against Property</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => setShowOpenModal(true)}>SME &amp; MSME Working Capital</span></li>
              </ul>
            </div>

            {/* Col 4: Customer Care & Compliance */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Support &amp; Compliance</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Toll Free: <strong>1800-209-4400</strong></li>
                <li>Email: <code>customercare@fincore.bank</code></li>
                <li>Principal Nodal Officer &bull; Grievance</li>
                <li>Doorstep Banking for Senior Citizens</li>
                <li>Cyber Crime Helpline: 1930</li>
              </ul>
            </div>

          </div>

          {/* Statutory Regulatory Disclaimers */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div>
              &copy; 1984 - {new Date().getFullYear()} FinCore Bank Ltd. All Rights Reserved. Regulated by Reserve Bank of India (RBI).
            </div>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <span>Privacy Policy</span>
              <span>Terms &amp; Conditions</span>
              <span>Fair Practices Code</span>
              <span>BCSBI Codes</span>
              <span>Regulatory Disclosures</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Account Opening Modal */}
      <CreateCustomerModal
        isOpen={showOpenModal}
        onClose={() => setShowOpenModal(false)}
        onCreated={() => {
          setShowOpenModal(false);
          onGoToLogin();
        }}
      />
    </div>
  );
};
