
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeProfile = ({ employee, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact_info: '',
        job_title: '',
        department: '',
        salary: '',
    });

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
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            let response;
            if (employee) {
                response = await axios.put(`http://localhost:5000/employees/${employee.id}`, formData);
            } else {
                response = await axios.post('http://localhost:5000/employees', formData);
            }
            onSubmit(response.data);
            onClose();
        } catch (error) {
            console.error('Error saving employee data:', error);
        }
    };

    return (
        <div>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
            <input type="text" name="contact_info" value={formData.contact_info} onChange={handleInputChange} placeholder="Contact Info" />
            <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} placeholder="Job Title" />
            <input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="Department" />
            <input type="text" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="Salary" />
            <button onClick={handleSave}>{employee ? 'Save' : 'Add Employee'}</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default EmployeeProfile;
