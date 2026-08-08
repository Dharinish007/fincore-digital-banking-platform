import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUniversity,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Demo Navigation
    navigate("/admin/dashboard");
  };

  return (
    <div className="login-page">
      {/* Left Side */}
      <div className="login-left">

        <div className="brand">

          <FaUniversity />

          <h1>FinCore</h1>

          <p>Digital Banking Platform</p>

        </div>

        <div className="welcome">

          <h2>Welcome Back!</h2>

          <p>
            Securely access your banking dashboard to manage accounts,
            transactions, loans and customer services.
          </p>

        </div>

      </div>

      {/* Right Side */}

      <div className="login-right">

        <form className="login-card" onSubmit={handleLogin}>

          <h2>Login</h2>

          <p className="subtitle">
            Enter your credentials to continue.
          </p>

          <div className="input-group">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              placeholder="Email Address"
              required
            />

          </div>

          <div className="input-group">

            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />

            <span
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

          </div>

          <div className="login-options">

            <label>

              <input type="checkbox" />

              Remember Me

            </label>

            <a href="#">Forgot Password?</a>

          </div>

          <button className="login-btn">

            Login

          </button>

          <div className="register-link">

            Don't have an account?

            <Link to="/register">

              Register

            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;