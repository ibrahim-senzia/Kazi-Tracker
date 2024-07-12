import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeList.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const handleEdit = (employee) => {
        navigate("/dashboard/profile", { state: { employee } });
    };

    const handleAdd = () => {
        navigate("/dashboard/profile");
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/employees/${id}`);
            setEmployees(employees.filter(employee => employee.id !== id));
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <h2>Employee List</h2>
            <button className="addButton" onClick={handleAdd}>Add Employee</button>
            <div className="Search-Box">
                <input
                    type="text"
                    placeholder="Search by Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchBox"
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact Info</th>
                        <th>Job Title</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.contact_info}</td>
                            <td>{employee.job_title}</td>
                            <td>{employee.department}</td>
                            <td>{employee.salary}</td>
                            <td className="action-cell">
                                <button className="editButton" onClick={() => handleEdit(employee)}>Edit</button>
                                <button className="deleteButton" onClick={() => handleDelete(employee.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;
