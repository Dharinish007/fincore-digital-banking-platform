import { useState } from "react";

import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTie,
  FaPlus,
} from "react-icons/fa";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import EmployeeStatCard from "../../components/employee/EmployeeStatCard";
import EmployeeTable from "../../components/employee/EmployeeTable";

import "./EmployeeManagement.css";


function EmployeeManagement() {

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Priya Patil",
      email: "priya@fincore.com",
      employeeId: "EMP001",
      role: "Manager",
      department: "Operations",
      status: "Active",
    },

    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@fincore.com",
      employeeId: "EMP002",
      role: "Teller",
      department: "Banking",
      status: "Active",
    },

    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@fincore.com",
      employeeId: "EMP003",
      role: "Teller",
      department: "Banking",
      status: "Active",
    },

    {
      id: 4,
      name: "Sneha Joshi",
      email: "sneha@fincore.com",
      employeeId: "EMP004",
      role: "Manager",
      department: "Loans",
      status: "Inactive",
    },

    {
      id: 5,
      name: "Vikas More",
      email: "vikas@fincore.com",
      employeeId: "EMP005",
      role: "Teller",
      department: "Banking",
      status: "Active",
    },
  ]);


  /* ==========================================
     Edit Employee
  ========================================== */

  const handleEdit = (employee) => {

    console.log("Edit employee:", employee);

  };


  /* ==========================================
     Delete Employee
  ========================================== */

  const handleDelete = (employee) => {

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    setEmployees((currentEmployees) =>
      currentEmployees.filter(
        (item) => item.id !== employee.id
      )
    );

  };


  /* ==========================================
     Add Employee
  ========================================== */

  const handleAddEmployee = () => {

    console.log("Add employee");

  };


  return (

    <div className="employee-page">

      {/* ==========================================
          Sidebar
      ========================================== */}

      <AdminSidebar />


      {/* ==========================================
          Main Area
      ========================================== */}

      <main className="employee-main">

        <AdminNavbar />


        <div className="employee-content">

          {/* ==========================================
              Page Header
          ========================================== */}

          <div className="employee-page-header">

            <div>

              <span className="employee-page-label">
                ADMINISTRATION
              </span>

              <h1>
                Employee Management
              </h1>

              <p>
                Manage bank employees, roles and access status.
              </p>

            </div>


            <button
              className="add-employee-btn"
              onClick={handleAddEmployee}
            >
              <FaPlus />
              Add Employee
            </button>

          </div>


          {/* ==========================================
              Statistics
          ========================================== */}

          <div className="employee-stats-grid">

            <EmployeeStatCard
              icon={<FaUsers />}
              title="Total Employees"
              value="42"
              description="Registered employees"
              variant="blue"
            />

            <EmployeeStatCard
              icon={<FaUserCheck />}
              title="Active Employees"
              value="39"
              description="Currently active"
              variant="green"
            />

            <EmployeeStatCard
              icon={<FaUserClock />}
              title="Inactive Employees"
              value="3"
              description="Currently inactive"
              variant="orange"
            />

            <EmployeeStatCard
              icon={<FaUserTie />}
              title="Managers"
              value="8"
              description="Assigned managers"
              variant="purple"
            />

          </div>


          {/* ==========================================
              Employee Table
          ========================================== */}

          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </div>

      </main>

    </div>
  );
}

export default EmployeeManagement;