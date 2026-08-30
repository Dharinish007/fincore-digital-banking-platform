import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaCalendarAlt,
  FaUserCog,
  FaEdit,
  FaLock,
} from "react-icons/fa";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminNavbar from "../../../components/admin/AdminNavbar";

import "./AdminProfile.css";

function AdminProfile() {
  return (
    <div className="admin-profile-page">

      <AdminSidebar />

      <div className="admin-profile-main">

        <AdminNavbar />

        <div className="admin-profile-content">

          {/* ==========================================
              Page Header
          ========================================== */}

          <div className="admin-profile-header">

            <div>
              <span className="admin-profile-label">
                ACCOUNT MANAGEMENT
              </span>

              <h1>My Profile</h1>

              <p>
                View and manage your administrator account information.
              </p>
            </div>

          </div>


          {/* ==========================================
              Profile Overview
          ========================================== */}

          <div className="admin-profile-grid">

            {/* Profile Card */}

            <div className="admin-profile-card profile-overview">

              <div className="profile-cover"></div>

              <div className="profile-avatar-wrapper">

                <div className="profile-avatar">
                  A
                </div>

                <span className="profile-online-dot"></span>

              </div>

              <div className="profile-overview-content">

                <h2>Admin</h2>

                <p className="profile-role">
                  <FaShieldAlt />
                  Administrator
                </p>

                <p className="profile-email">
                  admin@fincore.com
                </p>

              </div>

              <button className="edit-profile-btn">
                <FaEdit />
                Edit Profile
              </button>

            </div>


            {/* Account Information */}

            <div className="admin-profile-card">

              <div className="profile-card-header">

                <div>
                  <h2>Account Information</h2>

                  <p>
                    Your administrator account details.
                  </p>
                </div>

                <FaUserCog className="profile-header-icon" />

              </div>


              <div className="profile-info-grid">

                <div className="profile-info-item">

                  <div className="profile-info-icon">
                    <FaUserCircle />
                  </div>

                  <div>
                    <span>Full Name</span>
                    <strong>Admin</strong>
                  </div>

                </div>


                <div className="profile-info-item">

                  <div className="profile-info-icon">
                    <FaEnvelope />
                  </div>

                  <div>
                    <span>Email Address</span>
                    <strong>admin@fincore.com</strong>
                  </div>

                </div>


                <div className="profile-info-item">

                  <div className="profile-info-icon">
                    <FaPhone />
                  </div>

                  <div>
                    <span>Phone Number</span>
                    <strong>+91 XXXXX XXXXX</strong>
                  </div>

                </div>


                <div className="profile-info-item">

                  <div className="profile-info-icon">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <span>Role</span>
                    <strong>Administrator</strong>
                  </div>

                </div>


                <div className="profile-info-item">

                  <div className="profile-info-icon">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <span>Account Created</span>
                    <strong>01 Jan 2026</strong>
                  </div>

                </div>


                <div className="profile-info-item">

                  <div className="profile-info-icon">
                    <FaLock />
                  </div>

                  <div>
                    <span>Account Status</span>

                    <strong className="active-status">
                      Active
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* ==========================================
              Security Section
          ========================================== */}

          <div className="admin-profile-card security-card">

            <div className="profile-card-header">

              <div>
                <h2>Security</h2>

                <p>
                  Manage your account security settings.
                </p>
              </div>

              <FaLock className="profile-header-icon" />

            </div>


            <div className="security-options">

              <div className="security-option">

                <div className="security-option-left">

                  <div className="security-icon">
                    <FaLock />
                  </div>

                  <div>
                    <h3>Password</h3>

                    <p>
                      Last changed recently
                    </p>
                  </div>

                </div>

                <button className="security-btn">
                  Change Password
                </button>

              </div>


              <div className="security-option">

                <div className="security-option-left">

                  <div className="security-icon">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <h3>Role & Permissions</h3>

                    <p>
                      Administrator access
                    </p>
                  </div>

                </div>

                <span className="permission-badge">
                  Full Access
                </span>

              </div>

            </div>

          </div>


          {/* ==========================================
              Recent Login
          ========================================== */}

          <div className="admin-profile-card login-card">

            <div className="profile-card-header">

              <div>
                <h2>Recent Login</h2>

                <p>
                  Information about your latest account activity.
                </p>
              </div>

              <FaCalendarAlt className="profile-header-icon" />

            </div>


            <div className="login-details">

              <div>
                <span>Last Login</span>
                <strong>Today, 10:30 AM</strong>
              </div>

              <div>
                <span>Login Method</span>
                <strong>Email & Password</strong>
              </div>

              <div>
                <span>Status</span>
                <strong className="active-status">
                  Successful
                </strong>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminProfile;