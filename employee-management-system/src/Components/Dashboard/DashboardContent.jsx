
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboardcontent.css';

const Dashboard = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/dashboard');
            const { totalEmployees, totalSalary } = response.data; // Ensure your backend returns these fields correctly
            setTotalEmployees(totalEmployees);
            setTotalSalary(totalSalary);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <div className="dashboard">
                <div className="dashboard-box">
                    <h3>Total Employees</h3>
                    <p>{totalEmployees}</p>
                </div>
                <div className="dashboard-box">
                    <h3>Total Salary</h3>
                    <p>${totalSalary.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
