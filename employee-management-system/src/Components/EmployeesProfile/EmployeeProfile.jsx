import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        contact_info: '',
        job_title: '',
        department: '',
        salary: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const employee = location.state?.employee;

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                contact_info: employee.contact_info,
                job_title: employee.job_title,
                department: employee.department,
                salary: employee.salary,
            });
        }
    }, [employee]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            let response;
            if (employee) {
                response = await axios.put(`http://localhost:5000/employees/${employee.id}`, formData);
            } else {
                response = await axios.post('http://localhost:5000/employees', formData);
                setFormData({
                    name: '',
                    contact_info: '',
                    job_title: '',
                    department: '',
                    salary: '',
                });
            }
            setSuccessMessage('Employee saved successfully!');
            setTimeout(() => {
                setSuccessMessage('');
                navigate('/manage-employees');
            }, 2000);
        } catch (error) {
            console.error('Error saving employee data:', error);
        }
    };

    return (
        <div className="employee-form-container">
            {successMessage && <p className="success-message">{successMessage}</p>}
            <div className="employee-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="form-input"
                />
                <input
                    type="text"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={handleInputChange}
                    placeholder="Contact Info"
                    className="form-input"
                />
                <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    placeholder="Job Title"
                    className="form-input"
                />
                <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Department"
                    className="form-input"
                />
                <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Salary"
                    className="form-input"
                />
                <div className="form-buttons">
                    <button onClick={handleSave} className="save-button">
                        {employee ? 'Save' : 'Add Employee'}
                    </button>
                    <button onClick={() => navigate('/manage-employees')} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
