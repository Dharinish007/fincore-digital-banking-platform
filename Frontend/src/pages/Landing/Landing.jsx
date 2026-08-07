import { Link } from "react-router-dom";
import {
  FaUniversity,
  FaShieldAlt,
  FaMoneyCheckAlt,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa";

import "./Landing.css";

function Landing() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="container navbar-content">
          <div className="logo">
            <FaUniversity className="logo-icon" />
            <span>FinCore</span>
          </div>

          <div className="nav-buttons">
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>

            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-container">

          <div className="hero-left">

            <span className="tagline">
              Secure • Smart • Trusted Banking
            </span>

            <h1>
              Digital Banking
              <br />
              For The
              <span> Modern World</span>
            </h1>

            <p>
              FinCore provides secure digital banking with seamless fund
              transfers, account management, KYC verification,
              loan processing, and enterprise-level security.
            </p>

            <div className="hero-buttons">

              <Link to="/login" className="btn btn-primary">
                Login
              </Link>

              <Link to="/register" className="btn btn-outline">
                Open Account
              </Link>

            </div>

          </div>

          <div className="hero-right">

            <div className="bank-card">

              <div className="bank-title">
                🏦 FinCore Bank
              </div>

              <div className="bank-balance">
                ₹ 8,45,620
              </div>

              <div className="bank-footer">
                Secure Banking Platform
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Features */}

      <section className="features">

        <div className="container">

          <h2>Why Choose FinCore?</h2>

          <div className="feature-grid">

            <div className="feature-card">

              <FaShieldAlt />

              <h3>Highly Secure</h3>

              <p>
                Enterprise security with role-based authentication.
              </p>

            </div>

            <div className="feature-card">

              <FaMoneyCheckAlt />

              <h3>Instant Transfers</h3>

              <p>
                Fast and secure money transfers anytime.
              </p>

            </div>

            <div className="feature-card">

              <FaHeadset />

              <h3>24×7 Support</h3>

              <p>
                Dedicated banking support whenever you need help.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="cta">

        <div className="container">

          <h2>Start Your Banking Journey Today</h2>

          <p>
            Open your account in minutes and experience modern digital banking.
          </p>

          <Link to="/register" className="btn btn-primary">

            Get Started

            <FaArrowRight />

          </Link>

        </div>

      </section>

    </div>
  );
}

export default Landing;