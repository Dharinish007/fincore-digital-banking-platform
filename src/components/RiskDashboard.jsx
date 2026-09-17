import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../api/client';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Percent,
  DollarSign,
  PieChart,
  Search,
  Filter,
  Sliders,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

/**
 * Helper to compute an SVG donut arc path.
 */
function describeArc(cx, cy, rInner, rOuter, startAngleDeg, endAngleDeg) {
  // Handle edge case where a single slice is 360 deg
  const angleDiff = endAngleDeg - startAngleDeg;
  const clampedEnd = angleDiff >= 359.99 ? startAngleDeg + 359.99 : endAngleDeg;

  const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
  const endRad = ((clampedEnd - 90) * Math.PI) / 180;

  const x1 = cx + rOuter * Math.cos(startRad);
  const y1 = cy + rOuter * Math.sin(startRad);
  const x2 = cx + rOuter * Math.cos(endRad);
  const y2 = cy + rOuter * Math.sin(endRad);

  const x3 = cx + rInner * Math.cos(endRad);
  const y3 = cy + rInner * Math.sin(endRad);
  const x4 = cx + rInner * Math.cos(startRad);
  const y4 = cy + rInner * Math.sin(startRad);

  const largeArcFlag = angleDiff <= 180 ? 0 : 1;

  return [
    `M ${x1.toFixed(3)} ${y1.toFixed(3)}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2.toFixed(3)} ${y2.toFixed(3)}`,
    `L ${x3.toFixed(3)} ${y3.toFixed(3)}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x4.toFixed(3)} ${y4.toFixed(3)}`,
    'Z'
  ].join(' ');
}

/**
 * RiskDashboard Component
 * Displays multi-factor risk scoring analytics and an interactive SVG Donut Chart
 * representing risk and delinquency distribution across the institutional loan portfolio.
 */
export default function RiskDashboard({
  riskScores: propRiskScores,
  loans: propLoans,
  onReassess,
  title = "Loan Portfolio Credit Risk & Distribution Engine",
  subtitle = "Algorithmic multi-factor risk categorization, exposure concentration, and delinquency analytics"
}) {
  const [internalRiskScores, setInternalRiskScores] = useState([]);
  const [internalLoans, setInternalLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Active filters and view modes
  const [distributionMode, setDistributionMode] = useState('RISK_TIER'); // 'RISK_TIER' | 'NPA_TIER'
  const [metricMode, setMetricMode] = useState('EXPOSURE'); // 'EXPOSURE' ($) | 'COUNT' (#)
  const [selectedSlice, setSelectedSlice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  // Load data if not provided via props
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (propRiskScores && propLoans) {
        setInternalRiskScores(propRiskScores);
        setInternalLoans(propLoans);
        return;
      }
      setLoading(true);
      try {
        const [riskRes, loanRes] = await Promise.all([
          propRiskScores ? Promise.resolve({ data: propRiskScores }) : apiClient.getRiskScores(),
          propLoans ? Promise.resolve({ data: propLoans }) : apiClient.getLoans(),
        ]);
        if (isMounted) {
          setInternalRiskScores(riskRes.data || []);
          setInternalLoans(loanRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load RiskDashboard data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [propRiskScores, propLoans]);

  const riskScores = propRiskScores || internalRiskScores;
  const loans = propLoans || internalLoans;

  // Combine loans with their associated customer's risk profile
  const enrichedLoans = useMemo(() => {
    return loans.map((loan) => {
      const riskProfile = riskScores.find(
        (r) => r.customerId === loan.customerId || r.customerName === loan.customerName
      );

      // Derive risk tier from loan score or default heuristics
      const score = riskProfile?.score ?? (loan.npaClassification === 'NPA' ? 88 : loan.dpd > 30 ? 65 : 25);
      const level = riskProfile?.level ?? (score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW');
      const creditScore = riskProfile?.creditScore ?? 700;

      return {
        ...loan,
        riskScore: score,
        riskLevel: level,
        creditScore,
        factors: riskProfile?.factors || [],
        debtToIncomeRatio: riskProfile?.debtToIncomeRatio || '30%',
        lastAssessed: riskProfile?.lastAssessed || loan.disbursementDate,
      };
    });
  }, [loans, riskScores]);

  // Aggregate portfolio summary metrics
  const portfolioStats = useMemo(() => {
    const totalPrincipal = enrichedLoans.reduce((acc, l) => acc + (l.principalAmount || 0), 0);
    const totalOutstanding = enrichedLoans.reduce((acc, l) => acc + (l.outstandingAmount || 0), 0);
    const count = enrichedLoans.length;

    if (count === 0) {
      return {
        totalPrincipal: 0,
        totalOutstanding: 0,
        count: 0,
        avgRiskScore: 0,
        avgCreditScore: 0,
        highRiskVolume: 0,
        highRiskPercent: 0,
        standardVolume: 0,
      };
    }

    const avgRiskScore = Math.round(
      enrichedLoans.reduce((acc, l) => acc + l.riskScore, 0) / count
    );
    const avgCreditScore = Math.round(
      enrichedLoans.reduce((acc, l) => acc + l.creditScore, 0) / count
    );

    const highRiskLoans = enrichedLoans.filter((l) => l.riskLevel === 'HIGH');
    const highRiskVolume = highRiskLoans.reduce((acc, l) => acc + (l.outstandingAmount || 0), 0);
    const highRiskPercent = totalOutstanding > 0 ? (highRiskVolume / totalOutstanding) * 100 : 0;

    const standardLoans = enrichedLoans.filter((l) => l.npaClassification === 'STANDARD');
    const standardVolume = standardLoans.reduce((acc, l) => acc + (l.outstandingAmount || 0), 0);

    return {
      totalPrincipal,
      totalOutstanding,
      count,
      avgRiskScore,
      avgCreditScore,
      highRiskVolume,
      highRiskPercent,
      standardVolume,
    };
  }, [enrichedLoans]);

  // Prepare data for the Donut Chart based on distributionMode
  const chartSlices = useMemo(() => {
    if (enrichedLoans.length === 0) return [];

    const totalWeight = enrichedLoans.reduce((acc, l) => {
      return acc + (metricMode === 'EXPOSURE' ? (l.outstandingAmount || 0) : 1);
    }, 0);

    if (totalWeight === 0) return [];

    if (distributionMode === 'RISK_TIER') {
      const tiers = [
        {
          key: 'LOW',
          label: 'Low Risk Tier (Score 0-39)',
          color: '#10b981', // Emerald Green
          accentColor: 'rgba(16, 185, 129, 0.2)',
          filterFn: (l) => l.riskLevel === 'LOW',
        },
        {
          key: 'MEDIUM',
          label: 'Medium Risk Tier (Score 40-69)',
          color: '#f59e0b', // Amber Warning
          accentColor: 'rgba(245, 158, 11, 0.2)',
          filterFn: (l) => l.riskLevel === 'MEDIUM',
        },
        {
          key: 'HIGH',
          label: 'High Risk Tier (Score 70-100)',
          color: '#ef4444', // Crimson Red
          accentColor: 'rgba(239, 68, 68, 0.2)',
          filterFn: (l) => l.riskLevel === 'HIGH',
        },
      ];

      return tiers.map((tier) => {
        const matchingLoans = enrichedLoans.filter(tier.filterFn);
        const volume = matchingLoans.reduce((acc, l) => acc + (l.outstandingAmount || 0), 0);
        const count = matchingLoans.length;
        const weight = metricMode === 'EXPOSURE' ? volume : count;
        const percent = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;

        return {
          ...tier,
          count,
          volume,
          weight,
          percent,
          matchingLoans,
        };
      });
    }

    // Otherwise distribution by NPA Delinquency Classification
    const npaTiers = [
      {
        key: 'STANDARD',
        label: 'Standard Asset (0 DPD)',
        color: '#10b981',
        accentColor: 'rgba(16, 185, 129, 0.2)',
        filterFn: (l) => l.npaClassification === 'STANDARD',
      },
      {
        key: 'SMA-0',
        label: 'SMA-0 Watchlist (1-30 DPD)',
        color: '#3b82f6',
        accentColor: 'rgba(59, 130, 246, 0.2)',
        filterFn: (l) => l.npaClassification === 'SMA-0',
      },
      {
        key: 'SMA-1',
        label: 'SMA-1 Sub-Watch (31-60 DPD)',
        color: '#f59e0b',
        accentColor: 'rgba(245, 158, 11, 0.2)',
        filterFn: (l) => l.npaClassification === 'SMA-1',
      },
      {
        key: 'SMA-2',
        label: 'SMA-2 Critical Overdue (61-89 DPD)',
        color: '#ea580c',
        accentColor: 'rgba(234, 88, 12, 0.2)',
        filterFn: (l) => l.npaClassification === 'SMA-2',
      },
      {
        key: 'NPA',
        label: 'Impaired / NPA (90+ DPD)',
        color: '#ef4444',
        accentColor: 'rgba(239, 68, 68, 0.2)',
        filterFn: (l) => l.npaClassification === 'NPA' || l.npaClassification === 'SUBSTANDARD',
      },
    ];

    return npaTiers.map((tier) => {
      const matchingLoans = enrichedLoans.filter(tier.filterFn);
      const volume = matchingLoans.reduce((acc, l) => acc + (l.outstandingAmount || 0), 0);
      const count = matchingLoans.length;
      const weight = metricMode === 'EXPOSURE' ? volume : count;
      const percent = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;

      return {
        ...tier,
        count,
        volume,
        weight,
        percent,
        matchingLoans,
      };
    });
  }, [enrichedLoans, distributionMode, metricMode]);

  // Compute angles for Donut slices
  const computedArcs = useMemo(() => {
    let currentAngle = 0;
    return chartSlices.map((slice) => {
      const sliceAngle = (slice.percent / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      return {
        ...slice,
        startAngle,
        endAngle,
      };
    });
  }, [chartSlices]);

  // Filtered loan records for table view
  const filteredLoans = useMemo(() => {
    return enrichedLoans.filter((loan) => {
      // Tier filter
      if (tierFilter !== 'ALL' && loan.riskLevel !== tierFilter) {
        return false;
      }
      // Selected donut slice filter
      if (selectedSlice) {
        if (distributionMode === 'RISK_TIER' && loan.riskLevel !== selectedSlice.key) {
          return false;
        }
        if (distributionMode === 'NPA_TIER' && loan.npaClassification !== selectedSlice.key) {
          return false;
        }
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = loan.customerName?.toLowerCase().includes(term);
        const matchId = loan.id?.toLowerCase().includes(term);
        const matchCustId = loan.customerId?.toLowerCase().includes(term);
        const matchType = loan.loanType?.toLowerCase().includes(term);
        if (!matchName && !matchId && !matchCustId && !matchType) return false;
      }
      return true;
    });
  }, [enrichedLoans, tierFilter, selectedSlice, searchTerm, distributionMode]);

  // Active highlighted slice for center tooltip
  const activeFocusSlice = selectedSlice || computedArcs.find((s) => s.percent > 0) || null;

  return (
    <div className="risk-dashboard-container">
      {/* Top Banner & Header */}
      <div className="banking-card" style={{ marginBottom: 20 }}>
        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 12 }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldAlert size={22} style={{ color: '#60a5fa' }} />
              <span>{title}</span>
            </h2>
            <div className="card-subtitle">{subtitle}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge badge-blue">ISO 31000 Compliant</span>
            <span className="badge badge-purple">Basel III Framework</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        {/* Stat 1: Total Exposure */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Portfolio Exposure</span>
            <div className="stat-icon icon-blue">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="stat-value">
            ${(portfolioStats.totalOutstanding || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-desc">
            Across {portfolioStats.count} Active Credit Facilities
          </div>
        </div>

        {/* Stat 2: Weighted Risk Score */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Avg Portfolio Risk</span>
            <div
              className={`stat-icon ${
                portfolioStats.avgRiskScore >= 70
                  ? 'icon-red'
                  : portfolioStats.avgRiskScore >= 40
                  ? 'icon-orange'
                  : 'icon-green'
              }`}
            >
              <AlertTriangle size={18} />
            </div>
          </div>
          <div
            className="stat-value"
            style={{
              color:
                portfolioStats.avgRiskScore >= 70
                  ? '#ef4444'
                  : portfolioStats.avgRiskScore >= 40
                  ? '#f59e0b'
                  : '#10b981',
            }}
          >
            {portfolioStats.avgRiskScore} / 100
          </div>
          <div className="stat-desc">
            {portfolioStats.avgRiskScore >= 70
              ? 'Elevated Risk Horizon'
              : portfolioStats.avgRiskScore >= 40
              ? 'Moderate Risk Grade'
              : 'Low Risk Grade'}
          </div>
        </div>

        {/* Stat 3: High-Risk Exposure */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">High-Risk Exposure</span>
            <div className="stat-icon icon-red">
              <TrendingDown size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#ef4444' }}>
            ${(portfolioStats.highRiskVolume || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-desc" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{portfolioStats.highRiskPercent.toFixed(1)}% of total portfolio</span>
          </div>
        </div>

        {/* Stat 4: Average Credit Score */}
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-title">Bureau Rating Avg</span>
            <div className="stat-icon icon-purple">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#93c5fd' }}>
            {portfolioStats.avgCreditScore} / 850
          </div>
          <div className="stat-desc">
            Standard Prime Quality Index
          </div>
        </div>
      </div>

      {/* Main Visualizations: Donut Chart + Portfolio Composition */}
      <div className="banking-card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <h3>
              <PieChart size={18} style={{ color: '#60a5fa' }} />
              <span>Risk Concentration &amp; Portfolio Distribution</span>
            </h3>
            <div className="card-subtitle">
              Interactive Donut Breakdown: hover or click slices to isolate specific exposure categories
            </div>
          </div>

          {/* Visualization Controls & View Switcher */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex', background: '#0b1329', padding: 3, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                className={`btn btn-sm ${distributionMode === 'RISK_TIER' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
                onClick={() => {
                  setDistributionMode('RISK_TIER');
                  setSelectedSlice(null);
                }}
              >
                Risk Tiers
              </button>
              <button
                type="button"
                className={`btn btn-sm ${distributionMode === 'NPA_TIER' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
                onClick={() => {
                  setDistributionMode('NPA_TIER');
                  setSelectedSlice(null);
                }}
              >
                NPA / DPD Stages
              </button>
            </div>

            <div style={{ display: 'flex', background: '#0b1329', padding: 3, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                className={`btn btn-sm ${metricMode === 'EXPOSURE' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
                onClick={() => setMetricMode('EXPOSURE')}
              >
                By Volume ($)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${metricMode === 'COUNT' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none' }}
                onClick={() => setMetricMode('COUNT')}
              >
                By Count (#)
              </button>
            </div>
          </div>
        </div>

        {/* Visual Content: SVG Donut Chart + Legend + Center Callout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
            alignItems: 'center',
            padding: '10px 0',
          }}
        >
          {/* Left Column: Interactive SVG Donut */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <svg
              viewBox="0 0 280 280"
              style={{
                width: '100%',
                maxWidth: 280,
                height: 280,
                transform: 'rotate(-90deg)',
                cursor: 'pointer',
              }}
            >
              {/* Background circle track */}
              <circle
                cx="140"
                cy="140"
                r="95"
                fill="none"
                stroke="#0b1329"
                strokeWidth="42"
              />

              {/* Slices */}
              {computedArcs.map((slice, idx) => {
                if (slice.percent <= 0) return null;
                const isSelected = selectedSlice?.key === slice.key;
                const rInner = isSelected ? 68 : 72;
                const rOuter = isSelected ? 118 : 114;
                const pathD = describeArc(140, 140, rInner, rOuter, slice.startAngle, slice.endAngle);

                return (
                  <path
                    key={slice.key || idx}
                    d={pathD}
                    fill={slice.color}
                    stroke="#0b1329"
                    strokeWidth="2.5"
                    style={{
                      transition: 'all 0.25s ease',
                      opacity: selectedSlice && !isSelected ? 0.45 : 1,
                      filter: isSelected ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none',
                    }}
                    onMouseEnter={() => setSelectedSlice(slice)}
                    onClick={() => {
                      if (selectedSlice?.key === slice.key) {
                        setSelectedSlice(null);
                      } else {
                        setSelectedSlice(slice);
                      }
                    }}
                  />
                );
              })}
            </svg>

            {/* Centered Donut Label */}
            <div
              style={{
                position: 'absolute',
                width: 130,
                height: 130,
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                pointerEvents: 'none',
                background: 'rgba(7, 13, 30, 0.85)',
                boxShadow: 'inset 0 0 14px rgba(0,0,0,0.6)',
                padding: 10,
              }}
            >
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {activeFocusSlice ? activeFocusSlice.key : 'PORTFOLIO'}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '2px 0' }}>
                {activeFocusSlice
                  ? `${activeFocusSlice.percent.toFixed(1)}%`
                  : `$${(portfolioStats.totalOutstanding / 1000000).toFixed(2)}M`}
              </span>
              <span style={{ fontSize: '0.75rem', color: activeFocusSlice ? activeFocusSlice.color : '#60a5fa', fontWeight: 600 }}>
                {activeFocusSlice
                  ? `$${(activeFocusSlice.volume / 1000).toFixed(0)}k (${activeFocusSlice.count} loans)`
                  : `${portfolioStats.count} Total Facilities`}
              </span>
            </div>

            {selectedSlice && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 12, fontSize: '0.76rem', padding: '4px 10px' }}
                onClick={() => setSelectedSlice(null)}
              >
                Reset Donut Filter
              </button>
            )}
          </div>

          {/* Right Column: Interactive Segment Breakdown & Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
              <span className="stat-title">Distribution Breakdown</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Mode: <strong style={{ color: '#ffffff' }}>{distributionMode === 'RISK_TIER' ? 'Credit Risk Tiers' : 'Delinquency Status'}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {computedArcs.map((slice) => {
                const isSelected = selectedSlice?.key === slice.key;

                return (
                  <div
                    key={slice.key}
                    onClick={() => {
                      if (selectedSlice?.key === slice.key) {
                        setSelectedSlice(null);
                      } else {
                        setSelectedSlice(slice);
                      }
                    }}
                    style={{
                      background: isSelected ? 'rgba(37, 99, 235, 0.16)' : '#0b1329',
                      border: `1px solid ${isSelected ? 'var(--primary-blue)' : 'var(--border-subtle)'}`,
                      borderRadius: 10,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: slice.color,
                            display: 'inline-block',
                            boxShadow: `0 0 6px ${slice.color}`,
                          }}
                        />
                        <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.88rem' }}>
                          {slice.label}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, color: slice.color, fontSize: '0.92rem' }}>
                        {slice.percent.toFixed(1)}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                      <span>
                        Outstanding: <strong style={{ color: '#ffffff' }}>${slice.volume.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                      </span>
                      <span>
                        Count: <strong style={{ color: '#ffffff' }}>{slice.count} Facility{slice.count !== 1 ? 'ies' : ''}</strong>
                      </span>
                    </div>

                    {/* Proportional Mini Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: 4,
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: 2,
                        marginTop: 8,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${slice.percent}%`,
                          height: '100%',
                          background: slice.color,
                          borderRadius: 2,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Facility Deep Dive & Risk Scoring Table */}
      <div className="banking-card">
        <div className="card-header">
          <div>
            <h3>
              <span>Portfolio Risk Evaluation &amp; Multi-Factor Scoring Matrix</span>
            </h3>
            <div className="card-subtitle">
              Showing {filteredLoans.length} of {enrichedLoans.length} credit facilities matching active filters
            </div>
          </div>

          {/* Table Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            {/* Search Input */}
            <div className="search-box" style={{ maxWidth: 240 }}>
              <Search className="search-icon" size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search borrower or loan ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Risk Tier Quick Filter */}
            <select
              className="select-control"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="LOW">Low Risk Only</option>
              <option value="MEDIUM">Medium Risk Only</option>
              <option value="HIGH">High Risk Only</option>
            </select>

            {(searchTerm || tierFilter !== 'ALL' || selectedSlice) && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setTierFilter('ALL');
                  setSelectedSlice(null);
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Responsive Banking Table */}
        <div className="table-responsive">
          <table className="banking-table">
            <thead>
              <tr>
                <th>Loan Reference</th>
                <th>Borrower Profile</th>
                <th>Facility Type</th>
                <th>Outstanding Balance</th>
                <th>Bureau Score</th>
                <th>Computed Risk Score</th>
                <th>Risk Classification</th>
                <th>NPA Status</th>
                <th>Risk Drivers &amp; Factors</th>
                {onReassess && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => {
                const isHigh = loan.riskLevel === 'HIGH';
                const isMedium = loan.riskLevel === 'MEDIUM';

                return (
                  <tr key={loan.id}>
                    <td className="cell-mono" style={{ color: '#60a5fa', fontWeight: 600 }}>
                      {loan.id}
                    </td>

                    <td>
                      <div className="cell-primary">{loan.customerName}</div>
                      <div className="cell-mono cell-sub">{loan.customerId}</div>
                    </td>

                    <td>
                      <div>{loan.loanType}</div>
                      <div className="cell-sub">{loan.interestRate}% APR · {loan.tenorMonths} Mos</div>
                    </td>

                    <td className="cell-primary">
                      ${(loan.outstandingAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      <div className="cell-sub">
                        Orig. ${(loan.principalAmount || 0).toLocaleString()}
                      </div>
                    </td>

                    <td className="cell-mono" style={{ color: loan.creditScore >= 720 ? '#10b981' : loan.creditScore >= 620 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                      {loan.creditScore} / 850
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#10b981' }}>
                          {loan.riskScore}
                        </span>
                        {/* Mini Visual Gauge */}
                        <div style={{ width: 60, height: 6, background: '#0b1329', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div
                            style={{
                              width: `${loan.riskScore}%`,
                              height: '100%',
                              background: isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#10b981',
                            }}
                          />
                        </div>
                      </div>
                      <div className="cell-sub">DTI: {loan.debtToIncomeRatio}</div>
                    </td>

                    <td>
                      {isHigh && <span className="badge badge-danger">HIGH RISK</span>}
                      {isMedium && <span className="badge badge-warning">MEDIUM RISK</span>}
                      {!isHigh && !isMedium && <span className="badge badge-success">LOW RISK</span>}
                    </td>

                    <td>
                      {loan.npaClassification === 'STANDARD' && (
                        <span className="badge badge-success">STANDARD (0 DPD)</span>
                      )}
                      {loan.npaClassification === 'SMA-0' && (
                        <span className="badge badge-blue">SMA-0 ({loan.dpd} DPD)</span>
                      )}
                      {loan.npaClassification === 'SMA-1' && (
                        <span className="badge badge-warning">SMA-1 ({loan.dpd} DPD)</span>
                      )}
                      {loan.npaClassification === 'SMA-2' && (
                        <span className="badge badge-orange" style={{ background: 'rgba(234, 88, 12, 0.18)', color: '#fb923c', border: '1px solid rgba(234, 88, 12, 0.4)' }}>
                          SMA-2 ({loan.dpd} DPD)
                        </span>
                      )}
                      {loan.npaClassification === 'NPA' && (
                        <span className="badge badge-danger">NPA DEFAULT ({loan.dpd} DPD)</span>
                      )}
                    </td>

                    <td style={{ maxWidth: 260 }}>
                      {Array.isArray(loan.factors) && loan.factors.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {loan.factors.slice(0, 2).map((factor, fIdx) => (
                            <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <span
                                className={`badge ${
                                  factor.impact === 'POSITIVE'
                                    ? 'badge-success'
                                    : factor.impact === 'NEGATIVE'
                                    ? 'badge-danger'
                                    : 'badge-warning'
                                }`}
                                style={{ fontSize: '0.66rem', padding: '1px 5px', minWidth: 28, textAlign: 'center' }}
                              >
                                {factor.weight > 0 ? `+${factor.weight}` : factor.weight}
                              </span>
                              <span style={{ fontSize: '0.74rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {factor.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="cell-sub">Standard automated scoring parameters</span>
                      )}
                    </td>

                    {onReassess && (
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onReassess(loan)}
                        >
                          <Sliders size={13} />
                          <span>Reassess</span>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}

              {filteredLoans.length === 0 && (
                <tr>
                  <td colSpan={onReassess ? 10 : 9} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    <AlertCircle size={28} style={{ color: '#f59e0b', marginBottom: 8, display: 'inline-block' }} />
                    <div>No credit facilities match the active filter criteria.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
