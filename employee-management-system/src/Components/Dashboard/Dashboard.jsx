import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.css";
import { UserContext } from "../Context/UserContext"


function Dashboard() {

    // For logout eventhandle
    const {currentUser, logout} = useContext(UserContext)

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="dashboard-logo">
                    <Link to="/dashboard" className="dashboard-logo">
                        KaziTracker Dashboard
                    </Link>
                </div>
                <ul className="dashboard-links" style={{ listStyleType: "none", paddingLeft: 0 }}>
                    <li>
                        <Link to="/dashboard">
                            <i className="fs-4 bi-speedometer2"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/manage-employees">
                            <i className="fs-4 bi-people"></i>
                            <span>Manage Employees</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile">
                            <i className="fs-4 bi-person"></i>
                            <span>Employees Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/LeaveManagement">
                            <i className="fs-4 bi-person"></i>
                            <span>LeaveManagement</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/logout">
                            <i className="fs-4 bi-box-arrow-right"></i>
                            <span onClick={()=>logout()}>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="main-content">
                <div className="header">
                    <h2>Kazi Tracker</h2>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default Dashboard;
