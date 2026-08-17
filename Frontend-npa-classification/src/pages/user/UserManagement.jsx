import { useState } from "react";

import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserPlus,
  FaSearch,
} from "react-icons/fa";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import UserStatCard from "../../components/user/UserStatCard";
import UserTable from "../../components/user/UserTable";

import "./UserManagement.css";


function UserManagement() {

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      customerId: "CUS001",
      accountType: "Saving Account",
      phone: "+91 9876543210",
      status: "Active",
    },

    {
      id: 2,
      name: "Priya Patil",
      email: "priya@example.com",
      customerId: "CUS002",
      accountType: "Current Account",
      phone: "+91 9876543211",
      status: "Active",
    },

    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@example.com",
      customerId: "CUS003",
      accountType: "Saving Account",
      phone: "+91 9876543212",
      status: "Active",
    },

    {
      id: 4,
      name: "Sneha Joshi",
      email: "sneha@example.com",
      customerId: "CUS004",
      accountType: "Saving Account",
      phone: "+91 9876543213",
      status: "Inactive",
    },

    {
      id: 5,
      name: "Vikas More",
      email: "vikas@example.com",
      customerId: "CUS005",
      accountType: "Current Account",
      phone: "+91 9876543214",
      status: "Active",
    },
  ]);


  /* ==========================================
     View Customer
  ========================================== */

  const handleView = (user) => {

    console.log("View customer:", user);

  };


  /* ==========================================
     Edit Customer
  ========================================== */

  const handleEdit = (user) => {

    console.log("Edit customer:", user);

  };


  /* ==========================================
     Delete Customer
  ========================================== */

  const handleDelete = (user) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter(
        (item) => item.id !== user.id
      )
    );

  };


  /* ==========================================
     Add Customer
  ========================================== */

  const handleAddUser = () => {

    console.log("Add customer");

  };


  return (

    <div className="user-page">

      {/* ==========================================
          Sidebar
      ========================================== */}

      <AdminSidebar />


      {/* ==========================================
          Main Area
      ========================================== */}

      <main className="user-main">

        <AdminNavbar />


        <div className="user-content">

          {/* ==========================================
              Page Header
          ========================================== */}

          <div className="user-page-header">

            <div>

              <span className="user-page-label">
                CUSTOMER ADMINISTRATION
              </span>

              <h1>
                User Management
              </h1>

              <p>
                Monitor and manage registered customer accounts.
              </p>

            </div>


            <button
              className="add-user-btn"
              onClick={handleAddUser}
            >
              <FaUserPlus />
              Add Customer
            </button>

          </div>


          {/* ==========================================
              Statistics
          ========================================== */}

          <div className="user-stats-grid">

            <UserStatCard
              icon={<FaUsers />}
              title="Total Customers"
              value="1,250"
              description="Registered customers"
              variant="blue"
            />

            <UserStatCard
              icon={<FaUserCheck />}
              title="Active Customers"
              value="1,198"
              description="Currently active"
              variant="green"
            />

            <UserStatCard
              icon={<FaUserClock />}
              title="Inactive Customers"
              value="52"
              description="Currently inactive"
              variant="orange"
            />

            <UserStatCard
              icon={<FaUserPlus />}
              title="New Customers"
              value="86"
              description="Registered this month"
              variant="purple"
            />

          </div>


          {/* ==========================================
              Search / Filter
          ========================================== */}

          <div className="user-filter-card">

            <div className="user-filter-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search customers..."
              />

            </div>


            <select className="user-filter-select">

              <option value="">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>


            <select className="user-filter-select">

              <option value="">
                All Account Types
              </option>

              <option value="Saving Account">
                Saving Account
              </option>

              <option value="Current Account">
                Current Account
              </option>

            </select>

          </div>


          {/* ==========================================
              User Table
          ========================================== */}

          <UserTable
            users={users}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>

      </main>

    </div>
  );
}

export default UserManagement;