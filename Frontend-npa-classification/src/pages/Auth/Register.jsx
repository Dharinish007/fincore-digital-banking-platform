import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUniversity,
} from "react-icons/fa";

import "./Register.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="register-page">
      {/* Left Panel */}
      <div className="register-left">
        <div className="brand">
          <FaUniversity />
          <h1>FinCore</h1>
          <p>Digital Banking Management Platform</p>
        </div>

        <div className="welcome-content">
          <h2>Open Your Bank Account Online</h2>

          <p>
            Join FinCore and experience secure digital banking with instant
            account access, money transfers, loan services, KYC verification,
            and much more.
          </p>
        </div>
      </div>

      {/* Right Panel */}

      <div className="register-right">

        <form className="register-card">

          <h2>Create Customer Account</h2>

          <p className="subtitle">
            Fill in your details to create your account.
          </p>

          {/* Full Name */}

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              required
            />
          </div>

          {/* Email */}

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email Address"
              required
            />
          </div>

          {/* Mobile */}

          <div className="input-group">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              placeholder="Mobile Number"
              required
            />
          </div>

          {/* Aadhaar */}

          <div className="input-group">
            <FaIdCard className="input-icon" />
            <input
              type="text"
              placeholder="Aadhaar Number"
              required
            />
          </div>

          {/* PAN */}

          <div className="input-group">
            <FaIdCard className="input-icon" />
            <input
              type="text"
              placeholder="PAN Number"
              required
            />
          </div>

          {/* DOB */}

          <div className="input-group">
            <FaCalendarAlt className="input-icon" />
            <input
              type="date"
              required
            />
          </div>

          {/* Address */}

          <div className="input-group">
            <FaMapMarkerAlt className="input-icon" />
            <textarea
              placeholder="Address"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Password */}

          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}

          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
            />

            <span
              className="toggle-password"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Terms */}

          <div className="terms">
            <label>
              <input type="checkbox" required />

              I agree to the Terms & Conditions
            </label>
          </div>

          <button type="submit" className="register-btn">
            Create Account
          </button>

          <p className="login-link">
            Already have an account?

            <Link to="/login">
              Login
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Register;