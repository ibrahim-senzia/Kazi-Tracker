import React, { useState, useEffect } from 'react';
import "./LeaveManagement.css";

function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('pending');

  const fetchLeaves = async () => {
    try {
      const response = await fetch('http://localhost:5000/leaves');
      if (!response.ok) {
        throw new Error('Failed to fetch leaves');
      }
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error.message);
      // Handle error gracefully (e.g., show a message to the user)
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employee_id: employeeId, leave_type: leaveType, start_date: startDate, end_date: endDate, reason: reason, status: status })
      });
      if (!response.ok) {
        throw new Error('Failed to submit leave');
      }
      const result = await response.json();
      alert(result.message);
      fetchLeaves();
    } catch (error) {
      console.error('Error submitting leave:', error.message);
      // Handle error gracefully (e.g., show a message to the user)
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/leaves/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ leave_type: leaveType, start_date: startDate, end_date: endDate, reason: reason, status: status })
      });
      if (!response.ok) {
        throw new Error('Failed to update leave');
      }
      const result = await response.json();
      alert(result.message);
      fetchLeaves();
    } catch (error) {
      console.error('Error updating leave:', error.message);
      // Handle error gracefully (e.g., show a message to the user)
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/leaves/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete leave');
      }
      const result = await response.json();
      alert(result.message);
      fetchLeaves();
    } catch (error) {
      console.error('Error deleting leave:', error.message);
      // Handle error gracefully (e.g., show a message to the user)
    }
  };

  return (
    <div>
      <h2>Leave Management</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required />
        </div>
        <div>
          <label>Leave Type:</label>
          <input type="text" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required />
        </div>
        <div>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div>
          <label>Reason:</label>
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} required />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
      <h3>Leave Requests</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee ID</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.id}</td>
              <td>{leave.employee_id}</td>
              <td>{leave.leave_type}</td>
              <td>{leave.start_date}</td>
              <td>{leave.end_date}</td>
              <td>{leave.reason}</td>
              <td>{leave.status}</td>
              <td>
                <button className="update" onClick={() => handleUpdate(leave.id)}>Update</button>
                <button className="delete" onClick={() => handleDelete(leave.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveManagement;